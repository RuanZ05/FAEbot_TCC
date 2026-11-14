import type { BotReply, ChatMessage, QuickQuestionId } from "@/types/chat";
import { fallbackReply, knowledgeBase, replies } from "@/data/questions";
import { findBestMatch } from "@/services/matcher";
import { answerPreview, trackEvent } from "@/services/eventsClient";

/**
 * Camada de serviço do chat — os componentes só chamam sendMessage().
 *
 * Ordem de decisão:
 *  1. Pergunta rápida (botão) ........ resposta pronta e revisada (instantânea)
 *  2. Saudação / agradecimento curto .. buscador local (economiza a cota da IA)
 *  3. Texto livre ...................... Gemini via /api/chat (ou API externa)
 *  4. Se a IA estiver desligada, sem cota ou com erro → buscador local
 *     (tolerante a erros de digitação) → mensagem padrão com atendimento.
 *
 * Futuro: NEXT_PUBLIC_FAEBOT_API_URL aponta para a API própria (n8n + banco),
 * que deve aceitar o mesmo contrato da rota /api/chat:
 *   request:  { message: string; history: { role: "user" | "bot"; text: string }[] }
 *   response: BotReply (ver src/types/chat.ts)
 */

const EXTERNAL_API = process.env.NEXT_PUBLIC_FAEBOT_API_URL?.trim() || "";
const CHAT_ENDPOINT = EXTERNAL_API ? `${EXTERNAL_API.replace(/\/$/, "")}/chat` : "/api/chat";

/** Se a IA respondeu "desligada" (503), não tentamos de novo nesta sessão. */
let aiDisabled = false;

/** Resposta local para um texto livre. */
export function findMockReply(text: string): BotReply {
  return findBestMatch(text, knowledgeBase)?.reply ?? fallbackReply;
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Atraso simulado proporcional ao tamanho da resposta (sensação de "digitando"). */
function typingDelay(reply: BotReply): number {
  const chars = reply.content.reduce((acc, block) => {
    if (block.type === "text") return acc + block.text.length;
    if (block.type === "list") return acc + block.items.join("").length;
    return acc + 20;
  }, 0);
  return Math.min(1600, 550 + chars * 1.2);
}

function toHistory(history: ChatMessage[] = []) {
  return history
    .filter((m) => m.id !== "welcome")
    .slice(-8)
    .map((m) => ({
      role: m.role,
      text: m.content
        .map((b) => (b.type === "text" ? b.text : b.type === "list" ? b.items.join("; ") : ""))
        .filter(Boolean)
        .join("\n")
        .slice(0, 1000),
    }));
}

function isValidReply(value: unknown): value is BotReply {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as BotReply).content) &&
    (value as BotReply).content.length > 0
  );
}

async function askAI(message: string, history?: ChatMessage[]): Promise<BotReply | null> {
  if (aiDisabled && !EXTERNAL_API) return null;
  try {
    const response = await fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history: toHistory(history) }),
      signal: AbortSignal.timeout(30000),
    });
    if (response.status === 503) {
      aiDisabled = true;
      return null;
    }
    if (!response.ok) return null;
    const data: unknown = await response.json();
    return isValidReply(data) ? data : null;
  } catch (error) {
    console.warn("[FAEBOT] IA indisponível, usando buscador local.", error);
    return null;
  }
}

interface SendOptions {
  quickQuestionId?: QuickQuestionId;
  history?: ChatMessage[];
}

/** Registra perguntas que o FAEBOT não soube responder (para a equipe cadastrar depois). */
function reportUnanswered(question: string, reply: BotReply) {
  trackEvent({ type: "unanswered", question, answer: answerPreview(reply.content), source: reply.source });
}

export async function sendMessage(message: string, options: SendOptions = {}): Promise<BotReply> {
  // 1. Botões de pergunta rápida: resposta curada
  if (options.quickQuestionId) {
    const reply: BotReply = { ...replies[options.quickQuestionId], source: "quick" };
    await wait(typingDelay(reply));
    return reply;
  }

  const local = findBestMatch(message, knowledgeBase);

  // 2. "oi", "obrigado"... não gastam a cota da IA
  const shortMessage = message.trim().split(/\s+/).length <= 3;
  if (local && shortMessage && (local.entryId === "saudacao" || local.entryId === "agradecimento")) {
    await wait(typingDelay(local.reply));
    return { ...local.reply, source: "local" };
  }

  // 3. IA (Gemini)
  const ai = await askAI(message, options.history);
  if (ai) {
    const reply: BotReply = { ...ai, source: "ai" };
    // A IA não achou a resposta na base (e o usuário não estava só pedindo atendente)
    if (ai.handoff && local?.entryId !== "atendimento") reportUnanswered(message, reply);
    return reply;
  }

  // 4. Plano B: buscador local tolerante a erros
  const reply: BotReply = local ? { ...local.reply, source: "local" } : { ...fallbackReply, source: "fallback" };
  if (!local) reportUnanswered(message, reply);
  await wait(typingDelay(reply));
  return reply;
}

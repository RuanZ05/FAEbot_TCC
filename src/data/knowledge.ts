import type { BotReply, MessageBlock } from "@/types/chat";
import { fallbackReply, knowledgeBase, quickQuestions } from "@/data/questions";
import { institution, links } from "@/data/institution";

/**
 * Converte a base de respostas do FAEBOT em texto corrido para o Gemini.
 *
 * Hoje a fonte é src/data/questions.ts. Na fase do banco de dados, basta
 * trocar esta função para montar o mesmo texto a partir das tabelas —
 * a rota /api/chat e o restante do sistema continuam iguais.
 */

function blockToText(block: MessageBlock): string {
  switch (block.type) {
    case "text":
      return block.text;
    case "list":
      return block.items.map((item) => `- ${item}`).join("\n");
    case "links":
      return block.links.map((l) => `- Link "${l.label}": ${l.href}`).join("\n");
    case "whatsapp":
      return "- (Oferecer atendimento humano pelo WhatsApp.)";
    default:
      return "";
  }
}

function replyToText(reply: BotReply): string {
  return reply.content.map(blockToText).filter(Boolean).join("\n");
}

let cache: string | null = null;

export function buildKnowledgeText(): string {
  if (cache) return cache;

  const seen = new Set<BotReply>([fallbackReply]);
  const sections: string[] = [];

  for (const entry of knowledgeBase) {
    if (seen.has(entry.reply)) continue;
    seen.add(entry.reply);
    if (entry.id === "saudacao" || entry.id === "agradecimento") continue;
    sections.push(`### Tema: ${entry.id}\n${replyToText(entry.reply)}`);
  }

  const header = [
    `Instituição: ${institution.shortName} — ${institution.fullName}`,
    `Mantenedora: ${institution.maintainer}`,
    `Endereço: ${institution.address.street}, ${institution.address.district}, ${institution.address.city}, CEP ${institution.address.zip}`,
    `WhatsApp/celular: ${institution.contact.phoneDisplay} | Telefone da unidade: ${institution.contact.landlineDisplay} | E-mail: ${institution.contact.email}`,
    `Site oficial: ${links.home}`,
  ].join("\n");

  cache = `${header}\n\n${sections.join("\n\n")}`;
  return cache;
}

/** Links que o Gemini pode citar (qualquer outro é descartado por segurança). */
export function allowedLinks(): Map<string, string> {
  const map = new Map<string, string>();
  for (const [key, href] of Object.entries(links)) map.set(href, key);
  return map;
}

export const QUICK_QUESTION_IDS = quickQuestions.map((q) => q.id);

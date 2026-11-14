import type { ChatEvent } from "@/types/chat";
import { readSummary, recordEvent } from "@/services/eventStore";

/**
 * POST /api/events — registra avaliações 👍👎 e perguntas sem resposta.
 * GET  /api/events — resumo para a equipe (em desenvolvimento, ou com ?key=ADMIN_KEY).
 *
 * Não guarda IP, nome nem nenhum dado pessoal: só o texto da pergunta,
 * a avaliação e o início da resposta.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (recent.length >= 30) return true;
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

function parseEvent(body: unknown): ChatEvent | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  if (b.type !== "feedback" && b.type !== "unanswered") return null;
  if (typeof b.question !== "string" || !b.question.trim()) return null;
  if (b.type === "feedback" && b.value !== "up" && b.value !== "down") return null;
  const sources = ["quick", "ai", "local", "fallback"];
  return {
    type: b.type,
    question: b.question.trim().slice(0, 500),
    answer: typeof b.answer === "string" ? b.answer.slice(0, 200) : undefined,
    value: b.value === "up" || b.value === "down" ? b.value : undefined,
    source: typeof b.source === "string" && sources.includes(b.source) ? (b.source as ChatEvent["source"]) : undefined,
  };
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  const event = parseEvent(body);
  if (!event) return Response.json({ error: "invalid_event" }, { status: 400 });

  await recordEvent(event);
  return Response.json({ ok: true });
}

export async function GET(request: Request) {
  const adminKey = process.env.ADMIN_KEY;
  const key = new URL(request.url).searchParams.get("key");
  const allowed = process.env.NODE_ENV !== "production" || (adminKey && key === adminKey);
  if (!allowed) return Response.json({ error: "forbidden" }, { status: 403 });
  return Response.json(await readSummary());
}

import { askGemini, DEFAULT_MODEL, type HistoryItem } from "@/services/gemini";

/**
 * POST /api/chat — ponte segura entre o chat e o Gemini.
 *
 * - A chave GEMINI_API_KEY fica só no servidor (.env.local), nunca no navegador.
 * - Sem chave configurada → responde 503 e o chat usa o buscador local.
 * - Limite simples por IP para proteger a cota gratuita.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE = 500;
const MAX_HISTORY = 8;
const LIMIT_PER_MINUTE = 8;
const LIMIT_PER_HOUR = 60;

const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 3_600_000);
  const lastMinute = recent.filter((t) => now - t < 60_000).length;
  if (lastMinute >= LIMIT_PER_MINUTE || recent.length >= LIMIT_PER_HOUR) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // evita crescer sem limite
  return false;
}

function sanitizeHistory(value: unknown): HistoryItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (h): h is HistoryItem =>
        typeof h === "object" && h !== null && (h.role === "user" || h.role === "bot") && typeof h.text === "string",
    )
    .slice(-MAX_HISTORY)
    .map((h) => ({ role: h.role, text: h.text.slice(0, 1000) }));
}

/** GET /api/chat — informa se a IA está ativa (útil para testes). */
export async function GET() {
  return Response.json({ ai: Boolean(process.env.GEMINI_API_KEY), model: process.env.GEMINI_MODEL || DEFAULT_MODEL });
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return Response.json({ error: "ai_disabled" }, { status: 503 });

  let body: { message?: unknown; history?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim().slice(0, MAX_MESSAGE) : "";
  if (!message) return Response.json({ error: "empty_message" }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
  if (rateLimited(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

  try {
    const reply = await askGemini(message, sanitizeHistory(body.history), apiKey, process.env.GEMINI_MODEL || DEFAULT_MODEL);
    return Response.json(reply);
  } catch (error) {
    console.error("[FAEBOT] Erro no Gemini:", error);
    return Response.json({ error: "ai_error" }, { status: 502 });
  }
}

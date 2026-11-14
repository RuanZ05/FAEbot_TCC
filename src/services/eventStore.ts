import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { ChatEvent } from "@/types/chat";

/**
 * Armazenamento dos eventos de uso — USO EXCLUSIVO NO SERVIDOR.
 *
 * FASE ATUAL: grava uma linha JSON por evento em .data/faebot-events.jsonl
 * (funciona rodando no computador). Na Vercel o disco é somente leitura,
 * então lá os eventos aparecem apenas nos logs da plataforma.
 *
 * PRÓXIMA FASE (banco de dados): trocar o corpo de recordEvent() e readSummary()
 * por gravação/leitura em tabela. A rota /api/events não muda.
 */

/** Arquivo na raiz do projeto: .data/faebot-events.jsonl */
const eventsFile = () => path.join(process.cwd(), ".data", "faebot-events.jsonl");

export interface StoredEvent extends ChatEvent {
  at: string;
}

export async function recordEvent(event: ChatEvent): Promise<void> {
  const stored: StoredEvent = { ...event, at: new Date().toISOString() };
  console.info(`[FAEBOT] evento ${event.type}${event.value ? ` (${event.value})` : ""}: "${event.question.slice(0, 80)}"`);
  try {
    const file = eventsFile();
    await mkdir(path.dirname(file), { recursive: true });
    await appendFile(file, `${JSON.stringify(stored)}\n`, "utf8");
  } catch {
    // disco somente leitura (ex.: Vercel) — o log acima já registrou o evento
  }
}

export interface EventsSummary {
  feedback: { up: number; down: number; satisfaction: number | null };
  unanswered: { question: string; count: number; last: string }[];
  negative: { question: string; answer?: string; at: string }[];
  total: number;
}

export async function readSummary(): Promise<EventsSummary> {
  let lines: string[] = [];
  try {
    lines = (await readFile(eventsFile(), "utf8")).split("\n").filter(Boolean);
  } catch {
    /* ainda não há registros */
  }
  const events = lines
    .map((l) => {
      try {
        return JSON.parse(l) as StoredEvent;
      } catch {
        return null;
      }
    })
    .filter((e): e is StoredEvent => e !== null);

  const up = events.filter((e) => e.type === "feedback" && e.value === "up").length;
  const down = events.filter((e) => e.type === "feedback" && e.value === "down").length;

  const grouped = new Map<string, { question: string; count: number; last: string }>();
  for (const e of events.filter((ev) => ev.type === "unanswered")) {
    const key = e.question.toLowerCase().trim();
    const item = grouped.get(key) ?? { question: e.question, count: 0, last: e.at };
    item.count += 1;
    item.last = e.at;
    grouped.set(key, item);
  }

  return {
    feedback: { up, down, satisfaction: up + down > 0 ? Math.round((up / (up + down)) * 100) : null },
    unanswered: [...grouped.values()].sort((a, b) => b.count - a.count).slice(0, 50),
    negative: events
      .filter((e) => e.type === "feedback" && e.value === "down")
      .slice(-20)
      .reverse()
      .map((e) => ({ question: e.question, answer: e.answer, at: e.at })),
    total: events.length,
  };
}

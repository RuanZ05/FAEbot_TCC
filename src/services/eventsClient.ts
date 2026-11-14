import type { ChatEvent } from "@/types/chat";

/**
 * Envia um evento de uso para /api/events sem atrapalhar o chat:
 * não espera resposta e ignora qualquer erro.
 */
export function trackEvent(event: ChatEvent): void {
  if (typeof window === "undefined") return;
  try {
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    /* ignora */
  }
}

/** Primeiros caracteres do texto de uma resposta (contexto para análise). */
export function answerPreview(blocks: { type: string; text?: string; items?: string[] }[]): string {
  return blocks
    .map((b) => (b.type === "text" ? b.text : b.type === "list" ? (b.items ?? []).join("; ") : ""))
    .filter(Boolean)
    .join(" ")
    .slice(0, 200);
}

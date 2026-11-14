/**
 * Tipos centrais do FAEBOT.
 * Estes contratos são compartilhados entre a interface e a camada de serviço
 * (src/services/chatService.ts). Quando o back-end (API própria + Gemini + n8n)
 * for implementado, ele deverá responder neste mesmo formato.
 */

export type ChatRole = "user" | "bot";

/** Identificadores das perguntas rápidas / intenções conhecidas. */
export type QuickQuestionId =
  | "cursos"
  | "sistemas-internet"
  | "ingresso"
  | "calendario"
  | "documentos-matricula"
  | "conhecer-faeterj"
  | "infraestrutura"
  | "atendimento";

/** Nomes dos ícones usados nas perguntas rápidas (mapeados em QuickQuestions.tsx). */
export type QuickQuestionIcon =
  | "graduation"
  | "code"
  | "door"
  | "calendar"
  | "file"
  | "building"
  | "monitor"
  | "headset";

export interface QuickQuestion {
  id: QuickQuestionId;
  /** Texto exibido no botão. */
  label: string;
  /** Texto enviado como mensagem do usuário ao clicar. */
  prompt: string;
  icon: QuickQuestionIcon;
}

export interface ChatLink {
  label: string;
  href: string;
}

/** Blocos de conteúdo que compõem uma mensagem. */
export type MessageBlock =
  | { type: "text"; text: string }
  | { type: "list"; items: string[] }
  | { type: "links"; links: ChatLink[] }
  | { type: "whatsapp"; reason?: string };

export type MessageStatus = "sending" | "sent" | "read";

/** Quem produziu a resposta. */
export type ReplySource = "quick" | "ai" | "local" | "fallback";

export type FeedbackValue = "up" | "down";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: MessageBlock[];
  /** Timestamp em milissegundos (Date.now()). */
  createdAt: number;
  status?: MessageStatus;
  /** Sugestões de próximas perguntas exibidas abaixo da resposta do bot. */
  suggestions?: QuickQuestionId[];
  /** Pergunta do usuário que originou esta resposta. */
  question?: string;
  source?: ReplySource;
  /** Avaliação 👍/👎 dada pelo usuário. */
  feedback?: FeedbackValue;
}

/** Resposta produzida pelo serviço de chat (mock hoje, API amanhã). */
export interface BotReply {
  content: MessageBlock[];
  suggestions?: QuickQuestionId[];
  /** Indica que o bot não encontrou resposta e sugeriu atendimento humano. */
  handoff?: boolean;
  source?: ReplySource;
}

/** Eventos de uso registrados para melhorar o FAEBOT (sem dados pessoais). */
export interface ChatEvent {
  type: "feedback" | "unanswered";
  question: string;
  /** Início da resposta dada (para contexto). */
  answer?: string;
  value?: FeedbackValue;
  source?: ReplySource;
}

/** Item usado pela base de respostas simuladas. */
export interface KnowledgeEntry {
  id: string;
  /** Palavras/expressões que ativam a resposta (sem acento, minúsculas). */
  keywords: string[];
  reply: BotReply;
}

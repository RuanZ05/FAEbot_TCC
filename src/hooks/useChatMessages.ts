"use client";

import { useCallback, useRef, useState } from "react";
import type { ChatMessage, FeedbackValue, QuickQuestionId } from "@/types/chat";
import { getQuickQuestion, welcomeContent } from "@/data/questions";
import { sendMessage } from "@/services/chatService";
import { answerPreview, trackEvent } from "@/services/eventsClient";

let idCounter = 0;
const createId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;

function createWelcome(): ChatMessage {
  return { id: "welcome", role: "bot", content: welcomeContent, createdAt: Date.now() };
}

/** Estado e regras da conversa (independente da interface). */
export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [createWelcome()]);
  const [isTyping, setIsTyping] = useState(false);
  const busyRef = useRef(false);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const send = useCallback(async (text: string, quickQuestionId?: QuickQuestionId) => {
    const trimmed = text.trim();
    if (!trimmed || busyRef.current) return;
    busyRef.current = true;

    const userMessage: ChatMessage = {
      id: createId("user"),
      role: "user",
      content: [{ type: "text", text: trimmed }],
      createdAt: Date.now(),
      status: "sent",
    };
    const history = messagesRef.current;
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const reply = await sendMessage(trimmed, { quickQuestionId, history });
      const botMessage: ChatMessage = {
        id: createId("bot"),
        role: "bot",
        content: reply.content,
        suggestions: reply.suggestions,
        createdAt: Date.now(),
        question: trimmed,
        source: reply.source,
      };
      setMessages((prev) => [
        ...prev.map((m) => (m.id === userMessage.id ? { ...m, status: "read" as const } : m)),
        botMessage,
      ]);
    } finally {
      setIsTyping(false);
      busyRef.current = false;
    }
  }, []);

  const sendQuickQuestion = useCallback(
    (id: QuickQuestionId) => {
      const question = getQuickQuestion(id);
      if (question) void send(question.prompt, id);
    },
    [send],
  );

  /** Registra a avaliação 👍/👎 de uma resposta (uma vez por mensagem). */
  const giveFeedback = useCallback((messageId: string, value: FeedbackValue) => {
    const target = messagesRef.current.find((m) => m.id === messageId);
    if (!target || target.role !== "bot" || target.feedback) return;
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, feedback: value } : m)));
    trackEvent({
      type: "feedback",
      value,
      question: target.question ?? "(sem pergunta)",
      answer: answerPreview(target.content),
      source: target.source,
    });
  }, []);

  const reset = useCallback(() => {
    setMessages([createWelcome()]);
    setIsTyping(false);
    busyRef.current = false;
  }, []);

  return { messages, isTyping, send, sendQuickQuestion, giveFeedback, reset };
}

"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { ChatMessage, FeedbackValue, QuickQuestionId } from "@/types/chat";
import MessageBubble from "@/components/MessageBubble";
import QuickQuestions from "@/components/QuickQuestions";
import TypingIndicator from "@/components/TypingIndicator";
import { quickQuestions } from "@/data/questions";

const quickPrompts = new Set(quickQuestions.map((q) => q.prompt));

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onQuickQuestion: (id: QuickQuestionId) => void;
  onFeedback?: (messageId: string, value: FeedbackValue) => void;
}

export default function ChatMessages({ messages, isTyping, onQuickQuestion, onFeedback }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Rolagem automática para a última mensagem
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: isFirstRender.current || reduceMotion ? "auto" : "smooth",
    });
    isFirstRender.current = false;
  }, [messages, isTyping]);

  const lastBot = [...messages].reverse().find((m) => m.role === "bot");
  const lastMessage = messages[messages.length - 1];

  return (
    <div
      ref={scrollRef}
      className="scrollbar-thin relative flex-1 overflow-y-auto overflow-x-hidden overscroll-contain bg-gradient-to-b from-sky-50 to-[#eaf2fc] px-3 py-4 md:px-4"
    >
      <div
        className="mx-auto flex max-w-2xl flex-col gap-3"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Conversa com o FAEBOT"
      >
        {/* Apresentação do FAEBOT no topo da conversa */}
        <div className="flex flex-col items-center pb-1 pt-2 text-center">
          <Image
            src="/images/faebot-logo.png"
            alt="Logo do FAEBOT"
            width={640}
            height={640}
            className="size-24 drop-shadow-[0_8px_20px_rgba(13,91,215,0.3)]"
          />
          <p className="mt-2 text-sm font-semibold text-navy-800">Assistente virtual da FAETERJ Barra Mansa</p>
          <p className="text-xs text-slate-500">Respostas rápidas, 24 horas por dia</p>
        </div>

        <div className="flex justify-center">
          <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-slate-500 shadow-bubble">Hoje</span>
        </div>

        {messages.map((message, index) => {
          const prev = messages[index - 1];
          const showAvatar = message.role === "bot" && prev?.role !== "bot";
          const isWelcome = message.id === "welcome";
          // Pergunta digitada pelo usuário que gerou esta resposta (vai na mensagem do WhatsApp).
          // Cliques nas perguntas rápidas não entram: o assunto já identifica o pedido.
          const question =
            prev?.role === "user" && !quickPrompts.has(prev.content[0]?.type === "text" ? prev.content[0].text : "")
              ? prev.content[0]?.type === "text"
                ? prev.content[0].text
                : undefined
              : undefined;
          const showSuggestions =
            !isTyping &&
            message.role === "bot" &&
            !isWelcome &&
            message.id === lastBot?.id &&
            lastMessage?.id === message.id &&
            Boolean(message.suggestions?.length);

          return (
            <div key={message.id} className="flex flex-col gap-2.5">
              <MessageBubble
                message={message}
                showAvatar={showAvatar}
                question={question}
                onFeedback={!isWelcome && message.role === "bot" ? onFeedback : undefined}
              />

              {/* Perguntas rápidas logo após a mensagem de boas-vindas */}
              {isWelcome && (
                <div className="pl-10 pr-1">
                  <QuickQuestions onSelect={onQuickQuestion} disabled={isTyping} />
                </div>
              )}

              {/* Sugestões de próximos assuntos após a última resposta */}
              {showSuggestions && (
                <div className="animate-fade-up pl-10">
                  <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">Talvez você queira saber</p>
                  <QuickQuestions variant="compact" ids={message.suggestions} onSelect={onQuickQuestion} />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && <TypingIndicator />}
      </div>
    </div>
  );
}

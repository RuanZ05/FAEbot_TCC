"use client";

import { useEffect, useRef, useState } from "react";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";
import ChatLauncher from "@/components/ChatLauncher";
import { useChatUI } from "@/context/ChatContext";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useVisualViewport } from "@/hooks/useVisualViewport";

const MOBILE_QUERY = "(max-width: 767px)";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

/**
 * Janela principal do FAEBOT.
 * - Desktop/tablet (≥768px): janela grande e destacada à direita.
 * - Celular (<768px): tela cheia, respeitando notch, barra inferior e teclado.
 */
export default function Chatbot() {
  const { isOpen, minimize, close, toggle, sessionKey } = useChatUI();
  const { messages, isTyping, send, sendQuickQuestion, giveFeedback, reset } = useChatMessages();
  const isMobile = useIsMobile();
  const lastSession = useRef(sessionKey);

  useVisualViewport(isOpen && isMobile);

  // "Fechar" encerra a conversa: ao reabrir, começa do zero
  useEffect(() => {
    if (lastSession.current !== sessionKey) {
      lastSession.current = sessionKey;
      reset();
    }
  }, [sessionKey, reset]);

  // No celular, trava a rolagem da página por trás do chat em tela cheia
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("chat-locked", isOpen && isMobile);
    return () => root.classList.remove("chat-locked");
  }, [isOpen, isMobile]);

  // Esc minimiza o chat
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") minimize();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, minimize]);

  return (
    <>
      {isOpen && (
        <section
          aria-label="Chat com o FAEBOT"
          className="top-vv h-mobile-chat fixed inset-x-0 z-40 flex animate-chat-in flex-col overflow-hidden bg-white text-navy-900 md:inset-x-auto md:bottom-[104px] md:right-6 md:top-auto md:h-[min(780px,calc(100dvh-188px))] md:min-h-[420px] md:w-[400px] md:origin-bottom-right md:rounded-[28px] md:shadow-chat md:ring-1 md:ring-white/20 lg:w-[430px] xl:right-10 xl:w-[440px]"
        >
          <ChatHeader onMinimize={minimize} onClose={close} isTyping={isTyping} />
          <ChatMessages messages={messages} isTyping={isTyping} onQuickQuestion={sendQuickQuestion} onFeedback={giveFeedback} />
          <ChatInput
            onSend={(text) => void send(text)}
            onQuickQuestion={sendQuickQuestion}
            disabled={isTyping}
            autoFocus
          />
        </section>
      )}

      <ChatLauncher isOpen={isOpen} onClick={toggle} />
    </>
  );
}

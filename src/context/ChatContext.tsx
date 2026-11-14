"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface ChatUIContextValue {
  /** Janela do chat aberta (true) ou minimizada no botão flutuante (false). */
  isOpen: boolean;
  open: () => void;
  minimize: () => void;
  toggle: () => void;
  /** Incrementado a cada "fechar": o Chatbot usa para reiniciar a conversa. */
  sessionKey: number;
  /** Fecha o chat e encerra a conversa atual. */
  close: () => void;
}

const ChatUIContext = createContext<ChatUIContextValue | null>(null);

interface ChatProviderProps {
  children: ReactNode;
  /** O chat começa aberto? (padrão: fechado, só o botão flutuante aparece) */
  initiallyOpen?: boolean;
}

export function ChatProvider({ children, initiallyOpen = false }: ChatProviderProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [sessionKey, setSessionKey] = useState(0);

  const open = useCallback(() => setIsOpen(true), []);
  const minimize = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setSessionKey((k) => k + 1);
  }, []);

  const value = useMemo(
    () => ({ isOpen, open, minimize, toggle, close, sessionKey }),
    [isOpen, open, minimize, toggle, close, sessionKey],
  );

  return <ChatUIContext.Provider value={value}>{children}</ChatUIContext.Provider>;
}

export function useChatUI(): ChatUIContextValue {
  const ctx = useContext(ChatUIContext);
  if (!ctx) throw new Error("useChatUI deve ser usado dentro de <ChatProvider>.");
  return ctx;
}

"use client";

import Image from "next/image";
import { Minus, X } from "lucide-react";

interface ChatHeaderProps {
  onMinimize: () => void;
  onClose: () => void;
  isTyping?: boolean;
}

export default function ChatHeader({ onMinimize, onClose, isTyping = false }: ChatHeaderProps) {
  return (
    <header className="pt-safe relative shrink-0 overflow-hidden bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 text-white md:pt-0">
      {/* Detalhe tecnológico sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:14px_14px]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 size-40 rounded-full bg-cyan-400/30 blur-2xl" />

      <div className="relative flex items-center gap-3 px-4 py-3 md:px-5 md:py-4">
        <div className="relative shrink-0">
          <div className="flex size-11 items-center justify-center overflow-hidden rounded-full bg-navy-900 ring-2 ring-white/70 md:size-12">
            <Image src="/images/faebot.png" alt="Robô FAEBOT" width={96} height={96} className="size-full object-cover" />
          </div>
          <span className="absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-brand-600 bg-whatsapp" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold leading-tight tracking-wide md:text-lg">FAEBOT</h2>
          <p className="truncate text-xs text-white/85 md:text-[13px]">Assistente da FAETERJ</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-white/90" aria-live="polite">
            <span className="size-1.5 rounded-full bg-whatsapp" aria-hidden="true" />
            {isTyping ? "digitando..." : "Online"}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onMinimize}
            className="flex size-11 items-center justify-center rounded-full text-white/90 transition hover:bg-white/15 active:scale-95"
            aria-label="Minimizar chat"
            title="Minimizar"
          >
            <Minus className="size-5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-full text-white/90 transition hover:bg-white/15 active:scale-95"
            aria-label="Fechar chat e encerrar conversa"
            title="Fechar e encerrar conversa"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

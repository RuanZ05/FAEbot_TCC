"use client";

import Image from "next/image";

interface ChatLauncherProps {
  isOpen: boolean;
  onClick: () => void;
}

/**
 * Botão flutuante do FAEBOT (canto inferior direito).
 * - Chat minimizado: reabre a conversa.
 * - Chat aberto (desktop/tablet): minimiza, como na referência visual.
 * No celular, fica oculto enquanto o chat ocupa a tela.
 */
export default function ChatLauncher({ isOpen, onClick }: ChatLauncherProps) {
  return (
    <div
      className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 items-center gap-3 md:right-6 xl:right-10 ${
        isOpen ? "hidden md:flex" : "flex"
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className={`animate-pop-in hidden items-center gap-2 rounded-full border border-white/15 bg-navy-900/85 px-4 py-2.5 text-sm font-semibold text-white shadow-chat backdrop-blur-md transition hover:bg-navy-800 min-[400px]:flex ${
          isOpen ? "md:opacity-90" : ""
        }`}
        tabIndex={-1}
        aria-hidden="true"
      >
        Fale com o FAEBOT
      </button>

      <button
        type="button"
        onClick={onClick}
        aria-label={isOpen ? "Minimizar o FAEBOT" : "Abrir conversa com o FAEBOT"}
        aria-expanded={isOpen}
        className="group relative flex size-16 animate-pop-in items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-navy-800 p-[3px] shadow-chat transition hover:scale-105 active:scale-95"
      >
        {!isOpen && (
          <span className="absolute inset-0 animate-ping-slow rounded-full bg-cyan-400/60" aria-hidden="true" />
        )}
        <span className="relative flex size-full items-center justify-center overflow-hidden rounded-full bg-navy-900 ring-2 ring-cyan-400/60">
          <Image src="/images/faebot.png" alt="" width={128} height={128} className="size-full object-cover group-hover:animate-float" />
        </span>
        <span className="absolute bottom-0.5 right-0.5 size-4 rounded-full border-[3px] border-navy-900 bg-whatsapp" aria-hidden="true" />
      </button>
    </div>
  );
}

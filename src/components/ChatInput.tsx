"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { LayoutGrid, SendHorizontal, X } from "lucide-react";
import type { QuickQuestionId } from "@/types/chat";
import QuickQuestions from "@/components/QuickQuestions";

interface ChatInputProps {
  onSend: (text: string) => void;
  onQuickQuestion: (id: QuickQuestionId) => void;
  disabled?: boolean;
  /** Foca o campo automaticamente (apenas em dispositivos com mouse). */
  autoFocus?: boolean;
}

const MAX_LENGTH = 500;

export default function ChatInput({ onSend, onQuickQuestion, disabled = false, autoFocus = false }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [showTopics, setShowTopics] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Altura automática do campo (até ~4 linhas)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  useEffect(() => {
    if (!autoFocus) return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (finePointer) textareaRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  const canSend = value.trim().length > 0 && !disabled;

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!canSend) return;
    onSend(value);
    setValue("");
    setShowTopics(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="pb-safe shrink-0 border-t border-brand-600/10 bg-white md:pb-0">
      {showTopics && (
        <div className="animate-fade-up border-b border-brand-600/10 bg-sky-50/60">
          <QuickQuestions
            variant="strip"
            disabled={disabled}
            onSelect={(id) => {
              setShowTopics(false);
              onQuickQuestion(id);
            }}
          />
        </div>
      )}

      <form onSubmit={submit} className="flex items-end gap-2 px-3 py-3 md:px-4">
        <button
          type="button"
          onClick={() => setShowTopics((v) => !v)}
          aria-label={showTopics ? "Ocultar assuntos" : "Mostrar assuntos"}
          aria-expanded={showTopics}
          title="Assuntos"
          className={`flex size-11 shrink-0 items-center justify-center rounded-full transition active:scale-95 ${
            showTopics ? "bg-brand-600 text-white" : "bg-sky-100 text-brand-600 hover:bg-sky-300/40"
          }`}
        >
          {showTopics ? <X className="size-5" /> : <LayoutGrid className="size-5" />}
        </button>

        <label htmlFor="faebot-input" className="sr-only">
          Digite sua mensagem
        </label>
        <textarea
          id="faebot-input"
          ref={textareaRef}
          rows={1}
          value={value}
          maxLength={MAX_LENGTH}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          enterKeyHint="send"
          autoComplete="off"
          className="scrollbar-thin max-h-[120px] min-h-11 flex-1 resize-none rounded-3xl border border-slate-200 bg-slate-50 px-4 py-[11px] text-base leading-snug text-navy-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15 md:text-[14px] md:leading-[1.45]"
        />

        <button
          type="submit"
          disabled={!canSend}
          aria-label="Enviar mensagem"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/30 transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none"
        >
          <SendHorizontal className="size-5" />
        </button>
      </form>

      <p className="px-4 pb-2 text-center text-[10.5px] leading-snug text-slate-400">
        🔒 Não envie dados pessoais. As perguntas e avaliações são registradas, sem identificação, para melhorar o
        atendimento.
      </p>
    </div>
  );
}

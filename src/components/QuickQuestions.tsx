"use client";

import {
  Building2,
  CalendarDays,
  Code2,
  DoorOpen,
  FileText,
  GraduationCap,
  Headset,
  MonitorSmartphone,
  type LucideIcon,
} from "lucide-react";
import type { QuickQuestion, QuickQuestionIcon, QuickQuestionId } from "@/types/chat";
import { quickQuestions } from "@/data/questions";

export const quickQuestionIcons: Record<QuickQuestionIcon, LucideIcon> = {
  graduation: GraduationCap,
  code: Code2,
  door: DoorOpen,
  calendar: CalendarDays,
  file: FileText,
  building: Building2,
  monitor: MonitorSmartphone,
  headset: Headset,
};

interface QuickQuestionsProps {
  onSelect: (id: QuickQuestionId) => void;
  /** Quais perguntas exibir (padrão: todas). */
  ids?: QuickQuestionId[];
  /**
   * full  → grade de botões (após a mensagem de boas-vindas)
   * compact → chips menores (sugestões após uma resposta)
   * strip → faixa horizontal rolável (menu de assuntos acima do campo)
   */
  variant?: "full" | "compact" | "strip";
  disabled?: boolean;
}

export default function QuickQuestions({ onSelect, ids, variant = "full", disabled = false }: QuickQuestionsProps) {
  const items: QuickQuestion[] = ids
    ? ids.map((id) => quickQuestions.find((q) => q.id === id)).filter((q): q is QuickQuestion => Boolean(q))
    : quickQuestions;

  if (items.length === 0) return null;

  const list =
    variant === "strip"
      ? "scrollbar-none flex gap-2 overflow-x-auto px-3 py-2.5 md:px-4 snap-x"
      : variant === "compact"
        ? "flex flex-wrap gap-2"
        : "grid grid-cols-1 gap-2 min-[380px]:grid-cols-2";

  return (
    <ul className={list} aria-label="Perguntas rápidas">
      {items.map((q, index) => {
        const Icon = quickQuestionIcons[q.icon];
        const isAttendance = q.id === "atendimento";
        const base =
          "group flex items-center gap-2 border font-medium transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50";
        const look =
          variant === "full"
            ? `w-full min-h-12 rounded-2xl px-3 py-2 text-left text-[13px] leading-snug shadow-bubble ${
                isAttendance
                  ? "border-whatsapp/40 bg-whatsapp/10 text-whatsapp-dark hover:bg-whatsapp/15"
                  : "border-brand-600/15 bg-white text-navy-800 hover:border-brand-600/40 hover:bg-sky-50"
              }`
            : `min-h-10 shrink-0 snap-start whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] ${
                isAttendance
                  ? "border-whatsapp/40 bg-white text-whatsapp-dark hover:bg-whatsapp/10"
                  : "border-brand-600/20 bg-white text-brand-700 hover:border-brand-600/50 hover:bg-sky-50"
              }`;

        return (
          <li
            key={q.id}
            className={variant === "full" ? "animate-fade-up" : "shrink-0"}
            style={variant === "full" ? { animationDelay: `${120 + index * 45}ms` } : undefined}
          >
            <button type="button" disabled={disabled} onClick={() => onSelect(q.id)} className={`${base} ${look}`}>
              <span
                className={`flex shrink-0 items-center justify-center rounded-xl ${
                  variant === "full" ? "size-8" : "size-5"
                } ${
                  variant === "full"
                    ? isAttendance
                      ? "bg-whatsapp/15 text-whatsapp-dark"
                      : "bg-gradient-to-br from-brand-600 to-cyan-500 text-white"
                    : isAttendance
                      ? "text-whatsapp-dark"
                      : "text-brand-600"
                }`}
              >
                <Icon className={variant === "full" ? "size-4" : "size-4"} aria-hidden="true" />
              </span>
              <span>{q.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

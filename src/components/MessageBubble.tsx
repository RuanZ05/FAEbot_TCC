"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Check, CheckCheck, ExternalLink, ThumbsDown, ThumbsUp } from "lucide-react";
import type { ChatMessage, FeedbackValue, MessageBlock } from "@/types/chat";
import WhatsAppCard from "@/components/WhatsAppCard";

const timeFormatter = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });

/** Horário renderizado só no cliente (evita divergência de fuso na hidratação). */
function MessageTime({ createdAt, className }: { createdAt: number; className?: string }) {
  const [label, setLabel] = useState("");
  useEffect(() => setLabel(timeFormatter.format(createdAt)), [createdAt]);
  return (
    <time dateTime={new Date(createdAt).toISOString()} className={className} suppressHydrationWarning>
      {label || " "}
    </time>
  );
}

function Block({ block, isUser, question }: { block: MessageBlock; isUser: boolean; question?: string }) {
  switch (block.type) {
    case "text":
      return <p className="whitespace-pre-line break-words">{block.text}</p>;

    case "list": {
      const ordered = block.items.every((item) => /^\d+\./.test(item));
      return (
        <ul className="space-y-1">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2">
              {!ordered && (
                <span className={`mt-[0.55em] size-1.5 shrink-0 rounded-full ${isUser ? "bg-white" : "bg-cyan-500"}`} />
              )}
              <span className="break-words">{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    case "links":
      return (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {block.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-brand-600/20 bg-sky-50 px-3 text-xs font-semibold text-brand-700 transition hover:border-brand-600/50 hover:bg-sky-100"
            >
              {link.label}
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          ))}
        </div>
      );

    case "whatsapp":
      return <WhatsAppCard reason={block.reason} question={question} />;

    default:
      return null;
  }
}

interface MessageBubbleProps {
  message: ChatMessage;
  /** Exibe o avatar do bot (primeira mensagem de uma sequência). */
  showAvatar?: boolean;
  /** Pergunta do usuário que originou esta resposta (usada no WhatsApp). */
  question?: string;
  /** Exibe os botões "Foi útil?" 👍👎. */
  onFeedback?: (messageId: string, value: FeedbackValue) => void;
}

function FeedbackButtons({ message, onFeedback }: { message: ChatMessage; onFeedback: (id: string, v: FeedbackValue) => void }) {
  const given = message.feedback;
  if (given) {
    return (
      <span className="flex items-center gap-1 text-[11px] font-medium text-brand-600" role="status">
        {given === "up" ? <ThumbsUp className="size-3.5 fill-current" /> : <ThumbsDown className="size-3.5 fill-current" />}
        Obrigado pelo retorno!
      </span>
    );
  }
  const btn =
    "flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-sky-50 hover:text-brand-600 active:scale-90";
  return (
    <span className="-ml-1.5 flex items-center gap-0.5">
      <span className="mr-1 text-[11px] text-slate-400">Foi útil?</span>
      <button type="button" className={btn} onClick={() => onFeedback(message.id, "up")} aria-label="Resposta útil" title="Foi útil">
        <ThumbsUp className="size-3.5" />
      </button>
      <button type="button" className={btn} onClick={() => onFeedback(message.id, "down")} aria-label="Resposta não ajudou" title="Não ajudou">
        <ThumbsDown className="size-3.5" />
      </button>
    </span>
  );
}

export default function MessageBubble({ message, showAvatar = true, question, onFeedback }: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex animate-fade-up justify-end pl-10">
        <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-gradient-to-br from-brand-500 to-brand-700 px-3.5 py-2.5 text-[14px] leading-relaxed text-white shadow-md shadow-brand-600/20">
          <div className="space-y-2">
            {message.content.map((block, i) => (
              <Block key={i} block={block} isUser />
            ))}
          </div>
          <div className="mt-1 flex items-center justify-end gap-1 text-[10.5px] text-white/75">
            <MessageTime createdAt={message.createdAt} />
            {message.status === "read" ? (
              <CheckCheck className="size-3.5 text-cyan-400" aria-label="Lida" />
            ) : (
              <Check className="size-3.5" aria-label="Enviada" />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex animate-fade-up items-start gap-2 pr-6 md:pr-8">
      <div className="size-8 shrink-0">
        {showAvatar && (
          <div className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-navy-900 ring-2 ring-white">
            <Image src="/images/faebot.png" alt="" width={64} height={64} className="size-full object-cover" />
          </div>
        )}
      </div>
      <div className="min-w-0 max-w-[92%] rounded-2xl rounded-tl-md border border-brand-600/10 bg-white px-3.5 py-2.5 text-[14px] leading-relaxed text-slate-700 shadow-bubble">
        <div className="space-y-2">
          {message.content.map((block, i) => (
            <Block key={i} block={block} isUser={false} question={question} />
          ))}
        </div>
        <div className="mt-1 flex min-h-8 items-center justify-between gap-2">
          {onFeedback ? <FeedbackButtons message={message} onFeedback={onFeedback} /> : <span />}
          <MessageTime createdAt={message.createdAt} className="text-[10.5px] text-slate-400" />
        </div>
      </div>
    </div>
  );
}

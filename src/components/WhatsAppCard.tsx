import { ArrowUpRight } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { buildWhatsAppMessage, formatPhone, whatsappLink } from "@/data/institution";

interface WhatsAppCardProps {
  /** Assunto que será incluído na mensagem automática. */
  reason?: string;
  /** Última pergunta do usuário (vai junto para o atendente). */
  question?: string;
}

/**
 * Cartão de encaminhamento para atendimento humano.
 *
 * Fase 1 (atual): abre o WhatsApp do número configurado com uma mensagem
 * automática já escrita (assunto + dúvida do usuário). O usuário só toca em "enviar".
 * Fase 2: o back-end (WhatsApp Business Cloud API + n8n) poderá iniciar a
 * conversa sozinho, enviando também o histórico do chat ao atendente.
 */
export default function WhatsAppCard({ reason, question }: WhatsAppCardProps) {
  const href = whatsappLink(buildWhatsAppMessage({ reason, question }));

  return (
    <div className="mt-1 overflow-hidden rounded-2xl border border-whatsapp/30 bg-gradient-to-br from-[#effcf3] to-white">
      <div className="flex items-center gap-3 p-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-whatsapp text-white shadow-md shadow-whatsapp/30">
          <WhatsAppIcon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-navy-900">Atendimento humano</p>
          <p className="text-xs text-slate-500">WhatsApp {formatPhone()}</p>
        </div>
      </div>
      {question && (
        <p className="border-t border-whatsapp/15 px-3 py-2 text-[11.5px] leading-snug text-slate-500">
          Sua dúvida <span className="font-medium text-slate-600">&ldquo;{question.length > 80 ? `${question.slice(0, 80)}…` : question}&rdquo;</span> será enviada junto, para o atendente já saber do que se trata.
        </p>
      )}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-11 items-center justify-center gap-2 bg-whatsapp px-4 text-sm font-semibold text-white transition hover:bg-[#1ebe5a] active:brightness-95"
      >
        Falar pelo WhatsApp
        <ArrowUpRight className="size-4" />
      </a>
    </div>
  );
}

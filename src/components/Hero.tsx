"use client";

import Image from "next/image";
import { BookOpen, Building2, Code2, GraduationCap, MapPin, Moon, Sparkles } from "lucide-react";
import { institution, links } from "@/data/institution";
import { useChatUI } from "@/context/ChatContext";

const highlights = [
  { icon: Code2, label: "Tecnologia em Sistemas para Internet" },
  { icon: Sparkles, label: "Ingresso por vestibular e SiSU" },
  { icon: Moon, label: "Curso noturno" },
];

export default function Hero() {
  const { isOpen } = useChatUI();

  return (
    <section className="relative isolate flex min-h-dvh items-center" aria-labelledby="hero-title">
      {/* Fundo institucional simbólico */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <Image
          src="/images/faeterj-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover object-center blur-[1.5px]"
        />
        {/* Camadas de escurecimento para destacar o chatbot e o texto */}
        <div className="absolute inset-0 bg-navy-950/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/60 via-navy-900/35 to-navy-950/60" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-950/80 via-navy-950/25 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-navy-950/70 to-transparent" />
        {/* Brilho ciano sutil (assinatura FAEBOT) */}
        <div className="absolute -right-40 top-1/4 size-[520px] rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <div
        className={`mx-auto w-full max-w-[1600px] px-5 pb-28 pt-28 transition-[padding] duration-300 sm:px-8 lg:px-10 ${
          isOpen ? "md:pr-[440px] lg:pr-[500px] xl:pr-[540px]" : ""
        }`}
      >
        <div className="mx-auto flex max-w-[720px] animate-fade-up flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md sm:text-[13px]">
            <GraduationCap className="size-4 text-cyan-400" />
            Ensino superior público e gratuito
          </span>

          <h1 id="hero-title" className="mt-5 text-4xl leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-5xl xl:text-6xl">
            <span className="font-extrabold">FAETERJ</span> <span className="font-light">Barra Mansa</span>
          </h1>
          <p className="mt-3 text-sm text-white/85 sm:text-base">{institution.fullName}</p>

          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/70 sm:text-base">
            Ensino, pesquisa e extensão em tecnologia, com foco no desenvolvimento humano-tecnológico e na
            responsabilidade socioambiental.
          </p>

          <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
            <a
              href={links.sobre}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-500 active:scale-[0.98]"
            >
              <Building2 className="size-5" />
              Conheça a FAETERJ
            </a>
            <a
              href={links.cursos}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 font-semibold text-navy-900 transition hover:bg-sky-100 active:scale-[0.98]"
            >
              <BookOpen className="size-5" />
              Conheça o Curso
            </a>
          </div>

          {/* Conteúdo institucional secundário */}
          <ul className="mt-8 flex flex-wrap justify-center gap-2">
            {highlights.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/80 backdrop-blur-md sm:text-[13px]"
              >
                <Icon className="size-4 text-cyan-400" />
                {label}
              </li>
            ))}
          </ul>

          <p className="mt-6 flex items-start justify-center gap-2 text-xs text-white/55 sm:text-[13px]">
            <MapPin className="mt-0.5 size-4 shrink-0" />
            {institution.address.street}, {institution.address.district} — {institution.address.city}
          </p>
        </div>
      </div>
    </section>
  );
}

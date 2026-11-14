"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ExternalLink, Menu, X } from "lucide-react";
import { links, moreNavItems, navItems } from "@/data/institution";
import { useChatUI } from "@/context/ChatContext";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLLIElement>(null);
  const { open: openChat } = useChatUI();

  // Fecha o menu "Mais" ao clicar fora ou apertar Esc
  useEffect(() => {
    if (!moreOpen) return;
    const onClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  return (
    <header className="pt-safe absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:h-[72px] sm:px-6 lg:px-10">
        <a href={links.home} className="flex shrink-0 items-center" aria-label="FAETERJ Barra Mansa — site oficial">
          <Image
            src="/logo-faeterj.png"
            alt="FAETERJ Barra Mansa"
            width={520}
            height={140}
            priority
            className="h-9 w-auto sm:h-10 lg:h-11"
          />
        </a>

        {/* Navegação institucional discreta (desktop) */}
        <nav aria-label="Navegação institucional" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-[13px] font-medium text-white/85 xl:gap-2 xl:text-sm">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full px-3 py-2 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li ref={moreRef} className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                className="flex items-center gap-1 rounded-full px-3 py-2 transition-colors hover:bg-white/10 hover:text-white"
              >
                Mais
                <ChevronDown className={`size-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
              </button>
              {moreOpen && (
                <ul className="animate-fade-up absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-navy-900/95 p-1.5 shadow-chat backdrop-blur-xl">
                  {moreNavItems.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-xl px-3 py-2.5 text-sm text-white/85 hover:bg-white/10 hover:text-white"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </nav>

        {/* Botão de menu (tablet / celular) */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 lg:hidden"
          aria-label="Abrir menu"
          aria-expanded={mobileOpen}
        >
          <Menu className="size-5" />
        </button>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="pt-safe pb-safe animate-fade-up absolute inset-x-3 top-3 max-h-[calc(100dvh-24px)] overflow-y-auto rounded-3xl border border-white/10 bg-navy-900/95 p-3 shadow-chat backdrop-blur-xl">
            <div className="flex items-center justify-between px-2 pb-2">
              <Image src="/logo-faeterj.png" alt="FAETERJ Barra Mansa" width={520} height={140} className="h-8 w-auto" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex size-11 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
                aria-label="Fechar menu"
              >
                <X className="size-5" />
              </button>
            </div>
            <ul className="grid gap-1">
              {[...navItems, ...moreNavItems].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-12 items-center justify-between rounded-2xl px-4 text-[15px] font-medium text-white/90 hover:bg-white/10"
                  >
                    {item.label}
                    <ExternalLink className="size-4 text-white/40" />
                  </a>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openChat();
              }}
              className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-cyan-500 font-semibold text-white"
            >
              <Image src="/images/faebot.png" alt="" width={28} height={28} className="size-7" />
              Fale com o FAEBOT
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

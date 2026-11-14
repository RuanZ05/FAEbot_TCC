"use client";

import { useEffect } from "react";

/**
 * Mantém as variáveis CSS --vvh (altura visível) e --vv-top (deslocamento)
 * sincronizadas com o Visual Viewport.
 *
 * No celular, quando o teclado virtual abre, a área visível diminui.
 * O chat em tela cheia usa essas variáveis para encolher junto e manter
 * o campo de digitação sempre visível (Android e iOS).
 */
export function useVisualViewport(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const vv = window.visualViewport;
    const root = document.documentElement;

    const update = () => {
      const height = vv ? vv.height : window.innerHeight;
      const top = vv ? vv.offsetTop : 0;
      root.style.setProperty("--vvh", `${Math.round(height)}px`);
      root.style.setProperty("--vv-top", `${Math.round(top)}px`);
    };

    update();
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      root.style.removeProperty("--vvh");
      root.style.removeProperty("--vv-top");
    };
  }, [enabled]);
}

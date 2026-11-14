import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FAEBOT — Assistente Virtual da FAETERJ Barra Mansa",
  description:
    "Converse com o FAEBOT, o assistente virtual da FAETERJ Barra Mansa: cursos, ingresso, matrículas, documentos, contatos e atendimento.",
  applicationName: "FAEBOT",
  icons: { apple: "/images/faebot-logo.png" },
  openGraph: {
    title: "FAEBOT — Assistente Virtual da FAETERJ Barra Mansa",
    description: "Informações sobre a FAETERJ Barra Mansa, 24 horas por dia.",
    images: ["/images/faebot-logo.png"],
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Android/Chrome: o teclado virtual redimensiona o layout em vez de cobri-lo
  interactiveWidget: "resizes-content",
  themeColor: "#061a3a",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}

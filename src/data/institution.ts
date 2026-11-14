/**
 * Dados institucionais da FAETERJ Barra Mansa.
 *
 * Todas as informações abaixo foram retiradas do site oficial
 * (https://www.faeterjbm.com.br) — páginas Início, Cursos e Sobre Nós.
 * Nada aqui é inventado: o que o site não informa (calendário acadêmico,
 * horários da secretaria, lista de documentos de matrícula) NÃO é preenchido,
 * e o FAEBOT orienta o usuário a procurar a secretaria.
 *
 * No futuro, este arquivo será substituído pelo banco de dados institucional,
 * alimentado e atualizado pela própria faculdade.
 */

export const SITE_URL = "https://www.faeterjbm.com.br";

export const institution = {
  shortName: "FAETERJ Barra Mansa",
  fullName: "Faculdade de Educação Tecnológica do Estado do Rio de Janeiro",
  maintainer: "FAETEC — Fundação de Apoio à Escola Técnica",
  secretariat: "Secretaria de Estado de Ciência, Tecnologia e Inovação (SECTI)",
  address: {
    street: "Rua Três, S/N",
    district: "Barbará",
    city: "Barra Mansa - RJ",
    zip: "27330-450",
  },
  contact: {
    phoneDisplay: "(24) 98144-5559",
    whatsappNumber: "5524981445559",
    email: "faeterj.barramansa.secretaria@faetec.rj.gov.br",
    /** Telefone fixo da unidade informado no Anexo II do Edital FAETEC 2026.1 (Edital 8). */
    landlineDisplay: "(24) 3328-6483",
  },
} as const;

export const links = {
  home: SITE_URL,
  cursos: `${SITE_URL}/cursos`,
  pilares: `${SITE_URL}/pilares`,
  linhasPesquisa: `${SITE_URL}/linhas-pesquisas`,
  professores: `${SITE_URL}/professores`,
  sobre: `${SITE_URL}/sobrenos`,
  instalacoes: `${SITE_URL}/nossas-instalacoes`,
  contato: `${SITE_URL}/contato`,
  ead: "https://ead.faeterjbm.com.br",
  biblioteca: "https://plataforma.bvirtual.com.br/Account/Login",
  faetec: "https://www.faetec.rj.gov.br",
  sisu: "https://acessounico.mec.gov.br/sisu",
  matriz: `${SITE_URL}/assets/pdf/matriz.pdf`,
  coseac: "https://portal.coseac.uff.br",
  editalVestibular: "https://portal.coseac.uff.br/wp-content/uploads/2025/10/COM-CAPA-EDITAL_2026.1___08_PROVA_VESTIBULAR.pdf",
  faetecSuperior: "https://www.faetec.rj.gov.br/inicial-faetec/educacao-superior/",
  mapa: "https://www.google.com/maps/search/?api=1&query=FAETERJ+Barra+Mansa+Rua+Tr%C3%AAs+Barbar%C3%A1+Barra+Mansa+RJ",
} as const;

/* ------------------------------------------------------------------ */
/* WhatsApp — encaminhamento para atendimento humano                   */
/* ------------------------------------------------------------------ */

/**
 * Número que recebe os encaminhamentos do FAEBOT (formato internacional, só dígitos).
 * - Teste: número da equipe do projeto (padrão abaixo).
 * - Produção: defina NEXT_PUBLIC_WHATSAPP_NUMBER no .env com o número oficial
 *   da unidade (5524981445559), sem precisar mexer no código.
 */
const TEST_WHATSAPP_NUMBER = "5524998365068";

export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || TEST_WHATSAPP_NUMBER).replace(/\D/g, "");

/** Formata 5524998365068 → (24) 99836-5068 */
export function formatPhone(number: string = WHATSAPP_NUMBER): string {
  const local = number.startsWith("55") ? number.slice(2) : number;
  const ddd = local.slice(0, 2);
  const rest = local.slice(2);
  const split = rest.length === 9 ? 5 : 4;
  return `(${ddd}) ${rest.slice(0, split)}-${rest.slice(split)}`;
}

export const WHATSAPP_DEFAULT_MESSAGE =
  "Olá! Vim pelo FAEBOT, o assistente virtual da FAETERJ Barra Mansa, e gostaria de falar com um atendente.";

interface WhatsAppMessageOptions {
  /** Assunto do encaminhamento (ex.: "Documentos e matrícula"). */
  reason?: string;
  /** Última pergunta que o usuário fez ao FAEBOT. */
  question?: string;
}

/** Monta a mensagem automática enviada ao atendente. */
export function buildWhatsAppMessage({ reason, question }: WhatsAppMessageOptions = {}): string {
  const lines = [WHATSAPP_DEFAULT_MESSAGE, ""];
  if (reason) lines.push(`📌 Assunto: ${reason}`);
  if (question) lines.push(`💬 Minha dúvida: "${question.slice(0, 300)}"`);
  lines.push("", "(Mensagem gerada automaticamente pelo FAEBOT)");
  return lines.join("\n");
}

/**
 * Link que abre a conversa no WhatsApp com a mensagem já escrita.
 * api.whatsapp.com/send funciona no app (Android/iOS) e no WhatsApp Web.
 */
export function whatsappLink(message: string = WHATSAPP_DEFAULT_MESSAGE, number: string = WHATSAPP_NUMBER): string {
  return `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`;
}

/** Itens de navegação do cabeçalho (apontam para o site oficial). */
export const navItems = [
  { label: "Início", href: links.home },
  { label: "Cursos", href: links.cursos },
  { label: "Pilares", href: links.pilares },
  { label: "Linhas de Pesquisa", href: links.linhasPesquisa },
  { label: "Professores", href: links.professores },
  { label: "EAD", href: links.ead },
  { label: "Biblioteca Virtual", href: links.biblioteca },
] as const;

export const moreNavItems = [
  { label: "Sobre Nós", href: links.sobre },
  { label: "Nossas Instalações", href: links.instalacoes },
  { label: "Contato", href: links.contato },
] as const;

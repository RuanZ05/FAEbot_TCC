import type { BotReply, KnowledgeEntry } from "@/types/chat";

/**
 * Buscador local do FAEBOT (sem IA, sem internet).
 *
 * Funciona como "plano B" quando o Gemini não está disponível e também
 * responde instantaneamente às perguntas rápidas.
 *
 * Recursos:
 *  - ignora acentos, maiúsculas e pontuação;
 *  - expande abreviações comuns ("pra", "vc", "facul", "qnd"...);
 *  - tolera erros de digitação (distância de edição de 1 ou 2 letras);
 *  - reconhece expressões com várias palavras, também com erros.
 */

/** Remove acentos e pontuação, deixa em minúsculas. */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Abreviações e gírias comuns → forma completa (já normalizadas). */
const ABBREVIATIONS: Record<string, string> = {
  pra: "para",
  pro: "para o",
  q: "que",
  oq: "o que",
  vc: "voce",
  vcs: "voces",
  tb: "tambem",
  tbm: "tambem",
  facu: "faculdade",
  facul: "faculdade",
  fac: "faculdade",
  qnd: "quando",
  qdo: "quando",
  qnt: "quanto",
  qto: "quanto",
  qts: "quantos",
  hj: "hoje",
  doc: "documento",
  docs: "documentos",
  info: "informacao",
  infos: "informacoes",
  insc: "inscricao",
  labs: "laboratorio",
  lab: "laboratorio",
  wpp: "whatsapp",
  zap: "whatsapp",
  tel: "telefone",
  cel: "celular",
  end: "endereco",
  msm: "mesmo",
  td: "tudo",
  ngm: "ninguem",
  mt: "muito",
  mto: "muito",
  dps: "depois",
  tsi: "sistemas para internet",
  si: "sistemas para internet",
  ti: "tecnologia da informacao",
  "1o": "1",
  "2o": "2",
  "3o": "3",
  "4o": "4",
  "5o": "5",
  primeiro: "1",
  segundo: "2",
  terceiro: "3",
  quarto: "4",
  quinto: "5",
};

/** Normaliza e expande abreviações. */
export function prepare(text: string): string[] {
  const words = normalize(text).split(" ").filter(Boolean);
  return words.flatMap((w) => (ABBREVIATIONS[w] ?? w).split(" "));
}

/** Distância de Levenshtein com limite (para cedo se passar de `max`). */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      rowMin = Math.min(rowMin, curr[j]);
    }
    if (rowMin > max) return max + 1;
    prev = curr;
  }
  return prev[b.length];
}

/** Quantos erros aceitamos de acordo com o tamanho da palavra-chave. */
function tolerance(keyword: string): number {
  if (keyword.length >= 8) return 2;
  if (keyword.length >= 5) return 1;
  return 0;
}

type WordMatch = "exact" | "fuzzy" | null;

/**
 * Compara uma palavra digitada com uma palavra-chave.
 * Palavras-chave curtas (≤3) exigem igualdade; as demais aceitam prefixo
 * ("matricul" casa com "matriculas") e erros de digitação.
 */
function matchWord(word: string, keyword: string): WordMatch {
  if (word === keyword) return "exact";
  if (keyword.length <= 3) return null;
  if (word.startsWith(keyword)) return "exact";

  const tol = tolerance(keyword);
  if (tol === 0) return null;
  if (editDistance(word, keyword, tol) <= tol) return "fuzzy";
  // prefixo com erro: "inscriçao" ~ "inscric", "matricla" ~ "matricul"
  if (word.length > keyword.length && editDistance(word.slice(0, keyword.length), keyword, tol) <= tol) return "fuzzy";
  if (word.length >= keyword.length - 1 && editDistance(word, keyword.slice(0, word.length), 1) <= 1 && word.length >= 6)
    return "fuzzy";
  return null;
}

/** Procura a expressão (uma ou mais palavras) dentro do texto. */
function matchKeyword(words: string[], keyword: string): WordMatch {
  const kwWords = prepare(keyword);
  if (kwWords.length === 0) return null;
  let best: WordMatch = null;
  for (let start = 0; start + kwWords.length <= words.length; start++) {
    let result: WordMatch = "exact";
    for (let k = 0; k < kwWords.length; k++) {
      const m = matchWord(words[start + k], kwWords[k]);
      if (!m) {
        result = null;
        break;
      }
      if (m === "fuzzy") result = "fuzzy";
    }
    if (result === "exact") return "exact";
    if (result === "fuzzy") best = "fuzzy";
  }
  return best;
}

export interface MatchResult {
  reply: BotReply;
  entryId: string;
  score: number;
}

/**
 * Encontra a melhor entrada da base para um texto livre.
 * Pontuação: expressões com várias palavras valem 2, palavras soltas 1;
 * correspondências com erro de digitação valem 80% disso.
 */
export function findBestMatch(text: string, base: KnowledgeEntry[]): MatchResult | null {
  const words = prepare(text);
  if (words.length === 0) return null;

  let best: MatchResult | null = null;
  for (const entry of base) {
    let score = 0;
    for (const kw of entry.keywords) {
      const m = matchKeyword(words, kw);
      if (!m) continue;
      const weight = prepare(kw).length > 1 ? 2 : 1;
      score += m === "exact" ? weight : weight * 0.8;
    }
    if (score > 0 && (!best || score > best.score)) best = { reply: entry.reply, entryId: entry.id, score };
  }
  return best;
}

/**
 * Lightweight typograf for hanging short words (RU + EN).
 * Replaces regular spaces with NBSP so prepositions / conjunctions /
 * short pronouns don't sit alone at the end of a line.
 */

export type TypografLang = "en" | "ru";

const NBSP = "\u00A0";

/** Words that must stay with the FOLLOWING word (space AFTER → NBSP). */
const RU_NEXT = [
  // prepositions
  "в",
  "во",
  "на",
  "по",
  "с",
  "со",
  "к",
  "ко",
  "у",
  "о",
  "об",
  "обо",
  "от",
  "до",
  "из",
  "изо",
  "за",
  "над",
  "под",
  "при",
  "про",
  "для",
  "без",
  "через",
  "между",
  "перед",
  "около",
  "вместо",
  "внутри",
  "вне",
  "среди",
  "кроме",
  "ради",
  "сквозь",
  "после",
  "против",
  "благодаря",
  "согласно",
  "вопреки",
  // conjunctions / particles
  "и",
  "а",
  "но",
  "да",
  "или",
  "либо",
  "ни",
  "чем",
  "что",
  "чтобы",
  "как",
  "когда",
  "если",
  "пока",
  "хотя",
  "также",
  "тоже",
  "ведь",
  "даже",
  "лишь",
  "только",
  "уже",
  "ещё",
  "еще",
  "не",
  "нет",
  // short pronouns / determiners
  "я",
  "ты",
  "он",
  "она",
  "оно",
  "мы",
  "вы",
  "они",
  "мой",
  "моя",
  "моё",
  "мое",
  "твой",
  "твоя",
  "наш",
  "наша",
  "ваш",
  "ваша",
  "их",
  "его",
  "её",
  "ее",
  "это",
  "эта",
  "эти",
  "тот",
  "та",
  "те",
  "то",
  "все",
  "всё",
  "сам",
  "сама",
  "кто",
  "где",
  "вот",
  "вон",
];

/** Particles that bind to the PREVIOUS word (space BEFORE → NBSP). */
const RU_PREV = ["же", "ли", "ль", "бы", "б", "ж"];

const EN_NEXT = [
  // articles / short prepositions / conjunctions / pronouns
  "a",
  "an",
  "the",
  "of",
  "to",
  "in",
  "on",
  "at",
  "by",
  "for",
  "or",
  "as",
  "if",
  "is",
  "it",
  "be",
  "we",
  "he",
  "she",
  "my",
  "our",
  "his",
  "her",
  "its",
  "and",
  "but",
  "nor",
  "so",
  "yet",
  "via",
  "per",
  "no",
  "not",
  "i",
  "am",
  "from",
  "with",
  "into",
  "onto",
  "upon",
  "over",
  "under",
  "about",
  "after",
  "before",
  "above",
  "below",
  "than",
  "that",
  "this",
  "these",
  "those",
  "who",
  "whom",
  "whose",
  "which",
  "what",
  "when",
  "where",
  "why",
  "how",
  "all",
  "any",
  "each",
  "few",
  "more",
  "most",
  "some",
  "such",
  "both",
  "own",
  "your",
  "can",
  "may",
  "must",
  "shall",
  "will",
  "do",
  "did",
  "does",
  "are",
  "was",
  "were",
  "has",
  "had",
  "have",
  "mr",
  "mr.",
  "ms",
  "ms.",
  "mrs",
  "mrs.",
  "dr",
  "dr.",
  "vs",
  "vs.",
];

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildNextPattern(words: string[]): RegExp {
  // Longest first so "чтобы" wins over "что", "mrs." over "mr.", etc.
  const sorted = [...words].sort((a, b) => b.length - a.length).map(escapeRegExp);
  // Bound: start or non-letter/digit before; regular spaces after; letter/digit/quote ahead.
  return new RegExp(
    `(^|[^\\p{L}\\p{N}_])(${sorted.join("|")})( +)(?=[\\p{L}\\p{N}«»„“”"‘’'(0-9$€£¥₽])`,
    "giu",
  );
}

function buildPrevPattern(words: string[]): RegExp {
  const sorted = [...words].sort((a, b) => b.length - a.length).map(escapeRegExp);
  return new RegExp(
    `([^\\s${NBSP}])( +)(${sorted.join("|")})(?=[^\\p{L}\\p{N}]|$)`,
    "giu",
  );
}

const RU_NEXT_RE = buildNextPattern(RU_NEXT);
const RU_PREV_RE = buildPrevPattern(RU_PREV);
const EN_NEXT_RE = buildNextPattern(EN_NEXT);

/** Initials: «А. С.» / «J. K.» */
const INITIALS_RE = /([A-ZА-ЯЁ])\.( +)(?=[A-ZА-ЯЁa-zа-яё])/gu;

/** Number + short unit / word (keep on one line). */
const NUM_UNIT_RE =
  /(\d(?:[.,]\d+)?)( +)(?=(?:год(?:а|у|ом|ов)?|лет|мес(?:яц(?:а|ев|у|ом)?)?|дн(?:я|ей|ю|ём|ем)?|день|час(?:а|ов|у|ом)?|мин(?:ут[аыу]?)?|сек(?:унд[аыу]?)?|тыс(?:яч[аи]?)?|млн|млрд|кв\.?\s*м|м²|м2|USD|EUR|GEL|RUB|year(?:s)?|month(?:s)?|day(?:s)?|hour(?:s)?|min(?:ute)?s?|sec(?:ond)?s?|million|billion|%|\$|€|£|₽)(?=[^\p{L}\p{N}]|$))/giu;

/** Currency symbol glued to amount: "$ 1,200" → "$ NBSP 1,200" */
const CURRENCY_AMOUNT_RE = /([€$£¥₽])( +)(?=\d)/g;

/** Em dash: prefer NBSP before (RU/EN editorial). */
const EM_DASH_RE = / +—/g;

function shouldSkip(text: string): boolean {
  if (!text || !text.includes(" ")) return true;
  if (/^https?:\/\//i.test(text)) return true;
  if (/^mailto:/i.test(text)) return true;
  if (/^\/[\w./?#&=%-]*$/.test(text)) return true;
  return false;
}

/**
 * Apply hanging-word / glue rules. Idempotent for already-NBSPed text.
 */
export function fixTypography(text: string, lang: TypografLang = "ru"): string {
  if (shouldSkip(text)) return text;

  let out = text;

  out = out.replace(INITIALS_RE, `$1.${NBSP}`);
  out = out.replace(CURRENCY_AMOUNT_RE, `$1${NBSP}`);
  out = out.replace(NUM_UNIT_RE, `$1${NBSP}`);
  out = out.replace(EM_DASH_RE, `${NBSP}—`);

  if (lang === "ru") {
    out = out.replace(RU_NEXT_RE, `$1$2${NBSP}`);
    out = out.replace(RU_PREV_RE, `$1${NBSP}$3`);
  } else {
    out = out.replace(EN_NEXT_RE, `$1$2${NBSP}`);
  }

  return out;
}

/** Deep-map all strings in locale/content trees. */
export function typografDeep<T>(value: T, lang: TypografLang): T {
  if (typeof value === "string") return fixTypography(value, lang) as T;
  if (Array.isArray(value)) return value.map((v) => typografDeep(v, lang)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = Array.isArray(value) ? [] : {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      // Never touch structural ids / media paths by key name.
      if (
        k === "slug" ||
        k === "id" ||
        k === "href" ||
        k === "src" ||
        k === "url" ||
        k === "image" ||
        k === "img" ||
        k === "icon" ||
        k.endsWith("Href") ||
        k.endsWith("Src") ||
        k.endsWith("Url") ||
        k.endsWith("Image")
      ) {
        out[k] = v;
      } else {
        out[k] = typografDeep(v, lang);
      }
    }
    return out as T;
  }
  return value;
}

export function normalizeTypografLang(language: string): TypografLang {
  const c = language.toLowerCase();
  if (c === "ru" || c.startsWith("ru-") || c.startsWith("ru_")) return "ru";
  // Georgian has no Latin hanging-preposition rules; keep EN glue for mixed tokens
  return "en";
}

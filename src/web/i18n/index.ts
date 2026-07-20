import { useCallback } from "react";
import { normalizeLanguage, useLocale, type LanguageCode } from "../context/LocaleContext";
import en, { type MessageKey } from "./en";
import ru from "./ru";

const catalogs: Record<LanguageCode, Record<MessageKey, string>> = {
  en,
  ru,
};

export type { LanguageCode };

export function translate(
  language: string,
  key: MessageKey,
  vars?: Record<string, string | number>
): string {
  const lang = normalizeLanguage(language);
  let text: string = catalogs[lang][key] ?? catalogs.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return text;
}

export function useT() {
  const { language } = useLocale();
  return useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) =>
      translate(language, key, vars),
    [language]
  );
}

export type { MessageKey };

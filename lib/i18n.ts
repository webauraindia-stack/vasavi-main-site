import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "../messages/en.json";
import te from "../messages/te.json";
import hi from "../messages/hi.json";
import ta from "../messages/ta.json";
import kn from "../messages/kn.json";
import contentEn from "../messages/content-en.json";
import contentTe from "../messages/content-te.json";

function deepMerge<T extends Record<string, unknown>>(base: T, overlay: Record<string, unknown>): T {
  const out = { ...base } as Record<string, unknown>;
  for (const [k, v] of Object.entries(overlay)) {
    if (
      v &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      out[k] &&
      typeof out[k] === "object" &&
      !Array.isArray(out[k])
    ) {
      out[k] = deepMerge(out[k] as Record<string, unknown>, v as Record<string, unknown>);
    } else {
      out[k] = v;
    }
  }
  return out as T;
}

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "te", label: "తెలుగు" },
  { code: "hi", label: "हिंदी" },
  { code: "ta", label: "தமிழ்" },
  { code: "kn", label: "ಕನ್ನಡ" },
] as const;

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number]["code"];

const enFull = deepMerge(en as Record<string, unknown>, contentEn);
const teFull = deepMerge(te as Record<string, unknown>, contentTe);
const taFull = deepMerge(ta as Record<string, unknown>, contentTe);
const knFull = deepMerge(kn as Record<string, unknown>, contentTe);

const resources = {
  en: { translation: enFull },
  te: { translation: teFull },
  hi: { translation: hi },
  ta: { translation: taFull },
  kn: { translation: knFull },
};

const STORAGE_KEY = "vasavi-language";

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
      nonExplicitSupportedLngs: true,
      load: "languageOnly",
      detection: {
        order: ["localStorage", "navigator"],
        lookupLocalStorage: STORAGE_KEY,
        caches: ["localStorage"],
      },
      interpolation: {
        escapeValue: false,
      },
      pluralSeparator: "_",
      react: {
        useSuspense: false,
        bindI18n: "languageChanged loaded",
        bindI18nStore: "added removed",
      },
      returnEmptyString: false,
    });
}

export async function setAppLanguage(lang: AppLanguage) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }
  await i18n.changeLanguage(lang);
}

export default i18n;

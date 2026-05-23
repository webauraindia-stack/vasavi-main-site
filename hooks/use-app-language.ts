"use client";

import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { setAppLanguage, type AppLanguage, SUPPORTED_LANGUAGES } from "@/lib/i18n";

export function useAppLanguage() {
  const { i18n, t } = useTranslation();
  const language = (i18n.language?.split("-")[0] ?? "en") as AppLanguage;

  const changeLanguage = useCallback(async (code: AppLanguage) => {
    await setAppLanguage(code);
  }, []);

  return {
    t,
    i18n,
    language,
    languages: SUPPORTED_LANGUAGES,
    changeLanguage,
    ready: i18n.isInitialized,
  };
}

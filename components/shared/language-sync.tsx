"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function LanguageSync() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const apply = (lng: string) => {
      document.documentElement.lang = lng.split("-")[0];
    };

    apply(i18n.language);
    i18n.on("languageChanged", apply);
    return () => {
      i18n.off("languageChanged", apply);
    };
  }, [i18n]);

  return null;
}

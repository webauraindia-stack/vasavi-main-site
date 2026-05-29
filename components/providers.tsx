"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { LanguageSync } from "@/components/shared/language-sync";
import { ApiSessionSync } from "@/components/api-session-sync";
import { SessionTokenRefresher } from "@/components/session-token-refresher";
import { HotelsCatalogProvider } from "@/lib/context/hotels-catalog";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000, refetchOnWindowFocus: false },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <LanguageSync />
          <ApiSessionSync />
          <SessionTokenRefresher />
          <HotelsCatalogProvider>{children}</HotelsCatalogProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

import type { Metadata } from "next";
import { Cinzel, Marcellus, Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { BookingModal } from "@/components/shared/booking-modal";
import { BookingToast } from "@/components/shared/booking-toast";
import Script from "next/script";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vasavi Hotels — Premium Spiritual Hospitality",
    template: "%s | Vasavi Hotels",
  },
  description:
    "Experience divine temple elegance and premium Indian hospitality with Vasavi Hotels. A trusted ecosystem of luxury stays for families and pilgrims.",
  openGraph: {
    title: "Vasavi Hotels — Premium Spiritual Hospitality",
    description: "Experience divine temple elegance and premium Indian hospitality.",
    type: "website",
    locale: "en_IN",
    siteName: "Vasavi Hotels",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cinzel.variable} ${marcellus.variable} ${inter.variable}`}
    >
      <body className="min-h-screen min-w-0 flex flex-col">
        <div id="google_translate_element" style={{ display: "none" }}></div>
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                autoDisplay: false
              }, 'google_translate_element');
            }

            // Aggressively remove the Google Translate banner
            if (typeof window !== 'undefined') {
              const hideGoogleTranslate = () => {
                // Hide any iframe that looks like the banner
                const iframes = document.querySelectorAll('iframe');
                iframes.forEach(iframe => {
                  if (
                    iframe.className.includes('goog-te-banner-frame') || 
                    (iframe.src && iframe.src.includes('translate.googleapis.com')) ||
                    iframe.id === ':1.container'
                  ) {
                    iframe.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; height: 0 !important; width: 0 !important;';
                  }
                });

                // Hide the main wrapper if present (only specific ones)
                const wrappers = document.querySelectorAll('.skiptranslate > iframe.goog-te-banner-frame');
                wrappers.forEach(w => {
                  const parent = w.parentElement;
                  if (parent && parent.tagName === 'DIV') {
                    parent.style.cssText = 'display: none !important;';
                  }
                });

                // Reset body positioning
                const body = document.body;
                if (body && body.style.top !== '0px') {
                  body.style.top = '0px';
                  body.style.position = 'static';
                }
                const html = document.documentElement;
                if (html && html.style.top !== '0px') {
                  html.style.top = '0px';
                  html.style.position = 'static';
                }
              };
              
              hideGoogleTranslate();
              const observer = new MutationObserver(hideGoogleTranslate);
              observer.observe(document.body, { childList: true, subtree: true });
              window.addEventListener("resize", hideGoogleTranslate, { passive: true });
            }
          `}
        </Script>
        <Providers>
          <Navbar />
          <main className="flex-1 min-w-0 pb-20 lg:pb-0">{children}</main>
          <Footer />
          <BookingModal />
          <BookingToast />
        </Providers>
      </body>
    </html>
  );
}

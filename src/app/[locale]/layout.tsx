import type { Metadata } from "next";
import localFont from "next/font/local";
import { preconnect } from "react-dom";
import { notFound } from "next/navigation";
import { getDirection, locales } from "@/i18n/config";
import { isLocale } from "@/i18n/routing";
import { getDictionary } from "@/i18n/get-dictionary";
import "../globals.css";

const thmanyah = localFont({
  variable: "--font-thmanyah",
  display: "swap",
  fallback: ["Arial", "Segoe UI", "Tahoma", "sans-serif"],
  src: [
    { path: "../../fonts/thmanyah/thmanyahsans-Light.woff2", weight: "300", style: "normal" },
    { path: "../../fonts/thmanyah/thmanyahsans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/thmanyah/thmanyahsans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/thmanyah/thmanyahsans-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../fonts/thmanyah/thmanyahsans-Black.woff2", weight: "900", style: "normal" },
  ],
});

const thmanyahSerif = localFont({
  variable: "--font-thmanyah-serif",
  display: "swap",
  fallback: ["Georgia", "serif"],
  src: "../../fonts/thmanyah/thmanyahserifdisplay-Regular.woff2",
  weight: "400",
  style: "normal",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = await getDictionary(locale);
  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
    icons: { icon: "/img/favicon.svg" },
    alternates: {
      languages: {
        ar: "/ar",
        en: "/en",
      },
    },
  };
}

export default async function RootLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // News images (home, listing, articles) all load from Unsplash — open
  // the connection early instead of waiting for the first <img> to be found.
  preconnect("https://images.unsplash.com");

  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      className={`${thmanyah.variable} ${thmanyahSerif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

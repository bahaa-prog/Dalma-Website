export const locales = ["ar", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

export const localeCookieName = "dalma_locale";

const directions: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  en: "ltr",
};

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return directions[locale];
}

const dateFormatLocales: Record<Locale, string> = {
  ar: "ar-SA-u-ca-gregory",
  en: "en-GB-u-ca-gregory",
};

export function getDateFormatLocale(locale: Locale): string {
  return dateFormatLocales[locale];
}

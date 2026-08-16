import { defaultLocale, getDateFormatLocale, type Locale } from "@/i18n/config";

// `ar-SA` alone defaults to the Hijri calendar — force Gregorian so dates read
// the same way the old hardcoded "١٥ يونيو ٢٠٢٦" strings did. Kept in its own
// module (no DB import) so client components can use it without pulling
// better-sqlite3 into the browser bundle.
export function formatArticleDate(date: Date, locale: Locale = defaultLocale): string {
  return date.toLocaleDateString(getDateFormatLocale(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

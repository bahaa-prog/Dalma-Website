import { locales, type Locale } from "./config";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Splits a pathname into its leading locale segment (if any) and the rest.
 * "/ar/news/foo" -> { locale: "ar", rest: "/news/foo" }
 * "/ar"          -> { locale: "ar", rest: "/" }
 * "/news/foo"    -> { locale: null, rest: "/news/foo" }
 */
export function stripLocale(pathname: string): {
  locale: Locale | null;
  rest: string;
} {
  const segments = pathname.split("/");
  const first = segments[1] ?? "";

  if (!isLocale(first)) {
    return { locale: null, rest: pathname };
  }

  const rest = "/" + segments.slice(2).join("/");
  return { locale: first, rest: rest === "/" ? "/" : rest.replace(/\/+$/, "") || "/" };
}

/** Prefixes an unlocalized absolute path ("/news/foo") with a locale. */
export function localizePath(locale: Locale, path: string): string {
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

/** Swaps the locale segment of an already-localized (or bare) pathname. */
export function replaceLocale(pathname: string, targetLocale: Locale): string {
  const { rest } = stripLocale(pathname);
  return localizePath(targetLocale, rest);
}

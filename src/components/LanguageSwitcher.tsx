"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { localeCookieName } from "@/i18n/config";
import { replaceLocale } from "@/i18n/routing";

export default function LanguageSwitcher({
  locale,
  otherLanguageName,
  label,
  className,
  onNavigate,
}: {
  locale: Locale;
  otherLanguageName: string;
  label: string;
  className?: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const targetLocale: Locale = locale === "ar" ? "en" : "ar";

  function onClick() {
    document.cookie = `${localeCookieName}=${targetLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    const targetPath = replaceLocale(pathname, targetLocale);
    router.push(`${targetPath}${window.location.search}${window.location.hash}`);
    onNavigate?.();
  }

  return (
    <button
      type="button"
      className={className ?? "lang-switcher-btn"}
      onClick={onClick}
      aria-label={label}
    >
      <Globe className="icon-15" />
      <span>{otherLanguageName}</span>
    </button>
  );
}

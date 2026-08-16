"use client";

import { useParams, useRouter } from "next/navigation";
import { defaultLocale } from "@/i18n/config";
import { isLocale, localizePath } from "@/i18n/routing";

export default function LogoutButton({ label }: { label: string }) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push(localizePath(locale, "/admin/login"));
    router.refresh();
  }

  return (
    <button className="admin-logout-btn" onClick={onLogout}>
      {label}
    </button>
  );
}

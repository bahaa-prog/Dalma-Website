import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { defaultLocale } from "@/i18n/config";
import { isLocale, localizePath } from "@/i18n/routing";
import { getDictionary } from "@/i18n/get-dictionary";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-brand">{dict.admin.dashboardBrand}</span>
        <nav>
          <Link href={localizePath(locale, "/admin/articles")}>{dict.admin.navArticles}</Link>
          <Link href={localizePath(locale, "/admin/articles/new")}>{dict.admin.navNewArticle}</Link>
          <LanguageSwitcher
            locale={locale}
            otherLanguageName={dict.common.otherLanguageName}
            label={dict.common.languageSwitcherLabel}
          />
          <LogoutButton label={dict.admin.logout} />
        </nav>
      </div>
      <div className="admin-main">{children}</div>
    </>
  );
}

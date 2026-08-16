import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { isLocale } from "@/i18n/routing";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function MainLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <>
      <Header locale={locale} dict={dict.header} common={dict.common} />
      {children}
      <Footer locale={locale} dict={dict.footer} common={dict.common} />
    </>
  );
}

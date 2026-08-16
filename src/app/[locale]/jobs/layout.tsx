import type { Metadata } from "next";
import { defaultLocale } from "@/i18n/config";
import { isLocale } from "@/i18n/routing";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);
  return { title: dict.metadata.jobsTitle, description: dict.metadata.jobsDescription };
}

// jobs intentionally has no shared Header/Footer — minimal header only.
export default function JobsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="jobs-page">{children}</div>;
}

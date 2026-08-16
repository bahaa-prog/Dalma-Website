import { defaultLocale } from "@/i18n/config";
import { isLocale } from "@/i18n/routing";
import { getDictionary } from "@/i18n/get-dictionary";
import MessageContent from "./MessageContent";

export default async function MessagePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);

  return <MessageContent dict={dict.message} />;
}

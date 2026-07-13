import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "رسالة الرئيس — مدينة الدلما الإنسانية",
};

export default function MessageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

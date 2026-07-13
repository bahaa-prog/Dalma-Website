import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الأخبار والفعاليات — مدينة الدلما الإنسانية",
  description: "آخر أخبار وفعاليات وإنجازات مدينة الدلما الإنسانية.",
};

export default function NewsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

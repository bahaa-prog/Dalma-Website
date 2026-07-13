import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "طلب التوظيف — مدينة الدلما الإنسانية",
  description: "انضم إلى فريق مدينة الدلما الإنسانية — تقديم طلب التوظيف.",
};

// jobs intentionally has no shared Header/Footer — minimal header only.
export default function JobsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="jobs-page">{children}</div>;
}

import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { preconnect } from "react-dom";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "مدينة الدلما الإنسانية",
  description:
    "مدينة الدلما الإنسانية — رائدة في مجال رعاية وتأهيل الأشخاص ذوي الإعاقة في المملكة العربية السعودية.",
  icons: { icon: "/img/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // News images (home, listing, articles) all load from Unsplash — open
  // the connection early instead of waiting for the first <img> to be found.
  preconnect("https://images.unsplash.com");

  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body>{children}</body>
    </html>
  );
}

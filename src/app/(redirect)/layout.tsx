import "../globals.css";

// This route group (not `[locale]`) is what makes it a second, independent
// root layout — Next.js only allows multiple <html>-rendering layouts when
// each top-level branch is its own route group with no shared app/layout.tsx
// above them. Static export has no server, so there is no proxy.ts to
// negotiate a locale either; this layout only ever wraps the client redirect
// in page.tsx, which sends visitors on to /ar or /en.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}

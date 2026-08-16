import "./globals.css";

// Static export has no server, so there is no proxy.ts to negotiate a
// locale — this bare-root layout only ever renders the client redirect in
// page.tsx, which sends visitors on to /ar or /en.
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

// `ar-SA` alone defaults to the Hijri calendar — force Gregorian so dates read
// the same way the old hardcoded "١٥ يونيو ٢٠٢٦" strings did. Kept in its own
// module (no DB import) so client components can use it without pulling
// better-sqlite3 into the browser bundle.
export function formatArticleDate(date: Date): string {
  return date.toLocaleDateString("ar-SA-u-ca-gregory", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// `ar-SA` alone defaults to the Hijri calendar — force Gregorian so dates read
// the same way the old hardcoded "١٥ يونيو ٢٠٢٦" strings did. Kept in its own
// module so client components can use it too.
export function formatArticleDate(date: Date): string {
  return date.toLocaleDateString("ar-SA-u-ca-gregory", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

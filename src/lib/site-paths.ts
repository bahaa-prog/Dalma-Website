const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a public asset path when the site is hosted below a GitHub Pages subpath. */
export function assetPath(path: string): string {
  return `${basePath}${path}`;
}

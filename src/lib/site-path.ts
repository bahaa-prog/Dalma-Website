const basePath = process.env.GITHUB_ACTIONS === "true" ? "/Dalma-Website" : "";

export function sitePath(path: string) {
  return `${basePath}${path}`;
}

import sanitizeHtml from "sanitize-html";

// Allowlist matches Tiptap's actual output (starter-kit + link + image
// extensions). Sanitized once here on write; trusted on read everywhere
// else — cheap insurance against stored XSS even from a single trusted admin.
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li",
      "strong", "em", "s", "u",
      "a", "img", "br", "blockquote", "code", "pre", "hr",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
}

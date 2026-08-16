import { NextRequest, NextResponse } from "next/server";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";
import { defaultLocale, locales, localeCookieName, type Locale } from "@/i18n/config";
import { isLocale, stripLocale } from "@/i18n/routing";

// Unprefixed on purpose — called by client fetch()/FormData uploads, never
// navigated to directly, so it never needs a locale segment.
const PUBLIC_API_PATHS = ["/api/admin/login"];
const PUBLIC_ADMIN_PATHS = ["/admin/login"];

async function handleApiAdmin(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_API_PATHS.some((p) => pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const valid = token ? await verifySessionToken(token) : false;
  if (valid) return NextResponse.next();

  return NextResponse.json({ error: "غير مصرح." }, { status: 401 });
}

function negotiateLocale(req: NextRequest): Locale {
  const cookieLocale = req.cookies.get(localeCookieName)?.value;
  if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;

  const headers = { "accept-language": req.headers.get("accept-language") ?? "" };
  const languages = new Negotiator({ headers }).languages();
  const matched = match(languages, locales, defaultLocale);
  return isLocale(matched) ? matched : defaultLocale;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /api/admin/* stays unprefixed and keeps today's auth behavior exactly —
  // it's never navigated to, only fetch()ed, so it has no locale concern.
  if (pathname.startsWith("/api/admin")) {
    return handleApiAdmin(req);
  }

  const { locale, rest } = stripLocale(pathname);

  if (!locale) {
    const target = negotiateLocale(req);
    req.nextUrl.pathname = pathname === "/" ? `/${target}` : `/${target}${pathname}`;
    return NextResponse.redirect(req.nextUrl, 308);
  }

  const isAdminPage = rest === "/admin" || rest.startsWith("/admin/");
  if (isAdminPage) {
    const isPublic = PUBLIC_ADMIN_PATHS.some((p) => rest.startsWith(p));
    if (!isPublic) {
      const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
      const valid = token ? await verifySessionToken(token) : false;
      if (!valid) {
        const loginUrl = new URL(`/${locale}/admin/login`, req.url);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // Runs on every page request except Next internals, uploaded files, and
  // any request for a file with an extension (covers /img/*, favicon, etc).
  // /api/admin/* is intentionally included so handleApiAdmin() above runs.
  matcher: ["/((?!_next/|uploads/|.*\\.[^/]+$).*)"],
};

import { defaultLocale, locales, localeCookieName } from "@/i18n/config";
import { assetPath } from "@/lib/site-paths";

// No server = no proxy.ts locale negotiation, so the bare root sends a tiny
// inline script to pick a locale before first paint: saved cookie first
// (same cookie LanguageSwitcher writes), then the browser's language, then
// the site default. Runs before hydration to avoid a flash of the wrong page.
const redirectScript = `
(function () {
  var locales = ${JSON.stringify(locales)};
  var cookieName = ${JSON.stringify(localeCookieName)};
  var basePath = ${JSON.stringify(assetPath(""))};
  var target = ${JSON.stringify(defaultLocale)};

  var cookieMatch = document.cookie.match(new RegExp("(?:^|; )" + cookieName + "=([^;]*)"));
  var cookieLocale = cookieMatch && decodeURIComponent(cookieMatch[1]);

  if (cookieLocale && locales.indexOf(cookieLocale) !== -1) {
    target = cookieLocale;
  } else if (navigator.language) {
    var lang = navigator.language.slice(0, 2).toLowerCase();
    if (locales.indexOf(lang) !== -1) target = lang;
  }

  window.location.replace(basePath + "/" + target + "/");
})();
`;

export default function RootPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
      <noscript>
        <meta httpEquiv="refresh" content={`0; url=${assetPath(`/${defaultLocale}/`)}`} />
      </noscript>
    </>
  );
}

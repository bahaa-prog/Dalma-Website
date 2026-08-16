import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import XLogo from "./icons/XLogo";
import type { Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/routing";
import type { Dictionary } from "@/i18n/dictionaries/ar";
import { assetPath } from "@/lib/site-paths";

export default function Footer({
  locale,
  dict,
  common,
}: {
  locale: Locale;
  dict: Dictionary["footer"];
  common: Dictionary["common"];
}) {
  const href = (path: string) => localizePath(locale, path);
  const hrefHash = (hash: string) => `${localizePath(locale, "/")}${hash}`;
  const Chevron = locale === "ar" ? ChevronLeft : ChevronRight;

  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-logo-row">
              <img src={assetPath("/img/logo_white.PNG")} alt={common.logoAlt} className="footer-logo" />
              <img src={assetPath("/img/rafq_white_logo.PNG")} alt={dict.rafqLogoAlt} className="footer-logo footer-logo-lg" />
              <img src={assetPath("/img/HR_white_logo.PNG")} alt={dict.hrLogoAlt} className="footer-logo footer-logo-xl" />
            </div>
            <p className="footer-about">{dict.aboutBlurb}</p>
            <div className="footer-socials">
              {/* Other platforms disabled until accounts exist:
              <a href="#" className="social-btn" aria-label="Facebook"><Facebook className="icon-16" /></a>
              <a href="#" className="social-btn" aria-label="Instagram"><Instagram className="icon-16" /></a>
              <a href="#" className="social-btn" aria-label="YouTube"><Youtube className="icon-16" /></a>
              */}
              <a
                href="https://x.com/dhc_jouf?lang=ar"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                aria-label={dict.xLabel}
              >
                <XLogo className="icon-16" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="footer-col-title">{dict.quickLinksTitle}</h4>
            <ul className="footer-links">
              <li><Link href={href("/")} className="footer-link"><Chevron className="icon-13" />{dict.nav.home}</Link></li>
              <li><Link href={hrefHash("#about")} className="footer-link"><Chevron className="icon-13" />{dict.nav.about}</Link></li>
              <li><Link href={href("/message")} className="footer-link"><Chevron className="icon-13" />{dict.nav.message}</Link></li>
              <li><Link href={hrefHash("#programs")} className="footer-link"><Chevron className="icon-13" />{dict.nav.programs}</Link></li>
              <li><Link href={href("/news")} className="footer-link"><Chevron className="icon-13" />{dict.nav.news}</Link></li>
              <li><Link href={hrefHash("#contact")} className="footer-link"><Chevron className="icon-13" />{dict.nav.contact}</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">{dict.copyright}</p>
          <div className="footer-legal">
            <a href="#">{dict.privacyPolicy}</a>
            <a href="#">{dict.termsOfUse}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

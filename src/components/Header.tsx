"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Accessibility,
  Briefcase,
  ChevronDown,
  HandHeart,
  Menu,
  Phone,
  UserPlus,
  X,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import { localizePath, stripLocale } from "@/i18n/routing";
import type { Dictionary } from "@/i18n/dictionaries/ar";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({
  locale,
  dict,
  common,
}: {
  locale: Locale;
  dict: Dictionary["header"];
  common: Dictionary["common"];
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  const href = (path: string) => localizePath(locale, path);
  const hrefHash = (hash: string) => `${localizePath(locale, "/")}${hash}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const { rest: currentPath } = stripLocale(pathname ?? "/");
  const active = (paths: string[]) =>
    paths.some((p) => (p === "/" ? currentPath === "/" : currentPath.startsWith(p)))
      ? { color: "var(--primary)" }
      : undefined;

  const closeMobile = () => setMenuOpen(false);

  return (
    <header id="site-header" className={scrolled ? "scrolled" : undefined}>
      <div className="header-inner">
        <div className="header-logos">
          <Link href={href("/")}>
            <img src="/img/logo_color.PNG" alt={common.logoAlt} className="header-logo" />
          </Link>
          <span className="header-logo-divider"></span>
          <img src="/img/HR_logo.jpeg" alt={dict.hrLogoAlt} className="header-hr-logo" />
        </div>

        <nav className="desktop-nav">
          <Link href={href("/")} className="nav-link" style={active(["/"])}>{dict.home}</Link>
          <Link href={hrefHash("#about")} className="nav-link">{dict.about}</Link>
          <Link href={href("/message")} className="nav-link" style={active(["/message"])}>{dict.message}</Link>
          <Link href={hrefHash("#programs")} className="nav-link">{dict.programs}</Link>
          <Link href={href("/news")} className="nav-link" style={active(["/news"])}>{dict.news}</Link>
          <Link href={hrefHash("#contact")} className="nav-link">{dict.contact}</Link>

          <div className="dropdown-wrapper" id="eservices-wrapper" ref={servicesRef}>
            <button
              className={`dropdown-btn${servicesOpen ? " open" : ""}`}
              id="eservices-btn"
              onClick={() => setServicesOpen((o) => !o)}
            >
              {dict.eservicesLabel}
              <ChevronDown className="dropdown-chevron icon-15" />
            </button>
            <div id="eservices-panel" className={servicesOpen ? "open" : undefined}>
              <button className="eservice-item disabled">
                <span className="eservice-icon grey"><UserPlus className="icon-16" /></span>
                <span>{dict.eserviceRegister}</span>
                <span className="soon-badge">{dict.comingSoon}</span>
              </button>
              <button className="eservice-item disabled">
                <span className="eservice-icon grey"><HandHeart className="icon-16" /></span>
                <span>{dict.eserviceVolunteer}</span>
                <span className="soon-badge">{dict.comingSoon}</span>
              </button>
              <Link href={href("/jobs")} className="eservice-item can-click">
                <span className="eservice-icon blue"><Briefcase className="icon-16" /></span>
                <span>{dict.eserviceJobs}</span>
              </Link>
              <button className="eservice-item disabled">
                <span className="eservice-icon grey"><Accessibility className="icon-16" /></span>
                <span>{dict.eserviceAccessibility}</span>
                <span className="soon-badge">{dict.comingSoon}</span>
              </button>
            </div>
          </div>

          <LanguageSwitcher
            locale={locale}
            otherLanguageName={common.otherLanguageName}
            label={common.languageSwitcherLabel}
          />
        </nav>

        <Link href={hrefHash("#contact")} className="contact-cta-btn">
          <Phone className="icon-15" />
          {dict.contact}
        </Link>

        <button
          className="hamburger-btn"
          id="menu-btn"
          aria-label={menuOpen ? dict.closeMenu : dict.openMenu}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X className="icon-22" /> : <Menu className="icon-22" />}
        </button>
      </div>

      <div id="mobile-menu" className={menuOpen ? "open" : undefined}>
        <Link href={href("/")} className="mobile-nav-link" onClick={closeMobile}>{dict.home}</Link>
        <Link href={hrefHash("#about")} className="mobile-nav-link" onClick={closeMobile}>{dict.about}</Link>
        <Link href={href("/message")} className="mobile-nav-link" onClick={closeMobile}>{dict.message}</Link>
        <Link href={hrefHash("#programs")} className="mobile-nav-link" onClick={closeMobile}>{dict.programs}</Link>
        <Link href={href("/news")} className="mobile-nav-link" onClick={closeMobile}>{dict.news}</Link>
        <Link href={hrefHash("#contact")} className="mobile-nav-link" onClick={closeMobile}>{dict.contact}</Link>
        <div className="mobile-services-section">
          <p className="mobile-services-label">{dict.eservicesLabel}</p>
          <button className="mobile-svc-btn disabled">
            <UserPlus className="icon-16" style={{ color: "var(--primary)" }} />
            {dict.eserviceRegister}
            <span style={{ marginInlineStart: "auto", fontSize: "0.625rem", color: "var(--muted-fg)" }}>{dict.comingSoon}</span>
          </button>
          <button className="mobile-svc-btn disabled">
            <HandHeart className="icon-16" style={{ color: "var(--primary)" }} />
            {dict.eserviceVolunteer}
            <span style={{ marginInlineStart: "auto", fontSize: "0.625rem", color: "var(--muted-fg)" }}>{dict.comingSoon}</span>
          </button>
          <Link href={href("/jobs")} className="mobile-svc-btn can-click" onClick={closeMobile}>
            <Briefcase className="icon-16" style={{ color: "var(--primary)" }} />
            {dict.eserviceJobs}
          </Link>
          <button className="mobile-svc-btn disabled">
            <Accessibility className="icon-16" style={{ color: "var(--primary)" }} />
            {dict.eserviceAccessibility}
            <span style={{ marginInlineStart: "auto", fontSize: "0.625rem", color: "var(--muted-fg)" }}>{dict.comingSoon}</span>
          </button>
        </div>
        <LanguageSwitcher
          locale={locale}
          otherLanguageName={common.otherLanguageName}
          label={common.languageSwitcherLabel}
          className="lang-switcher-btn lang-switcher-btn--mobile"
          onNavigate={closeMobile}
        />
        <Link href={hrefHash("#contact")} className="mobile-contact-cta" onClick={closeMobile}>{dict.contact}</Link>
      </div>
    </header>
  );
}

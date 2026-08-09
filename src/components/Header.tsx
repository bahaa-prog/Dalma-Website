"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sitePath } from "@/lib/site-path";
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

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

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

  const active = (paths: string[]) =>
    paths.some((p) => (p === "/" ? pathname === "/" : pathname.startsWith(p)))
      ? { color: "var(--primary)" }
      : undefined;

  const closeMobile = () => setMenuOpen(false);

  return (
    <header id="site-header" className={scrolled ? "scrolled" : undefined}>
      <div className="header-inner">
        <div className="header-logos">
          <Link href="/">
            <img src={sitePath("/img/logo_color.PNG")} alt="شعار مدينة الدلما الإنسانية" className="header-logo" />
          </Link>
          <span className="header-logo-divider"></span>
          <img src={sitePath("/img/HR_logo.jpeg")} alt="شعار وزارة الموارد البشرية والتنمية الاجتماعية" className="header-hr-logo" />
        </div>

        <nav className="desktop-nav">
          <Link href="/" className="nav-link" style={active(["/"])}>الرئيسية</Link>
          <Link href="/#about" className="nav-link">عن المدينة</Link>
          <Link href="/message" className="nav-link" style={active(["/message"])}>الرسالة</Link>
          <Link href="/#programs" className="nav-link">البرامج</Link>
          <Link href="/impact" className="nav-link" style={active(["/impact"])}>أثر المدينة</Link>
          <Link href="/news" className="nav-link" style={active(["/news"])}>الأخبار</Link>
          <Link href="/#contact" className="nav-link">تواصل معنا</Link>

          <div className="dropdown-wrapper" id="eservices-wrapper" ref={servicesRef}>
            <button
              className={`dropdown-btn${servicesOpen ? " open" : ""}`}
              id="eservices-btn"
              onClick={() => setServicesOpen((o) => !o)}
            >
              الخدمات الإلكترونية
              <ChevronDown className="dropdown-chevron icon-15" />
            </button>
            <div id="eservices-panel" className={servicesOpen ? "open" : undefined}>
              <button className="eservice-item disabled">
                <span className="eservice-icon grey"><UserPlus className="icon-16" /></span>
                <span>تسجيل مستفيد جديد</span>
                <span className="soon-badge">قريباً</span>
              </button>
              <button className="eservice-item disabled">
                <span className="eservice-icon grey"><HandHeart className="icon-16" /></span>
                <span>التطوع</span>
                <span className="soon-badge">قريباً</span>
              </button>
              <Link href="/jobs" className="eservice-item can-click">
                <span className="eservice-icon blue"><Briefcase className="icon-16" /></span>
                <span>التوظيف</span>
              </Link>
              <button className="eservice-item disabled">
                <span className="eservice-icon grey"><Accessibility className="icon-16" /></span>
                <span>استشارات إمكانية الوصول</span>
                <span className="soon-badge">قريباً</span>
              </button>
            </div>
          </div>
        </nav>

        <Link href="/#contact" className="contact-cta-btn">
          <Phone className="icon-15" />
          تواصل معنا
        </Link>

        <button
          className="hamburger-btn"
          id="menu-btn"
          aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X className="icon-22" /> : <Menu className="icon-22" />}
        </button>
      </div>

      <div id="mobile-menu" className={menuOpen ? "open" : undefined}>
        <Link href="/" className="mobile-nav-link" onClick={closeMobile}>الرئيسية</Link>
        <Link href="/#about" className="mobile-nav-link" onClick={closeMobile}>عن المدينة</Link>
        <Link href="/message" className="mobile-nav-link" onClick={closeMobile}>الرسالة</Link>
        <Link href="/#programs" className="mobile-nav-link" onClick={closeMobile}>البرامج</Link>
        <Link href="/impact" className="mobile-nav-link" onClick={closeMobile}>أثر المدينة</Link>
        <Link href="/news" className="mobile-nav-link" onClick={closeMobile}>الأخبار</Link>
        <Link href="/#contact" className="mobile-nav-link" onClick={closeMobile}>تواصل معنا</Link>
        <div className="mobile-services-section">
          <p className="mobile-services-label">الخدمات الإلكترونية</p>
          <button className="mobile-svc-btn disabled">
            <UserPlus className="icon-16" style={{ color: "var(--primary)" }} />
            تسجيل مستفيد جديد
            <span style={{ marginRight: "auto", fontSize: "0.625rem", color: "var(--muted-fg)" }}>قريباً</span>
          </button>
          <button className="mobile-svc-btn disabled">
            <HandHeart className="icon-16" style={{ color: "var(--primary)" }} />
            التطوع
            <span style={{ marginRight: "auto", fontSize: "0.625rem", color: "var(--muted-fg)" }}>قريباً</span>
          </button>
          <Link href="/jobs" className="mobile-svc-btn can-click" onClick={closeMobile}>
            <Briefcase className="icon-16" style={{ color: "var(--primary)" }} />
            التوظيف
          </Link>
          <button className="mobile-svc-btn disabled">
            <Accessibility className="icon-16" style={{ color: "var(--primary)" }} />
            استشارات إمكانية الوصول
            <span style={{ marginRight: "auto", fontSize: "0.625rem", color: "var(--muted-fg)" }}>قريباً</span>
          </button>
        </div>
        <Link href="/#contact" className="mobile-contact-cta" onClick={closeMobile}>تواصل معنا</Link>
      </div>
    </header>
  );
}

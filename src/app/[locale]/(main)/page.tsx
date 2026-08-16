import Link from "next/link";
import { preload } from "react-dom";
import {
  Accessibility,
  Activity,
  ArrowLeft,
  BadgeCheck,
  Calendar,
  CheckCircle,
  ChevronDown,
  Dumbbell,
  Globe,
  GraduationCap,
  Hand,
  Handshake,
  HeartHandshake,
  HeartPulse,
  MessageCircle,
  Newspaper,
  Stethoscope,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import ContactSection from "@/components/ContactSection";
import { formatArticleDate, getLatestArticles } from "@/lib/news";
import AboutImpact from "./AboutImpact";
import { defaultLocale } from "@/i18n/config";
import { isLocale, localizePath } from "@/i18n/routing";
import { getDictionary } from "@/i18n/get-dictionary";

const SERVICE_ICONS = [BadgeCheck, Accessibility, Stethoscope, GraduationCap, Users, TrendingUp, Globe, Target];
const PROGRAM_ICONS = [HeartPulse, Stethoscope, Dumbbell, HeartHandshake, Handshake];
const CLINIC_ICONS = [Activity, Hand, MessageCircle];

// Admin-published articles must show up without a rebuild — render per request.
export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);
  const t = dict.home;
  const homeNews = await getLatestArticles(3, locale);

  // Hero image is the page's LCP element; hint the browser before it
  // reaches the <img> tag deep in the DOM.
  preload("/img/dalma_building.webp", { as: "image" });

  return (
    <>
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="hero">
        <div className="hero-bg">
          <img src="/img/dalma_building.webp" alt={t.heroImgAlt} />
          <div className="hero-overlay hero-gradient"></div>
        </div>
        <div className="hero-content">
          <div className="section-inner">
            <div className="hero-grid">
              <div>
                <span className="hero-badge">{t.heroBadge}</span>
                <h1 className="hero-title">
                  <span className="yellow">{t.heroTitle}</span>
                </h1>
                <p className="hero-desc">{t.heroDesc}</p>
                <div className="hero-ctas">
                  <a href="#services" className="btn-hero-primary">
                    {t.ctaServices} <ArrowLeft className="icon-18" />
                  </a>
                  <a href="#about" className="btn-hero-outline">
                    {t.ctaAbout}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll">
          <ChevronDown className="icon-28" />
        </div>
      </section>

      {/* ═══════════════════════ ABOUT ═══════════════════════ */}
      <section id="about">
        <div className="section-inner">
          <div className="about-grid">
            <div className="about-img-wrap">
              <div className="about-img-inner">
                <img src="/img/section_image.webp" alt={t.aboutImgAlt} loading="lazy" />
              </div>
            </div>
            <div>
              <span className="section-label">{t.aboutLabel}</span>
              <h2 className="section-h2 section-title rtl-section-title" style={{ textAlign: "start", marginBottom: "1.5rem" }}>{t.aboutHeading}</h2>
              <p style={{ color: "var(--muted-fg)", lineHeight: 2, fontSize: "1rem", marginBottom: "1.5rem" }}>
                <strong style={{ color: "var(--foreground)" }}>{t.aboutIntroStrong}</strong>{t.aboutIntroRest}
              </p>
              <AboutImpact dict={t.aboutImpact} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SERVICES (GOALS) ═══════════════════════ */}
      <section id="services">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">{t.servicesLabel}</span>
            <h2 className="section-h2 section-title">{t.servicesHeading}</h2>
            <p className="section-desc">{t.servicesDesc}</p>
          </div>
          <div className="services-grid">
            {t.services.map((service, i) => {
              const Icon = SERVICE_ICONS[i];
              const color = i % 2 === 0 ? "#127DB3" : "#588B46";
              return (
                <div className="service-card card-hover" key={service.title}>
                  <div className="service-icon-wrap" style={{ background: `${color}15` }}><Icon className="icon-26" style={{ color }} /></div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-desc">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ STATS ═══════════════════════ */}
      <section id="stats">
        <div className="section-inner">
          <div className="stats-hdr">
            <h2>{t.statsHeading}</h2>
            <p>{t.statsDesc}</p>
          </div>
          <div className="stats-grid">
            {t.stats.map((stat) => (
              <div className="stat-card" key={stat.label}><div className="stat-num">{stat.num}</div><div className="stat-label">{stat.label}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ PROGRAMS ═══════════════════════ */}
      <section id="programs">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">{t.programsLabel}</span>
            <h2 className="section-h2 section-title">{t.programsHeading}</h2>
            <p className="section-desc">{t.programsDesc}</p>
          </div>
          <div className="programs-grid">
            {t.programs.map((program, i) => {
              const Icon = PROGRAM_ICONS[i];
              const color = i % 2 === 0 ? "#127DB3" : "#588B46";
              return (
                <div className="program-card card-hover" key={program.title}>
                  <div className="program-icon-wrap" style={{ background: `${color}15` }}><Icon className="icon-26" style={{ color }} /></div>
                  <div className="program-body">
                    <h3 className="program-title">{program.title}</h3>
                    <ul className="program-list">
                      {program.items.map((item) => (
                        <li key={item}><CheckCircle className="icon-16" /><span>{item}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CLINICS ═══════════════════════ */}
      <section className="clinics-section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">{t.clinicsLabel}</span>
            <h2 className="section-h2 section-title">{t.clinicsHeading}</h2>
          </div>
          <div className="clinics-grid">
            {t.clinics.map((clinic, i) => {
              const Icon = CLINIC_ICONS[i];
              const color = i % 2 === 0 ? "#127DB3" : "#588B46";
              const num = String(i + 1).padStart(2, "0");
              return (
                <div className="clinic-card card-hover" key={clinic.title}>
                  <span className="clinic-num">{locale === "ar" ? num.replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]) : num}</span>
                  <div className="clinic-icon-circle" style={{ background: color }}><Icon className="icon-28" /></div>
                  <h3 className="clinic-title">{clinic.title}</h3>
                  <p className="clinic-desc">{clinic.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ PARTNERS — pending user edit before re-enabling ═══════════════════════
      <section className="partners-section">
        <div className="section-inner">
          <div className="section-header" style={{ marginBottom: "3rem" }}>
            <span className="section-label">نعمل معاً</span>
            <h2 className="section-h2 section-title">شركاؤنا وداعمونا</h2>
          </div>
          <div className="partners-flex">
            <div className="partner-badge">وزارة الموارد البشرية</div>
            <div className="partner-badge">وزارة الصحة</div>
            <div className="partner-badge">هيئة الهلال الأحمر</div>
            <div className="partner-badge">جمعية الأطفال المعوقين</div>
            <div className="partner-badge">الصندوق الخيري</div>
            <div className="partner-badge">جامعة الملك سعود</div>
            <div className="partner-badge">مستشفى الملك فيصل</div>
            <div className="partner-badge">الجمعية الوطنية</div>
          </div>
        </div>
      </section>
      */}

      {/* ═══════════════════════ NEWS ═══════════════════════ */}
      <section id="news">
        <div className="section-inner">
          <div className="news-header">
            <div>
              <span className="section-label">{t.newsLabel}</span>
              <h2 className="section-h2 section-title rtl-section-title" style={{ textAlign: "start" }}>{t.newsHeading}</h2>
            </div>
            <Link href={localizePath(locale, "/news")} className="btn-outline-primary">
              {t.newsAllLink} <ArrowLeft className="icon-16" />
            </Link>
          </div>
          {homeNews.length === 0 ? (
            <div className="news-empty-state">
              <Newspaper className="icon-40" />
              <p>{t.newsEmpty}</p>
            </div>
          ) : (
            <div className="news-grid">
              {homeNews.map((article) => (
                <Link key={article.id} href={localizePath(locale, `/news/${article.slug}`)} className="news-card card-hover">
                  <div className="news-img-wrap">
                    {article.image ? (
                      <img src={article.image} alt={article.title} loading="lazy" />
                    ) : (
                      <div className="news-img-placeholder" />
                    )}
                    <span className="news-cat">{dict.categories[article.cat]}</span>
                  </div>
                  <div className="news-body">
                    <div className="news-date"><Calendar className="icon-13" /> {formatArticleDate(article.publishedAt, locale)}</div>
                    <h3 className="news-title">{article.title}</h3>
                    <p className="news-desc">{article.desc}</p>
                    <span className="news-read-more">{t.newsReadMore} <ArrowLeft className="icon-16" /></span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════ CONTACT ═══════════════════════ */}
      <ContactSection dict={dict.contact} />
    </>
  );
}

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
import { assetPath } from "@/lib/site-paths";
import AboutImpact from "./AboutImpact";

export default async function HomePage() {
  const homeNews = await getLatestArticles(3);

  // Hero image is the page's LCP element; hint the browser before it
  // reaches the <img> tag deep in the DOM.
  preload(assetPath("/img/dalma_building.webp"), { as: "image" });

  return (
    <>
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="hero">
        <div className="hero-bg">
          <img src={assetPath("/img/dalma_building.webp")} alt="مبنى مدينة الدلما الإنسانية" />
          <div className="hero-overlay hero-gradient"></div>
        </div>
        <div className="hero-content">
          <div className="section-inner">
            <div className="hero-grid">
              <div>
                <span className="hero-badge">مدينة الدلما الإنسانية</span>
                <h1 className="hero-title">
                  <span className="yellow">رعاية متكاملة... وتمكين يصنع الأثر</span>
                </h1>
                <p className="hero-desc">مدينة الدلما الإنسانية مشروع إنساني متخصص في رعاية وتأهيل وتمكين الأشخاص ذوي الإعاقة، من خلال منظومة متكاملة من الخدمات العلاجية والتأهيلية والتعليمية، وفق أفضل الممارسات والمعايير المعتمدة، بما يعزز جودة الحياة، والاستقلالية، والاندماج المجتمعي. </p>
                <div className="hero-ctas">
                  <a href="#services" className="btn-hero-primary">
                    اكتشف خدماتنا <ArrowLeft className="icon-18" />
                  </a>
                  <a href="#about" className="btn-hero-outline">
                    تعرف على المدينة
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
                <img src={assetPath("/img/section_image.webp")} alt="فريق مدينة الدلما الإنسانية" loading="lazy" />
              </div>
            </div>
            <div>
              <span className="section-label">من نحن</span>
              <h2 className="section-h2 section-title rtl-section-title" style={{ textAlign: "right", marginBottom: "1.5rem" }}>مدينة الدلما الإنسانية</h2>
              <p style={{ color: "var(--muted-fg)", lineHeight: 2, fontSize: "1rem", marginBottom: "1.5rem" }}>
                <strong style={{ color: "var(--foreground)" }}>مدينة الدلما الإنسانية</strong> مدينة متخصصة تهدف إلى توفير منظومة متكاملة من خدمات الرعاية والعلاج والتأهيل والتعليم والتمكين، في بيئة إنسانية آمنة وشاملة، تُسهم في تنمية قدرات الأشخاص ذوي الإعاقة، وتعزيز استقلاليتهم، وتمكينهم من المشاركة الفاعلة في المجتمع.
              </p>
              <AboutImpact />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SERVICES (GOALS) ═══════════════════════ */}
      <section id="services">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">توجهاتنا الاستراتيجية</span>
            <h2 className="section-h2 section-title">أهداف مدينة الدلما</h2>
            <p className="section-desc">تهدف مدينة الدلما الإنسانية إلى تمكين الأشخاص ذوي الإعاقة عبر تقديم رعاية شاملة ومتخصصة تسهم في تحسين جودة حياتهم وتعزيز اندماجهم في المجتمع</p>
          </div>
          <div className="services-grid">
            <div className="service-card card-hover">
              <div className="service-icon-wrap" style={{ background: "#127DB315" }}><BadgeCheck className="icon-26" style={{ color: "#127DB3" }} /></div>
              <h3 className="service-title">أفضل الممارسات والمعايير</h3>
              <p className="service-desc">تقديم خدمات متخصصة وفق أفضل الممارسات والمعايير.</p>
            </div>
            <div className="service-card card-hover">
              <div className="service-icon-wrap" style={{ background: "#588B4615" }}><Accessibility className="icon-26" style={{ color: "#588B46" }} /></div>
              <h3 className="service-title">التمكين والاستقلالية</h3>
              <p className="service-desc">تمكين الأشخاص ذوي الإعاقة وتعزيز استقلاليتهم.</p>
            </div>
            <div className="service-card card-hover">
              <div className="service-icon-wrap" style={{ background: "#127DB315" }}><Stethoscope className="icon-26" style={{ color: "#127DB3" }} /></div>
              <h3 className="service-title">برامج متخصصة</h3>
              <p className="service-desc">توفير برامج متخصصة لذوي اضطراب طيف التوحد، والشلل الدماغي، والإعاقات المتعددة.</p>
            </div>
            <div className="service-card card-hover">
              <div className="service-icon-wrap" style={{ background: "#588B4615" }}><GraduationCap className="icon-26" style={{ color: "#588B46" }} /></div>
              <h3 className="service-title">تنمية القدرات</h3>
              <p className="service-desc">تنمية القدرات التعليمية والمهنية والحياتية للمستفيدين.</p>
            </div>
            <div className="service-card card-hover">
              <div className="service-icon-wrap" style={{ background: "#127DB315" }}><Users className="icon-26" style={{ color: "#127DB3" }} /></div>
              <h3 className="service-title">دعم الأسر</h3>
              <p className="service-desc">دعم الأسر وتمكينها كشريك رئيس في رحلة التأهيل.</p>
            </div>
            <div className="service-card card-hover">
              <div className="service-icon-wrap" style={{ background: "#588B4615" }}><TrendingUp className="icon-26" style={{ color: "#588B46" }} /></div>
              <h3 className="service-title">المشاركة المجتمعية</h3>
              <p className="service-desc">تعزيز المشاركة المجتمعية ورفع جودة الحياة.</p>
            </div>
            <div className="service-card card-hover">
              <div className="service-icon-wrap" style={{ background: "#127DB315" }}><Globe className="icon-26" style={{ color: "#127DB3" }} /></div>
              <h3 className="service-title">شراكات استراتيجية</h3>
              <p className="service-desc">بناء شراكات استراتيجية تحقق استدامة الخدمات.</p>
            </div>
            <div className="service-card card-hover">
              <div className="service-icon-wrap" style={{ background: "#588B4615" }}><Target className="icon-26" style={{ color: "#588B46" }} /></div>
              <h3 className="service-title">مجتمع شامل</h3>
              <p className="service-desc">الإسهام في بناء مجتمع أكثر شمولًا وتمكينًا.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ STATS ═══════════════════════ */}
      <section id="stats">
        <div className="section-inner">
          <div className="stats-hdr">
            <h2>المدينة بالأرقام</h2>
            <p>أرقام تعكس التزامنا بخدمة مجتمعنا وأثرنا في حياة آلاف المستفيدين</p>
          </div>
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-num">١٧٥ مليون ريال</div><div className="stat-label">قيمة المشروع</div></div>
            <div className="stat-card"><div className="stat-num">٧٠٠</div><div className="stat-label">الطاقة الاستيعابية (مستفيد)</div></div>
            <div className="stat-card"><div className="stat-num">٧٥</div><div className="stat-label">وظيفة مباشرة</div></div>
            <div className="stat-card"><div className="stat-num">١٤+</div><div className="stat-label">خدمة متخصصة</div></div>
            <div className="stat-card"><div className="stat-num">٢٤/٧</div><div className="stat-label">خدمات طبية وتمريضية</div></div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ PROGRAMS ═══════════════════════ */}
      <section id="programs">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">ما يميزنا</span>
            <h2 className="section-h2 section-title">منظومة خدماتنا</h2>
            <p className="section-desc">مبادرات وبرامج مبتكرة تجمع بين أحدث الأساليب العلمية والرعاية الإنسانية الصادقة لتحقيق أفضل النتائج.</p>
          </div>
          <div className="programs-grid">
            <div className="program-card card-hover">
              <div className="program-icon-wrap" style={{ background: "#127DB315" }}><HeartPulse className="icon-26" style={{ color: "#127DB3" }} /></div>
              <div className="program-body">
                <h3 className="program-title">الرعاية اليومية</h3>
                <ul className="program-list">
                  <li><CheckCircle className="icon-16" /><span>تنمية مهارات العناية الشخصية.</span></li>
                  <li><CheckCircle className="icon-16" /><span>خدمات الإيواء.</span></li>
                  <li><CheckCircle className="icon-16" /><span>الخدمات الطبية والتمريضية على مدار الساعة.</span></li>
                  <li><CheckCircle className="icon-16" /><span>التغذية العلاجية.</span></li>
                </ul>
              </div>
            </div>
            <div className="program-card card-hover">
              <div className="program-icon-wrap" style={{ background: "#588B4615" }}><Stethoscope className="icon-26" style={{ color: "#588B46" }} /></div>
              <div className="program-body">
                <h3 className="program-title">الخدمات العلاجية</h3>
                <ul className="program-list">
                  <li><CheckCircle className="icon-16" /><span>العلاج الطبيعي.</span></li>
                  <li><CheckCircle className="icon-16" /><span>العلاج الوظيفي.</span></li>
                  <li><CheckCircle className="icon-16" /><span>علاج النطق والتخاطب.</span></li>
                  <li><CheckCircle className="icon-16" /><span>العلاج المائي.</span></li>
                </ul>
              </div>
            </div>
            <div className="program-card card-hover">
              <div className="program-icon-wrap" style={{ background: "#127DB315" }}><Dumbbell className="icon-26" style={{ color: "#127DB3" }} /></div>
              <div className="program-body">
                <h3 className="program-title">البرامج التأهيلية</h3>
                <ul className="program-list">
                  <li><CheckCircle className="icon-16" /><span>التأهيل الشامل.</span></li>
                  <li><CheckCircle className="icon-16" /><span>تعديل السلوك.</span></li>
                  <li><CheckCircle className="icon-16" /><span>التدريب على المهارات اليومية.</span></li>
                  <li><CheckCircle className="icon-16" /><span>التدريب على المهارات المهنية.</span></li>
                  <li><CheckCircle className="icon-16" /><span>التمكين المهني والتوظيف.</span></li>
                </ul>
              </div>
            </div>
            <div className="program-card card-hover">
              <div className="program-icon-wrap" style={{ background: "#588B4615" }}><HeartHandshake className="icon-26" style={{ color: "#588B46" }} /></div>
              <div className="program-body">
                <h3 className="program-title">الأسرة والمجتمع</h3>
                <ul className="program-list">
                  <li><CheckCircle className="icon-16" /><span>الدعم النفسي والاجتماعي.</span></li>
                  <li><CheckCircle className="icon-16" /><span>الإرشاد الأسري.</span></li>
                  <li><CheckCircle className="icon-16" /><span>برامج الدمج المجتمعي.</span></li>
                  <li><CheckCircle className="icon-16" /><span>البرامج الترفيهية.</span></li>
                </ul>
              </div>
            </div>
            <div className="program-card card-hover">
              <div className="program-icon-wrap" style={{ background: "#127DB315" }}><Handshake className="icon-26" style={{ color: "#127DB3" }} /></div>
              <div className="program-body">
                <h3 className="program-title">التطوير والشراكات</h3>
                <ul className="program-list">
                  <li><CheckCircle className="icon-16" /><span>برامج التدريب والتطوير.</span></li>
                  <li><CheckCircle className="icon-16" /><span>الشراكات المجتمعية.</span></li>
                  <li><CheckCircle className="icon-16" /><span>تطوير المرافق والخدمات.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CLINICS ═══════════════════════ */}
      <section className="clinics-section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">عياداتنا</span>
            <h2 className="section-h2 section-title">العيادات والخدمات التخصصية</h2>
          </div>
          <div className="clinics-grid">
            <div className="clinic-card card-hover">
              <span className="clinic-num">٠١</span>
              <div className="clinic-icon-circle" style={{ background: "#127DB3" }}><Activity className="icon-28" /></div>
              <h3 className="clinic-title">العلاج الطبيعي</h3>
              <p className="clinic-desc">يهدف إلى تحسين القدرات الحركية والوظيفية، واستعادة الاستقلالية، والحد من المشكلات الجسدية، من خلال خطط علاجية فردية تعتمد على أحدث الأساليب العلاجية.</p>
            </div>
            <div className="clinic-card card-hover">
              <span className="clinic-num">٠٢</span>
              <div className="clinic-icon-circle" style={{ background: "#588B46" }}><Hand className="icon-28" /></div>
              <h3 className="clinic-title">العلاج الوظيفي</h3>
              <p className="clinic-desc">يساعد المستفيدين على تنمية المهارات اللازمة لممارسة أنشطة الحياة اليومية باستقلالية، بما يعزز الاعتماد على الذات وجودة الحياة.</p>
            </div>
            <div className="clinic-card card-hover">
              <span className="clinic-num">٠٣</span>
              <div className="clinic-icon-circle" style={{ background: "#127DB3" }}><MessageCircle className="icon-28" /></div>
              <h3 className="clinic-title">علاج النطق والتخاطب</h3>
              <p className="clinic-desc">يقدم خدمات تقييم وتشخيص وعلاج اضطرابات النطق واللغة والتواصل، إضافة إلى توفير وسائل التواصل البديلة للحالات التي تحتاج إليها.</p>
            </div>
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
              <span className="section-label">ابقَ على اطلاع</span>
              <h2 className="section-h2 section-title rtl-section-title" style={{ textAlign: "right" }}>آخر الأخبار والفعاليات</h2>
            </div>
            <Link href="/news" className="btn-outline-primary">
              جميع الأخبار <ArrowLeft className="icon-16" />
            </Link>
          </div>
          {homeNews.length === 0 ? (
            <div className="news-empty-state">
              <Newspaper className="icon-40" />
              <p>لا توجد أخبار منشورة حالياً — تابعونا قريباً.</p>
            </div>
          ) : (
            <div className="news-grid">
              {homeNews.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`} className="news-card card-hover">
                  <div className="news-img-wrap">
                    {article.image ? (
                      <img src={article.image} alt={article.title} loading="lazy" />
                    ) : (
                      <div className="news-img-placeholder" />
                    )}
                    <span className="news-cat">{article.cat}</span>
                  </div>
                  <div className="news-body">
                    <div className="news-date"><Calendar className="icon-13" /> {formatArticleDate(article.publishedAt)}</div>
                    <h3 className="news-title">{article.title}</h3>
                    <p className="news-desc">{article.desc}</p>
                    <span className="news-read-more">اقرأ المزيد <ArrowLeft className="icon-16" /></span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════ CONTACT ═══════════════════════ */}
      <ContactSection />
    </>
  );
}

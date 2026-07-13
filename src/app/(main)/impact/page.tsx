import type { Metadata } from "next";
import { Check, HeartHandshake, Sparkles, TrendingUp } from "lucide-react";
import "./impact.css";

export const metadata: Metadata = {
  title: "أثر المدينة — مدينة الدلما الإنسانية",
};

export default function ImpactPage() {
  return (
    <>
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="impact-hero">
        <div className="impact-hero-inner">
          <div className="impact-hero-badge">
            <Sparkles className="icon-15" />
            نصنع فرقاً حقيقياً
          </div>
          <h1>أثر المدينة</h1>
          <p>التزام يتجاوز الرعاية إلى صناعة أثر ملموس في حياة الأفراد والأسر والمجتمع بأكمله.</p>
          <div className="impact-hero-divider"></div>
        </div>
      </section>

      {/* ═══════════════════════ IMPACT CONTENT ═══════════════════════ */}
      <section className="impact-page-section">
        <div className="section-inner">
          <div className="impact-grid">

            <div className="impact-panel impact-social">
              <div className="impact-icon"><HeartHandshake className="icon-32" /></div>
              <h3 className="impact-title">الأثر الاجتماعي</h3>
              <ul className="impact-list">
                <li><Check className="icon-13" /><span>توفير بيئة إنسانية شاملة وداعمة.</span></li>
                <li><Check className="icon-13" /><span>تعزيز فرص التعليم والتأهيل والتمكين.</span></li>
                <li><Check className="icon-13" /><span>دعم الأسر وتخفيف الأعباء.</span></li>
                <li><Check className="icon-13" /><span>رفع مستوى الوعي المجتمعي.</span></li>
                <li><Check className="icon-13" /><span>تعزيز الاندماج والمشاركة المجتمعية.</span></li>
              </ul>
            </div>

            <div className="impact-panel impact-economic">
              <div className="impact-icon"><TrendingUp className="icon-32" /></div>
              <h3 className="impact-title">الأثر الاقتصادي</h3>
              <ul className="impact-list">
                <li><Check className="icon-13" /><span>توفير فرص عمل مباشرة وغير مباشرة.</span></li>
                <li><Check className="icon-13" /><span>دعم استدامة الخدمات الإنسانية.</span></li>
                <li><Check className="icon-13" /><span>تعزيز الشراكات التنموية.</span></li>
                <li><Check className="icon-13" /><span>الإسهام في التنمية الاقتصادية والاجتماعية.</span></li>
              </ul>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

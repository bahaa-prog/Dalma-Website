"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export default function AboutImpact() {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className={`about-more${expanded ? " expanded" : ""}`}>
        <div className="about-more-inner">
          <h4 className="about-more-heading">الأثر الاجتماعي</h4>
          <ul className="about-more-list">
            <li><Check className="icon-16" /><span>توفير بيئة إنسانية شاملة وداعمة.</span></li>
            <li><Check className="icon-16" /><span>تعزيز فرص التعليم والتأهيل والتمكين.</span></li>
            <li><Check className="icon-16" /><span>دعم الأسر وتخفيف الأعباء.</span></li>
            <li><Check className="icon-16" /><span>رفع مستوى الوعي المجتمعي.</span></li>
            <li><Check className="icon-16" /><span>تعزيز الاندماج والمشاركة المجتمعية.</span></li>
          </ul>

          <h4 className="about-more-heading">الأثر الاقتصادي</h4>
          <ul className="about-more-list">
            <li><Check className="icon-16" /><span>توفير فرص عمل مباشرة وغير مباشرة.</span></li>
            <li><Check className="icon-16" /><span>دعم استدامة الخدمات الإنسانية.</span></li>
            <li><Check className="icon-16" /><span>تعزيز الشراكات التنموية.</span></li>
            <li><Check className="icon-16" /><span>الإسهام في التنمية الاقتصادية والاجتماعية.</span></li>
          </ul>
        </div>
      </div>

      <button
        type="button"
        className={`about-read-more${expanded ? " open" : ""}`}
        onClick={() => setExpanded((e) => !e)}
      >
        <span>{expanded ? "عرض أقل" : "اقرأ المزيد"}</span>
        <ChevronDown className="icon-15" />
      </button>
    </>
  );
}

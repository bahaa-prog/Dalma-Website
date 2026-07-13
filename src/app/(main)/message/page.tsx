"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, CheckCircle2, Eye } from "lucide-react";
import "./message.css";

export default function MessagePage() {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [showReadMore, setShowReadMore] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = bodyRef.current;
    if (el && el.scrollHeight > el.clientHeight + 4) {
      setShowReadMore(true);
    }
  }, []);

  return (
    <>
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="msg-hero">
        <div className="msg-hero-inner">
          <div className="msg-hero-badge">
            <CheckCircle2 size={13} strokeWidth={2.5} />
            قيادة المدينة
          </div>
          <h1>كلمة رئيس مجلس الإدارة</h1>
          <p>رؤيتنا ورسالتنا بكلمات القيادة — التزام راسخ بخدمة الأشخاص ذوي الإعاقة وتمكينهم في مجتمع يؤمن بقدراتهم.</p>
          <div className="msg-hero-divider"></div>
        </div>
      </section>

      {/* ═══════════════════════ CONTENT ═══════════════════════ */}
      <section className="msg-section">
        <div className="msg-container">

          {/* Chairman card with gradient border */}
          <div className="chairman-border">
            <div className="chairman-card">

              {/* Text column (right in RTL — column 1) */}
              <div className="chairman-text-col">
                <span className="msg-quote-icon">&quot;</span>
                <h2 className="msg-col-heading">كلمة رئيس مجلس إدارة<br />مدينة الدلما الإنسانية</h2>

                <div className={`msg-text-body${expanded ? " expanded" : ""}`} ref={bodyRef}>
                  <p>انطلقت مدينة الدلما الإنسانية من إيمانٍ راسخ بأن الإنسان هو محور التنمية وأساسها، وأن تمكين الأشخاص ذوي الإعاقة وتوفير بيئة داعمة لهم ولأسرهم يمثل مسؤولية وطنية وإنسانية مشتركة.</p>
                  <p>ولدت فكرة هذا المشروع من احتياجاتٍ واقعية لمسناها عن قرب، ومن حلمٍ آمنت به والدتي الدلما -رحمها الله-، التي حملت في قلبها رسالةً إنسانية تقوم على العطاء والرحمة والإيمان بحق كل إنسان في الحياة الكريمة. فجاءت المدينة تحمل اسمها وفاءً لذكراها، وتجسيدًا لقيمٍ غرستها، ورسالةٍ نطمح أن يمتد أثرها إلى الأجيال القادمة.</p>
                  <p>جاءت فكرة المدينة استجابةً لتلك الاحتياجات، ورغبةً في بناء منظومة متكاملة تجمع بين الرعاية والتأهيل والتعليم والتدريب والخدمات المساندة، بما يسهم في تعزيز الاستقلالية والاندماج المجتمعي وتحسين جودة الحياة للمستفيدين.</p>
                  <p>وتنسجم أهداف مدينة الدلما الإنسانية مع مستهدفات رؤية السعودية 2030 التي تضع جودة الحياة وتمكين جميع فئات المجتمع في مقدمة أولوياتها، من خلال تعزيز المشاركة المجتمعية، وتطوير الخدمات التأهيلية والتنموية، وتهيئة الفرص التي تمكّن الأشخاص ذوي الإعاقة من الإسهام في مسيرة التنمية الوطنية.</p>
                  <p>كما نؤمن بأن هذا المشروع لا يقتصر أثره على الجوانب الإنسانية فحسب، بل يمتد ليكون رافدًا للتنمية الاقتصادية والاجتماعية، من خلال الإسهام في خلق فرصٍ وظيفية، وتحفيز الفرص الاستثمارية، وبناء شراكات نوعية تعزز استدامة المشروع وتدعم التنمية في المنطقة والمملكة.</p>
                  <p>ونسعى في مدينة الدلما الإنسانية إلى تقديم نموذج رائد في العمل الإنساني والتنموي، يقوم على قيم الكرامة والتمكين والشمولية، ويتيح لكل فرد فرصة عادلة لاكتشاف قدراته وتنمية إمكاناته والمشاركة الفاعلة في المجتمع.</p>
                  <p>كما نؤمن بأن تحقيق هذه الرسالة يتطلب شراكات فاعلة مع الجهات الحكومية والخاصة وغير الربحية، إلى جانب دعم أفراد المجتمع، لبناء بيئة أكثر احتواءً واستدامةً للأجيال القادمة.</p>
                  <p>إن طموحنا يتجاوز تقديم الخدمات إلى صناعة أثرٍ مستدام ينعكس على حياة المستفيدين وأسرهم، ويسهم في بناء مجتمع أكثر وعيًا ورحمةً وتكافلًا، ويعزز مكانة المملكة كنموذج عالمي في العناية بالإنسان وتمكينه.</p>
                  <p>نسأل الله أن يبارك هذا المشروع، وأن يجعله منارةً للعطاء والتنمية الإنسانية، وأن يحقق أهدافه في خدمة الوطن وأبنائه.</p>
                </div>
                {showReadMore && (
                  <button
                    className={`msg-read-more${expanded ? " open" : ""}`}
                    style={{ display: "flex" }}
                    type="button"
                    onClick={() => setExpanded((e) => !e)}
                  >
                    <span>{expanded ? "عرض أقل" : "اقرأ المزيد"}</span>
                    <ChevronDown className="icon-15" />
                  </button>
                )}

                <div className="chairman-nameplate">
                  <img src="/img/logo_color.PNG" alt="شعار مدينة الدلما" className="chairman-avatar-logo" />
                  <div>
                    <p className="chairman-name"> الباذل : شافي فاحس الزوين الصقري</p>
                    <p className="chairman-title">رئيس مجلس الإدارة — مدينة الدلما الإنسانية</p>
                  </div>
                </div>
              </div>

              {/* Image column (left in RTL — column 2) */}
              <div className="chairman-img-col">
                <img src="/img/chairman_image.jpeg" alt="رئيس مجلس إدارة مدينة الدلما الإنسانية" />
              </div>

            </div>
          </div>

          {/* Vision & Mission */}
          <div className="vm-grid">

            <div className="vm-card vm-card-vision">
              <div className="vm-card-icon">
                <Eye size={22} />
              </div>
              <h3>رؤيتنا</h3>
              <p className="vm-card-body">أن تكون مدينة الدلما الإنسانية نموذجًا رائدًا في تقديم الخدمات الإنسانية المتكاملة، وتمكين الأشخاص ذوي الإعاقة، وتعزيز اندماجهم المجتمعي.</p>
            </div>

            <div className="vm-card vm-card-mission">
              <div className="vm-card-icon">
                <CheckCircle2 size={22} />
              </div>
              <h3>رسالتنا</h3>
              <p className="vm-card-body">تقديم خدمات نوعية وشاملة في مجالات الرعاية، والعلاج، والتأهيل، والتعليم، والتدريب، بما يدعم الاستقلالية والتمكين، ويرتقي بجودة الحياة للمستفيدين وأسرهم.</p>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}

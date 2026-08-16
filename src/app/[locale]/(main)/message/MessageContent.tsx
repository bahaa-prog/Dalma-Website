"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, CheckCircle2, Eye } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries/ar";
import { assetPath } from "@/lib/site-paths";
import "./message.css";

export default function MessageContent({ dict }: { dict: Dictionary["message"] }) {
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
            {dict.heroBadge}
          </div>
          <h1>{dict.heroHeading}</h1>
          <p>{dict.heroDesc}</p>
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
                <h2 className="msg-col-heading">{dict.columnHeadingLine1}<br />{dict.columnHeadingLine2}</h2>

                <div className={`msg-text-body${expanded ? " expanded" : ""}`} ref={bodyRef}>
                  {dict.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                {showReadMore && (
                  <button
                    className={`msg-read-more${expanded ? " open" : ""}`}
                    style={{ display: "flex" }}
                    type="button"
                    onClick={() => setExpanded((e) => !e)}
                  >
                    <span>{expanded ? dict.showLess : dict.readMore}</span>
                    <ChevronDown className="icon-15" />
                  </button>
                )}

                <div className="chairman-nameplate">
                  <img src={assetPath("/img/logo_color.PNG")} alt={dict.logoAlt} className="chairman-avatar-logo" />
                  <div>
                    <p className="chairman-name">{dict.chairmanName}</p>
                    <p className="chairman-title">{dict.chairmanTitle}</p>
                  </div>
                </div>
              </div>

              {/* Image column (left in RTL — column 2) */}
              <div className="chairman-img-col">
                <img src={assetPath("/img/chairman_image.jpeg")} alt={dict.chairmanImgAlt} />
              </div>

            </div>
          </div>

          {/* Vision & Mission */}
          <div className="vm-grid">

            <div className="vm-card vm-card-vision">
              <div className="vm-card-icon">
                <Eye size={22} />
              </div>
              <h3>{dict.visionHeading}</h3>
              <p className="vm-card-body">{dict.visionBody}</p>
            </div>

            <div className="vm-card vm-card-mission">
              <div className="vm-card-icon">
                <CheckCircle2 size={22} />
              </div>
              <h3>{dict.missionHeading}</h3>
              <p className="vm-card-body">{dict.missionBody}</p>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}

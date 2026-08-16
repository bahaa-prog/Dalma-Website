"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries/ar";

export default function AboutImpact({ dict }: { dict: Dictionary["home"]["aboutImpact"] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className={`about-more${expanded ? " expanded" : ""}`}>
        <div className="about-more-inner">
          <h4 className="about-more-heading">{dict.socialHeading}</h4>
          <ul className="about-more-list">
            {dict.socialItems.map((item) => (
              <li key={item}><Check className="icon-16" /><span>{item}</span></li>
            ))}
          </ul>

          <h4 className="about-more-heading">{dict.economicHeading}</h4>
          <ul className="about-more-list">
            {dict.economicItems.map((item) => (
              <li key={item}><Check className="icon-16" /><span>{item}</span></li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        className={`about-read-more${expanded ? " open" : ""}`}
        onClick={() => setExpanded((e) => !e)}
      >
        <span>{expanded ? dict.showLess : dict.readMore}</span>
        <ChevronDown className="icon-15" />
      </button>
    </>
  );
}

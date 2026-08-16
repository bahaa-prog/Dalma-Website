"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle,
  FileText,
  MapPin,
  Upload,
  Users,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/routing";
import type { Dictionary } from "@/i18n/dictionaries/ar";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function JobsForm({
  locale,
  common,
  dict,
}: {
  locale: Locale;
  common: Dictionary["common"];
  dict: Dictionary["jobs"];
}) {
  const homeHref = localizePath(locale, "/");
  const BackIcon = locale === "ar" ? ArrowRight : ArrowLeft;
  const [cvName, setCvName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { sections: s, fields: f, experience: exp } = dict;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ═══════════════════════ HEADER ═══════════════════════ */}
      <header className="jobs-header">
        <div className="jobs-header-inner">
          <img src="/img/logo_color.PNG" alt={common.logoAlt} className="jobs-logo" />
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <LanguageSwitcher
              locale={locale}
              otherLanguageName={common.otherLanguageName}
              label={common.languageSwitcherLabel}
            />
            <Link href={homeHref} className="btn-back">
              <BackIcon className="icon-16" />
              {dict.backToHome}
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <div className="jobs-hero">
        <div className="jobs-hero-icon">
          <Briefcase className="icon-26" />
        </div>
        <h1 className="jobs-hero-title">{dict.heroTitle}</h1>
        <p className="jobs-hero-desc">{dict.heroDesc}</p>
      </div>

      {/* ═══════════════════════ SUCCESS SCREEN ═══════════════════════ */}
      <div id="success-screen" className={submitted ? "visible" : undefined}>
        <div className="success-inner">
          <div className="success-icon-wrap">
            <CheckCircle className="icon-48" style={{ color: "var(--secondary)" }} />
          </div>
          <h2 className="success-title">{dict.successTitle}</h2>
          <p className="success-desc">{dict.successDesc}</p>
          <Link href={homeHref} className="btn-back-home">{dict.backToHomeFromSuccess}</Link>
        </div>
      </div>

      {/* ═══════════════════════ FORM ═══════════════════════ */}
      <div className="jobs-form-wrap" id="jobs-form-wrap" style={submitted ? { display: "none" } : undefined}>
        <form id="jobs-form" onSubmit={onSubmit}>

          {/* ── Applicant info ── */}
          <div className="form-section">
            <div className="form-section-hdr">
              <span className="form-section-icon blue"><Users className="icon-16" /></span>
              <h2 className="form-section-title">{s.applicant}</h2>
            </div>
            <div className="form-section-body">
              <div className="jfg3">
                <div>
                  <label className="j-label">{f.firstName}</label>
                  <input type="text" required placeholder={f.firstNamePh} className="j-input" />
                </div>
                <div>
                  <label className="j-label">{f.fatherName}</label>
                  <input type="text" required placeholder={f.fatherNamePh} className="j-input" />
                </div>
                <div>
                  <label className="j-label">{f.lastName}</label>
                  <input type="text" required placeholder={f.lastNamePh} className="j-input" />
                </div>
                <div>
                  <label className="j-label">{f.gender}</label>
                  <select required className="j-input" defaultValue="">
                    <option value="">{f.choose}</option>
                    <option>{f.male}</option>
                    <option>{f.female}</option>
                  </select>
                </div>
                <div>
                  <label className="j-label">{f.email}</label>
                  <input type="email" required placeholder={f.emailPh} className="j-input" />
                </div>
                <div>
                  <label className="j-label">{f.dob}</label>
                  <input type="date" required className="j-input" />
                </div>
                <div>
                  <label className="j-label">{f.nationality}</label>
                  <input type="text" required placeholder={f.nationalityPh} className="j-input" />
                </div>
                <div>
                  <label className="j-label">{f.phone}</label>
                  <div className="phone-wrap">
                    <span className="phone-prefix">+966</span>
                    <input type="tel" required placeholder={f.phonePh} className="j-input" />
                  </div>
                </div>
                <div>
                  <label className="j-label">{f.maritalStatus}</label>
                  <select required className="j-input" defaultValue="">
                    <option value="">{f.choose}</option>
                    <option>{f.single}</option>
                    <option>{f.married}</option>
                    <option>{f.divorced}</option>
                    <option>{f.widowed}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ── Address ── */}
          <div className="form-section">
            <div className="form-section-hdr">
              <span className="form-section-icon green"><MapPin className="icon-16" /></span>
              <h2 className="form-section-title">{s.address}</h2>
            </div>
            <div className="form-section-body">
              <div className="jfg2">
                <div>
                  <label className="j-label">{f.detailedAddress}</label>
                  <input type="text" placeholder={f.detailedAddressPh} className="j-input" />
                </div>
                <div>
                  <label className="j-label">{f.city}</label>
                  <input type="text" placeholder={f.cityPh} className="j-input" />
                </div>
                <div>
                  <label className="j-label">{f.region}</label>
                  <input type="text" required placeholder={f.regionPh} className="j-input" />
                </div>
                <div>
                  <label className="j-label">{f.postalCode}</label>
                  <input type="text" required placeholder={f.postalCodePh} className="j-input" />
                </div>
              </div>
            </div>
          </div>

          {/* ── Education ── */}
          <div className="form-section">
            <div className="form-section-hdr">
              <span className="form-section-icon blue"><BookOpen className="icon-16" /></span>
              <h2 className="form-section-title">{s.education}</h2>
            </div>
            <div className="form-section-body">
              <div className="jfg2">
                <div>
                  <label className="j-label">{f.degree}</label>
                  <select required className="j-input" defaultValue="">
                    <option value="">{f.choose}</option>
                    <option>{f.highSchool}</option>
                    <option>{f.diploma}</option>
                    <option>{f.bachelor}</option>
                    <option>{f.master}</option>
                    <option>{f.phd}</option>
                  </select>
                </div>
                <div>
                  <label className="j-label">{f.major}</label>
                  <input type="text" placeholder={f.majorPh} className="j-input" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label className="j-label">{f.university}</label>
                  <input type="text" placeholder={f.universityPh} className="j-input" />
                </div>
                <div>
                  <label className="j-label">{f.jobCategory}</label>
                  <select required className="j-input" defaultValue="">
                    <option value="">{f.choose}</option>
                    <option>{f.catMedical}</option>
                    <option>{f.catEducational}</option>
                    <option>{f.catAdmin}</option>
                    <option>{f.catSocial}</option>
                    <option>{f.catSupport}</option>
                  </select>
                </div>
                <div>
                  <label className="j-label">{f.subSpecialty}</label>
                  <select className="j-input" defaultValue="">
                    <option value="">{f.choose}</option>
                    <option>{f.subPhysio}</option>
                    <option>{f.subOccupational}</option>
                    <option>{f.subSpeech}</option>
                    <option>{f.subNursing}</option>
                    <option>{f.subSpecialEd}</option>
                    <option>{f.subHR}</option>
                    <option>{f.subIT}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ── Experience ── */}
          <div className="form-section">
            <div className="form-section-hdr">
              <span className="form-section-icon green"><Briefcase className="icon-16" /></span>
              <h2 className="form-section-title">{s.experience}</h2>
            </div>
            <div className="form-section-body">

              <div className="exp-label">
                <span className="exp-num">1</span>
                {exp.label1}
                <span className="req-tag">{exp.requiredTag}</span>
              </div>
              <div className="jfg3">
                <div>
                  <label className="j-label">{f.orgNameRequired}</label>
                  <input type="text" required placeholder={f.orgNamePh} className="j-input" />
                </div>
                <div>
                  <label className="j-label">{f.jobTitleRequired}</label>
                  <input type="text" required placeholder={f.jobTitlePh} className="j-input" />
                </div>
                <div>
                  <label className="j-label">{f.durationRequired}</label>
                  <input type="text" required placeholder={f.durationPh} className="j-input" />
                </div>
              </div>
              <hr className="exp-divider" />

              <div className="exp-label" style={{ marginTop: "1.5rem" }}>
                <span className="exp-num">2</span>
                {exp.label2}
              </div>
              <div className="jfg3">
                <div>
                  <label className="j-label">{f.orgName}</label>
                  <input type="text" placeholder={f.orgNamePh} className="j-input" />
                </div>
                <div>
                  <label className="j-label">{f.jobTitle}</label>
                  <input type="text" placeholder={f.jobTitlePh} className="j-input" />
                </div>
                <div>
                  <label className="j-label">{f.duration}</label>
                  <input type="text" placeholder={f.durationPh} className="j-input" />
                </div>
              </div>
              <hr className="exp-divider" />

              <div className="exp-label" style={{ marginTop: "1.5rem" }}>
                <span className="exp-num">3</span>
                {exp.label3}
              </div>
              <div className="jfg3">
                <div>
                  <label className="j-label">{f.orgName}</label>
                  <input type="text" placeholder={f.orgNamePh} className="j-input" />
                </div>
                <div>
                  <label className="j-label">{f.jobTitle}</label>
                  <input type="text" placeholder={f.jobTitlePh} className="j-input" />
                </div>
                <div>
                  <label className="j-label">{f.duration}</label>
                  <input type="text" placeholder={f.durationPh} className="j-input" />
                </div>
              </div>

            </div>
          </div>

          {/* ── Training courses ── */}
          <div className="form-section">
            <div className="form-section-hdr">
              <span className="form-section-icon blue"><Award className="icon-16" /></span>
              <h2 className="form-section-title">{s.courses}</h2>
            </div>
            <div className="form-section-body">
              <div className="jfg3">
                <div>
                  <label className="j-label">{f.course1}</label>
                  <input type="text" placeholder={f.coursePh} className="j-input" />
                </div>
                <div>
                  <label className="j-label">{f.course2}</label>
                  <input type="text" placeholder={f.coursePh} className="j-input" />
                </div>
                <div>
                  <label className="j-label">{f.course3}</label>
                  <input type="text" placeholder={f.coursePh} className="j-input" />
                </div>
              </div>
            </div>
          </div>

          {/* ── CV ── */}
          <div className="form-section">
            <div className="form-section-hdr">
              <span className="form-section-icon green"><FileText className="icon-16" /></span>
              <h2 className="form-section-title">{s.cv}</h2>
            </div>
            <div className="form-section-body">
              <label className="j-label">{f.uploadCv}</label>
              <label className="cv-label" id="cv-label">
                <input
                  type="file"
                  id="cv-input"
                  accept=".pdf,.doc,.docx"
                  required
                  style={{ display: "none" }}
                  onChange={(e) => setCvName(e.target.files?.[0]?.name ?? null)}
                />
                <Upload className="icon-28 cv-icon" />
                <span className="cv-text" id="cv-text">{cvName ?? f.clickToUpload}</span>
                <span className="cv-subtext" id="cv-subtext">{cvName ? f.clickToChange : f.acceptedFormats}</span>
              </label>
            </div>
          </div>

          {/* ── Buttons ── */}
          <div className="jobs-btns">
            <button type="button" className="btn-draft">{f.saveDraft}</button>
            <button type="submit" className="btn-submit-job">{f.submit}</button>
          </div>

        </form>
      </div>
    </>
  );
}

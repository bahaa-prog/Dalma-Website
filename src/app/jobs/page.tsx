"use client";

import { useState } from "react";
import Link from "next/link";
import { sitePath } from "@/lib/site-path";
import {
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

export default function JobsPage() {
  const [cvName, setCvName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

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
          <img src={sitePath("/img/logo_color.PNG")} alt="شعار مدينة الدلما الإنسانية" className="jobs-logo" />
          <Link href="/" className="btn-back">
            <ArrowRight className="icon-16" />
            العودة للرئيسية
          </Link>
        </div>
      </header>

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <div className="jobs-hero">
        <div className="jobs-hero-icon">
          <Briefcase className="icon-26" />
        </div>
        <h1 className="jobs-hero-title">نموذج طلب التوظيف</h1>
        <p className="jobs-hero-desc">انضم إلى فريقنا المتخصص وكن جزءاً من رسالتنا الإنسانية في خدمة ذوي الإعاقة</p>
      </div>

      {/* ═══════════════════════ SUCCESS SCREEN ═══════════════════════ */}
      <div id="success-screen" className={submitted ? "visible" : undefined}>
        <div className="success-inner">
          <div className="success-icon-wrap">
            <CheckCircle className="icon-48" style={{ color: "var(--secondary)" }} />
          </div>
          <h2 className="success-title">تم إرسال طلبك بنجاح!</h2>
          <p className="success-desc">شكراً لتقديمك طلب التوظيف في مدينة الدلما الإنسانية. سيتواصل معك فريق الموارد البشرية خلال ٥ أيام عمل.</p>
          <Link href="/" className="btn-back-home">العودة إلى الرئيسية</Link>
        </div>
      </div>

      {/* ═══════════════════════ FORM ═══════════════════════ */}
      <div className="jobs-form-wrap" id="jobs-form-wrap" style={submitted ? { display: "none" } : undefined}>
        <form id="jobs-form" onSubmit={onSubmit}>

          {/* ── معلومات المتقدم ── */}
          <div className="form-section">
            <div className="form-section-hdr">
              <span className="form-section-icon blue"><Users className="icon-16" /></span>
              <h2 className="form-section-title">معلومات المتقدم</h2>
            </div>
            <div className="form-section-body">
              <div className="jfg3">
                <div>
                  <label className="j-label">الاسم الأول *</label>
                  <input type="text" required placeholder="الاسم الأول" className="j-input" />
                </div>
                <div>
                  <label className="j-label">اسم الأب *</label>
                  <input type="text" required placeholder="اسم الأب" className="j-input" />
                </div>
                <div>
                  <label className="j-label">اسم العائلة *</label>
                  <input type="text" required placeholder="اسم العائلة" className="j-input" />
                </div>
                <div>
                  <label className="j-label">الجنس *</label>
                  <select required className="j-input" defaultValue="">
                    <option value="">اختر...</option>
                    <option>ذكر</option>
                    <option>أنثى</option>
                  </select>
                </div>
                <div>
                  <label className="j-label">البريد الإلكتروني *</label>
                  <input type="email" required placeholder="IT@dalma.edu.sa" className="j-input" />
                </div>
                <div>
                  <label className="j-label">تاريخ الميلاد *</label>
                  <input type="date" required className="j-input" />
                </div>
                <div>
                  <label className="j-label">الجنسية *</label>
                  <input type="text" required placeholder="الجنسية" className="j-input" />
                </div>
                <div>
                  <label className="j-label">رقم الجوال *</label>
                  <div className="phone-wrap">
                    <span className="phone-prefix">+966</span>
                    <input type="tel" required placeholder="5xxxxxxxx" className="j-input" />
                  </div>
                </div>
                <div>
                  <label className="j-label">الحالة الاجتماعية *</label>
                  <select required className="j-input" defaultValue="">
                    <option value="">اختر...</option>
                    <option>أعزب/عزباء</option>
                    <option>متزوج/متزوجة</option>
                    <option>مطلق/مطلقة</option>
                    <option>أرمل/أرملة</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ── العنوان ── */}
          <div className="form-section">
            <div className="form-section-hdr">
              <span className="form-section-icon green"><MapPin className="icon-16" /></span>
              <h2 className="form-section-title">العنوان</h2>
            </div>
            <div className="form-section-body">
              <div className="jfg2">
                <div>
                  <label className="j-label">العنوان التفصيلي</label>
                  <input type="text" placeholder="الحي، الشارع، رقم المبنى" className="j-input" />
                </div>
                <div>
                  <label className="j-label">المدينة</label>
                  <input type="text" placeholder="المدينة" className="j-input" />
                </div>
                <div>
                  <label className="j-label">المنطقة / المحافظة *</label>
                  <input type="text" required placeholder="المنطقة أو المحافظة" className="j-input" />
                </div>
                <div>
                  <label className="j-label">الرمز البريدي *</label>
                  <input type="text" required placeholder="الرمز البريدي" className="j-input" />
                </div>
              </div>
            </div>
          </div>

          {/* ── المؤهلات العلمية ── */}
          <div className="form-section">
            <div className="form-section-hdr">
              <span className="form-section-icon blue"><BookOpen className="icon-16" /></span>
              <h2 className="form-section-title">المؤهلات العلمية</h2>
            </div>
            <div className="form-section-body">
              <div className="jfg2">
                <div>
                  <label className="j-label">أعلى مؤهل علمي *</label>
                  <select required className="j-input" defaultValue="">
                    <option value="">اختر...</option>
                    <option>ثانوية عامة</option>
                    <option>دبلوم</option>
                    <option>بكالوريوس</option>
                    <option>ماجستير</option>
                    <option>دكتوراه</option>
                  </select>
                </div>
                <div>
                  <label className="j-label">التخصص / المجال</label>
                  <input type="text" placeholder="التخصص الدراسي" className="j-input" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label className="j-label">الجامعة / الكلية</label>
                  <input type="text" placeholder="اسم الجامعة أو الكلية" className="j-input" />
                </div>
                <div>
                  <label className="j-label">الفئة الوظيفية *</label>
                  <select required className="j-input" defaultValue="">
                    <option value="">اختر...</option>
                    <option>طبية وصحية</option>
                    <option>تعليمية وتربوية</option>
                    <option>إدارية وتقنية</option>
                    <option>اجتماعية ونفسية</option>
                    <option>دعم وخدمات</option>
                  </select>
                </div>
                <div>
                  <label className="j-label">التخصص الفرعي</label>
                  <select className="j-input" defaultValue="">
                    <option value="">اختر...</option>
                    <option>علاج طبيعي</option>
                    <option>علاج وظيفي</option>
                    <option>تخاطب ولغة</option>
                    <option>تمريض</option>
                    <option>تربية خاصة</option>
                    <option>إدارة موارد بشرية</option>
                    <option>تقنية معلومات</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ── الخبرات السابقة ── */}
          <div className="form-section">
            <div className="form-section-hdr">
              <span className="form-section-icon green"><Briefcase className="icon-16" /></span>
              <h2 className="form-section-title">الخبرات السابقة</h2>
            </div>
            <div className="form-section-body">

              {/* خبرة 1 */}
              <div className="exp-label">
                <span className="exp-num">1</span>
                الخبرة الأولى
                <span className="req-tag">(مطلوب)</span>
              </div>
              <div className="jfg3">
                <div>
                  <label className="j-label">اسم الجهة *</label>
                  <input type="text" required placeholder="اسم الشركة أو الجهة" className="j-input" />
                </div>
                <div>
                  <label className="j-label">المسمى الوظيفي *</label>
                  <input type="text" required placeholder="المسمى الوظيفي" className="j-input" />
                </div>
                <div>
                  <label className="j-label">مدة العمل *</label>
                  <input type="text" required placeholder="مثال: يناير ٢٠٢٠ – ديسمبر ٢٠٢٢" className="j-input" />
                </div>
              </div>
              <hr className="exp-divider" />

              {/* خبرة 2 */}
              <div className="exp-label" style={{ marginTop: "1.5rem" }}>
                <span className="exp-num">2</span>
                الخبرة الثانية
              </div>
              <div className="jfg3">
                <div>
                  <label className="j-label">اسم الجهة</label>
                  <input type="text" placeholder="اسم الشركة أو الجهة" className="j-input" />
                </div>
                <div>
                  <label className="j-label">المسمى الوظيفي</label>
                  <input type="text" placeholder="المسمى الوظيفي" className="j-input" />
                </div>
                <div>
                  <label className="j-label">مدة العمل</label>
                  <input type="text" placeholder="مثال: يناير ٢٠٢٠ – ديسمبر ٢٠٢٢" className="j-input" />
                </div>
              </div>
              <hr className="exp-divider" />

              {/* خبرة 3 */}
              <div className="exp-label" style={{ marginTop: "1.5rem" }}>
                <span className="exp-num">3</span>
                الخبرة الثالثة
              </div>
              <div className="jfg3">
                <div>
                  <label className="j-label">اسم الجهة</label>
                  <input type="text" placeholder="اسم الشركة أو الجهة" className="j-input" />
                </div>
                <div>
                  <label className="j-label">المسمى الوظيفي</label>
                  <input type="text" placeholder="المسمى الوظيفي" className="j-input" />
                </div>
                <div>
                  <label className="j-label">مدة العمل</label>
                  <input type="text" placeholder="مثال: يناير ٢٠٢٠ – ديسمبر ٢٠٢٢" className="j-input" />
                </div>
              </div>

            </div>
          </div>

          {/* ── الدورات التدريبية ── */}
          <div className="form-section">
            <div className="form-section-hdr">
              <span className="form-section-icon blue"><Award className="icon-16" /></span>
              <h2 className="form-section-title">الدورات التدريبية</h2>
            </div>
            <div className="form-section-body">
              <div className="jfg3">
                <div>
                  <label className="j-label">اسم الدورة الأولى</label>
                  <input type="text" placeholder="اسم الدورة التدريبية" className="j-input" />
                </div>
                <div>
                  <label className="j-label">اسم الدورة الثانية</label>
                  <input type="text" placeholder="اسم الدورة التدريبية" className="j-input" />
                </div>
                <div>
                  <label className="j-label">اسم الدورة الثالثة</label>
                  <input type="text" placeholder="اسم الدورة التدريبية" className="j-input" />
                </div>
              </div>
            </div>
          </div>

          {/* ── السيرة الذاتية ── */}
          <div className="form-section">
            <div className="form-section-hdr">
              <span className="form-section-icon green"><FileText className="icon-16" /></span>
              <h2 className="form-section-title">السيرة الذاتية / الملفات المطلوبة</h2>
            </div>
            <div className="form-section-body">
              <label className="j-label">رفع السيرة الذاتية *</label>
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
                <span className="cv-text" id="cv-text">{cvName ?? "انقر لرفع الملف"}</span>
                <span className="cv-subtext" id="cv-subtext">{cvName ? "انقر لتغيير الملف" : "الصيغ المقبولة: PDF، Word"}</span>
              </label>
            </div>
          </div>

          {/* ── Buttons ── */}
          <div className="jobs-btns">
            <button type="button" className="btn-draft">حفظ كمسودة</button>
            <button type="submit" className="btn-submit-job">تقديم الطلب</button>
          </div>

        </form>
      </div>
    </>
  );
}

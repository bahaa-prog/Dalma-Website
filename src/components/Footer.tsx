import Link from "next/link";
import { ChevronLeft, Mail, MapPin, X } from "lucide-react";
import { sitePath } from "@/lib/site-path";

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-logo-row">
              <img src={sitePath("/img/logo_white.PNG")} alt="شعار مدينة الدلما الإنسانية" className="footer-logo" />
              <div className="footer-hr-badge">
                <img src={sitePath("/img/HR_Logo_Number.jpeg")} alt="ترخيص وزارة الموارد البشرية - رقم الترخيص" className="footer-hr-logo" />
              </div>
            </div>
            <p className="footer-about">مدينة الدلما الإنسانية — بيت يحتضن الأشخاص ذوي الإعاقة برعاية صادقة، ويؤمن بقدراتهم، ويسعى إلى تمكينهم من عيش حياة كريمة مليئة بالأمل.</p>
            <div className="footer-socials">
              {/* Other platforms disabled until accounts exist:
              <a href="#" className="social-btn" aria-label="Facebook"><Facebook className="icon-16" /></a>
              <a href="#" className="social-btn" aria-label="Instagram"><Instagram className="icon-16" /></a>
              <a href="#" className="social-btn" aria-label="YouTube"><Youtube className="icon-16" /></a>
              */}
              <a href="#" className="social-btn" aria-label="X"><X className="icon-16" /></a>
            </div>
          </div>
          <div>
            <h4 className="footer-col-title">روابط سريعة</h4>
            <ul className="footer-links">
              <li><Link href="/" className="footer-link"><ChevronLeft className="icon-13" />الرئيسية</Link></li>
              <li><Link href="/#about" className="footer-link"><ChevronLeft className="icon-13" />عن المدينة</Link></li>
              <li><Link href="/message" className="footer-link"><ChevronLeft className="icon-13" />الرسالة</Link></li>
              <li><Link href="/#programs" className="footer-link"><ChevronLeft className="icon-13" />البرامج</Link></li>
              <li><Link href="/impact" className="footer-link"><ChevronLeft className="icon-13" />أثر المدينة</Link></li>
              <li><Link href="/news" className="footer-link"><ChevronLeft className="icon-13" />الأخبار</Link></li>
              <li><Link href="/#contact" className="footer-link"><ChevronLeft className="icon-13" />تواصل معنا</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-col-title">تواصل معنا</h4>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <MapPin className="icon-15 footer-contact-icon" />
                <span>الجوف، المملكة العربية السعودية</span>
              </li>
              {/* TODO: update phone number
              <li className="footer-contact-item">
                <Phone className="icon-15 footer-contact-icon" />
                <span>920-000-000</span>
              </li>
              */}
              <li className="footer-contact-item">
                <Mail className="icon-15 footer-contact-icon" />
                <span>info@dalma.edu.sa</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© ٢٠٢٦ مدينة الدلما الإنسانية. جميع الحقوق محفوظة.</p>
          <div className="footer-legal">
            <a href="#">سياسة الخصوصية</a>
            <a href="#">شروط الاستخدام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

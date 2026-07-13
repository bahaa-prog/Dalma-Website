import { Clock, ExternalLink, Mail, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact">
      <div className="section-inner">
        <div className="contact-grid">
          <div>
            <span className="section-label">نسعد بتواصلكم</span>
            <h2 className="section-h2 section-title rtl-section-title" style={{ textAlign: "right", marginBottom: "1.5rem" }}>تواصل معنا</h2>
            <p style={{ color: "var(--muted-fg)", lineHeight: 2 }}>نسعد بتواصلكم للإجابة عن الاستفسارات، واستقبال طلبات الخدمات، وبناء الشراكات، عبر قنوات التواصل الرسمية لمدينة الدلما الإنسانية.</p>
            <div className="contact-items">
              {/* TODO: update phone number
              <a href="tel:920000000" className="contact-item">
                <div className="contact-item-icon"><Phone className="icon-20" /></div>
                <div><div className="contact-item-label">الهاتف</div><div className="contact-item-val">920-000-000</div></div>
              </a>
              */}
              <a href="mailto:info@dalma.org.sa" className="contact-item">
                <div className="contact-item-icon"><Mail className="icon-20" /></div>
                <div><div className="contact-item-label">البريد الإلكتروني</div><div className="contact-item-val">info@dalma.edu.sa</div></div>
              </a>
              <a href="#" className="contact-item">
                <div className="contact-item-icon"><MapPin className="icon-20" /></div>
                <div><div className="contact-item-label">العنوان</div><div className="contact-item-val">الجوف، المملكة العربية السعودية</div></div>
              </a>
              <a href="#" className="contact-item">
                <div className="contact-item-icon"><Clock className="icon-20" /></div>
                <div><div className="contact-item-label">ساعات العمل</div><div className="contact-item-val">الأحد – الخميس: ٨ص – ٤م</div></div>
              </a>
            </div>
          </div>
          <div className="map-wrapper">
            <iframe
              src="https://www.google.com/maps?q=مدينة+الدلما+الإنسانية+سكاكا+الجوف&output=embed"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="موقع مدينة الدلما الإنسانية"
            ></iframe>
            <a href="https://maps.app.goo.gl/59mRyrtwEJ195ZEP8" target="_blank" rel="noopener noreferrer" className="map-overlay-link" aria-label="فتح في خرائط Google">
              <span className="map-open-badge">
                <ExternalLink className="icon-16" />
                افتح في خرائط Google
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

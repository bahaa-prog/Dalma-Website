import { Clock, ExternalLink, Mail, MapPin } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries/ar";

export default function ContactSection({ dict }: { dict: Dictionary["contact"] }) {
  return (
    <section id="contact">
      <div className="section-inner">
        <div className="contact-grid">
          <div>
            <span className="section-label">{dict.label}</span>
            <h2 className="section-h2 section-title rtl-section-title" style={{ textAlign: "start", marginBottom: "1.5rem" }}>{dict.heading}</h2>
            <p style={{ color: "var(--muted-fg)", lineHeight: 2 }}>{dict.intro}</p>
            <div className="contact-items">
              {/* TODO: update phone number
              <a href="tel:920000000" className="contact-item">
                <div className="contact-item-icon"><Phone className="icon-20" /></div>
                <div><div className="contact-item-label">الهاتف</div><div className="contact-item-val">920-000-000</div></div>
              </a>
              */}
              <a href="mailto:info@dalma.org.sa" className="contact-item">
                <div className="contact-item-icon"><Mail className="icon-20" /></div>
                <div><div className="contact-item-label">{dict.emailLabel}</div><div className="contact-item-val" dir="ltr">{dict.email}</div></div>
              </a>
              <a href="#" className="contact-item">
                <div className="contact-item-icon"><MapPin className="icon-20" /></div>
                <div><div className="contact-item-label">{dict.addressLabel}</div><div className="contact-item-val">{dict.address}</div></div>
              </a>
              <a href="#" className="contact-item">
                <div className="contact-item-icon"><Clock className="icon-20" /></div>
                <div><div className="contact-item-label">{dict.hoursLabel}</div><div className="contact-item-val">{dict.hours}</div></div>
              </a>
            </div>
          </div>
          <div className="map-wrapper">
            <iframe
              src={`https://www.google.com/maps?q=${dict.mapQuery}&output=embed`}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={dict.mapTitle}
            ></iframe>
            <a href="https://maps.app.goo.gl/59mRyrtwEJ195ZEP8" target="_blank" rel="noopener noreferrer" className="map-overlay-link" aria-label={dict.openInMaps}>
              <span className="map-open-badge">
                <ExternalLink className="icon-16" />
                {dict.openInMaps}
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

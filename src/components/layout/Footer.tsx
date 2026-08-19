import Link from "next/link";
import { NAV } from "@/config/site.config";
import { CONTACT, activeSocials, hasValue } from "@/config/contact";
import { content } from "@/content";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";

/**
 * A contact line. When the client has not supplied the value yet we render a
 * clearly-marked empty slot instead of inventing data or leaving a blank row.
 */
function ContactRow({ label, value }: { label: string; value: string }) {
  const filled = hasValue(value);
  return (
    <li className="text-sm">
      <span className="block text-ink-inverse/60">{label}</span>
      {filled ? (
        <span className="text-ink-inverse">{value}</span>
      ) : (
        <span
          data-empty-slot={label.toLowerCase()}
          className="text-ink-inverse/70 italic"
        >
          Awaiting client details
        </span>
      )}
    </li>
  );
}

export function Footer() {
  const socials = activeSocials();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-inverse text-ink-inverse">
      <Container>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
          {/* Brand + tagline */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <Logo variant="onDark" />
            </div>
            <p className="mt-3 max-w-xs text-sm text-ink-inverse/70">
              {content.brand.tagline}
            </p>
          </div>

          {/* Navigation — same NAV array, same order as the header */}
          <nav aria-label="Footer">
            <h2 className="text-sm font-semibold">{content.labels.footerPages}</h2>
            <ul data-testid="footer-nav" className="mt-4 space-y-2">
              {NAV.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    data-nav-key={item.key}
                    className="text-sm text-ink-inverse/70 transition-colors hover:text-ink-inverse"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact — every value is currently an empty slot */}
          <div>
            <h2 className="text-sm font-semibold">{content.labels.footerContact}</h2>
            <ul className="mt-4 space-y-3">
              <ContactRow label="Email" value={CONTACT.email} />
              <ContactRow label="Phone" value={CONTACT.phone} />
              <ContactRow label="WhatsApp" value={CONTACT.whatsapp} />
            </ul>
          </div>

          {/* Office */}
          <div>
            <h2 className="text-sm font-semibold">{content.labels.footerOffice}</h2>
            <ul className="mt-4 space-y-3">
              <ContactRow label="Address" value={CONTACT.address} />
              <ContactRow label="Hours" value={CONTACT.hours} />
            </ul>
            {socials.length > 0 && (
              <ul className="mt-4 flex gap-4">
                {socials.map((social) => (
                  <li key={social.key}>
                    <a
                      href={social.href}
                      className="text-sm text-ink-inverse/70 transition-colors hover:text-ink-inverse"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Disclaimer + copyright */}
        <div className="border-t border-ink-inverse/15 py-6">
          <p
            data-testid="disclaimer"
            className="max-w-3xl text-xs leading-relaxed text-ink-inverse/60"
          >
            {content.disclaimer}
          </p>
          <p className="mt-3 text-xs text-ink-inverse/50">
            © {year} {content.brand.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}

import Link from "next/link";
import { NAV } from "@/config/site.config";
import { CONTACT, hasValue } from "@/config/contact";
import { content } from "@/content";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";

/**
 * Footer.
 *
 * MILESTONE 2: contact details are the client-confirmed values (no more
 * empty slots for Email/Phone/WhatsApp). The Office column (Address, Hours)
 * is REMOVED per the client's Developer Notes. Social links stay HIDDEN —
 * TBD, no placeholder links.
 */
export function Footer() {
  return (
    <footer className="bg-surface-inverse text-ink-inverse">
      <Container>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 lg:py-16">
          {/* Brand + tagline */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <Logo variant="onDark" />
            </div>
            <p className="mt-3 max-w-xs text-sm text-ink-inverse/70">
              {content.footer.tagline}
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

          {/* Contact — client-confirmed details */}
          <div>
            <h2 className="text-sm font-semibold">{content.labels.footerContact}</h2>
            <ul className="mt-4 space-y-3">
              <li className="text-sm">
                <span className="block text-ink-inverse/60">Email</span>
                {hasValue(CONTACT.email) ? (
                  <span className="text-ink-inverse">{CONTACT.email}</span>
                ) : (
                  <span data-empty-slot="email" className="italic text-ink-inverse/70">
                    Awaiting client details
                  </span>
                )}
              </li>
              <li className="text-sm">
                <span className="block text-ink-inverse/60">Phone</span>
                <span className="text-ink-inverse">{CONTACT.phone}</span>
              </li>
              <li className="text-sm">
                <span className="block text-ink-inverse/60">WhatsApp</span>
                {hasValue(CONTACT.whatsapp) ? (
                  <span className="text-ink-inverse">{CONTACT.whatsapp}</span>
                ) : (
                  <span data-empty-slot="whatsapp" className="italic text-ink-inverse/70">
                    Awaiting client details
                  </span>
                )}
              </li>
            </ul>
            {/*
              Social Media — HIDDEN. Client: TBD, do not create placeholder
              links. Re-enable once SOCIALS in src/config/contact.ts has
              real entries.
            */}
          </div>
        </div>

        {/*
          Office (Address, Hours) — REMOVED per the client's Developer Notes.
        */}

        {/* Disclaimer + copyright */}
        <div className="border-t border-ink-inverse/15 py-6">
          <p
            data-testid="disclaimer"
            className="max-w-3xl text-xs leading-relaxed text-ink-inverse/60"
          >
            {content.disclaimer}
          </p>
          <p className="mt-3 text-xs text-ink-inverse/50">
            © {content.copyright.year} {content.copyright.holder}
          </p>
          <p className="mt-1 text-xs text-ink-inverse/50">
            {content.copyright.developedBy}
          </p>
        </div>
      </Container>
    </footer>
  );
}

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { content } from "@/content";
import "./globals.css";

/**
 * Poppins is the approved type family for the whole site. Loading it through
 * next/font self-hosts the files (no external request at runtime) and exposes
 * it as the CSS variable that `--font-sans` in globals.css points at.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: content.brand.name,
    template: `%s | ${content.brand.name}`,
  },
  description: content.home.supporting,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning is required, not incidental: the motion boot
    // script below adds `motion-ready` to this element BEFORE React hydrates,
    // so the live DOM legitimately carries a class the server markup does not.
    // React would otherwise report a mismatch on every page load. It suppresses
    // only this element's own attributes, one level deep — children are still
    // fully checked.
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        {/*
          Motion boot script (Milestone 1: animation).

          Runs synchronously as the parser reaches it, which is BEFORE any
          animated element below has been parsed or painted. That ordering is
          the whole point: it prevents content rendering visible and then
          snapping to hidden once CSS applies.

          It adds the class only when reduced motion is NOT requested, so the
          motion preference is honoured before a single frame is drawn. The
          try/catch means an old browser without matchMedia simply gets the
          static site rather than an error.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('motion-ready')}}catch(e){}",
          }}
        />
        <MotionProvider />
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

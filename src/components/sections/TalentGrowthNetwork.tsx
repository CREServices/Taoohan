"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Live Talent Growth Network — a custom abstract visual for the About page's
 * first section, right side. Not a chart: no axes, no numbers, no data. A
 * single SVG path drifts from lower-left to upper-right through five journey
 * nodes (Talent Sourcing → Matching → Recruitment → Placement → Growth),
 * visually standing in for the copy on the left ("talent sourcing,
 * recruitment, and flexible workforce solutions ... helping people discover
 * meaningful opportunities to grow their careers").
 *
 * Self-contained animation, independent of the site-wide MotionProvider
 * (that drives simple fade/rise reveals; this needs a multi-step sequence —
 * path draw, then staggered nodes, then a looping particle stream). Uses the
 * same reduced-motion contract as the rest of the site: nothing is ever
 * gated behind motion that might not run.
 */

// A true infinity (∞) symbol — flat, symmetric, two equal loops — matching
// Taoohan's own logo mark, rather than a tilted or diagonal shape. Traced as
// one continuous path: from the left loop's upper edge, around the full left
// loop, through the centre crossing, around the full right loop, ending at
// its top. Growth is communicated only through colour (the stroke gradient
// deepens along the path) and the emphasis on the final node — the shape
// itself stays perfectly level. Built with a circle-arc generator and
// verified visually; coordinates are fixed here rather than computed at
// runtime since the shape never changes.
const NODES = [
  { key: "sourcing", x: 132, y: 250, label: "Talent Sourcing" },
  { key: "matching", x: 145, y: 88, label: "Matching" },
  { key: "recruitment", x: 230, y: 170, label: "Recruitment" },
  { key: "placement", x: 389, y: 199, label: "Placement" },
  { key: "growth", x: 312, y: 88, label: "Growth" },
] as const;

const PATH_D =
  "M229.6,178.6 Q226.0,195.2 222.6,203.0 Q219.2,210.8 214.2,217.7 Q209.2,224.5 202.9,230.3 " +
  "Q196.7,236.0 189.3,240.3 Q182.0,244.6 173.9,247.3 Q165.9,250.0 157.4,251.0 Q149.0,252.0 140.5,251.2 " +
  "Q132.1,250.4 124.0,247.9 Q115.8,245.4 108.4,241.3 Q101.0,237.2 94.5,231.6 Q88.1,226.0 83.0,219.3 " +
  "Q77.9,212.5 74.2,204.8 Q70.6,197.1 68.6,188.8 Q66.7,180.6 66.5,172.1 Q66.3,163.6 67.8,155.2 " +
  "Q69.3,146.8 72.6,139.0 Q75.8,131.1 80.6,124.1 Q85.4,117.1 91.5,111.2 Q97.6,105.3 104.8,100.8 " +
  "Q112.1,96.3 120.0,93.4 Q128.0,90.5 136.4,89.3 Q144.9,88.1 153.3,88.6 Q161.8,89.2 170.0,91.5 " +
  "Q178.2,93.8 185.7,97.7 Q193.3,101.6 199.8,107.0 Q206.4,112.4 211.7,119.1 Q217.0,125.7 220.8,133.3 " +
  "Q224.7,140.9 226.8,149.1 Q229.0,157.3 229.5,165.8 Q229.9,174.3 228.6,182.7 Q227.2,191.1 224.2,199.0 " +
  "Q221.2,207.0 216.6,214.1 Q212.0,221.3 206.0,227.3 Q200.0,233.4 193.0,238.0 Q185.9,242.7 178.0,245.9 " +
  "Q170.1,249.0 161.7,250.4 Q153.3,251.8 144.8,251.5 Q136.3,251.2 128.1,249.1 Q119.8,247.0 112.2,243.3 " +
  "Q104.5,239.5 97.8,234.3 Q91.1,229.1 85.7,222.6 Q80.2,216.1 76.2,208.6 Q72.1,201.1 69.7,193.0 " +
  "Q67.3,184.8 66.7,176.3 Q66.0,167.9 67.1,159.4 Q68.2,151.0 71.0,143.0 Q73.9,135.0 78.3,127.7 " +
  "Q82.7,120.4 88.5,114.2 Q94.3,108.0 101.3,103.2 Q108.2,98.3 116.1,95.0 Q123.9,91.6 132.2,90.0 " +
  "Q140.6,88.3 149.1,88.4 Q157.6,88.6 165.9,90.4 Q174.2,92.3 181.9,95.8 Q189.6,99.3 196.5,104.4 " +
  "Q203.3,109.4 208.9,115.8 Q214.6,122.1 218.8,129.5 Q223.0,136.9 225.6,145.0 Q228.2,153.1 229.1,161.5 " +
  "Q230.0,170.0 230.0,170.0 Q230.0,170.0 230.1,172.9 Q230.2,175.8 230.5,178.8 Q230.8,181.7 231.4,184.6 " +
  "Q231.9,187.4 232.6,190.3 Q233.3,193.1 234.2,195.9 Q235.2,198.7 236.3,201.4 Q237.4,204.1 238.7,206.7 " +
  "Q240.0,209.3 241.5,211.8 Q243.0,214.3 244.7,216.7 Q246.4,219.1 248.2,221.4 Q250.0,223.7 252.0,225.8 " +
  "Q254.0,228.0 256.2,230.0 Q258.3,232.0 260.6,233.8 Q262.9,235.6 265.3,237.3 Q267.7,239.0 270.2,240.5 " +
  "Q272.7,242.0 275.3,243.3 Q277.9,244.6 280.6,245.7 Q283.3,246.8 286.1,247.8 Q288.9,248.7 291.7,249.4 " +
  "Q294.6,250.1 297.4,250.6 Q300.3,251.2 303.2,251.5 Q306.2,251.8 309.1,251.9 Q312.0,252.0 314.9,251.9 " +
  "Q317.8,251.8 320.8,251.5 Q323.7,251.2 326.6,250.6 Q329.4,250.1 332.3,249.4 Q335.1,248.7 337.9,247.8 " +
  "Q340.7,246.8 343.4,245.7 Q346.1,244.6 348.7,243.3 Q351.3,242.0 353.8,240.5 Q356.3,239.0 358.7,237.3 " +
  "Q361.1,235.6 363.4,233.8 Q365.7,232.0 367.8,230.0 Q370.0,228.0 372.0,225.8 Q374.0,223.7 375.8,221.4 " +
  "Q377.6,219.1 379.3,216.7 Q381.0,214.3 382.5,211.8 Q384.0,209.3 385.3,206.7 Q386.6,204.1 387.7,201.4 " +
  "Q388.8,198.7 389.8,195.9 Q390.7,193.1 391.4,190.3 Q392.1,187.4 392.6,184.6 Q393.2,181.7 393.5,178.8 " +
  "Q393.8,175.8 393.9,172.9 Q394.0,170.0 393.9,167.1 Q393.8,164.2 393.5,161.2 Q393.2,158.3 392.6,155.4 " +
  "Q392.1,152.6 391.4,149.7 Q390.7,146.9 389.8,144.1 Q388.8,141.3 387.7,138.6 Q386.6,135.9 385.3,133.3 " +
  "Q384.0,130.7 382.5,128.2 Q381.0,125.7 379.3,123.3 Q377.6,120.9 375.8,118.6 Q374.0,116.3 372.0,114.2 " +
  "Q370.0,112.0 367.8,110.0 Q365.7,108.0 363.4,106.2 Q361.1,104.4 358.7,102.7 Q356.3,101.0 353.8,99.5 " +
  "Q351.3,98.0 348.7,96.7 Q346.1,95.4 343.4,94.3 Q340.7,93.2 337.9,92.2 Q335.1,91.3 332.3,90.6 " +
  "Q329.4,89.9 326.6,89.4 Q323.7,88.8 320.8,88.5 Q317.8,88.2 314.9,88.1 T312.0,88.0";

// Approximate length of PATH_D (sum of the underlying sample-point segments),
// used to size the stroke-dasharray draw-in animation in globals.css.
const PATH_LENGTH = 1406;

function NodeIcon({ nodeKey }: { nodeKey: (typeof NODES)[number]["key"] }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (nodeKey) {
    case "sourcing":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 19c.7-2.8 2.7-4.4 5.5-4.4S13.8 16.2 14.5 19" />
          <circle cx="17" cy="9" r="2.2" />
          <path d="M15.8 19c.4-1.9 1.5-3 3.2-3.4" />
        </svg>
      );
    case "matching":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="8" cy="12" r="3.5" />
          <circle cx="16" cy="12" r="3.5" />
          <path d="M11 12h2" />
        </svg>
      );
    case "recruitment":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="4" y="7" width="16" height="12" rx="2" />
          <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
        </svg>
      );
    case "placement":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M8.5 12.5l2.3 2.3L16 9.5" />
        </svg>
      );
    case "growth":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M4 17l5-5 4 3 7-8" />
          <path d="M15 6.5h5V11" />
        </svg>
      );
  }
}

export function TalentGrowthNetwork({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  // Reduced motion never needs an entrance to trigger — start "active" so the
  // final state renders immediately, with no synchronous setState in an effect.
  const [active, setActive] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (active) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const observer = new IntersectionObserver(
      (entries, self) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setActive(true);
          self.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.25 },
    );
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [active]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    const handleMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setTilt({ x: px * 6, y: py * 6 });
      });
    };
    const handleLeave = () => setTilt({ x: 0, y: 0 });

    wrap.addEventListener("pointermove", handleMove);
    wrap.addEventListener("pointerleave", handleLeave);
    return () => {
      wrap.removeEventListener("pointermove", handleMove);
      wrap.removeEventListener("pointerleave", handleLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={
        "relative aspect-[9/8] w-full select-none sm:aspect-[10/9]" +
        (className ? ` ${className}` : "")
      }
    >
      <div
        className="talent-network-scene h-full w-full"
        style={{
          transform: `rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg)`,
        }}
      >
        <svg
          viewBox="0 0 460 340"
          className="h-full w-full overflow-visible"
          fill="none"
        >
          <defs>
            <linearGradient id="tgn-path" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#A9D3A0" />
              <stop offset="100%" stopColor="#3D7A4F" />
            </linearGradient>
            <radialGradient id="tgn-growth-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#5FAF73" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#5FAF73" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Faint decorative echo of the same ∞ path, scaled down slightly —
              depth only, no meaning of its own. */}
          <path
            d={PATH_D}
            transform="translate(30,40) scale(0.9)"
            stroke="#CCE3C3"
            strokeWidth="1"
            strokeOpacity="0.5"
            className="talent-network-bg-line"
          />

          {/* Main journey path — a level, symmetric infinity (∞) loop. */}
          <path
            ref={pathRef}
            d={PATH_D}
            stroke="url(#tgn-path)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={
              active
                ? ({ "--tgn-path-length": PATH_LENGTH } as React.CSSProperties)
                : undefined
            }
            className={
              "talent-network-path" + (active ? " talent-network-path--active" : "")
            }
          />

          {/* Traveling particles — only once the path has drawn in. */}
          {active && (
            <g className="talent-network-particles">
              <circle r="3" fill="#5FAF73" className="talent-network-particle talent-network-particle--1">
                <animateMotion dur="6s" repeatCount="indefinite" path={PATH_D} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
              </circle>
              <circle r="2.5" fill="#82C084" className="talent-network-particle talent-network-particle--2">
                <animateMotion dur="6s" begin="2s" repeatCount="indefinite" path={PATH_D} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
              </circle>
              <circle r="2" fill="#A9D3A0" className="talent-network-particle talent-network-particle--3">
                <animateMotion dur="6s" begin="4s" repeatCount="indefinite" path={PATH_D} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
              </circle>
            </g>
          )}

          {/* Growth endpoint emphasis. */}
          <circle
            cx={NODES[4].x}
            cy={NODES[4].y}
            r="34"
            fill="url(#tgn-growth-glow)"
            className={
              "talent-network-growth-ring" +
              (active ? " talent-network-growth-ring--active" : "")
            }
          />
        </svg>

        {/* Nodes — HTML layer positioned over the SVG's own coordinate box so
            the glass treatment can use real backdrop-blur (unavailable to
            SVG foreignObject reliably across browsers). */}
        <div className="talent-network-nodes">
          {NODES.map((node, index) => (
            <div
              key={node.key}
              className={
                "talent-network-node" +
                (active ? " talent-network-node--active" : "") +
                (node.key === "growth" ? " talent-network-node--growth" : "")
              }
              style={
                {
                  left: `${(node.x / 460) * 100}%`,
                  top: `${(node.y / 340) * 100}%`,
                  "--node-delay": `${900 + index * 180}ms`,
                  "--pulse-delay": `${index * 900}ms`,
                } as React.CSSProperties
              }
            >
              <span className="talent-network-node-icon">
                <NodeIcon nodeKey={node.key} />
              </span>
              <span className="talent-network-node-label">{node.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

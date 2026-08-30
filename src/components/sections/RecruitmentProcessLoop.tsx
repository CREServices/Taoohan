"use client";

import { useEffect, useRef, useState } from "react";
import type { Feature } from "@/content/types";

/**
 * The recruitment process, drawn as a continuous loop — About page, first
 * section, right side.
 *
 * WHAT IT SHOWS is the client's own approved six-step process, passed in from
 * `content.services.steps` rather than restated here. The steps are numbered
 * and traversed in order, one highlighted at a time, so the sequence reads as
 * a sequence. This replaces an earlier "Talent Growth Network" visual whose
 * five nodes were an invented journey scattered around the curve in no
 * legible order.
 *
 * WHY A LOOP and not a straight line: the shape is the brand mark. The client's
 * logo is two interlocking rings, and recruitment genuinely is continuous —
 * a placement feeds the next requirement. The crossing in the middle is where
 * the employer side meets the talent side, and the filled portion of the
 * ribbon grows as the sequence advances, so progress through the process is
 * legible at a glance and not just implied.
 *
 * WHERE STEP ONE SITS: at the leftmost point of the left ring, and the
 * sequence runs from there rightwards around the figure. The client asked for
 * this: the sequence used to open on the upper-left node, which put the first
 * beat of the animation somewhere in the middle of the left ring's arc with
 * no visual reason to start there. The far-left point is the loop's extreme
 * — the one place on the shape a reader's eye can be relied on to find first
 * — so beginning there makes the direction of travel self-evident from the
 * opening frame. See NODES for what that does to the ordering.
 *
 * ACCESSIBILITY: the drawing is decorative and marked aria-hidden; the legend
 * beneath it is a real ordered list carrying the same step titles, so nothing
 * shown visually is withheld from assistive tech. The full process, with the
 * body copy for each step, lives on the Services page.
 *
 * Self-contained animation, independent of the site-wide MotionProvider (that
 * drives simple fade/rise reveals; this needs a sequence). Reduced motion is
 * honoured in both directions: the cycle never starts, and the loop renders
 * complete rather than stuck on step one.
 */

/**
 * The ribbon: two round lobes meeting in a true crossing, as four cubics.
 *
 * Built from half-width W=156, crossing spread (A=58, B=88) and outer control
 * height H=120, about the centre (220,130). A cubic's midpoint sits at 3/8 of
 * its two control heights, so B + H = 208 puts each lobe's peak exactly W/2
 * from the axis and makes the lobes read as circles rather than teardrops.
 * The curve spans x 64–376 and y 51.5–208.5, which leaves room inside the
 * 440x260 viewBox for the stroke and its glow — nothing overflows, so the
 * SVG needs no `overflow: visible` and cannot widen the page.
 *
 * Regenerate with scripts/build-process-loop.mjs if the geometry changes; the
 * arc lengths below come from the same script and must stay in step with it.
 */
const PATH_D =
  "M220,130C162,42 64,10 64,130C64,250 162,218 220,130" +
  "C278,42 376,10 376,130C376,250 278,218 220,130Z";

/** Total arc length of PATH_D, for the dash-based fill and the travelling light. */
const PATH_LENGTH = 964.5;

/** Length of the bright travelling segment. */
const SPARK_LENGTH = 54;

/**
 * Six marker positions, listed IN STEP ORDER. They are evenly spaced by arc
 * length and offset half a step so none lands on the crossing, which puts
 * exactly three on each lobe. `arc` is the distance along the path, used to
 * grow the filled ribbon to that step, and it MUST increase down the list —
 * the fill is a dash offset, so a step whose arc went backwards would animate
 * the ribbon in reverse.
 *
 * Step one is the leftmost point (arc 241.1) rather than the upper-left one,
 * so the list is the six positions rotated by one place. That rotation is why
 * the last entry's arc is 1044.85 and not 80.4: the upper-left marker is now
 * reached at the END of the traversal, a full lap on from where the sequence
 * began, and expressing it as 80.4 + PATH_LENGTH is what keeps the sequence
 * monotonic — every step must sit further along than the one before it, or
 * the growing ribbon would animate backwards.
 *
 * The cost of starting at the extreme is that the left ring now carries steps
 * 1, 2 and 6 rather than 1–3 — unavoidable, because the leftmost point is the
 * MIDDLE of that ring's arc, so any traversal beginning there leaves the ring
 * before it has spent three steps on it. Three markers still sit on each
 * ring; only which numbers they carry has moved.
 */
const NODES = [
  { x: 64.0, y: 130.1, arc: 241.1 },
  { x: 165.4, y: 188.3, arc: 401.9 },
  { x: 274.7, y: 71.7, arc: 562.6 },
  { x: 376.0, y: 130.0, arc: 723.3 },
  { x: 274.6, y: 188.3, arc: 884.1 },
  { x: 165.3, y: 71.7, arc: 80.4 + 964.5 },
] as const;

/**
 * Where the ribbon starts growing: step one's own position, NOT the path's
 * start point.
 *
 * The path's `M` happens to be the crossing in the middle, which is an
 * accident of how the four cubics were written and has nothing to do with
 * where the process begins. Growing the fill from there meant that by the
 * time the ribbon reached step one it had already swept past the marker for
 * step six sitting between them — the sequence appeared to begin part-drawn,
 * with its last step lit before its first. Offsetting the dash by this puts
 * the ribbon's leading edge exactly on step one at step one.
 */
const START_ARC = NODES[0].arc;

/** How long each step holds before the loop advances. */
const STEP_MS = 2400;

export function RecruitmentProcessLoop({
  steps,
  className,
}: {
  /** The client's approved process steps — `content.services.steps`. */
  steps: readonly Feature[];
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  // Server and first client render must agree, so both start inactive on
  // step one. Reduced motion is settled in the effect below rather than in
  // the initial state, which would render different markup than the server
  // sent and trip a hydration mismatch on every load.
  const [active, setActive] = useState(false);
  // Counts advances since activation rather than wrapping, so the filled
  // ribbon can only ever grow. Tracking the step alone meant that wrapping
  // from six back to one animated the fill 900ms BACKWARDS around the loop,
  // which read as the process running in reverse.
  const [tick, setTick] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // The geometry is fixed at six markers; pair it with however many steps the
  // content layer actually supplies rather than trusting the two to match.
  const shown = steps.slice(0, NODES.length);

  useEffect(() => {
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
      { rootMargin: "0px 0px -15% 0px", threshold: 0.2 },
    );
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active || shown.length === 0) return;
    // Reduced motion never advances the sequence. It does NOT get left on a
    // frozen step one either: the stylesheet paints the finished state for
    // this component under the reduced-motion query, so the ribbon reads
    // fully travelled and every marker reads complete.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setTick((current) => current + 1), STEP_MS);
    return () => clearInterval(id);
  }, [active, shown.length]);

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
      raf = requestAnimationFrame(() => setTilt({ x: px * 5, y: py * 5 }));
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

  const count = shown.length;
  const step = count > 0 ? tick % count : 0;
  // One full pass completed: the ribbon stays closed from here on and the
  // highlight simply tours it, rather than the fill resetting every cycle.
  const toured = count > 0 && tick >= count;
  // How far the ribbon has travelled FROM step one — not from the path's
  // start point. Once a full pass is done it closes the remaining gap between
  // step six and step one, which is the loop's whole point.
  const filled = !active ? 0 : toured ? PATH_LENGTH : NODES[step].arc - START_ARC;

  /**
   * The dash that paints the travelled ribbon, as `[drawn, gap]` starting at
   * START_ARC.
   *
   * A single-value dasharray (`PATH_LENGTH`) can only ever draw from the
   * path's start. A two-value pattern whose total is exactly PATH_LENGTH can
   * be slid to begin anywhere with a negative offset, and because the total
   * matches the path exactly it wraps around the closed curve seamlessly when
   * the drawn run passes the start point — which it does on every step past
   * the halfway mark.
   */
  const ribbonDash = {
    strokeDasharray: `${filled} ${Math.max(PATH_LENGTH - filled, 0)}`,
    strokeDashoffset: -START_ARC,
  };

  /**
   * The travelling light rests ON the active step rather than circling
   * continuously: it glides to the current marker, stops there for the step's
   * whole hold, then moves on when the step does.
   *
   * The target is CUMULATIVE — lap * PATH_LENGTH + this step's arc — so that
   * wrapping from step six back to step one keeps moving FORWARD into the next
   * lap instead of sliding backwards around the loop. On the first lap it
   * lands exactly on the filled ribbon's leading edge, so the light reads as
   * the head of the fill.
   *
   * A dash pattern of `SPARK_LENGTH` on, rest off, offset by
   * `SPARK_LENGTH - arc`, puts the segment's leading edge at `arc`. The extra
   * PATH_LENGTH keeps the first lap's offset positive.
   */
  const lap = count > 0 ? Math.floor(tick / count) : 0;
  const sparkArc = !active || count === 0 ? 0 : lap * PATH_LENGTH + NODES[step].arc;
  const sparkOffset = PATH_LENGTH + SPARK_LENGTH - sparkArc;

  return (
    <div
      ref={wrapRef}
      className={"process-loop" + (className ? ` ${className}` : "")}
    >
      <div
        className={"process-loop-scene" + (active ? " process-loop-scene--active" : "")}
        style={{ transform: `rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg)` }}
      >
        <svg
          viewBox="0 0 440 260"
          className="process-loop-svg"
          aria-hidden="true"
        >
          <defs>
            {/* Deepens left to right, so the ribbon gains weight as the
                sequence moves from sourcing toward placement. */}
            <linearGradient id="process-loop-ribbon" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" className="process-loop-ribbon-from" />
              <stop offset="45%" className="process-loop-ribbon-via" />
              <stop offset="100%" className="process-loop-ribbon-to" />
            </linearGradient>
            <filter id="process-loop-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <filter id="process-loop-spark" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {/* Soft bloom under the travelled portion — the ribbon reads lit
              rather than drawn. */}
          <path
            d={PATH_D}
            className="process-loop-bloom"
            filter="url(#process-loop-glow)"
            style={ribbonDash}
          />

          {/* The untravelled ribbon. */}
          <path d={PATH_D} className="process-loop-track" />

          {/* The travelled ribbon, grown to the active step. */}
          <path
            d={PATH_D}
            className="process-loop-fill"
            style={ribbonDash}
          />

          {/* A thin core highlight down the middle of the ribbon, which is
              what stops it reading as a flat band. */}
          <path
            d={PATH_D}
            className="process-loop-core"
            style={ribbonDash}
          />

          {/* The travelling light. It advances one step at a time and rests on
              the active marker — see sparkArc above. */}
          <path
            d={PATH_D}
            className="process-loop-spark"
            filter="url(#process-loop-spark)"
            style={{
              strokeDasharray: `${SPARK_LENGTH} ${PATH_LENGTH - SPARK_LENGTH}`,
              strokeDashoffset: sparkOffset,
            }}
          />

          {NODES.slice(0, shown.length).map((node, index) => {
            const done = active && (toured || index <= step);
            const current = active && index === step;
            return (
              <g
                key={shown[index].key}
                className={
                  "process-loop-node" +
                  (active ? " process-loop-node--in" : "") +
                  (done ? " process-loop-node--done" : "") +
                  (current ? " process-loop-node--current" : "")
                }
                style={{ "--node-delay": `${index * 90}ms` } as React.CSSProperties}
              >
                {current && (
                  <circle cx={node.x} cy={node.y} r="15" className="process-loop-node-halo" />
                )}
                <circle cx={node.x} cy={node.y} r="14" className="process-loop-node-disc" />
                <text
                  x={node.x}
                  y={node.y}
                  className="process-loop-node-label"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {index + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <ol className="process-loop-legend">
        {shown.map((item, index) => (
          <li
            key={item.key}
            className={
              "process-loop-legend-item" +
              (active && index === step ? " process-loop-legend-item--current" : "")
            }
          >
            <span className="process-loop-legend-number" aria-hidden="true">
              {index + 1}
            </span>
            <span className="process-loop-legend-title">{item.title}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

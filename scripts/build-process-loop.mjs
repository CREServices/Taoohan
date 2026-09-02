/**
 * Regenerates the ribbon geometry used by
 * src/components/sections/RecruitmentProcessLoop.tsx.
 *
 * Prints PATH_D, PATH_LENGTH and the six NODES entries. Paste them back into
 * the component — they are hardcoded there rather than computed at runtime so
 * the server and client agree on marker positions (a runtime measurement via
 * getPointAtLength would not exist during SSR and would shift on hydration).
 *
 *   node scripts/build-process-loop.mjs
 */

const CX = 220, CY = 130;
const W = 156; // half-width: centre to a lobe's outer edge
const A = 58;  // crossing spread, horizontal
const B = 88;  // crossing spread, vertical
const H = 120; // outer control height
// A cubic's midpoint sits at 3/8 of its two control heights, so B + H = 208
// puts each lobe's peak exactly W/2 from the axis — which is what makes the
// lobes read as circles rather than teardrops.

const cubics = [
  [[CX, CY], [CX - A, CY - B], [CX - W, CY - H], [CX - W, CY]],
  [[CX - W, CY], [CX - W, CY + H], [CX - A, CY + B], [CX, CY]],
  [[CX, CY], [CX + A, CY - B], [CX + W, CY - H], [CX + W, CY]],
  [[CX + W, CY], [CX + W, CY + H], [CX + A, CY + B], [CX, CY]],
];

const d =
  `M${CX},${CY}` +
  cubics
    .map((c) => `C${c[1][0]},${c[1][1]} ${c[2][0]},${c[2][1]} ${c[3][0]},${c[3][1]}`)
    .join("") +
  "Z";

const at = (c, t) => {
  const u = 1 - t;
  return [0, 1].map(
    (i) =>
      u * u * u * c[0][i] +
      3 * u * u * t * c[1][i] +
      3 * u * t * t * c[2][i] +
      t * t * t * c[3][i],
  );
};

const N = 4000;
const samples = [];
let len = 0;
let prev = at(cubics[0], 0);
samples.push({ len: 0, p: prev });
for (const c of cubics) {
  for (let i = 1; i <= N; i++) {
    const p = at(c, i / N);
    len += Math.hypot(p[0] - prev[0], p[1] - prev[1]);
    samples.push({ len, p });
    prev = p;
  }
}

const pointAt = (target) => {
  let lo = 0, hi = samples.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (samples[mid].len < target) lo = mid + 1;
    else hi = mid;
  }
  return samples[lo].p;
};

// Six markers, evenly spaced by arc length and offset half a step so none
// lands on the crossing — which puts exactly three on each lobe.
const STEPS = 6;
const nodes = [];
for (let k = 0; k < STEPS; k++) {
  const arc = (len * (2 * k + 1)) / (2 * STEPS);
  const [x, y] = pointAt(arc);
  nodes.push({ x: +x.toFixed(1), y: +y.toFixed(1), arc: +arc.toFixed(1) });
}

console.log(`const PATH_D =\n  "${d.slice(0, 50)}" +\n  "${d.slice(50)}";`);
console.log(`\nconst PATH_LENGTH = ${len.toFixed(1)};`);
console.log("\nconst NODES = [");
for (const n of nodes) {
  console.log(`  { x: ${n.x.toFixed(1)}, y: ${n.y.toFixed(1)}, arc: ${n.arc.toFixed(1)} },`);
}
console.log("] as const;");

const xs = samples.map((s) => s.p[0]);
const ys = samples.map((s) => s.p[1]);
console.log(
  `\n// extent: x ${Math.min(...xs).toFixed(1)}–${Math.max(...xs).toFixed(1)}, ` +
    `y ${Math.min(...ys).toFixed(1)}–${Math.max(...ys).toFixed(1)} in a 440x260 viewBox`,
);

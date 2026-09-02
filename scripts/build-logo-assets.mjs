import sharp from "sharp";

// The three supplied files are flat vector art flattened onto an opaque
// background. Un-composite them so the artwork can sit on any surface:
// solve P = A*C + (1-A)*B for each pixel, choosing C from the known
// four-colour brand palette by nearest distance to the segment [B, C].
const DARK  = [38, 51, 42];    // #26332A  surface-inverse / ink
const BRAND = [95, 175, 115];  // #5FAF73  brand-500
const LIGHT = [204, 227, 195]; // #CCE3C3  brand-200
const WHITE = [255, 255, 255];

function unComposite(data, info, bg, palette) {
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let p = 0; p < info.width * info.height; p++) {
    const i = p * info.channels;
    const P = [data[i], data[i + 1], data[i + 2]];

    let best = null;
    for (const { from, to } of palette) {
      const d = [from[0] - bg[0], from[1] - bg[1], from[2] - bg[2]];
      const v = [P[0] - bg[0], P[1] - bg[1], P[2] - bg[2]];
      const dd = d[0] * d[0] + d[1] * d[1] + d[2] * d[2];
      let t = dd === 0 ? 0 : (v[0] * d[0] + v[1] * d[1] + v[2] * d[2]) / dd;
      t = Math.max(0, Math.min(1, t));
      const proj = [bg[0] + d[0] * t, bg[1] + d[1] * t, bg[2] + d[2] * t];
      const err =
        (P[0] - proj[0]) ** 2 + (P[1] - proj[1]) ** 2 + (P[2] - proj[2]) ** 2;
      if (!best || err < best.err) best = { err, alpha: t, colour: to };
    }

    const o = p * 4;
    out[o] = best.colour[0];
    out[o + 1] = best.colour[1];
    out[o + 2] = best.colour[2];
    out[o + 3] = Math.round(best.alpha * 255);
  }
  return out;
}

async function build({ src, dest, bg, palette }) {
  const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
  const rgba = unComposite(data, info, bg, palette);
  const meta = await sharp(rgba, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 1 })
    .png({ compressionLevel: 9 })
    .toFile(dest);
  console.log(dest.padEnd(46), meta.width + "x" + meta.height);
  return meta;
}

const keep = (...cs) => cs.map((c) => ({ from: c, to: c }));

await build({
  src: "public/logo/taoohan-dark.png",
  dest: "public/logo/taoohan-wordmark.png",
  bg: WHITE,
  palette: keep(DARK, BRAND, LIGHT),
});

await build({
  src: "public/logo/taoohan-dark.png",
  dest: "public/logo/taoohan-wordmark-inverse.png",
  bg: WHITE,
  palette: [
    { from: DARK, to: WHITE },
    { from: BRAND, to: BRAND },
    { from: LIGHT, to: LIGHT },
  ],
});

await build({
  src: "public/logo/logo-dark.png",
  dest: "public/logo/taoohan-mark.png",
  bg: WHITE,
  palette: keep(DARK, BRAND, LIGHT),
});

await build({
  src: "public/logo/logo-white.png",
  dest: "public/logo/taoohan-mark-inverse.png",
  bg: DARK,
  palette: keep(WHITE, BRAND, LIGHT),
});

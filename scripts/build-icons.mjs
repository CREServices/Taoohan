import sharp from "sharp";

/**
 * Browser icon. The mark sits on the brand's own dark ground (the same
 * treatment the client ships as logo-white.png) rather than on transparency:
 * the mark's left ring is #26332A, which all but vanishes against a dark
 * browser tab strip. On the dark tile both rings stay bright at 16px.
 *
 * Run after scripts/build-logo-assets.mjs — it reads that script's output.
 */
const SOURCE = "public/logo/taoohan-mark-inverse.png";
const GROUND = "#26332A";

async function tile({ size, radius, dest }) {
  const markWidth = Math.round(size * 0.78);
  const mark = await sharp(SOURCE).resize({ width: markWidth }).toBuffer();
  const { height } = await sharp(mark).metadata();

  const layers = [
    {
      input: mark,
      top: Math.round((size - height) / 2),
      left: Math.round((size - markWidth) / 2),
    },
  ];

  if (radius) {
    layers.unshift({
      input: Buffer.from(
        `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${GROUND}"/></svg>`,
      ),
      top: 0,
      left: 0,
    });
  }

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: radius ? { r: 0, g: 0, b: 0, alpha: 0 } : GROUND,
    },
  })
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toFile(dest);

  console.log(dest.padEnd(28), `${size}x${size}`);
}

await tile({ size: 512, radius: Math.round(512 * 0.2), dest: "src/app/icon.png" });
// iOS applies its own mask, so the touch icon is full-bleed: no corner radius
// of its own, no transparency.
await tile({ size: 180, radius: 0, dest: "src/app/apple-icon.png" });

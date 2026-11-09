import sharp from "sharp";
import { access, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const directory = fileURLToPath(
  new URL("../public/projects/cryptofolio/", import.meta.url),
);
const captures = [
  ["dashboard-desktop", 1920, 1080],
  ["analysis-desktop", 1920, 1080],
  ["alerts-desktop", 1920, 1080],
  ["markets-desktop", 1920, 1080],
  ["dashboard-mobile", 880, 1912],
  ["navigation-mobile", 880, 1912],
];

for (const [name, width, height] of captures) {
  const input = path.join(directory, `${name}.png`);
  const output = path.join(directory, `${name}.webp`);
  await access(input);
  const metadata = await sharp(input).metadata();
  if (Math.abs(metadata.width / metadata.height - width / height) > 0.002)
    throw new Error(
      `${name}: capture has ${metadata.width} × ${metadata.height}; recapture at the fixed viewport ratio instead of stretching it.`,
    );
  await sharp(input)
    .resize(width, height, { fit: "inside" })
    .webp({ quality: 90, effort: 6 })
    .toFile(output);
  const prepared = await sharp(output).metadata();
  if (prepared.width !== width || prepared.height !== height)
    throw new Error(`${name}: output dimensions are inconsistent.`);
  console.log(
    `${name}: ${width} × ${height}, ${Math.round((await stat(output)).size / 1024)} KB`,
  );
}

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const output = fileURLToPath(
  new URL("../public/projects/e-commerce/", import.meta.url),
);
const backend = "C:/Users/caoan/Workspace/e-commerce/.cache/";
const frontend = "C:/Users/caoan/Workspace/e-commerce-ui/docs/previews/";
const sources = [
  ["storefront", `${backend}football-redesign/home-hero.png`],
  ["discovery", `${backend}football-redesign/catalog-desktop.png`],
  ["product", `${backend}football-shopping-journey/product-1440.png`],
  ["tracking", `${backend}football-shopping-journey/order-shipped-1440.png`],
  ["appearance", `${frontend}shadcn/appearance-1440.png`],
];

await mkdir(output, { recursive: true });
for (const [name, source] of sources) {
  const metadata = await sharp(source).metadata();
  if (metadata.width !== 1440 || metadata.height < 1050)
    throw new Error(
      `${name}: expected a 1440px-wide capture at least 1050px tall.`,
    );
  const target = `${output}/${name}-desktop.webp`;
  await sharp(source)
    .extract({ left: 0, top: 0, width: 1440, height: 1050 })
    .resize(1920, 1400)
    .webp({ quality: 90, effort: 6 })
    .toFile(target);
  const result = await sharp(target).metadata();
  if (result.width !== 1920 || result.height !== 1400)
    throw new Error(`${name}: inconsistent output size.`);
  console.log(`${name}: ${result.width} × ${result.height}`);
}

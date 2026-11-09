export type ProjectCapture = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  device: "desktop" | "mobile";
};

export const cryptofolioCaptures = {
  dashboard: {
    src: "/projects/cryptofolio/dashboard-desktop.webp",
    alt: "Cryptofolio desktop dashboard with portfolio allocation, market rates, and holding summaries",
    caption:
      "The overview: balances, allocation, and market context in one workspace.",
    width: 1920,
    height: 1080,
    device: "desktop",
  },
  markets: {
    src: "/projects/cryptofolio/markets-desktop.webp",
    alt: "Cryptofolio Markets page showing market sentiment, global market statistics, trending assets, and comparative performance",
    caption:
      "Market context, from sentiment and trending assets to comparative performance.",
    width: 1920,
    height: 1080,
    device: "desktop",
  },
  analysis: {
    src: "/projects/cryptofolio/analysis-desktop.webp",
    alt: "Cryptofolio portfolio analysis interface",
    caption: "The analysis workspace, captured from the running application.",
    width: 1920,
    height: 1080,
    device: "desktop",
  },
  alerts: {
    src: "/projects/cryptofolio/alerts-desktop.webp",
    alt: "Cryptofolio alert management and Telegram notification interface",
    caption:
      "Price alerts and notification delivery, brought into the same workspace.",
    width: 1920,
    height: 1080,
    device: "desktop",
  },
  mobile: {
    src: "/projects/cryptofolio/dashboard-mobile.webp",
    alt: "Cryptofolio dashboard at a mobile viewport with stacked market and portfolio cards",
    caption: "A compact overview with the same portfolio context.",
    width: 880,
    height: 1912,
    device: "mobile",
  },
  navigation: {
    src: "/projects/cryptofolio/navigation-mobile.webp",
    alt: "Cryptofolio mobile navigation expanded above the floating menu button",
    caption: "A thumb-reachable menu for moving between the app’s main areas.",
    width: 880,
    height: 1912,
    device: "mobile",
  },
} satisfies Record<string, ProjectCapture>;

export function getFeatureCapture(
  slug: string,
  visual: string,
): ProjectCapture | undefined {
  if (slug === "e-commerce") {
    if (visual === "storefront") return commerceCaptures.discovery;
    if (visual === "checkout") return commerceCaptures.product;
    if (visual === "operations") return commerceCaptures.tracking;
  }
  if (slug !== "cryptofolio") return undefined;
  if (visual === "overview") return cryptofolioCaptures.dashboard;
  if (visual === "analysis") return cryptofolioCaptures.analysis;
  if (visual === "alerts") return cryptofolioCaptures.alerts;
  return undefined;
}

export const commerceCaptures = {
  storefront: {
    src: "/projects/e-commerce/storefront-desktop.webp",
    alt: "Football Fan Store homepage with real catalog photography, collections, and merchant branding",
    caption:
      "A store with its own identity. Retained local football-store capture.",
    width: 1920,
    height: 1400,
    device: "desktop",
  },
  discovery: {
    src: "/projects/e-commerce/discovery-desktop.webp",
    alt: "Football catalog filtered by Nike and maximum price, with active filters and sorted product results",
    caption:
      "Brand, budget, size, and availability help shoppers narrow the catalog.",
    width: 1920,
    height: 1400,
    device: "desktop",
  },
  product: {
    src: "/projects/e-commerce/product-desktop.webp",
    alt: "Football boot product page showing a photo gallery, explicit sizes, VND price, stock state, and quantity controls",
    caption:
      "See the product, choose the actual variant, and check availability.",
    width: 1920,
    height: 1400,
    device: "desktop",
  },
  tracking: {
    src: "/projects/e-commerce/tracking-desktop.webp",
    alt: "Test order tracking with a five-step progress timeline, original line prices, delivery charges, and confirmed VietQR payment status",
    caption:
      "A retained test order: progress, original totals, and payment status together.",
    width: 1920,
    height: 1400,
    device: "desktop",
  },
  appearance: {
    src: "/projects/e-commerce/appearance-desktop.webp",
    alt: "Store appearance editor with home, fashion, and sport presets plus merchant branding and homepage content fields",
    caption:
      "Appearance editor captured with synthetic test-store content in an earlier UI check.",
    width: 1920,
    height: 1400,
    device: "desktop",
  },
} satisfies Record<string, ProjectCapture>;

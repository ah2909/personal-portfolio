import type { Project } from "./project-model";

export const seedProjects: Project[] = [
  {
    slug: "cryptofolio",
    title: "Cryptofolio",
    category: "FINTECH / FULL STACK",
    tagline: "Every exchange. One clear picture.",
    description:
      "A cryptocurrency workspace that brings exchange balances, portfolio performance, live market data, AI analysis, and Telegram alerts into one experience.",
    problem:
      "Crypto activity lives across exchanges, transactions, and fast-moving markets. Understanding the whole portfolio means connecting those pieces without losing the details.",
    approach:
      "Bring holdings and transactions into one portfolio, stream market prices, and make analysis and alerts available alongside the assets they describe.",
    architecture:
      "A Next.js and TypeScript frontend uses Redux Toolkit Query and Socket.IO. A Laravel API coordinates portfolios and exchanges. Dedicated Node.js, Python FastAPI / LangGraph, and Go services handle authentication, market streaming, AI analysis, and alerts. MariaDB stores records; Redis supports caching and events.",
    stack: [
      "Next.js",
      "TypeScript",
      "Laravel",
      "FastAPI",
      "LangGraph",
      "Go",
      "Socket.IO",
      "MariaDB",
      "Redis",
    ],
    features: [
      {
        title: "A unified portfolio",
        description:
          "Track balances, allocation, performance history, and transaction activity. Connect supported exchanges, synchronize trades, or import transactions from CSV.",
        visual: "overview",
      },
      {
        title: "AI-powered insight",
        description:
          "Explore portfolio risk, concentration, profit and loss, and asset performance. A LangGraph pipeline combines market data with structured AI assessment; token research is available on demand.",
        visual: "analysis",
      },
      {
        title: "Alerts that reach you",
        description:
          "Manage price alerts and connect Telegram for notifications. A dedicated Go service evaluates Binance prices and publishes events through Redis to the real-time layer.",
        visual: "alerts",
      },
    ],
    highlights: [
      "Separate services for portfolios, identity, live data, AI, and alerts",
      "Shared Binance subscriptions fan out to authenticated clients",
      "Revocable public portfolio sharing",
      "Exchange synchronization and CSV transaction import",
    ],
    caveat:
      "Reviewed in local frontend and backend source. Desktop and mobile screenshots were captured from the running local application using its test account. Values reflect the capture time, not a live feed. This portfolio does not connect to exchanges or run financial analysis.",
    accent: "mint",
    year: "2026",
    order: 1,
    published: true,
    featured: true,
    liveUrl: "",
    sourceUrl: "",
    coverUrl: "",
  },
  {
    slug: "e-commerce",
    title: "E-Commerce",
    category: "COMMERCE / FULL STACK",
    tagline: "Built for the shop. Designed for the shopper.",
    description:
      "An independent storefront and an everyday workspace for Vietnamese retailers. Owners shape their brand and manage products, stock, orders, and payments; shoppers discover the right variant and follow their purchase through delivery.",
    problem:
      "An owner needs to keep the catalog, stock, payments, and delivery work connected. A shopper needs to find a product in the right size and budget, understand availability, and know what happens after ordering.",
    approach:
      "Connect a branded storefront to permissioned store operations. Pair precise product discovery and clear order progress with server-owned prices, stock reservations, historical order snapshots, and independent store data.",
    architecture:
      "The Next.js and TypeScript UI uses TanStack Query, shared shadcn / Radix components, and an OpenAPI contract. A Go API uses Gin and GORM with module-owned domain logic. PostgreSQL owns transactions, Redis provides ephemeral coordination, and an outbox carries asynchronous events toward Kafka without putting it inside the checkout commit.",
    stack: [
      "Next.js",
      "TypeScript",
      "TanStack Query",
      "Go",
      "Gin",
      "PostgreSQL",
      "Redis",
      "Kafka",
      "OpenAPI",
    ],
    features: [
      {
        title: "Find the right product",
        description:
          "Search across names, descriptions, SKUs, brands, and categories without needing exact accents. Combine collection, brand, size, budget, and stock filters; keep your choices in the URL when returning to browse.",
        visual: "storefront",
      },
      {
        title: "Choose with more confidence",
        description:
          "Inspect product photos with a gallery, select an explicit size or variant, see its price and availability, and adjust quantity. Purchase controls reflect the chosen variant; original size labels remain visible.",
        visual: "checkout",
      },
      {
        title: "Follow every step",
        description:
          "A five-step order timeline connects payment, preparation, dispatch, and completion. Shoppers see the original order totals and authorized shipment information, with clear messages for expiry, cancellation, reconciliation, and refunds.",
        visual: "operations",
      },
    ],
    highlights: [
      "Store isolation resolved from a validated hostname",
      "Atomic checkout, stock reservations, and historical order snapshots",
      "Vietnamese address entry and integer VND pricing",
      "Versioned appearance and role-based administration",
    ],
    caveat:
      "Capabilities were reviewed in project documentation and implementation. Screenshots are retained local app captures from earlier project UI checks; the appearance editor uses synthetic test-store content. Values are test data, not live store activity. Live MoMo and social-login validation remain pending; checkout currently offers VietQR. No production-readiness claim is made.",
    accent: "orange",
    year: "2026",
    order: 2,
    published: true,
    featured: true,
    liveUrl: "",
    sourceUrl: "",
    coverUrl: "",
  },
];

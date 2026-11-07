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
      "Reviewed in local frontend and backend source. This presentation does not connect to exchanges, run financial analysis, or expose account data. Visuals use illustrative sample data.",
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
    tagline: "One platform. A store of your own.",
    description:
      "A multi-store commerce platform for Vietnamese shops, connecting customizable storefronts with catalog, checkout, inventory, payments, and store operations.",
    problem:
      "A storefront is only the visible part of commerce. Orders must keep their original prices, inventory must survive competing checkouts, and every store's customers and data must remain separate.",
    approach:
      "Pair a customizable Next.js shopping experience with a Go modular monolith. Let the backend own tenant resolution, money, stock reservations, and order transitions, while the storefront stays focused on the shopper.",
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
        title: "A storefront with identity",
        description:
          "Browse products, variants, categories, and available stock. Merchants can edit their brand, hero, and announcement, and choose home, fashion, or sport appearance presets.",
        visual: "storefront",
      },
      {
        title: "Checkout, carefully handled",
        description:
          "Guest and registered shoppers can build a cart and enter Vietnamese delivery addresses. Checkout revalidates prices and stock, reserves inventory, and persists order snapshots with idempotent retry protection.",
        visual: "checkout",
      },
      {
        title: "The whole store, managed",
        description:
          "Permissioned administration covers products, price lists, inventory adjustments, orders, shipping, workforce roles, and payment reconciliation. VietQR supports audited manual confirmation.",
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
      "Source review confirms implemented flows. The backend inventory marks live MoMo and social-login interoperability as validation pending. This is not a production-readiness claim. Visuals use illustrative sample data.",
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

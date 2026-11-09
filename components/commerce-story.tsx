import {
  ArrowDown,
  ArrowUpRight,
  Boxes,
  Check,
  Fingerprint,
  PackageCheck,
  Palette,
  ReceiptText,
  ShieldCheck,
  Store,
  Truck,
  Users,
} from "lucide-react";
import { commerceCaptures } from "../lib/project-media";
import { ProjectCapture } from "./project-capture";

const ownerTools = [
  {
    icon: Boxes,
    title: "A catalog you control",
    text: "Create and publish products, organize categories, and manage photos, SKUs, sizes, and price lists.",
  },
  {
    icon: PackageCheck,
    title: "Stock with a history",
    text: "See exact stock, record adjustments, and trace inventory changes. Checkout reservations protect availability.",
  },
  {
    icon: Truck,
    title: "Orders through delivery",
    text: "Work through the order queue, prepare carrier and tracking details, then dispatch and complete shipments.",
  },
  {
    icon: ReceiptText,
    title: "Payment exceptions, handled",
    text: "Confirm VietQR receipts, reconcile unresolved payments, and manage full refunds with permission checks.",
  },
  {
    icon: Users,
    title: "A team with clear roles",
    text: "Assign owner, admin, and staff memberships with explicit access to sensitive store operations.",
  },
  {
    icon: Store,
    title: "Each store stays independent",
    text: "A store’s hostname selects its own catalog, accounts, carts, orders, and payments.",
  },
];

export function CommerceHero() {
  return (
    <div className="commerce-hero">
      <div className="commerce-hero-copy">
        <span className="case-kicker">
          THE FOOTBALL STORE / A LOCAL DEMONSTRATION
        </span>
        <h2>
          A shop people
          <br />
          want to explore.
          <br />
          <em>
            A business you
            <br />
            can run.
          </em>
        </h2>
        <p>
          One connected journey, from the first product discovery to the work
          behind every order.
        </p>
        <a href="#owner">
          Step behind the counter <ArrowDown size={16} aria-hidden />
        </a>
        <div className="commerce-hero-tags">
          <span>MERCHANT TOOLS</span>
          <span>SHOPPER EXPERIENCE</span>
        </div>
      </div>
      <ProjectCapture capture={commerceCaptures.storefront} priority />
    </div>
  );
}

export function CommerceOwner() {
  return (
    <section className="commerce-owner" id="owner">
      <div className="case-section-title">
        <div>
          <span className="case-kicker">02 / FOR THE STORE OWNER</span>
          <h2>
            Your storefront.
            <br />
            <span>Your daily workspace.</span>
          </h2>
        </div>
        <p>
          Build the brand customers see.
          <br />
          Manage the details that keep the store moving.
        </p>
      </div>
      <div className="commerce-brand-story">
        <div className="commerce-brand-copy">
          <span className="commerce-icon">
            <Palette size={23} aria-hidden />
          </span>
          <span className="case-kicker">MAKE IT YOUR OWN</span>
          <h3>
            Change the personality.
            <br />
            Keep the commerce.
          </h3>
          <p>
            Choose a home, fashion, or sport preset. Shape the store name, hero
            copy, announcement, logo, and artwork without rebuilding the
            shopping flow.
          </p>
          <ul>
            <li>
              <Check size={15} aria-hidden /> Preview before saving
            </li>
            <li>
              <Check size={15} aria-hidden /> Keep your copy when switching
              presets
            </li>
            <li>
              <Check size={15} aria-hidden /> Versioned, permissioned changes
            </li>
          </ul>
          <div
            className="commerce-presets"
            aria-label="Available storefront presets"
          >
            <span>Home</span>
            <span>Fashion</span>
            <span>Sport</span>
          </div>
        </div>
        <ProjectCapture capture={commerceCaptures.appearance} />
      </div>
      <div className="commerce-tools">
        {ownerTools.map(({ icon: Icon, title, text }, index) => (
          <article key={title}>
            <div>
              <Icon size={22} aria-hidden />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <p className="commerce-section-footnote">
        Owner capabilities are described from implementation review. The editor
        image is an earlier synthetic test-store capture.
      </p>
    </section>
  );
}

export function CommerceReliability() {
  return (
    <section className="commerce-reliability" id="reliability">
      <div className="commerce-reliability-heading">
        <span className="case-kicker">04 / WHAT MAKES IT DIFFERENT</span>
        <h2>
          The details you don’t see.
          <br />
          <em>The difference you feel.</em>
        </h2>
        <p>
          A convincing store needs more than a cart button. These decisions
          connect the shopping experience to dependable store operations.
        </p>
      </div>
      <div className="commerce-differences">
        <article>
          <Fingerprint size={22} aria-hidden />
          <h3>Find a size you can actually buy.</h3>
          <p>
            Size, price, and stock filters must match the same variant. A
            sold-out cheap size cannot make an unavailable option look like a
            match.
          </p>
          <span>VARIANT-AWARE DISCOVERY</span>
        </article>
        <article>
          <ShieldCheck size={22} aria-hidden />
          <h3>A retry should not become a second order.</h3>
          <p>
            Checkout rechecks prices and stock, reserves inventory, and records
            the order together. Accepted retries return the original order.
          </p>
          <span>ATOMIC, IDEMPOTENT CHECKOUT</span>
        </article>
        <article>
          <ReceiptText size={22} aria-hidden />
          <h3>Yesterday’s order keeps yesterday’s price.</h3>
          <p>
            Order snapshots preserve the purchased items, prices, address,
            shipping, and totals even when the catalog changes later.
          </p>
          <span>HISTORICAL ORDER SNAPSHOTS</span>
        </article>
        <article>
          <Store size={22} aria-hidden />
          <h3>Vietnamese commerce from the start.</h3>
          <p>
            VND amounts, Vietnamese delivery addresses, guest or account
            checkout, and VietQR instructions fit the store’s local workflow.
          </p>
          <span>LOCAL SHOPPING CONTEXT</span>
        </article>
      </div>
      <div
        className="commerce-order-path"
        aria-label="Checkout reservation lifecycle"
      >
        <span>
          <b>01</b> Recheck price & stock
        </span>
        <ArrowUpRight size={17} aria-hidden />
        <span>
          <b>02</b> Reserve for 10 minutes
        </span>
        <ArrowUpRight size={17} aria-hidden />
        <span>
          <b>03</b> Settle or release stock
        </span>
      </div>
    </section>
  );
}

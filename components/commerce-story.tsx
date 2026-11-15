"use client";

import { useTranslation } from "./language-provider";
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
  const t = useTranslation();
  return (
    <div className="commerce-hero">
      <div className="commerce-hero-copy">
        <span className="case-kicker">
          {t("THE FOOTBALL STORE / A LOCAL DEMONSTRATION")}
        </span>
        <h2>
          {t("A shop people")}
          <br />
          {t("want to explore.")}
          <br />
          <em>
            {t("A business you")}
            <br />
            {t("can run.")}
          </em>
        </h2>
        <p>
          {t("One connected journey, from the first product discovery to the work behind every order.")}
        </p>
        <a href="#owner">
          {t("Step behind the counter")} <ArrowDown size={16} aria-hidden />
        </a>
        <div className="commerce-hero-tags">
          <span>
            {t("MERCHANT TOOLS")}
          </span>
          <span>
            {t("SHOPPER EXPERIENCE")}
          </span>
        </div>
      </div>
      <ProjectCapture capture={commerceCaptures.storefront} priority />
    </div>
  );
}

export function CommerceOwner() {
  const t = useTranslation();
  return (
    <section className="commerce-owner" id="owner">
      <div className="case-section-title">
        <div>
          <span className="case-kicker">
            {t("02 / FOR THE STORE OWNER")}
          </span>
          <h2>
            {t("Your storefront.")}
            <br />
            <span>
              {t("Your daily workspace.")}
            </span>
          </h2>
        </div>
        <p>
          {t("Build the brand customers see.")}
          <br />
          {t("Manage the details that keep the store moving.")}
        </p>
      </div>
      <div className="commerce-brand-story">
        <div className="commerce-brand-copy">
          <span className="commerce-icon">
            <Palette size={23} aria-hidden />
          </span>
          <span className="case-kicker">
            {t("MAKE IT YOUR OWN")}
          </span>
          <h3>
            {t("Change the personality.")}
            <br />
            {t("Keep the commerce.")}
          </h3>
          <p>
            {t("Choose a home, fashion, or sport preset. Shape the store name, hero copy, announcement, logo, and artwork without rebuilding the shopping flow.")}
          </p>
          <ul>
            <li>
              <Check size={15} aria-hidden /> {t("Preview before saving")}
            </li>
            <li>
              <Check size={15} aria-hidden /> {t("Keep your copy when switching presets")}
            </li>
            <li>
              <Check size={15} aria-hidden /> {t("Versioned, permissioned changes")}
            </li>
          </ul>
          <div
            className="commerce-presets"
            aria-label={t("Available storefront presets")}
          >
            <span>
              {t("Home")}
            </span>
            <span>
              {t("Fashion")}
            </span>
            <span>
              {t("Sport")}
            </span>
          </div>
        </div>
        <ProjectCapture capture={commerceCaptures.appearance} />
      </div>
      <div className="commerce-tools">
        {ownerTools.map(({ icon: Icon, title, text }, index) => (
          <article key={title}>
            <div>
              <Icon size={22} aria-hidden />
              <span>{String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3>
              {t(title)}
            </h3>
            <p>
              {t(text)}
            </p>
          </article>
        ))}
      </div>
      <p className="commerce-section-footnote">
        {t("Owner capabilities are described from implementation review. The editor image is an earlier synthetic test-store capture.")}
      </p>
    </section>
  );
}

export function CommerceReliability() {
  const t = useTranslation();
  return (
    <section className="commerce-reliability" id="reliability">
      <div className="commerce-reliability-heading">
        <span className="case-kicker">
          {t("04 / WHAT MAKES IT DIFFERENT")}
        </span>
        <h2>
          {t("The details you don’t see.")}
          <br />
          <em>
            {t("The difference you feel.")}
          </em>
        </h2>
        <p>
          {t("A convincing store needs more than a cart button. These decisions connect the shopping experience to dependable store operations.")}
        </p>
      </div>
      <div className="commerce-differences">
        <article>
          <Fingerprint size={22} aria-hidden />
          <h3>
            {t("Find a size you can actually buy.")}
          </h3>
          <p>
            {t("Size, price, and stock filters must match the same variant. A sold-out cheap size cannot make an unavailable option look like a match.")}
          </p>
          <span>
            {t("VARIANT-AWARE DISCOVERY")}
          </span>
        </article>
        <article>
          <ShieldCheck size={22} aria-hidden />
          <h3>
            {t("A retry should not become a second order.")}
          </h3>
          <p>
            {t("Checkout rechecks prices and stock, reserves inventory, and records the order together. Accepted retries return the original order.")}
          </p>
          <span>
            {t("ATOMIC, IDEMPOTENT CHECKOUT")}
          </span>
        </article>
        <article>
          <ReceiptText size={22} aria-hidden />
          <h3>
            {t("Yesterday’s order keeps yesterday’s price.")}
          </h3>
          <p>
            {t("Order snapshots preserve the purchased items, prices, address, shipping, and totals even when the catalog changes later.")}
          </p>
          <span>
            {t("HISTORICAL ORDER SNAPSHOTS")}
          </span>
        </article>
        <article>
          <Store size={22} aria-hidden />
          <h3>
            {t("Vietnamese commerce from the start.")}
          </h3>
          <p>
            {t("VND amounts, Vietnamese delivery addresses, guest or account checkout, and VietQR instructions fit the store’s local workflow.")}
          </p>
          <span>
            {t("LOCAL SHOPPING CONTEXT")}
          </span>
        </article>
      </div>
      <div
        className="commerce-order-path"
        aria-label={t("Checkout reservation lifecycle")}
      >
        <span>
          <b>01</b> {t("Recheck price & stock")}
        </span>
        <ArrowUpRight size={17} aria-hidden />
        <span>
          <b>02</b> {t("Reserve for 10 minutes")}
        </span>
        <ArrowUpRight size={17} aria-hidden />
        <span>
          <b>03</b> {t("Settle or release stock")}
        </span>
      </div>
    </section>
  );
}

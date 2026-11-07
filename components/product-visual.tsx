import {
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  LayoutGrid,
  Package,
  Search,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { Feature, Project } from "../lib/project-model";

function Chart() {
  return (
    <svg
      className="mock-chart"
      viewBox="0 0 500 140"
      role="img"
      aria-label="Illustrative portfolio performance chart"
    >
      <defs>
        <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a5e8c9" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#a5e8c9" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[30, 70, 110].map((y) => (
        <path key={y} d={`M0 ${y}H500`} stroke="currentColor" opacity="0.08" />
      ))}
      <path
        d="M0 120 20 115 40 119 65 92 90 102 120 78 145 88 170 66 195 75 220 45 245 59 268 49 292 69 315 38 340 45 365 20 390 32 420 12 445 24 470 7 500 13V140H0Z"
        fill="url(#chart-fill)"
      />
      <path
        d="M0 120 20 115 40 119 65 92 90 102 120 78 145 88 170 66 195 75 220 45 245 59 268 49 292 69 315 38 340 45 365 20 390 32 420 12 445 24 470 7 500 13"
        stroke="#a5e8c9"
        strokeWidth="2.5"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CryptoVisual({ visual }: { visual: Feature["visual"] }) {
  return (
    <div className="product-window crypto-window">
      <div className="window-toolbar">
        <div className="window-dots">
          <i />
          <i />
          <i />
        </div>
        <span>cryptofolio / workspace</span>
        <span className="tiny-pill">DEMO</span>
      </div>
      <div className="crypto-content">
        <div className="mock-nav">
          <strong>
            <span className="crypto-logo">c</span> Cryptofolio
          </strong>
          <span>
            <LayoutGrid size={14} /> Overview
          </span>
          <Wallet size={16} />
          <Bell size={16} />
        </div>
        {visual === "analysis" ? (
          <>
            <div className="mock-heading">
              <div>
                <small>UNDERSTAND YOUR EXPOSURE</small>
                <h3>Portfolio insights</h3>
              </div>
              <Sparkles size={22} />
            </div>
            <div className="insight-score">
              <div className="score-ring">
                62<small>/ 100</small>
              </div>
              <div>
                <span className="tiny-pill">ILLUSTRATIVE ASSESSMENT</span>
                <h4>A closer look at your allocation.</h4>
                <p>
                  A structured view of concentration,
                  <br />
                  exposure, and asset performance.
                </p>
              </div>
            </div>
            <div className="insight-row">
              <span>Concentration</span>
              <div>
                <i style={{ width: "68%" }} />
              </div>
              <span>High</span>
            </div>
            <div className="insight-row">
              <span>Diversification</span>
              <div>
                <i style={{ width: "44%" }} />
              </div>
              <span>Moderate</span>
            </div>
          </>
        ) : visual === "alerts" ? (
          <>
            <div className="mock-heading">
              <div>
                <small>STAY IN THE LOOP</small>
                <h3>Your market, on watch.</h3>
              </div>
              <Bell size={22} />
            </div>
            <div className="alert-demo">
              <div className="alert-demo-icon">
                <Bell size={24} />
              </div>
              <div>
                <strong>BTC price alert</strong>
                <p>Notify when Bitcoin crosses $70,000</p>
              </div>
              <span className="tiny-pill">Watching</span>
            </div>
            <div className="telegram-demo">
              <Check size={18} />
              <div>
                <strong>Telegram connected</strong>
                <p>Market notifications, delivered to your chat.</p>
              </div>
            </div>
            <div className="mock-disclaimer">
              An illustrative alert. No live monitoring is running here.
            </div>
          </>
        ) : (
          <>
            <div className="mock-heading">
              <div>
                <small>TOTAL PORTFOLIO VALUE</small>
                <h3>
                  $48,256<span>.90</span>
                </h3>
                <p className="gain">
                  ↗ +$2,184.32 <span>this month</span>
                </p>
              </div>
              <span className="mock-period">
                This month <ChevronDown size={12} />
              </span>
            </div>
            <Chart />
            <div className="mock-axis">
              <span>01 NOV</span>
              <span>07 NOV</span>
              <span>14 NOV</span>
              <span>21 NOV</span>
            </div>
            <div className="asset-list">
              {[
                ["B", "Bitcoin", "BTC", "$25,093.59", "52%"],
                ["E", "Ethereum", "ETH", "$14,959.64", "31%"],
                ["S", "Solana", "SOL", "$8,203.67", "17%"],
              ].map((asset, i) => (
                <div key={asset[1]}>
                  <b className={`coin coin-${i}`}>{asset[0]}</b>
                  <strong>
                    {asset[1]} <small>{asset[2]}</small>
                  </strong>
                  <span>{asset[3]}</span>
                  <span className="asset-percent">{asset[4]}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CommerceVisual({ visual }: { visual: Feature["visual"] }) {
  return (
    <div className="product-window commerce-window">
      <div className="window-toolbar">
        <div className="window-dots">
          <i />
          <i />
          <i />
        </div>
        <span>
          commerce / {visual === "operations" ? "store admin" : "storefront"}
        </span>
        <span className="tiny-pill">DEMO</span>
      </div>
      <div className="commerce-content">
        <div className="shop-nav">
          <strong>
            mộc<span>®</span>
          </strong>
          <span>Everyday, thoughtfully.</span>
          <ShoppingBag size={16} />
        </div>
        {visual === "checkout" ? (
          <div className="checkout-demo">
            <div>
              <small>01 / YOUR DETAILS</small>
              <h3>Almost yours.</h3>
              <div className="fake-input">
                Full name <span>Nguyễn An</span>
              </div>
              <div className="fake-input">
                Delivery address <span>Ho Chi Minh City</span>
              </div>
              <div className="fake-input">
                Payment <span>VietQR bank transfer</span>
              </div>
            </div>
            <div className="order-summary">
              <div className="vase vase-small" />
              <strong>Everyday vase</strong>
              <span>490.000 ₫</span>
              <hr />
              <span>
                Shipping <b>30.000 ₫</b>
              </span>
              <strong>
                Total <b>520.000 ₫</b>
              </strong>
              <span className="fake-button">
                Order summary <Check size={14} />
              </span>
            </div>
          </div>
        ) : visual === "operations" ? (
          <>
            <div className="mock-heading">
              <div>
                <small>YOUR STORE AT A GLANCE</small>
                <h3>Room to grow.</h3>
              </div>
              <Package size={24} />
            </div>
            <div className="ops-stats">
              <div>
                <small>PRODUCTS</small>
                <strong>24</strong>
              </div>
              <div>
                <small>OPEN ORDERS</small>
                <strong>08</strong>
              </div>
              <div>
                <small>STOCK ALERTS</small>
                <strong>03</strong>
              </div>
            </div>
            <div className="ops-row">
              <span>ORDER</span>
              <span>ITEMS</span>
              <span>STATUS</span>
            </div>
            {[
              ["#ORD-108", "2 items", "Reserved"],
              ["#ORD-107", "1 item", "Confirmed"],
              ["#ORD-106", "3 items", "Fulfilled"],
            ].map((row) => (
              <div className="ops-row" key={row[0]}>
                <strong>{row[0]}</strong>
                <span>{row[1]}</span>
                <span className="tiny-pill">{row[2]}</span>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="shop-hero">
              <div>
                <span className="shop-kicker">OBJECTS FOR SLOW LIVING</span>
                <h3>
                  A little less.
                  <br />A little better.
                </h3>
                <p>Thoughtful pieces for your everyday.</p>
                <span className="shop-discover">
                  Discover the collection <ArrowUpRight size={14} />
                </span>
              </div>
              <div className="still-life">
                <div className="still-life-disc" />
                <div className="vase" />
                <div className="vase vase-two" />
                <div className="still-life-base" />
              </div>
            </div>
            <div className="shop-bottom">
              <span>Made for the everyday.</span>
              <span>Considered design. Lasting character.</span>
              <Search size={15} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function ProductVisual({
  project,
  visual,
  compact = false,
}: {
  project: Project;
  visual?: Feature["visual"];
  compact?: boolean;
}) {
  const selected = visual || project.features[0]?.visual || "generic";
  return (
    <div
      className={`product-stage accent-${project.accent} ${compact ? "compact" : ""}`}
    >
      {project.coverUrl && !visual ? (
        <img
          className="project-cover"
          src={project.coverUrl}
          alt={`${project.title} project preview`}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : ["overview", "analysis", "alerts"].includes(selected) ? (
        <CryptoVisual visual={selected} />
      ) : ["storefront", "checkout", "operations"].includes(selected) ? (
        <CommerceVisual visual={selected} />
      ) : (
        <div className="generic-preview">
          <span className="generic-symbol">{project.title.charAt(0)}</span>
          <h3>{project.title}</h3>
          <p>{project.tagline}</p>
          <span className="eyebrow">
            {project.stack.slice(0, 3).join(" / ")}
          </span>
        </div>
      )}
      <span className="stage-caption">
        {project.coverUrl && !visual
          ? "PROJECT PREVIEW"
          : "ILLUSTRATIVE PRODUCT PREVIEW"}
      </span>
    </div>
  );
}

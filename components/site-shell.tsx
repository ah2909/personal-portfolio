import Link from "next/link";
import { ArrowUpRight, Asterisk, ArrowUp } from "lucide-react";
import { profile } from "../lib/profile";

export function Header({
  admin = false,
  projectCount,
}: {
  admin?: boolean;
  projectCount?: number;
}) {
  return (
    <header className="site-header wrap">
      <Link href="/" className="wordmark" aria-label={`${profile.name} home`}>
        h<span className="brand-dot">.</span>
        <span className="wordmark-label">
          {profile.name.toUpperCase()}
          <br />
          PERSONAL PROJECT LAB
        </span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/#work">
          Selected work{" "}
          {projectCount !== undefined && (
            <span className="nav-index">
              {String(projectCount).padStart(2, "0")}
            </span>
          )}
        </Link>
        <Link href="/#about">About</Link>
        <Link
          className="nav-contact"
          href={admin ? "/" : `mailto:${profile.email}`}
        >
          {admin ? "View portfolio" : "Let’s connect"}
          <ArrowUpRight size={16} aria-hidden />
        </Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer wrap" id="connect">
      <div className="footer-top">
        <div>
          <span className="eyebrow">ALWAYS BUILDING SOMETHING</span>
          <h2>
            Good ideas deserve
            <br />
            to become <em>real things.</em>
          </h2>
          <div className="footer-contact">
            <a className="text-link" href={`mailto:${profile.email}`}>
              Let’s talk <ArrowUpRight size={16} aria-hidden />
            </a>
            <a
              className="text-link"
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ArrowUpRight size={16} aria-hidden />
            </a>
          </div>
        </div>
        <Asterisk className="footer-star" strokeWidth={1} aria-hidden />
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {profile.name} · Built with curiosity.
        </span>
        <div>
          <Link href="/admin">
            Project admin <ArrowUpRight size={14} aria-hidden />
          </Link>
          <a href="#top">
            Back to top <ArrowUp size={14} aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Header } from "../components/site-shell";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="wrap error-page">
        <span className="eyebrow">404 / A SMALL DETOUR</span>
        <h1>
          Nothing built
          <br />
          here. Yet.
        </h1>
        <p>This project may be a draft, removed, or at another address.</p>
        <Link className="button button-dark" href="/#work">
          Back to the projects
        </Link>
      </main>
    </>
  );
}

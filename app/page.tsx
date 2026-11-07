import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Asterisk,
  Braces,
  Layers3,
  Radio,
} from "lucide-react";
import { Header, Footer } from "../components/site-shell";
import { Sculpture } from "../components/sculpture";
import { ProjectGallery } from "../components/project-gallery";
import { listProjects } from "../lib/projects";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await listProjects();
  return (
    <div id="top">
      <Header projectCount={projects.length} />
      <main id="main">
        <section className="hero wrap">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow">
              <span className="status-dot" /> A PERSONAL SPACE FOR THINGS I
              BUILD
            </div>
            <h1>
              Ideas,
              <br />
              <span>made real</span>
              <span className="hero-period">.</span>
            </h1>
            <p className="hero-description">
              I’m Huân. I turn curiosity into digital products —
              <br className="desktop-only" /> thoughtful interfaces, connected
              systems,
              <br className="desktop-only" /> and the little details that make
              them work.
            </p>
            <a className="button button-dark" href="#work">
              Explore my projects <ArrowDown size={17} aria-hidden />
            </a>
            <div className="hero-signature">
              <span className="signature-line" />
              <span>
                FULL-STACK DEVELOPMENT
                <br />
                WITH A CURIOUS MIND.
              </span>
            </div>
          </div>
          <div className="hero-art">
            <Sculpture />
            <span className="hero-art-caption">
              <Asterisk size={16} aria-hidden /> A LITTLE PLAY. A LOT OF
              POSSIBILITY.
            </span>
          </div>
          <div className="hero-bottom">
            <span>INDEPENDENT PROJECTS · {new Date().getFullYear()}</span>
            <a href="#work">
              SCROLL TO DISCOVER <ArrowDown size={14} aria-hidden />
            </a>
          </div>
        </section>
        <div className="capability-strip">
          <div className="wrap">
            <span>FROM INTERFACE TO INFRASTRUCTURE</span>
            <b>
              <Braces size={17} aria-hidden /> Full-stack products
            </b>
            <i />
            <b>
              <Radio size={17} aria-hidden /> Real-time experiences
            </b>
            <i />
            <b>
              <Layers3 size={17} aria-hidden /> Thoughtful systems
            </b>
            <Asterisk size={21} aria-hidden />
          </div>
        </div>
        <ProjectGallery projects={projects} />
        <section className="about-section wrap" id="about">
          <div className="about-label">
            <span className="eyebrow">
              <i className="orange-square" /> A BIT OF CONTEXT
            </span>
            <span className="about-asterisk" aria-hidden>
              ✳
            </span>
          </div>
          <div className="about-body">
            <h2>
              I like building the interface.
              <br />
              And everything <em>behind it.</em>
            </h2>
            <p>
              My projects are a place to explore the whole product: how it feels
              to use, how data moves through it, and what happens when the happy
              path ends.
            </p>
            <p>
              From a crypto workspace to a multi-store commerce platform, this
              is a growing collection of ideas, decisions, and working software.
            </p>
            <div className="about-facts">
              <span>
                <b>01</b> Make it useful.
              </span>
              <span>
                <b>02</b> Think it through.
              </span>
              <span>
                <b>03</b> Keep exploring.
              </span>
            </div>
            {projects[0] && (
              <Link
                className="text-link"
                href={`/projects/${projects[0].slug}`}
              >
                Start with {projects[0].title}{" "}
                <ArrowUpRight size={16} aria-hidden />
              </Link>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

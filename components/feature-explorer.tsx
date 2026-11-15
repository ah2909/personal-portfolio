"use client";

import { useTranslation } from "./language-provider";

import { useId, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "../lib/project-model";
import { getFeatureCapture } from "../lib/project-media";
import { ProductVisual } from "./product-visual";
import { ProjectCapture } from "./project-capture";

export function FeatureExplorer({ project }: { project: Project; }) {
  const t = useTranslation();
  const [active, setActive] = useState(0);
  const id = useId();
  const feature =
    project.features[Math.min(active, project.features.length - 1)];
  const capture = getFeatureCapture(project.slug, feature.visual);
  return (
    <section className="feature-section case-features" id="features">
      <div className="case-section-title">
        <div>
          <span className="case-kicker">
            {project.slug === "e-commerce"
              ? t("03 / FOR THE SHOPPER")
              : t("02 / THE EXPERIENCE")}
          </span>
          <h2>
            {project.slug === "e-commerce"
              ? t("Give people a reason")
              : t("A closer look.")}
            <br />
            <span>
              {project.slug === "e-commerce"
                ? t("to keep exploring.")
                : t("One feature at a time.")}
            </span>
          </h2>
        </div>
        <p>
          {project.slug === "cryptofolio"
            ? t("Explore actual screens from the running app.\nSelect a feature, then enlarge the view.")
            : project.slug === "e-commerce"
              ? t("From finding the right size to following an order.\nExplore retained screenshots from local app checks.")
              : t("Explore the product’s core workflows.\nThese interface previews use illustrative data.")}
        </p>
      </div>
      <div className="case-feature-layout">
        <div className="case-feature-sidebar">
          <div
            className="case-feature-tabs"
            role="tablist"
            aria-label={t("Project features")}
            aria-orientation="vertical"
          >
            {project.features.map((item, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                id={`${id}-tab-${index}`}
                aria-selected={active === index}
                aria-controls={`${id}-panel`}
                tabIndex={active === index ? 0 : -1}
                className={`case-feature-tab ${active === index ? "active" : ""}`}
                onClick={() => setActive(index)}
                onKeyDown={(event) => {
                  const keys = [
                    "ArrowDown",
                    "ArrowRight",
                    "ArrowUp",
                    "ArrowLeft",
                    "Home",
                    "End",
                  ];
                  if (!keys.includes(event.key)) return;
                  event.preventDefault();
                  const next =
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? project.features.length - 1
                        : (index +
                          (["ArrowDown", "ArrowRight"].includes(event.key)
                            ? 1
                            : -1) +
                          project.features.length) %
                        project.features.length;
                  setActive(next);
                  document.getElementById(`${id}-tab-${next}`)?.focus();
                }}
              >
                <span>{String(index + 1).padStart(2, "0")}
                </span>
                <h3>
                  {t(item.title)}
                </h3>
                <ArrowUpRight size={19} aria-hidden />
              </button>
            ))}
          </div>
          <div className="case-feature-description" aria-live="polite">
            <span className="case-kicker">
              {t("WHAT IT DOES")}
            </span>
            <p>
              {t(feature.description)}
            </p>
            <span className="capture-type-label">
              <span />
              {capture ? t("CAPTURED FROM THE APP") : t("ILLUSTRATIVE INTERFACE")}
            </span>
          </div>
        </div>
        <div
          className="case-feature-panel"
          role="tabpanel"
          id={`${id}-panel`}
          aria-labelledby={`${id}-tab-${active}`}
          tabIndex={0}
        >
          {capture ? (
            <ProjectCapture capture={capture} />
          ) : (
            <ProductVisual project={project} visual={feature.visual} />
          )}
        </div>
      </div>
    </section>
  );
}

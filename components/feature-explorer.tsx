"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Project } from "../lib/project-model";
import { ProductVisual } from "./product-visual";

export function FeatureExplorer({ project }: { project: Project }) {
  const [active, setActive] = useState(0);
  return (
    <section className="feature-section" id="features">
      <div className="section-heading">
        <div>
          <span className="eyebrow">THE EXPERIENCE</span>
          <h2>
            Get to know
            <br />
            <span>what’s inside.</span>
          </h2>
        </div>
        <p>
          Select a feature to explore the experience.
          <br />
          Previews are illustrative, with sample data.
        </p>
      </div>
      <div className="feature-layout">
        <div
          className="feature-options"
          role="tablist"
          aria-label="Project features"
        >
          {project.features.map((feature, index) => (
            <button
              className={`feature-option ${active === index ? "active" : ""}`}
              key={index}
              type="button"
              role="tab"
              id={`feature-tab-${index}`}
              aria-selected={active === index}
              aria-controls="feature-preview"
              tabIndex={active === index ? 0 : -1}
              onKeyDown={(event) => {
                if (
                  [
                    "ArrowDown",
                    "ArrowRight",
                    "ArrowUp",
                    "ArrowLeft",
                    "Home",
                    "End",
                  ].includes(event.key)
                ) {
                  event.preventDefault();
                  const next =
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? project.features.length - 1
                        : (active +
                            (["ArrowDown", "ArrowRight"].includes(event.key)
                              ? 1
                              : -1) +
                            project.features.length) %
                          project.features.length;
                  setActive(next);
                  document.getElementById(`feature-tab-${next}`)?.focus();
                }
              }}
              onClick={() => setActive(index)}
            >
              <span className="feature-number">0{index + 1}</span>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
              <ArrowRight size={18} aria-hidden />
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          id="feature-preview"
          aria-labelledby={`feature-tab-${active}`}
          tabIndex={0}
        >
          <ProductVisual
            project={project}
            visual={project.features[active].visual}
          />
        </div>
      </div>
    </section>
  );
}

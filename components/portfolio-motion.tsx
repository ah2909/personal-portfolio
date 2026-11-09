"use client";

import { useEffect } from "react";

export function PortfolioMotion() {
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = document.querySelectorAll<HTMLElement>(
      ".hero-copy > *, .hero-art, .section-heading, .project-card, .about-label, .about-body, .footer-top",
    );
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("reveal-pending");
        entry.target.classList.add("reveal-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    const reset = () => {
      observer.disconnect();
      elements.forEach((element) => {
        element.classList.remove("reveal-pending", "reveal-visible");
        if (!motion.matches) {
          element.classList.add("reveal-pending");
          observer.observe(element);
        }
      });
    };
    reset();
    motion.addEventListener("change", reset);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", reset);
      elements.forEach((element) => element.classList.remove("reveal-pending", "reveal-visible"));
    };
  }, []);

  return null;
}

"use client";

import { useTranslation } from "./language-provider";

import { useRef } from "react";
import { Expand, X, ArrowUpRight } from "lucide-react";
import type { ProjectCapture as Capture } from "../lib/project-media";

export function ProjectCapture({
  capture,
  priority = false,
  framed = true,
  className = "",
}: {
  capture: Capture;
  priority?: boolean;
  framed?: boolean;
  className?: string;
}) {
  const t = useTranslation();
  const dialog = useRef<HTMLDialogElement>(null);
  const image = (
    <img
      src={capture.src}
      alt={t(capture.alt)}
      width={capture.width}
      height={capture.height}
      style={{ aspectRatio: `${capture.width} / ${capture.height}` }}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  );
  return (
    <figure
      className={`capture-figure ${capture.device === "mobile" ? "is-mobile" : "is-desktop"} ${className}`}
    >
      <button
        type="button"
        className={`capture-open ${framed ? "is-framed" : ""}`}
        onClick={() => dialog.current?.showModal()}
        aria-label={`${t("Enlarge screenshot")}: ${t(capture.alt)}`}
      >
        {framed && capture.device === "desktop" && (
          <span className="capture-browser">
            <span className="capture-browser-dots">
              <i />
              <i />
              <i />
            </span>
            <span>
              {capture.src.includes("/e-commerce/")
                ? "E-Commerce"
                : "Cryptofolio"}{" "}
              <span className="capture-browser-divider">/</span> {t("Product view")}
            </span>
            <ArrowUpRight size={12} aria-hidden />
          </span>
        )}
        {image}
        <span className="capture-expand">
          <Expand size={15} aria-hidden />
          <span>
            {t("Take a closer look")}
          </span>
        </span>
      </button>
      <figcaption>
        <span className="capture-live-dot" />
        {t(capture.caption)}
      </figcaption>
      <dialog
        ref={dialog}
        className="capture-dialog"
        aria-label={t(capture.alt)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="capture-dialog-toolbar">
          <span>
            {t(capture.caption)}
          </span>
          <button
            type="button"
            className="icon-button"
            onClick={() => dialog.current?.close()}
            aria-label={t("Close screenshot")}
          >
            <X size={21} />
          </button>
        </div>
        <div className="capture-dialog-image">
          <img
            src={capture.src}
            alt={t(capture.alt)}
            width={capture.width}
            height={capture.height}
            loading="lazy"
          />
        </div>
      </dialog>
    </figure>
  );
}

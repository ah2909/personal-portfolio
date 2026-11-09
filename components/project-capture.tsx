"use client";

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
  const dialog = useRef<HTMLDialogElement>(null);
  const image = (
    <img
      src={capture.src}
      alt={capture.alt}
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
        aria-label={`Enlarge screenshot: ${capture.alt}`}
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
              <span className="capture-browser-divider">/</span> Product view
            </span>
            <ArrowUpRight size={12} aria-hidden />
          </span>
        )}
        {image}
        <span className="capture-expand">
          <Expand size={15} aria-hidden />
          <span>Take a closer look</span>
        </span>
      </button>
      <figcaption>
        <span className="capture-live-dot" />
        {capture.caption}
      </figcaption>
      <dialog
        ref={dialog}
        className="capture-dialog"
        aria-label={capture.alt}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="capture-dialog-toolbar">
          <span>{capture.caption}</span>
          <button
            type="button"
            className="icon-button"
            onClick={() => dialog.current?.close()}
            aria-label="Close screenshot"
          >
            <X size={21} />
          </button>
        </div>
        <div className="capture-dialog-image">
          <img
            src={capture.src}
            alt={capture.alt}
            width={capture.width}
            height={capture.height}
            loading="lazy"
          />
        </div>
      </dialog>
    </figure>
  );
}

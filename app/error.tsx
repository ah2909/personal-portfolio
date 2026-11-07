"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="wrap error-page">
      <span className="eyebrow">A SMALL INTERRUPTION</span>
      <h1>
        Let’s try
        <br />
        that again.
      </h1>
      <p>
        The project collection could not be loaded. Your saved work is
        unchanged.
      </p>
      <button type="button" className="button button-dark" onClick={reset}>
        Try again
      </button>
    </main>
  );
}

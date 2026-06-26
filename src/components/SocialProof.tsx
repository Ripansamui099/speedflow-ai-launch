export function SocialProof() {
  const logos = ["NORTHWIND", "ACME/CO", "STELLAR", "QUANTA", "VERTEX", "MERIDIAN"];
  const quotes = [
    {
      q: "We replaced four orchestration tools and a sentiment pipeline in two sprints. Latency dropped 62%.",
      who: "Asha P.",
      role: "Staff Eng, Stellar Cloud",
    },
    {
      q: "The lineage view alone justified the migration. We pass audit prep in hours, not weeks.",
      who: "Marcus L.",
      role: "Head of Data, Northwind",
    },
    {
      q: "Compute spend is finally predictable. The cost governor caught a runaway agent before billing did.",
      who: "Priya R.",
      role: "Platform Lead, Quanta",
    },
  ];
  return (
    <section id="customers" className="relative px-6 py-24 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <p className="rise rise-1 font-display text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] text-center">
          Trusted by teams shipping at the edge of latency
        </p>
        <div className="rise rise-2 mt-8 grid grid-cols-2 md:grid-cols-6 gap-6 items-center opacity-80">
          {logos.map((l) => (
            <span
              key={l}
              className="font-display text-sm md:text-base font-bold tracking-widest text-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors duration-150"
            >
              {l}
            </span>
          ))}
        </div>

        <div className="mt-20 flex items-center justify-between">
          <h3 className="font-display text-2xl font-bold">What developers are saying</h3>
          <div className="flex gap-2">
            <button
              className="grid place-items-center h-8 w-8 rounded-full border border-border hover:border-[var(--forsythia)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors duration-150 cursor-pointer"
              aria-label="Previous testimonial"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className="grid place-items-center h-8 w-8 rounded-full border border-border hover:border-[var(--forsythia)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors duration-150 cursor-pointer"
              aria-label="Next testimonial"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="m8.25 4.5l7.5 7.5l-7.5 7.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-5">
          {quotes.map((qt, i) => (
            <figure
              key={qt.who}
              className={`rise rise-${i + 2} rounded-2xl border border-border bg-[var(--card)] p-7 hover-lift`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="text-[var(--forsythia)]"
                fill="currentColor"
                aria-hidden
              >
                <path d="M9 7H4v6h3c0 2-1 3-3 3v3c4 0 6-2 6-7V7zm11 0h-5v6h3c0 2-1 3-3 3v3c4 0 6-2 6-7V7z" />
              </svg>
              <blockquote className="mt-4 text-lg leading-snug">{qt.q}</blockquote>
              <figcaption className="mt-6 font-display text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
                {qt.who} — <span className="text-[var(--foreground)]">{qt.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-border pt-12">
          {[
            ["98.99%", "Multi-region SLA"],
            ["42ms", "p50 inference"],
            ["240+", "Native connectors"],
            ["$0.0008", "Per 1k events"],
          ].map(([num, label], i) => (
            <div key={label} className={`rise rise-${i + 1}`}>
              <div className="font-display text-3xl md:text-4xl font-bold text-[var(--forsythia)] tabular-nums">
                {num}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { DataPlane3D } from "./DataPlane3D";
import { BrainCore3D } from "./BrainCore3D";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-24 md:pt-44 md:pb-32 grid-noise">
      {/* Backdrop 3D data plane mesh & glow */}
      <DataPlane3D />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(closest-side, #FFC801, transparent)" }}
        />
        <div
          className="absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(closest-side, #FF9932, transparent)" }}
        />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="rise rise-1 inline-flex items-center gap-2 rounded-full border border-border bg-[var(--card)] px-3 py-1.5 text-xs font-display w-fit">
              <span className="grid place-items-center h-1.5 w-1.5 rounded-full bg-[var(--forsythia)] animate-[pulseDot_2s_infinite]" />
              <span className="uppercase tracking-wider">v4.0 — Edge runtime now GA</span>
            </div>

            <h1 className="rise rise-2 mt-6 font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] max-w-5xl">
              The data plane <span className="text-[var(--forsythia)]">that thinks</span> before it
              ships.
            </h1>

            <p className="rise rise-3 mt-7 max-w-2xl text-base md:text-lg text-[var(--muted-foreground)] leading-relaxed">
              Mesh is an AI-native automation platform that ingests, reasons over, and routes your
              data with sub-100ms decisions — without a single line of orchestration code.
            </p>

            <div className="rise rise-4 mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#pricing"
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--forsythia)] px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-[var(--noir)] hover-lift hover:bg-[var(--saffron)]"
              >
                Deploy free tier
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transition-transform duration-150 group-hover:translate-x-0.5"
                >
                  <path
                    d="m8.25 4.5l7.5 7.5l-7.5 7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 font-display text-sm font-medium uppercase tracking-wider hover:border-[var(--forsythia)] hover:text-[var(--forsythia)] transition-colors duration-150"
              >
                See architecture
              </a>
            </div>

            <div className="rise rise-4 mt-3 text-xs text-[var(--muted-foreground)]">
              No card · 10k free events · Cancel anytime
            </div>
          </div>

          {/* Interactive 3D WebGL Neural Network Brain Core */}
          <div className="rise rise-3 lg:col-span-5 h-[380px] md:h-[450px] relative w-full flex items-center justify-center">
            <BrainCore3D />
          </div>
        </div>

        {/* Schematic card */}
        <div className="rise rise-4 mt-16 relative rounded-3xl border border-border bg-[var(--card)] p-2 ring-soft">
          <div className="rounded-2xl border border-border bg-[var(--noir)] p-6 md:p-10 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--saffron)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--forsythia)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--mint)]" />
              </div>
              <span className="font-display text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
                ~/pipelines/checkout-fraud.mesh
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "INGEST", val: "stripe.events" },
                { label: "ENRICH", val: "geo + device" },
                { label: "REASON", val: "fraud-llm-v3" },
                { label: "ROUTE", val: "→ block | ✓ accept" },
              ].map((step, i) => (
                <div
                  key={step.label}
                  className="relative rounded-xl border border-border bg-[var(--card)] p-4"
                >
                  <div className="font-display text-[10px] uppercase tracking-wider text-[var(--forsythia)]">
                    {step.label}
                  </div>
                  <div className="mt-2 font-display text-sm font-medium truncate">{step.val}</div>
                  {i < 3 && (
                    <svg
                      className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M2 6H10M10 6L7 3M10 6L7 9"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between text-xs font-display text-[var(--muted-foreground)]">
              <span>p50 · 42ms</span>
              <span className="hidden md:inline">throughput · 12,488 ev/s</span>
              <span className="text-[var(--forsythia)]">● live</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

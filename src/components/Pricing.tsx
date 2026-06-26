import { useEffect, useRef } from "react";

// Multi-dimensional pricing matrix — single source of truth.
// final = baseRate * regionalTariff * (cycle === 'annual' ? 12 * 0.8 : 1)
type Tier = {
  id: string;
  name: string;
  base: number;
  blurb: string;
  features: string[];
  featured?: boolean;
};
const TIERS: Tier[] = [
  {
    id: "starter",
    name: "Starter",
    base: 19,
    blurb: "For builders shipping their first pipelines.",
    features: ["10K events / mo", "3 workspaces", "Community models", "Email support"],
  },
  {
    id: "scale",
    name: "Scale",
    base: 49,
    blurb: "Production automations with isolated runtimes.",
    features: [
      "2M events / mo",
      "Unlimited workspaces",
      "Custom models",
      "Priority SLA",
      "Audit log",
    ],
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    base: 149,
    blurb: "Compliance, residency, dedicated capacity.",
    features: [
      "Unlimited events",
      "VPC peering",
      "SOC2 + HIPAA",
      "Dedicated CSM",
      "On-prem option",
    ],
  },
];

const CURRENCIES = {
  USD: { symbol: "$", tariff: 1.0, locale: "en-US" },
  EUR: { symbol: "€", tariff: 0.93, locale: "de-DE" },
  INR: { symbol: "₹", tariff: 83.5, locale: "en-IN" },
} as const;
type CurrencyCode = keyof typeof CURRENCIES;
type Cycle = "monthly" | "annual";

const ANNUAL_DISCOUNT = 0.2;

function compute(base: number, currency: CurrencyCode, cycle: Cycle) {
  const { tariff } = CURRENCIES[currency];
  const monthly = base * tariff;
  if (cycle === "annual") {
    return monthly * 12 * (1 - ANNUAL_DISCOUNT);
  }
  return monthly;
}

function format(amount: number, currency: CurrencyCode) {
  const { symbol, locale } = CURRENCIES[currency];
  const rounded = amount >= 100 ? Math.round(amount) : Math.round(amount * 100) / 100;
  return `${symbol}${rounded.toLocaleString(locale, { maximumFractionDigits: rounded >= 100 ? 0 : 2 })}`;
}

/**
 * Pricing — ZERO React re-render on currency/cycle change.
 * State lives in refs. We mutate textContent of price + suffix nodes only.
 */
export function Pricing() {
  // refs to each tier's price + suffix node
  const priceRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const suffixRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const currencyRef = useRef<CurrencyCode>("USD");
  const cycleRef = useRef<Cycle>("monthly");
  const toggleTrackRef = useRef<HTMLDivElement | null>(null);
  const saveBadgeRef = useRef<HTMLSpanElement | null>(null);

  const repaintPrices = () => {
    const cur = currencyRef.current;
    const cyc = cycleRef.current;
    for (const tier of TIERS) {
      const priceEl = priceRefs.current[tier.id];
      const suffixEl = suffixRefs.current[tier.id];
      if (priceEl) priceEl.textContent = format(compute(tier.base, cur, cyc), cur);
      if (suffixEl) suffixEl.textContent = cyc === "annual" ? "/year" : "/month";
    }
    if (saveBadgeRef.current) {
      saveBadgeRef.current.style.opacity = cyc === "annual" ? "1" : "0";
    }
    if (toggleTrackRef.current) {
      toggleTrackRef.current.dataset.cycle = cyc;
      const buttons = toggleTrackRef.current.querySelectorAll("button");
      buttons.forEach((btn) => {
        const isActive = btn.getAttribute("data-cycle-type") === cyc;
        btn.setAttribute("data-active", String(isActive));
      });
      const slider = toggleTrackRef.current.querySelector<HTMLElement>("[data-slider]");
      if (slider) {
        slider.style.transform = cyc === "annual" ? "translateX(100%)" : "translateX(0%)";
      }
    }
  };

  useEffect(() => {
    repaintPrices();
  }, []);

  const onCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    currencyRef.current = e.target.value as CurrencyCode;
    repaintPrices();
  };

  const setCycle = (c: Cycle) => {
    cycleRef.current = c;
    repaintPrices();
  };

  return (
    <section id="pricing" className="relative px-6 py-24 md:py-32 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <header className="rise rise-1 max-w-2xl mb-12">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-[var(--forsythia)]">
            / 03 — Pricing matrix
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold">
            Priced like infra.
            <br />
            Billed like software.
          </h2>
          <p className="mt-4 text-[var(--muted-foreground)] max-w-lg">
            Three tiers. Three currencies. One annual discount. All computed from a single
            configuration matrix — no hardcoded UI values.
          </p>
        </header>

        {/* Controls — uncontrolled, mutate DOM imperatively */}
        <div className="rise rise-2 flex flex-wrap items-center gap-4 mb-10">
          <div
            ref={toggleTrackRef}
            data-cycle="monthly"
            className="relative inline-flex items-center rounded-full border border-border bg-[var(--card)] p-1"
            role="tablist"
            aria-label="Billing cycle"
          >
            <button
              type="button"
              role="tab"
              data-cycle-type="monthly"
              data-active="true"
              onClick={() => setCycle("monthly")}
              className="relative z-10 px-5 py-2 text-sm font-medium rounded-full cursor-pointer transition-colors duration-150 data-[active=true]:text-[var(--noir)]"
            >
              Monthly
            </button>
            <button
              type="button"
              role="tab"
              data-cycle-type="annual"
              data-active="false"
              onClick={() => setCycle("annual")}
              className="relative z-10 px-5 py-2 text-sm font-medium rounded-full cursor-pointer transition-colors duration-150 data-[active=true]:text-[var(--noir)]"
            >
              Annual
            </button>
            <span
              data-slider
              aria-hidden
              className="absolute top-1 left-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)] rounded-full bg-[var(--forsythia)]"
              style={{
                transition: "transform 180ms cubic-bezier(.2,.7,.2,1)",
                transform: "translateX(0%)",
              }}
            />
          </div>

          <div className="relative">
            <select
              defaultValue="USD"
              onChange={onCurrencyChange}
              aria-label="Currency"
              className="appearance-none rounded-full border border-border bg-[var(--card)] pl-5 pr-10 py-2.5 text-sm font-medium font-display cursor-pointer hover:border-[var(--forsythia)] transition-colors duration-150"
            >
              {Object.keys(CURRENCIES).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted-foreground)]"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="m19.5 8.25l-7.5 7.5l-7.5-7.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <span
            ref={saveBadgeRef}
            className="text-xs font-display uppercase tracking-wider text-[var(--forsythia)]"
            style={{ opacity: 0, transition: "opacity 180ms cubic-bezier(.2,.7,.2,1)" }}
          >
            ↳ Save 20%
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {TIERS.map((tier, i) => (
            <article
              key={tier.id}
              className={`rise rise-${i + 2} group relative flex flex-col rounded-2xl border p-7 hover-lift ring-soft ${
                tier.featured
                  ? "border-[var(--forsythia)] bg-gradient-to-b from-[var(--nocturnal)] to-[var(--card)]"
                  : "border-border bg-[var(--card)]"
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-7 rounded-full bg-[var(--forsythia)] px-3 py-1 text-[10px] font-display font-bold uppercase tracking-wider text-[var(--noir)]">
                  Most picked
                </span>
              )}
              <div className="flex-1 flex flex-col">
                <h3 className="font-display text-xl font-bold">{tier.name}</h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)] min-h-[2.5rem]">
                  {tier.blurb}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span
                    ref={(el) => {
                      priceRefs.current[tier.id] = el;
                    }}
                    className="font-display text-5xl font-bold tracking-tight tabular-nums"
                    aria-live="polite"
                  >
                    {format(compute(tier.base, "USD", "monthly"), "USD")}
                  </span>
                  <span
                    ref={(el) => {
                      suffixRefs.current[tier.id] = el;
                    }}
                    className="text-sm text-[var(--muted-foreground)]"
                  >
                    /month
                  </span>
                </div>
                <ul className="mt-7 space-y-3 text-sm">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        className="mt-0.5 shrink-0 text-[var(--forsythia)]"
                        fill="none"
                      >
                        <path
                          d="M3 8.5L6.5 12L13 4.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className={`mt-8 w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-display font-semibold uppercase tracking-wider transition-colors duration-150 cursor-pointer ${
                  tier.featured
                    ? "bg-[var(--forsythia)] text-[var(--noir)] hover:bg-[var(--saffron)]"
                    : "border border-border hover:border-[var(--forsythia)] hover:text-[var(--forsythia)]"
                }`}
              >
                <span>{tier.id === "enterprise" ? "Talk to sales" : "Start free"}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="m8.25 4.5l7.5 7.5l-7.5 7.5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

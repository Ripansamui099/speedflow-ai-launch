import { useEffect, useRef, useState } from "react";

const NODES = [
  {
    title: "Stream Ingest",
    tag: "01",
    body: "Bi-directional connectors stream raw events from 240+ sources with at-least-once delivery and per-row lineage.",
  },
  {
    title: "Vector Reasoning",
    tag: "02",
    body: "Embeddings + LLM agents reason across structured + unstructured rows. Plug your own models, or use ours.",
  },
  {
    title: "Workflow Compiler",
    tag: "03",
    body: "Drag a graph; we compile it to typed, observable, hot-swappable runtimes deployed at the edge.",
  },
  {
    title: "Audit & Lineage",
    tag: "04",
    body: "Every transform, prompt, and decision is fingerprinted and replayable. SOC2-ready out of the box.",
  },
  {
    title: "Region Failover",
    tag: "05",
    body: "Active-active across three continents with sub-second failover and data residency pinning.",
  },
  {
    title: "Cost Governor",
    tag: "06",
    body: "Token, compute and egress budgets enforced per-workspace with predictive throttling.",
  },
];

const MOBILE_BP = 768;

/**
 * Bento ↔ Accordion with state-context transfer.
 * Zero external UI/animation libs — pure CSS + WAAPI.
 */
export function BentoFeatures() {
  // Single source of truth — index that is "active" (hovered on desktop, or open on mobile).
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  // Remember the last desktop hover, so a resize can transfer it.
  const lastHoverRef = useRef<number | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BP - 1}px)`);
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const nowMobile = "matches" in e ? e.matches : (e as MediaQueryListEvent).matches;
      setIsMobile(nowMobile);
      // Context-lock: transfer hovered desktop node → opened accordion panel on transition into mobile.
      if (nowMobile && lastHoverRef.current !== null) {
        setActiveIndex(lastHoverRef.current);
      }
    };
    onChange(mql);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Desktop handlers
  const handleEnter = (i: number) => {
    if (isMobile) return;
    lastHoverRef.current = i;
    setActiveIndex(i);
  };
  const handleLeave = () => {
    if (isMobile) return;
    setActiveIndex(null);
    // keep lastHoverRef so a resize-while-not-hovering still picks the most recent
  };

  // Mobile handler
  const togglePanel = (i: number) => {
    setActiveIndex((prev) => {
      const next = prev === i ? null : i;
      lastHoverRef.current = next;
      return next;
    });
  };

  return (
    <section id="features" className="relative px-6 py-24 md:py-32 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <header className="rise rise-1 max-w-2xl mb-12">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-[var(--forsythia)]">
            / 02 — Platform surface
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold">
            Six primitives.
            <br />
            Infinite topologies.
          </h2>
          <p className="mt-4 text-[var(--muted-foreground)]">
            Each node is independently observable, replaceable, and billed. Compose pipelines
            without inheriting the whole stack.
          </p>
        </header>

        {/* Desktop: Bento grid */}
        {!isMobile && (
          <div className="grid grid-cols-6 grid-rows-2 gap-4 auto-rows-fr min-h-[520px]">
            {NODES.map((node, i) => {
              // Asymmetric span pattern for visual interest
              const spans = [
                "col-span-3 row-span-2",
                "col-span-3 row-span-1",
                "col-span-2 row-span-1",
                "col-span-1 row-span-1",
                "col-span-2 row-span-1",
                "col-span-3 row-span-1",
              ];
              const isActive = activeIndex === i;
              return (
                <article
                  key={node.title}
                  className={`${spans[i]} rise rise-${(i % 4) + 1} group relative overflow-hidden rounded-2xl border border-border p-6 cursor-pointer ring-soft`}
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={handleLeave}
                  style={{
                    transition:
                      "background-color 180ms ease-out, border-color 180ms ease-out, transform 180ms ease-out",
                    backgroundColor: isActive ? "var(--forsythia)" : "var(--card)",
                    borderColor: isActive ? "var(--forsythia)" : "var(--border)",
                    color: isActive ? "var(--noir)" : "var(--foreground)",
                    transform: isActive ? "translate3d(0,-2px,0)" : "translate3d(0,0,0)",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-display text-xs opacity-60">{node.tag}</span>
                    <NodeGlyph index={i} active={isActive} />
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-bold">{node.title}</h3>
                  <p
                    className="mt-3 text-sm max-w-md leading-relaxed"
                    style={{
                      opacity: isActive ? 1 : 0.7,
                      transition: "opacity 180ms ease-out",
                    }}
                  >
                    {node.body}
                  </p>
                </article>
              );
            })}
          </div>
        )}

        {/* Mobile: Accordion (custom, no libs) */}
        {isMobile && (
          <ul className="rise rise-1 divide-y divide-[color:var(--border)] border-y border-border">
            {NODES.map((node, i) => {
              const open = activeIndex === i;
              return (
                <li key={node.title}>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`panel-${i}`}
                    id={`trigger-${i}`}
                    onClick={() => togglePanel(i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="flex items-center gap-4">
                      <span className="font-display text-xs text-[var(--forsythia)]">
                        {node.tag}
                      </span>
                      <span className="font-display text-lg font-semibold">{node.title}</span>
                    </span>
                    <span
                      aria-hidden
                      className="grid h-8 w-8 place-items-center rounded-full border border-border shrink-0"
                      style={{
                        transition: "transform 200ms ease-out, background-color 200ms ease-out",
                        transform: open ? "rotate(180deg)" : "rotate(0)",
                        backgroundColor: open ? "var(--forsythia)" : "transparent",
                        color: open ? "var(--noir)" : "var(--foreground)",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path
                          d="m19.5 8.25l-7.5 7.5l-7.5-7.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                  <div
                    id={`panel-${i}`}
                    role="region"
                    aria-labelledby={`trigger-${i}`}
                    className="grid layout-reflow"
                    style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p
                        className="pb-6 pr-12 text-sm text-[var(--muted-foreground)] leading-relaxed"
                        style={{ opacity: open ? 1 : 0, transition: "opacity 240ms ease-out" }}
                      >
                        {node.body}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

function NodeGlyph({ index, active }: { index: number; active: boolean }) {
  const stroke = active ? "#172B36" : "#FFC801";
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    strokeWidth: 1.5,
    stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (index % 6) {
    case 0:
      return (
        <svg {...common}>
          <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      );
    case 1:
      return (
        <svg {...common}>
          <path d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93c.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204c.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78c-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107c-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93c-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204c-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78c.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107c.397-.165.71-.505.78-.929l.15-.894Z" />
          <path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z" />
        </svg>
      );
    case 2:
      return (
        <svg width="28" height="28" viewBox="0 0 16 16" fill={stroke}>
          <path d="M8.372 1.349a.75.75 0 0 0-.744 0l-4.81 2.748L8 7.131l5.182-3.034zM14 5.357L8.75 8.43v6.005l4.872-2.784A.75.75 0 0 0 14 11zm-6.75 9.078V8.43L2 5.357V11c0 .27.144.518.378.651z" />
        </svg>
      );
    case 3:
      return (
        <svg {...common}>
          <path d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
        </svg>
      );
    case 4:
      return (
        <svg {...common}>
          <path d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
          <path d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
        </svg>
      );
  }
}

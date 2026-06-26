import { useEffect, useState } from "react";

export function SiteHeader({ onSignInClick }: { onSignInClick?: () => void }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const isLight = document.documentElement.classList.contains("light");
    setTheme(isLight ? "light" : "dark");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[color-mix(in_oklab,var(--noir)_80%,transparent)] border-b border-border">
      <nav
        className="mx-auto max-w-6xl flex items-center justify-between px-6 h-16"
        aria-label="Primary"
      >
        <a href="#" className="flex items-center gap-2 font-display font-bold">
          <svg
            width="24"
            height="24"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="text-[var(--forsythia)]"
            aria-hidden
          >
            <path d="M8.372 1.349a.75.75 0 0 0-.744 0l-4.81 2.748L8 7.131l5.182-3.034zM14 5.357L8.75 8.43v6.005l4.872-2.784A.75.75 0 0 0 14 11zm-6.75 9.078V8.43L2 5.357V11c0 .27.144.518.378.651z" />
          </svg>
          MESH<span className="text-[var(--forsythia)]">/AI</span>
        </a>
        <ul className="hidden md:flex items-center gap-7 text-sm">
          {[
            ["Features", "#features"],
            ["Pricing", "#pricing"],
            ["Customers", "#customers"],
            ["Docs", "#"],
          ].map(([l, h]) => (
            <li key={l}>
              <a
                href={h}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors duration-150"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden lg:flex items-center gap-2 border border-border bg-[var(--noir)] rounded-full px-3 py-1.5 text-xs text-[var(--muted-foreground)] cursor-pointer hover:border-[var(--forsythia)] transition-colors duration-150">
          <svg
            width="12"
            height="12"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="text-[var(--muted-foreground)]"
          >
            <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33l-1.42 1.42l-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
          </svg>
          <span>Search docs...</span>
          <kbd className="bg-[var(--card)] px-1.5 py-0.5 rounded text-[10px] border border-border font-display">
            ⌘K
          </kbd>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="grid h-8 w-8 place-items-center rounded-full border border-border bg-[var(--noir)] text-[var(--muted-foreground)] hover:border-[var(--forsythia)] hover:text-[var(--foreground)] transition-colors duration-150 cursor-pointer"
            aria-label="Toggle visual theme"
          >
            {theme === "dark" ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <button
            onClick={onSignInClick}
            className="rounded-full bg-[var(--forsythia)] px-4 py-2 text-xs font-display font-bold uppercase tracking-wider text-[var(--noir)] hover:bg-[var(--saffron)] transition-colors duration-150 cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="px-6 py-16 border-t border-border">
      <div className="mx-auto max-w-6xl grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display font-bold text-lg">
            <svg
              width="22"
              height="22"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="text-[var(--forsythia)]"
              aria-hidden
            >
              <path d="M8.372 1.349a.75.75 0 0 0-.744 0l-4.81 2.748L8 7.131l5.182-3.034zM14 5.357L8.75 8.43v6.005l4.872-2.784A.75.75 0 0 0 14 11zm-6.75 9.078V8.43L2 5.357V11c0 .27.144.518.378.651z" />
            </svg>
            MESH<span className="text-[var(--forsythia)]">/AI</span>
          </div>
          <p className="mt-4 text-sm text-[var(--muted-foreground)] max-w-sm">
            The AI-native data plane. Built in Bangalore, deployed on three continents.
          </p>
        </div>
        {[
          ["Product", ["Platform", "Pricing", "Changelog", "Status"]],
          ["Company", ["About", "Customers", "Careers", "Press"]],
        ].map(([h, items]) => (
          <div key={h as string}>
            <div className="font-display text-xs uppercase tracking-wider text-[var(--forsythia)]">
              {h}
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {(items as string[]).map((it) => (
                <li key={it}>
                  <a
                    href="#"
                    className="group flex items-center gap-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors duration-150"
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 text-[var(--forsythia)]"
                    >
                      <path
                        d="m8.25 4.5l7.5 7.5l-7.5 7.5"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{it}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-6xl mt-12 pt-6 border-t border-border flex flex-wrap justify-between gap-3 text-xs text-[var(--muted-foreground)] font-display uppercase tracking-wider">
        <span>© 2026 Mesh Systems Inc.</span>
        <span className="flex items-center gap-1.5">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-[var(--forsythia)]"
          >
            <path
              fillRule="evenodd"
              d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037a.75.75 0 0 1-.646 1.353a5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353a5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037a.75.75 0 0 1-.354-1Z"
              clipRule="evenodd"
            />
          </svg>
          SOC2 · HIPAA · GDPR
        </span>
      </div>
    </footer>
  );
}

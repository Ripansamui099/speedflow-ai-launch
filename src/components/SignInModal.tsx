import { useEffect, useState } from "react";
import { toast } from "sonner";

export function SignInModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      toast.error("Please fill in all credentials.");
      return;
    }
    // Simulate premium login success
    toast.success(`Welcome back, ${username}! Sign in successful.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-[color-mix(in_oklab,var(--noir)_60%,transparent)] backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-[var(--card)] p-8 shadow-2xl ring-soft animate-[rise_240ms_cubic-bezier(.2,.7,.2,1)]"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 grid h-8 w-8 place-items-center rounded-full border border-border text-[var(--muted-foreground)] hover:border-[var(--forsythia)] hover:text-[var(--foreground)] transition-colors duration-150 cursor-pointer"
          aria-label="Close dialog"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 18L18 6M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Logo Icon */}
        <div className="flex items-center gap-2 mb-6">
          <svg
            width="28"
            height="28"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="text-[var(--forsythia)]"
          >
            <path d="M8.372 1.349a.75.75 0 0 0-.744 0l-4.81 2.748L8 7.131l5.182-3.034zM14 5.357L8.75 8.43v6.005l4.872-2.784A.75.75 0 0 0 14 11zm-6.75 9.078V8.43L2 5.357V11c0 .27.144.518.378.651z" />
          </svg>
          <span className="font-display font-bold tracking-tight text-lg">
            MESH<span className="text-[var(--forsythia)]">/AI</span>
          </span>
        </div>

        <h2 className="font-display text-2xl font-bold tracking-tight">Access Control</h2>
        <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">
          Provide your workspace credentials to enter the data plane.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-display uppercase tracking-wider text-[var(--muted-foreground)]">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. janesmith"
              className="mt-1.5 w-full rounded-xl border border-border bg-[var(--noir)] px-4 py-3 text-sm font-medium text-[var(--foreground)] placeholder:text-[color-mix(in_oklab,var(--muted-foreground)_40%,transparent)] focus:border-[var(--forsythia)] focus:outline-none transition-colors duration-150"
            />
          </div>

          <div>
            <label className="block text-xs font-display uppercase tracking-wider text-[var(--muted-foreground)]">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@mesh.ai"
              className="mt-1.5 w-full rounded-xl border border-border bg-[var(--noir)] px-4 py-3 text-sm font-medium text-[var(--foreground)] placeholder:text-[color-mix(in_oklab,var(--muted-foreground)_40%,transparent)] focus:border-[var(--forsythia)] focus:outline-none transition-colors duration-150"
            />
          </div>

          <div>
            <label className="block text-xs font-display uppercase tracking-wider text-[var(--muted-foreground)]">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="mt-1.5 w-full rounded-xl border border-border bg-[var(--noir)] px-4 py-3 text-sm font-medium text-[var(--foreground)] placeholder:text-[color-mix(in_oklab,var(--muted-foreground)_40%,transparent)] focus:border-[var(--forsythia)] focus:outline-none transition-colors duration-150"
            />
          </div>

          <button
            type="submit"
            className="mt-8 w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--forsythia)] px-5 py-3 text-sm font-display font-semibold uppercase tracking-wider text-[var(--noir)] hover:bg-[var(--saffron)] transition-colors duration-150 cursor-pointer"
          >
            <span>Authenticate</span>
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
        </form>
      </div>
    </div>
  );
}

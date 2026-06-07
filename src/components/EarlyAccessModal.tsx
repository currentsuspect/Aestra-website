import { useState } from "react";
import { Check, X } from "lucide-react";

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;

export const EarlyAccessModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [daw, setDaw] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Request early access"
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md bg-bg rounded-2xl border border-border/80 p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-md flex items-center justify-center text-muted hover:text-fg hover:bg-surface-2 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {done ? (
          <div className="text-center py-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
              <Check className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-fg mb-1">You're on the list.</h3>
            <p className="text-sm text-muted">We'll let you know when early access opens.</p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-fg mb-1">Request early access</h3>
            <p className="text-sm text-muted mb-6">Aestra is in active development. Get in early.</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!email) return;
                setSubmitting(true);
                setError("");
                try {
                  const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, daw, source: "early-access" }),
                  });
                  if (res.ok) setDone(true);
                  else setError("Something went wrong. Try again.");
                } catch {
                  setError("Network error. Try again.");
                } finally {
                  setSubmitting(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="ea-name" className="block text-sm font-medium text-fg mb-1">Name</label>
                <input
                  id="ea-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full h-10 px-3 rounded-lg bg-surface-2 border border-border text-fg text-sm placeholder-dim focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="ea-email" className="block text-sm font-medium text-fg mb-1">Email</label>
                <input
                  id="ea-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full h-10 px-3 rounded-lg bg-surface-2 border border-border text-fg text-sm placeholder-dim focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="you@studio.email"
                />
              </div>
              <div>
                <label htmlFor="ea-daw" className="block text-sm font-medium text-fg mb-1">What DAW do you use currently?</label>
                <input
                  id="ea-daw"
                  type="text"
                  value={daw}
                  onChange={(e) => setDaw(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-2 border border-border text-fg text-sm placeholder-dim focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="FL Studio, Ableton, etc."
                />
              </div>
              {error && <p className="text-rose-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-lg bg-fg text-on-accent font-medium text-sm hover:bg-fg-muted transition-colors disabled:opacity-50"
              >
                {submitting ? "Sending…" : "Request access"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

import React, { memo, useState, useEffect } from "react";
import { User, Shield, Zap, LifeBuoy, Music, Download, Copy, Check, Menu, X, LogIn, ArrowLeft } from "lucide-react";
import { cn } from "../lib";
import { Button, Badge, Card } from "../components/ui";
import type { PageProps } from "../types";

const DEMO_LICENSE = "XXXX-XXXX-XXXX-8921";

export const Dashboard = memo(({ setPage }: PageProps) => {
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [activeTab]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(DEMO_LICENSE);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: User },
    { id: "licenses", label: "Licenses", icon: Shield },
    { id: "plugins",  label: "My plugins", icon: Zap },
    { id: "support",  label: "Support", icon: LifeBuoy },
  ];

  const activeLabel = navItems.find((n) => n.id === activeTab)?.label ?? activeTab;

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 sm:px-6 py-12 bg-bg">
        <Card className="w-full max-w-md p-7 sm:p-8 border-border/80">
          <div className="flex items-center gap-2 mb-7">
            <Music className="w-5 h-5 text-fg" />
            <span className="text-[15px] font-semibold text-fg tracking-tight">Aestra</span>
          </div>

          <h1 className="display text-2xl sm:text-3xl text-fg mb-2">Sign in</h1>
          <p className="text-muted text-sm leading-relaxed mb-7">
            Manage your licenses, downloads, and Supporter perks.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); setAuthed(true); }}
            className="space-y-3"
          >
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-muted font-medium">Email</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  className="mt-1.5 w-full bg-bg border border-border rounded-md px-3 py-2.5 text-sm text-fg placeholder:text-dim focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                  placeholder="you@studio.com"
                />
            </label>
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-muted font-medium">Password</span>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  className="mt-1.5 w-full bg-bg border border-border rounded-md px-3 py-2.5 text-sm text-fg placeholder:text-dim focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                  placeholder="••••••••"
                />
            </label>
            <Button type="submit" className="w-full mt-2" icon={LogIn}>Sign in</Button>
          </form>

          <p className="mt-6 text-[12px] text-dim text-center">
            No account? <button onClick={() => setPage("download")} className="text-fg-muted hover:text-fg underline underline-offset-4">Get Aestra</button> — sign-in is created on first license activation.
          </p>

          <div className="mt-7 pt-5 border-t border-border/80 flex items-center justify-between">
            <button
              onClick={() => setPage("home")}
              className="text-[12px] text-muted hover:text-fg inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to site
            </button>
            <Badge variant="outline">Preview</Badge>
          </div>
        </Card>
      </div>
    );
  }

  const SidebarContent = () => (
    <>
      <div className="p-5 flex items-center gap-2.5 cursor-pointer" onClick={() => setPage("home")}>
        <Music className="w-5 h-5 text-fg" />
        <span className="text-[15px] font-semibold text-fg tracking-tight">Aestra</span>
      </div>

      <nav className="px-3 mt-4 space-y-0.5 flex-1" aria-label="Dashboard sections">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-current={activeTab === item.id ? "page" : undefined}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-center gap-2.5 tap-target",
                activeTab === item.id
                  ? "text-fg bg-surface-2"
                  : "text-muted hover:text-fg hover:bg-surface-2/40"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border/80">
        <button
          onClick={() => setAuthed(false)}
          className="w-full text-left text-[12px] text-muted hover:text-fg inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-surface-2/40 transition-colors"
        >
          <LogIn className="w-3.5 h-3.5 rotate-180" /> Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex">
      {/* Sidebar (desktop) */}
      <aside className="w-60 border-r border-border/80 bg-bg hidden md:flex flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile drawer overlay */}
      {mobileNavOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (mobile drawer) */}
      <aside
        className={cn(
          "md:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-bg border-r border-border/80 flex flex-col transition-transform duration-200 ease-out",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-label="Dashboard navigation"
      >
        <button
          onClick={() => setMobileNavOpen(false)}
          className="absolute top-3 right-3 w-9 h-9 inline-flex items-center justify-center rounded-md text-muted hover:text-fg hover:bg-surface-2"
          aria-label="Close navigation"
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent />
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0 px-5 sm:px-8 md:px-12 py-6 sm:py-8 md:py-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-3 mb-2 sm:mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setMobileNavOpen(true)}
                className="md:hidden -ml-2 w-10 h-10 inline-flex items-center justify-center rounded-md text-muted hover:text-fg hover:bg-surface-2 shrink-0"
                aria-label="Open navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl sm:text-2xl font-semibold text-fg tracking-tight truncate">{activeLabel}</h1>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setAuthed(false)}>Sign out</Button>
          </div>
          <p className="text-[12px] text-dim mb-8 sm:mb-10">Preview environment — data shown is illustrative.</p>

          {activeTab === "overview" && (
            <div className="space-y-4">
              <Card className="p-6 border-border/80">
                <h3 className="text-[12px] uppercase tracking-wider text-muted font-medium mb-3">Active license</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/5 text-emerald-300">Active</Badge>
                  <span className="text-muted text-sm">Beta</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="w-full bg-bg border border-border rounded-md p-3 font-mono text-fg-muted text-sm flex items-center justify-between hover:border-border-2 transition-colors"
                  aria-label="Copy license key"
                >
                  <span>{DEMO_LICENSE}</span>
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-muted" />}
                </button>
              </Card>

              <Card className="p-6 border-border/80">
                <h3 className="text-[12px] uppercase tracking-wider text-muted font-medium mb-3">Latest build</h3>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-fg font-medium">Aestra Beta</div>
                  <div className="text-xs text-muted">Released 2 days ago</div>
                </div>
                <Button className="w-full" icon={Download}>Download installer</Button>
              </Card>

              <div className="pt-2">
                <h3 className="text-[15px] font-medium text-fg mb-3">Installation history</h3>
                <div className="rounded-xl border border-border/80 bg-bg overflow-hidden">
                  {[
                    ["macOS Installer (Apple Silicon)", "v0.7", "Mar 27, 2026"],
                    ["Windows installer (x64)",        "v0.6", "Mar 14, 2026"],
                    ["Linux AppImage (Ubuntu)",        "v0.5", "Feb 28, 2026"],
                  ].map(([name, ver, date], i) => (
                    <div key={i} className="flex items-center justify-between p-4 border-b border-border/80 last:border-b-0 hover:bg-surface-2/30 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-md bg-surface-2 border border-border flex items-center justify-center text-muted">
                          <Download className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm text-fg-muted truncate">{name}</div>
                          <div className="text-xs text-muted font-mono">{ver}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted shrink-0">{date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "plugins" && (
            <div className="text-center py-20">
              <div className="w-12 h-12 rounded-full bg-surface-2 border border-border flex items-center justify-center mx-auto mb-4">
                <Zap className="w-5 h-5 text-muted" />
              </div>
              <h3 className="text-fg text-lg font-semibold tracking-tight mb-2">Muse AI</h3>
              <p className="text-muted max-w-md mx-auto mb-6 leading-relaxed">
                Predictive creative assistant — autocomplete for your music. Coming for Supporters.
              </p>
              <Badge variant="outline">Coming in v1.1</Badge>
            </div>
          )}

          {activeTab === "support" && (
            <Card className="p-6 border-border/80">
              <h3 className="text-fg font-medium mb-3">Open a ticket</h3>
              <textarea
                className="w-full h-32 bg-bg border border-border rounded-md p-3 text-fg-muted text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors resize-none"
                placeholder="Describe your issue..."
                aria-label="Support ticket description"
              />
              <div className="mt-4">
                <Button onClick={() => alert("Support ticket system coming soon.")}>Submit request</Button>
              </div>
            </Card>
          )}

          {activeTab === "licenses" && (
            <Card className="p-6 border-border/80">
              <h3 className="text-[12px] uppercase tracking-wider text-muted font-medium mb-4">Your licenses</h3>
              <div className="divide-y divide-border/80">
                {[
                  ["Aestra Beta", "Active", "Free core"],
                  ["Muse AI", "Coming soon", "Supporter"],
                  ["Founder card", "Reserved", "Founder"],
                ].map(([name, status, plan]) => (
                  <div key={name} className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-fg text-sm font-medium">{name}</div>
                      <div className="text-xs text-muted">{plan}</div>
                    </div>
                    <Badge variant="outline">{status}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
});

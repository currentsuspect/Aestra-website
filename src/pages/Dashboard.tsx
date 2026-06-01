import React, { memo, useState, useEffect } from "react";
import { User, Shield, Zap, LifeBuoy, Music, Download, Copy, Check, Menu, X } from "lucide-react";
import { cn } from "../lib";
import { Button, Badge, Card } from "../components/ui";
import type { PageProps } from "../types";

export const Dashboard = memo(({ setPage }: PageProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [activeTab]);

  const handleCopy = () => {
    navigator.clipboard?.writeText("XXXX-XXXX-XXXX-8921");
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

  const SidebarContent = () => (
    <>
      <div className="p-5 flex items-center gap-2.5 cursor-pointer" onClick={() => setPage("home")}>
        <Music className="w-5 h-5 text-zinc-50" />
        <span className="text-[15px] font-semibold text-zinc-50 tracking-tight">Aestra</span>
      </div>

      <nav className="px-3 mt-4 space-y-0.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-center gap-2.5 tap-target",
                activeTab === item.id
                  ? "text-zinc-50 bg-zinc-900"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/40"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-3">
        <div className="flex items-center gap-2.5 p-2.5 rounded-md bg-zinc-900/60 border border-zinc-800/80">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 text-xs font-semibold shrink-0">JD</div>
          <div className="text-xs min-w-0">
            <div className="text-zinc-100 truncate">John Doe</div>
            <div className="text-zinc-500 truncate">Pro plan</div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex">
      {/* Sidebar (desktop) */}
      <aside className="w-60 border-r border-zinc-800/80 bg-[#0a0a0b] hidden md:flex flex-col shrink-0">
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
          "md:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#0a0a0b] border-r border-zinc-800/80 flex flex-col transition-transform duration-200 ease-out",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-label="Dashboard navigation"
      >
        <button
          onClick={() => setMobileNavOpen(false)}
          className="absolute top-3 right-3 w-9 h-9 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
          aria-label="Close navigation"
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent />
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0 px-5 sm:px-8 md:px-12 py-6 sm:py-8 md:py-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-3 mb-8 sm:mb-10">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setMobileNavOpen(true)}
                className="md:hidden -ml-2 w-10 h-10 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 shrink-0"
                aria-label="Open navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl sm:text-2xl font-semibold text-zinc-50 tracking-tight capitalize truncate">{activeLabel}</h1>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setPage("home")}>Sign out</Button>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-4">
              <Card className="p-6 border-zinc-800/80">
                <h3 className="text-[12px] uppercase tracking-wider text-zinc-500 font-medium mb-3">Active license</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/5 text-emerald-300">Active</Badge>
                  <span className="text-zinc-500 text-sm">Beta</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-3 font-mono text-zinc-200 text-sm flex items-center justify-between hover:border-zinc-700 transition-colors"
                >
                  <span>XXXX-XXXX-XXXX-8921</span>
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
                </button>
              </Card>

              <Card className="p-6 border-zinc-800/80">
                <h3 className="text-[12px] uppercase tracking-wider text-zinc-500 font-medium mb-3">Latest build</h3>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-zinc-50 font-medium">Aestra Beta</div>
                  <div className="text-xs text-zinc-500">Released 2 days ago</div>
                </div>
                <Button className="w-full" icon={Download}>Download installer</Button>
              </Card>

              <div className="pt-2">
                <h3 className="text-[15px] font-medium text-zinc-50 mb-3">Installation history</h3>
                <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 overflow-hidden">
                  {[
                    ["macOS Installer (Apple Silicon)", "v0.7", "Mar 27, 2026"],
                    ["Windows installer (x64)",        "v0.6", "Mar 14, 2026"],
                    ["Linux AppImage (Ubuntu)",        "v0.5", "Feb 28, 2026"],
                  ].map(([name, ver, date], i) => (
                    <div key={i} className="flex items-center justify-between p-4 border-b border-zinc-800/80 last:border-b-0 hover:bg-zinc-900/30 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                          <Download className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm text-zinc-200 truncate">{name}</div>
                          <div className="text-xs text-zinc-500 font-mono">{ver}</div>
                        </div>
                      </div>
                      <div className="text-xs text-zinc-500 shrink-0">{date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "plugins" && (
            <div className="text-center py-20">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-5 h-5 text-zinc-500" />
              </div>
              <h3 className="text-zinc-50 text-lg font-semibold tracking-tight mb-2">Muse AI</h3>
              <p className="text-zinc-400 max-w-md mx-auto mb-6 leading-relaxed">
                Predictive creative assistant — autocomplete for your music. Coming for Supporters.
              </p>
              <Badge variant="outline">Coming in v1.1</Badge>
            </div>
          )}

          {activeTab === "support" && (
            <Card className="p-6 border-zinc-800/80">
              <h3 className="text-zinc-50 font-medium mb-3">Open a ticket</h3>
              <textarea
                className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-md p-3 text-zinc-300 text-sm focus:outline-none focus:border-zinc-700 transition-colors resize-none"
                placeholder="Describe your issue..."
                aria-label="Support ticket description"
              />
              <div className="mt-4">
                <Button>Submit request</Button>
              </div>
            </Card>
          )}

          {activeTab === "licenses" && (
            <Card className="p-6 border-zinc-800/80">
              <h3 className="text-[12px] uppercase tracking-wider text-zinc-500 font-medium mb-4">Your licenses</h3>
              <div className="divide-y divide-zinc-800/80">
                {[
                  ["Aestra Beta", "Active", "Free core"],
                  ["Muse AI", "Coming soon", "Supporter"],
                  ["Founder card", "Reserved #042", "Founder"],
                ].map(([name, status, plan]) => (
                  <div key={name} className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-zinc-50 text-sm font-medium">{name}</div>
                      <div className="text-xs text-zinc-500">{plan}</div>
                    </div>
                    <Badge variant="outline">{status}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
});

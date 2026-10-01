import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Home", icon: "◈" },
  { to: "/stock", label: "Stock", icon: "▤" },
  { to: "/specials", label: "Specials", icon: "✦" },
  { to: "/buying", label: "Buying", icon: "▣" },
  { to: "/forecast", label: "Forecast", icon: "◔" },
  { to: "/settings", label: "Settings", icon: "⚙" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-ambient" />
      <div className="pointer-events-none fixed -left-24 -top-24 size-[380px] rounded-full bg-gold/15 blur-3xl floaty" />
      <div className="pointer-events-none fixed -right-28 top-1/3 size-[360px] rounded-full bg-primary/10 blur-3xl floaty2" />

      <div className="relative z-10 mx-auto flex max-w-[1280px] gap-6 px-4 pb-28 pt-4 md:py-6 md:pb-6">
        <aside className="glass sticky top-6 hidden h-[calc(100vh-3rem)] w-64 shrink-0 flex-col gap-1 rounded-[2rem] p-5 md:flex">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="grid size-11 place-items-center rounded-xl bg-primary font-display font-bold text-primary-foreground shadow-lg">K</div>
            <div>
              <p className="font-display text-base font-extrabold leading-none tracking-tight">KitchenSense</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Stock & waste helper</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1.5">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: true }}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-foreground/60 transition-colors hover:bg-card/60"
                activeProps={{ className: "!bg-primary !text-primary-foreground shadow-lg font-bold" }}
              >
                <span className="text-gold-deep">{n.icon}</span> {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl bg-primary p-5 text-primary-foreground">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Saved from the bin</p>
            <p className="mt-2 font-display text-3xl font-extrabold">€184</p>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-primary-foreground/10">
              <div className="h-full w-2/3 bg-gold" />
            </div>
            <p className="mt-2 text-[11px] font-medium text-primary-foreground/60">this week · 22% less waste</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 space-y-6">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 px-3 pb-3 md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between rounded-3xl bg-primary px-1 py-1.5 text-primary-foreground shadow-hero">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: true }}
              className="flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 text-primary-foreground/55"
              activeProps={{ className: "!text-gold bg-primary-foreground/10" }}
            >
              <span className="text-base leading-none">{n.icon}</span>
              <span className="text-[10px] font-semibold">{n.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <header className="glass grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-[2rem] px-5 py-4 sm:px-6">
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-deep">{eyebrow}</p>
        <h1 className="truncate text-xl font-extrabold sm:text-2xl">{title}</h1>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {children}
        <div className="size-10 rounded-full border-2 border-gold p-0.5">
          <div className="grid size-full place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">MA</div>
        </div>
      </div>
    </header>
  );
}

export function Panel({ title, aside, children, className = "" }: { title?: string; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`glass rounded-[2rem] p-5 sm:p-7 ${className}`}>
      {title && (
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-xl font-bold">{title}</h3>
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

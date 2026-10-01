import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, EmptyState, PageHeader, Panel } from "@/components/AppShell";
import { OwnerSpecialCreator } from "@/components/OwnerSpecialCreator";
import { radarAtRisk, spoilRadar, suggestedSpecials } from "@/lib/kitchen";
import { forecast, specials, stock, statusOf, statusStyles, wasteRisk } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KitchenSense — Today in your kitchen" },
      { name: "description", content: "Spoilage alerts, specials ideas, stock levels and demand forecast for your café at a glance." },
      { property: "og:title", content: "KitchenSense — Today in your kitchen" },
      { property: "og:description", content: "Waste less and earn more with daily stock insights for cafés and restaurants." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const radar = spoilRadar();
  const suggestions = suggestedSpecials(radar);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const glance = [...stock].sort((a, b) => a.days - b.days).slice(0, 4);
  const hero = specials[0]!;
  const max = Math.max(...forecast.week.map((d) => d.covers));

  return (
    <AppShell>
      <PageHeader eyebrow="Thursday · 08:12" title="Morning, Marisol." />

      <div className="grid grid-cols-3 gap-3">
        {[
          { to: "/stock", label: "Add stock", icon: "+" },
          { to: "/waste", label: "Mark waste", icon: "×" },
          { to: "/specials", label: "Menu ideas", icon: "✦" },
        ].map((a) => (
          <Link key={a.label} to={a.to} className="glass flex flex-col items-center gap-2 rounded-2xl py-4 text-xs font-bold transition-transform hover:scale-[1.02]">
            <span className="grid size-9 place-items-center rounded-full bg-primary text-lg text-gold">{a.icon}</span>
            {a.label}
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Suggested specials · use stock within 48h" aside={<span className="rounded-full bg-danger/15 px-3 py-1 text-[11px] font-bold text-danger">€{radarAtRisk(radar).toFixed(2)} at risk</span>} className="lg:col-span-2">
          {radar.length === 0 ? (
            <EmptyState icon="◎" title="Nothing on the radar" body="Add 5 pantry items with use-by days to get your first special suggestion." action={<Link to="/stock" className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">Add pantry items</Link>} />
          ) : (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground">Smart matching has turned {radar.length} at-risk ingredients into {suggestions.length} practical specials.</p>
            {suggestions.map((idea) => {
              const s = statusStyles[statusOf(idea.days)];
              const on = picked[idea.dish];
              return (
                <div key={idea.dish} className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:gap-4">
                  <span className={`grid size-11 shrink-0 place-items-center rounded-xl text-sm font-extrabold ${s.badge}`}>{idea.days === 1 ? "24h" : "48h"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold">{idea.dish} <span className="font-semibold text-muted-foreground">· €{idea.price.toFixed(2)}</span></p>
                    <p className="text-xs font-semibold text-gold-deep">✦ {idea.ingredients.map((item) => item.name).join(" · ")}</p>
                    <p className="mt-0.5 text-[11px] font-semibold text-muted-foreground">{idea.note}</p>
                    <p className="mt-0.5 text-[11px] font-bold text-danger">Saves up to €{idea.eur.toFixed(2)} of stock</p>
                  </div>
                  <button onClick={() => setPicked({ ...picked, [idea.dish]: !on })} className={`col-span-2 w-full shrink-0 rounded-full px-4 py-2 text-xs font-bold sm:col-span-1 sm:w-auto ${on ? "bg-good text-primary-foreground" : "bg-primary text-primary-foreground"}`}>{on ? "✓ On specials" : "Make it a special"}</button>
                </div>
              );
            })}
            <OwnerSpecialCreator />
            <p className="pt-1 text-xs font-medium text-muted-foreground">Specials board only — your printed menu stays as it is.</p>
          </div>
          )}
        </Panel>

        <Panel title="Waste risk">
          <div className="flex items-end gap-2">
            <span className="font-display text-6xl font-extrabold text-warn">{wasteRisk}</span>
            <span className="pb-2 text-sm font-bold text-muted-foreground">/ 100</span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-gradient-to-r from-good via-warn to-danger" style={{ width: `${wasteRisk}%` }} />
          </div>
          <p className="mt-4 text-sm font-medium text-muted-foreground">Medium. Bread, lettuce and chicken are the main worries this week.</p>
        </Panel>
      </div>

      <Link to="/story" className="glass flex items-center gap-4 rounded-2xl border-l-4 border-gold p-4 transition-colors hover:bg-card">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-gold">▶</span>
        <span className="min-w-0 flex-1"><span className="block text-sm font-extrabold">Monday special from Sunday surplus</span><span className="block text-xs font-semibold text-muted-foreground">See a week with KitchenSense: waste €312 → €184</span></span>
        <span className="text-xs font-bold text-gold-deep">Watch →</span>
      </Link>

      <section className="relative overflow-hidden rounded-[2.5rem] bg-primary p-6 text-primary-foreground shadow-hero sm:p-8">
        <div className="absolute -right-20 -top-20 size-80 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gold">✦ Today's special idea</div>
            <h2 className="mt-5 text-3xl font-extrabold leading-[1.1] sm:text-4xl">{hero.name}</h2>
            <p className="mt-4 max-w-md text-[15px] font-medium leading-relaxed text-primary-foreground/70">{hero.why}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/specials" className="rounded-full bg-gold px-7 py-3 text-sm font-bold text-primary transition-transform hover:scale-105">Add to menu</Link>
              <Link to="/specials" className="rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-7 py-3 text-sm font-bold hover:bg-primary-foreground/10">More ideas</Link>
            </div>
          </div>
          <div className="grid shrink-0 grid-cols-2 gap-4 lg:w-80">
            <div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gold/70">Margin</p>
              <p className="mt-1 font-display text-3xl font-bold">{hero.margin}%</p>
              <p className="mt-1 text-[11px] font-semibold text-gold">at {hero.price}</p>
            </div>
            <div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gold/70">Saves</p>
              <p className="mt-1 font-display text-3xl font-bold">2.1<span className="text-sm">kg</span></p>
              <p className="mt-1 text-[11px] font-semibold text-gold">from the bin</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Stock at a glance" aside={<Link to="/stock" className="text-xs font-bold text-gold-deep">View all →</Link>} className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {glance.map((i) => {
              const st = statusOf(i.days);
              const s = statusStyles[st];
              return (
                <div key={i.name} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-extrabold">{i.name}</p>
                    <span className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold uppercase ${s.badge}`}>{s.label}</span>
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground">{i.qty} · {i.days} days left</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full ${s.bar}`} style={{ width: `${Math.min(100, i.days * 12)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <section className="rounded-[2rem] bg-primary p-7 text-primary-foreground">
          <h3 className="text-xl font-bold">Demand forecast</h3>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-gold">{forecast.today.weather}</p>
          <div className="mt-6 flex h-36 items-end gap-2">
            {forecast.week.map((d) => (
              <div key={d.day} className={`flex-1 rounded-t-md ${d.covers === max ? "bg-gold" : "bg-gold/35"}`} style={{ height: `${(d.covers / max) * 100}%` }} />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-7 text-center text-[10px] font-bold text-gold/60">
            {forecast.week.map((d) => <span key={d.day}>{d.day}</span>)}
          </div>
          <p className="mt-6 border-t border-primary-foreground/10 pt-5 text-xs font-medium leading-relaxed text-primary-foreground/70">Saturday looks like your busiest day — rugby nearby. <Link to="/forecast" className="font-bold text-gold">See forecast →</Link></p>
        </section>
      </div>
    </AppShell>
  );
}

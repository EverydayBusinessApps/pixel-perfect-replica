import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Panel } from "@/components/AppShell";
import { forecast, localEvents, weekPlan } from "@/lib/data";

export const Route = createFileRoute("/forecast")({
  head: () => ({
    meta: [
      { title: "Busy days ahead — KitchenSense" },
      { name: "description", content: "How busy you'll be, what to prep and order, and local events coming up." },
      { property: "og:title", content: "Busy days ahead — KitchenSense" },
      { property: "og:description", content: "Demand forecast, prep plan and local events for your café." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ForecastPage,
});

const kindStyle: Record<string, string> = {
  Local: "bg-gold/20 text-gold-deep",
  National: "bg-primary/10 text-primary",
  Sport: "bg-good/15 text-good",
};

function ForecastPage() {
  const max = Math.max(...weekPlan.map((d) => d.covers));
  const t = forecast.today;
  const next = [...localEvents].sort((a, b) => b.lift - a.lift)[0];
  return (
    <AppShell>
      <PageHeader eyebrow="Events · past trade · weather" title="Busy days ahead" />

      <section className="relative overflow-hidden rounded-[2.5rem] bg-primary p-6 text-primary-foreground shadow-hero sm:p-8">
        <div className="absolute -right-20 -top-20 size-80 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Today · {t.weather}</p>
            <p className="mt-3 font-display text-5xl font-extrabold">{t.covers} <span className="text-lg font-bold text-primary-foreground/60">customers</span></p>
            <p className="mt-3 max-w-md text-sm text-primary-foreground/80">{t.note}</p>
            <p className="mt-4 max-w-md border-t border-gold/40 pt-3 text-sm text-primary-foreground/90">
              <span className="font-bold text-gold">Biggest thing coming:</span> {next.name} in {next.daysAway} days — expect about +{next.lift}% trade.
            </p>
          </div>
          <span className="w-fit rounded-full bg-gold px-4 py-2 text-sm font-bold text-primary">+{t.change}% vs usual</span>
        </div>
      </section>

      <Panel title="Local events coming up" aside={<span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Next 4 weeks</span>}>
        <div className="grid gap-3 md:grid-cols-2">
          {localEvents.map((e) => (
            <div key={e.name} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${kindStyle[e.kind]}`}>{e.kind}</span>
                <span className="text-xs font-bold text-muted-foreground">in {e.daysAway} days</span>
              </div>
              <p className="mt-3 font-display text-xl font-bold">{e.name}</p>
              <p className="text-xs font-semibold text-gold-deep">{e.dates} · about +{e.lift}% customers</p>
              <p className="mt-2 text-sm text-muted-foreground">{e.impact}</p>
              <ul className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
                {e.prep.map((p) => (
                  <li key={p} className="flex gap-2"><span className="text-gold-deep">✓</span>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="This week: what to prep" aside={<span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">customers per day</span>}>
        <div className="flex h-44 items-end gap-3">
          {weekPlan.map((d) => (
            <div key={d.day} className="flex h-full flex-1 flex-col justify-end gap-2 text-center">
              <span className="text-xs font-bold">{d.covers}</span>
              <div className={`rounded-t-lg ${d.covers === max ? "bg-gold" : "bg-primary/80"}`} style={{ height: `${(d.covers / max) * 80}%` }} />
              <span className="text-[11px] font-bold text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
        <ul className="mt-6 divide-y divide-border border-t border-border">
          {weekPlan.map((d) => (
            <li key={d.day} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-3 py-3 text-sm sm:grid-cols-[3rem_9rem_minmax(0,1fr)]">
              <span className="font-bold">{d.day}</span>
              <span className="text-xs font-semibold text-gold-deep sm:text-sm">{d.why}</span>
              <span className="col-span-2 text-muted-foreground sm:col-span-1">{d.action}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </AppShell>
  );
}

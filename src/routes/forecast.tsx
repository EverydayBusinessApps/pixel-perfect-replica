import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Panel } from "@/components/AppShell";
import { forecast } from "@/lib/data";

export const Route = createFileRoute("/forecast")({
  head: () => ({
    meta: [
      { title: "Busy days ahead — KitchenSense" },
      { name: "description", content: "How busy you'll be today, the next 3 days and next week, based on weather, events and past trade." },
      { property: "og:title", content: "Busy days ahead — KitchenSense" },
      { property: "og:description", content: "Demand forecast for your café in plain language." },
    ],
  }),
  component: ForecastPage,
});

function ForecastPage() {
  const max = Math.max(...forecast.week.map((d) => d.covers));
  const t = forecast.today;
  return (
    <AppShell>
      <PageHeader eyebrow="Weather · events · past trade" title="Busy days ahead" />

      <section className="relative overflow-hidden rounded-[2.5rem] bg-primary p-6 text-primary-foreground shadow-hero sm:p-8">
        <div className="absolute -right-20 -top-20 size-80 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Today · {t.weather}</p>
            <p className="mt-3 font-display text-5xl font-extrabold">{t.covers} <span className="text-lg font-bold text-primary-foreground/60">customers</span></p>
            <p className="mt-3 max-w-md text-sm text-primary-foreground/70">{t.note}</p>
          </div>
          <span className="w-fit rounded-full bg-gold px-4 py-2 text-sm font-bold text-primary">+{t.change}% vs usual</span>
        </div>
      </section>

      <Panel title="Next 3 days">
        <div className="grid gap-3 sm:grid-cols-3">
          {forecast.next3.map((d) => (
            <div key={d.day} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gold-deep">{d.day}</p>
              <p className="mt-1 font-display text-3xl font-bold">{d.covers}</p>
              <p className="text-xs font-semibold text-muted-foreground">{d.weather}</p>
              {d.event && <p className="mt-2 inline-block rounded-md bg-warn/15 px-2 py-1 text-[10px] font-bold text-warn">★ {d.event}</p>}
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Next week" aside={<span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">customers per day</span>}>
        <div className="flex h-56 items-end gap-3">
          {forecast.week.map((d) => (
            <div key={d.day} className="flex h-full flex-1 flex-col justify-end gap-2 text-center">
              <span className="text-xs font-bold">{d.covers}</span>
              <div className={`rounded-t-lg ${d.covers === max ? "bg-gold" : "bg-primary/80"}`} style={{ height: `${(d.covers / max) * 80}%` }} />
              <span className="text-[11px] font-bold text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 border-t border-border pt-5 text-sm text-muted-foreground">
          Weekend will be your busiest stretch — the rugby on Saturday usually brings about 40% more people. Monday and Tuesday are quiet, so order lighter for early next week.
        </p>
      </Panel>
    </AppShell>
  );
}

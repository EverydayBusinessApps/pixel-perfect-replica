import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Panel } from "@/components/AppShell";
import { useIsMobile } from "@/hooks/use-mobile";
import { menu, total, trend, margin, ingredientUsage, priceOf, lossLeaders, priceAlerts, isDrink } from "@/lib/insights";
import { stock } from "@/lib/data";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Menu insights — KitchenSense" },
      { name: "description", content: "Eight weeks of sales: best and worst sellers, shared ingredients, single-use costs, and which low-margin dishes earn their keep as part of a bigger order." },
      { property: "og:title", content: "Menu insights — KitchenSense" },
      { property: "og:description", content: "See what sells, what doesn't, and what your menu shares with the pantry." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InsightsPage,
});

const eur = (n: number) => `€${n.toFixed(2)}`;

function Spark({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div className="flex h-8 w-24 items-end gap-0.5">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm bg-primary/70" style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  );
}

function InsightsPage() {
  const isMobile = useIsMobile();
  const [sharedOpen, setSharedOpen] = useState<boolean | null>(null);
  const [singleOpen, setSingleOpen] = useState<boolean | null>(null);
  const [priceOpen, setPriceOpen] = useState<boolean | null>(null);
  const [leadersOpen, setLeadersOpen] = useState<boolean | null>(null);
  const sharedIsOpen = sharedOpen ?? !isMobile;
  const singleIsOpen = singleOpen ?? !isMobile;
  const priceIsOpen = priceOpen ?? !isMobile;
  const leadersIsOpen = leadersOpen ?? !isMobile;
  // When one panel of a pair is open and the other closed, each takes the full
  // width; when they match, they sit side by side.
  const pairSpan = (a: boolean, b: boolean) => (a === b ? "" : "lg:col-span-2");

  const ranked = [...menu].sort((a, b) => total(b) - total(a));
  const usage = ingredientUsage();
  const shared = usage.filter((u) => u.dishes.length > 1);
  const single = usage.filter((u) => u.dishes.length === 1).sort((a, b) => priceOf(b.name) - priceOf(a.name));
  const inPantry = new Set(stock.map((s) => s.name));
  const alerts = priceAlerts();
  const leaders = lossLeaders();

  return (
    <AppShell>
      <PageHeader eyebrow="Last 8 weeks" title="Menu insights" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Dishes tracked", value: menu.length },
          { label: "Ingredients used", value: usage.length },
          { label: "Shared across dishes", value: shared.length },
          { label: "Bought for one dish", value: single.length },
        ].map((k) => (
          <div key={k.label} className="glass rounded-2xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{k.label}</p>
            <p className="mt-1 font-display text-3xl font-bold">{k.value}</p>
          </div>
        ))}
      </div>

      <Panel title="What's selling" aside={<span className="text-xs font-bold text-muted-foreground">Plates sold · 8 weeks</span>} collapsible>
        {(["Food", "Drinks"] as const).map((groupLabel) => {
          const list = ranked.filter((m) => (groupLabel === "Drinks") === isDrink(m.name));
          return (
            <div key={groupLabel} className={groupLabel === "Drinks" ? "mt-4" : ""}>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gold-deep">{groupLabel}</p>
              <div className="space-y-3">
                {list.map((m, idx) => {
                  const t = trend(m);
                  const tag = t >= 5 ? "bg-good/15 text-good" : t <= -5 ? "bg-danger/15 text-danger" : "bg-warn/15 text-warn";
                  return (
                    <div key={m.name} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                      <span className="w-6 shrink-0 text-center font-display text-lg font-bold text-gold-deep">{idx + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-extrabold">{m.name}</p>
                        <p className="text-xs font-semibold text-muted-foreground">{total(m).toLocaleString()} sold · {margin(m.price, m.cost)}% margin</p>
                      </div>
                      <div className="hidden sm:block"><Spark data={m.sold} /></div>
                      <span className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold ${tag}`}>{t > 0 ? "↑" : t < 0 ? "↓" : "→"} {Math.abs(t)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <p className="mt-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Rocket & Pear Salad</strong> and <strong className="text-foreground">Caesar Wrap</strong> are falling fast. Consider dropping one — together they rely on 5 ingredients nothing else uses.
        </p>
      </Panel>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Panel title="Shared ingredients" aside={<span className="rounded-full bg-good/15 px-3 py-1 text-[11px] font-bold text-good">{shared.length} work hard</span>} collapsible className={pairSpan(sharedIsOpen, singleIsOpen)} open={sharedIsOpen} onToggle={setSharedOpen}>
          <p className="mb-3 text-sm text-muted-foreground">Used in more than one dish — less risk of waste.</p>
          <div className="space-y-2">
            {shared.map((u) => (
              <div key={u.name} className="rounded-xl border border-border bg-card p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-extrabold">{u.name}</p>
                  <span className="text-xs font-bold text-gold-deep">{u.dishes.length} dishes</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{u.dishes.join(" · ")}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Bought for one dish" aside={<span className="rounded-full bg-warn/15 px-3 py-1 text-[11px] font-bold text-warn">{single.length} at risk</span>} collapsible className={pairSpan(sharedIsOpen, singleIsOpen)} open={singleIsOpen} onToggle={setSingleOpen}>
          <p className="mb-3 text-sm text-muted-foreground">If that dish stops selling, these end up in the bin. Sorted by how much each costs you.</p>
          <div className="space-y-2">
            {single.map((u) => {
              const dish = menu.find((m) => m.name === u.dishes[0])!;
              const falling = trend(dish) <= -5;
              return (
                <div key={u.name} className="rounded-xl border border-border bg-card p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-extrabold">{u.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gold-deep">{eur(priceOf(u.name))}</span>
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">{inPantry.has(u.name) ? "In stock" : "Ordered in"}</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Only for {dish.name}
                    {falling && <span className="font-bold text-danger"> · dish sales falling</span>}
                  </p>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <Panel title="Costs on the rise" aside={<span className="text-xs font-bold text-muted-foreground">Last 3 months</span>} collapsible>
        <p className="mb-3 text-sm text-muted-foreground">Ingredient costs that have crept up, so you know what to watch before your next menu print.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {[...menu].filter((m) => m.cost > m.costPrev).sort((a, b) => (b.cost - b.costPrev) / b.costPrev - (a.cost - a.costPrev) / a.costPrev).map((m) => (
            <div key={m.name} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-extrabold">{m.name}</p>
                <span className="rounded-md bg-warn/15 px-2 py-1 text-[10px] font-bold text-warn">+{Math.round(((m.cost - m.costPrev) / m.costPrev) * 100)}%</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Plate cost {eur(m.costPrev)} → {eur(m.cost)} · margin now {margin(m.price, m.cost)}%</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Panel title="Price watch" aside={<span className="text-xs font-bold text-muted-foreground">Breakeven only</span>} collapsible>
          <p className="mb-3 text-sm text-muted-foreground">You print your menus, so a price change is only flagged when a dish is about to stop paying for itself.</p>
          {alerts.length === 0 ? (
            <div className="rounded-xl border border-good/30 bg-good/10 p-4">
              <p className="font-extrabold text-good">All clear</p>
              <p className="mt-1 text-xs text-muted-foreground">No dish is close to breakeven at today's ingredient costs — nothing needs a price change at your next print.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.map((a) => (
                <div key={a.name} className="rounded-xl border border-danger/30 bg-card p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-extrabold">{a.name}</p>
                    <span className="rounded-md bg-danger/15 px-2 py-1 text-[10px] font-bold text-danger">Breakeven risk</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Margin {a.now}% now, {a.projected}% if costs rise again. Consider {eur(a.suggested)} at the next print.
                  </p>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Loss leaders worth keeping" aside={<span className="text-xs font-bold text-muted-foreground">Basket view</span>} collapsible>
          <p className="mb-3 text-sm text-muted-foreground">Thin margins that are fine — they arrive alongside bigger orders.</p>
          <div className="space-y-2">
            {leaders.map((l) => (
              <div key={l.name} className="rounded-xl border border-gold/40 bg-card p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-extrabold">{l.name}</p>
                  <span className="rounded-md bg-gold/15 px-2 py-1 text-[10px] font-bold text-gold-deep">{l.now}% margin</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Usually ordered with <strong className="text-foreground">{l.partners.map((p) => p.name).join(" + ")}</strong> — the full basket pays <strong className="text-good">{l.basketMargin}%</strong>.
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Panel } from "@/components/AppShell";
import { menu, total, trend, margin, ingredientUsage, priceOf } from "@/lib/insights";
import { stock } from "@/lib/data";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Menu insights — KitchenSense" },
      { name: "description", content: "Eight weeks of sales: best and worst sellers, how dishes share ingredients, and which single-use items cost you the most." },
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
  const ranked = [...menu].sort((a, b) => total(b) - total(a));
  const usage = ingredientUsage();
  const shared = usage.filter((u) => u.dishes.length > 1);
  const single = usage.filter((u) => u.dishes.length === 1).sort((a, b) => priceOf(b.name) - priceOf(a.name));
  const inPantry = new Set(stock.map((s) => s.name));

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

      <Panel title="What's selling" aside={<span className="text-xs font-bold text-muted-foreground">Plates sold · 8 weeks</span>}>
        <div className="space-y-3">
          {ranked.map((m, idx) => {
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
        <p className="mt-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Rocket & Pear Salad</strong> and <strong className="text-foreground">Caesar Wrap</strong> are falling fast. Consider dropping one — together they rely on 5 ingredients nothing else uses.
        </p>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Shared ingredients" aside={<span className="rounded-full bg-good/15 px-3 py-1 text-[11px] font-bold text-good">{shared.length} work hard</span>}>
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

        <Panel title="Bought for one dish" aside={<span className="rounded-full bg-warn/15 px-3 py-1 text-[11px] font-bold text-warn">{single.length} at risk</span>}>
          <p className="mb-3 text-sm text-muted-foreground">If that dish stops selling, these end up in the bin.</p>
          <div className="space-y-2">
            {single.map((u) => {
              const dish = menu.find((m) => m.name === u.dishes[0])!;
              const falling = trend(dish) <= -5;
              return (
                <div key={u.name} className="rounded-xl border border-border bg-card p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-extrabold">{u.name}</p>
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">{inPantry.has(u.name) ? "In stock" : "Ordered in"}</span>
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

      <Panel title="Suggested price changes" aside={<span className="text-xs font-bold text-muted-foreground">Target {TARGET_MARGIN}% margin</span>}>
        <p className="mb-3 text-sm text-muted-foreground">Ingredient costs have gone up over the last 3 months. Rises are capped at 12% so regulars don't notice a jump.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {prices.map((p) => (
            <div key={p.name} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-extrabold">{p.name}</p>
                <span className="rounded-md bg-danger/15 px-2 py-1 text-[10px] font-bold text-danger">Cost +{p.rise}%</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Plate cost {eur(p.costPrev)} → {eur(p.cost)}</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Price</p>
                  <p className="font-display text-2xl font-bold">
                    <span className="text-base text-muted-foreground line-through">{eur(p.price)}</span> {eur(p.suggested)}
                  </p>
                </div>
                <p className="text-right text-xs font-bold">
                  Margin {p.now}% → <span className="text-good">{p.newMargin}%</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { stock, statusOf, statusStyles } from "@/lib/data";

export const Route = createFileRoute("/stock")({
  head: () => ({
    meta: [
      { title: "Stock — KitchenSense" },
      { name: "description", content: "Every ingredient, how much you have and how many days until it spoils." },
      { property: "og:title", content: "Stock — KitchenSense" },
      { property: "og:description", content: "Colour-coded stock list with spoilage countdowns." },
    ],
  }),
  component: StockPage,
});

const categories = ["Meat & Fish", "Produce", "Dairy", "Bakery", "Dry goods"] as const;

function StockPage() {
  const [open, setOpen] = useState<Record<string, boolean>>({ "Meat & Fish": true, Produce: true });
  const [wasted, setWasted] = useState<Record<string, boolean>>({});

  return (
    <AppShell>
      <PageHeader eyebrow={`${stock.length} ingredients`} title="Your stock" />
      <div className="flex flex-wrap gap-2 text-xs font-bold">
        {(["urgent", "watch", "good"] as const).map((k) => (
          <span key={k} className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-card-foreground shadow-sm">
            <span className={`size-2 rounded-full ${statusStyles[k].dot}`} />
            {statusStyles[k].label} · {stock.filter((i) => statusOf(i.days) === k).length}
          </span>
        ))}
      </div>

      {categories.map((cat) => {
        const items = stock.filter((i) => i.category === cat);
        const isOpen = open[cat];
        return (
          <section key={cat} className="glass overflow-hidden rounded-[2rem]">
            <button onClick={() => setOpen({ ...open, [cat]: !isOpen })} className="flex w-full items-center justify-between px-6 py-5 text-left">
              <span className="font-display text-xl font-bold">{cat}</span>
              <span className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                {items.length} items <span className={`text-gold transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
              </span>
            </button>
            {isOpen && (
              <div className="space-y-3 px-4 pb-5 sm:px-6">
                {items.map((i) => {
                  const s = statusStyles[statusOf(i.days)];
                  const gone = wasted[i.name];
                  return (
                    <div key={i.name} className={`grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center ${gone ? "opacity-50" : ""}`}>
                      <div className="flex min-w-0 items-center gap-4">
                        <span className={`size-3 shrink-0 rounded-full ${s.dot}`} />
                        <div className="min-w-0">
                          <p className="truncate font-extrabold">{i.name}</p>
                          <p className="text-xs font-semibold text-muted-foreground">{i.qty} · cost €{i.cost.toFixed(2)} · {gone ? "marked as waste" : `${i.days} day${i.days > 1 ? "s" : ""} until spoilage`}</p>
                        </div>
                        <span className={`ml-auto shrink-0 rounded-md px-2 py-1 text-[10px] font-bold uppercase ${s.badge}`}>{s.label}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link to="/specials" className="flex-1 rounded-full bg-primary px-4 py-2 text-center text-xs font-bold text-primary-foreground sm:flex-none">Use in special</Link>
                        <button onClick={() => setWasted({ ...wasted, [i.name]: !gone })} className="flex-1 rounded-full border border-danger/30 px-4 py-2 text-xs font-bold text-danger sm:flex-none">{gone ? "Undo" : "Mark waste"}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </AppShell>
  );
}

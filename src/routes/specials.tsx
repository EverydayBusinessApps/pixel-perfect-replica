import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { specials } from "@/lib/data";

export const Route = createFileRoute("/specials")({
  head: () => ({
    meta: [
      { title: "Specials ideas — KitchenSense" },
      { name: "description", content: "Dish ideas that use up stock, ride the weather and keep margins healthy." },
      { property: "og:title", content: "Specials ideas — KitchenSense" },
      { property: "og:description", content: "Smart specials suggestions for your café menu." },
    ],
  }),
  component: SpecialsPage,
});

const reasonIcon = { "Use it up": "⏳", "Over-stocked": "▤", Trending: "↗", Weather: "☂" } as const;

function SpecialsPage() {
  const [added, setAdded] = useState<Record<string, boolean>>({});
  return (
    <AppShell>
      <PageHeader eyebrow="Picked for today" title="Specials ideas" />
      <div className="grid gap-6 md:grid-cols-2">
        {specials.map((s, idx) => {
          const on = added[s.name];
          const dark = idx === 0;
          return (
            <article key={s.name} className={`relative flex flex-col overflow-hidden rounded-[2rem] p-6 sm:p-7 ${dark ? "bg-primary text-primary-foreground shadow-hero" : "glass"}`}>
              <div className="flex items-center justify-between gap-2">
                <span className={`inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${dark ? "text-gold" : "text-gold-deep"}`}>{reasonIcon[s.reason]} {s.reason}</span>
...
              <p className={`mt-3 text-xs font-bold ${dark ? "text-gold" : "text-gold-deep"}`}>Uses: {s.uses}</p>
              <div className="mt-6 flex items-end justify-between gap-4 pt-2">
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${dark ? "text-gold/70" : "text-muted-foreground"}`}>Est. margin</p>
                  <p className="font-display text-3xl font-bold">{s.margin}%</p>
                </div>
                <button
                  onClick={() => setAdded({ ...added, [s.name]: !on })}
                  className={`rounded-full px-6 py-3 text-sm font-bold transition-transform hover:scale-105 ${on ? "bg-good text-primary-foreground" : dark ? "bg-gold text-primary" : "bg-primary text-primary-foreground"}`}
                >
                  {on ? "✓ On the menu" : "Add to menu"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}

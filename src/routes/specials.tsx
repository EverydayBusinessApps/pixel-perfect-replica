import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AppShell, EmptyState, PageHeader } from "@/components/AppShell";
import { OwnerSpecialCreator } from "@/components/OwnerSpecialCreator";
import { specials, stock } from "@/lib/data";
import { parseEur, specialPriceHint, TARGET_MARGIN } from "@/lib/kitchen";

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
      {stock.length < 5 ? (
        <EmptyState title="Add 5 pantry items to get your first special" body="KitchenSense needs a few ingredients and their use-by days to suggest specials that use them up." action={<Link to="/stock" className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">Add pantry items</Link>} />
      ) : (
      <div className="grid gap-6 md:grid-cols-2">
        {specials.map((s, idx) => {
          const on = added[s.name];
          const dark = idx === 0;
          const hint = specialPriceHint(s.name, parseEur(s.price));
          return (
            <article key={s.name} className={`relative flex flex-col overflow-hidden rounded-[2rem] p-6 sm:p-7 ${dark ? "bg-primary text-primary-foreground shadow-hero" : "glass"}`}>
              <div className="flex items-center justify-between gap-2">
                <span className={`inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${dark ? "text-gold" : "text-gold-deep"}`}>{reasonIcon[s.reason]} {s.reason}</span>
                <span className={`text-xs font-bold ${dark ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{s.price}</span>
              </div>
              <h2 className="mt-5 text-2xl font-extrabold leading-tight">{s.name}</h2>
              <p className={`mt-3 text-sm font-medium leading-relaxed ${dark ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{s.why}</p>
              <p className={`mt-3 text-xs font-bold ${dark ? "text-gold" : "text-gold-deep"}`}>Uses: {s.uses}</p>
              {hint && (
                <div className={`mt-4 rounded-xl border px-3 py-2 text-xs font-semibold ${hint.suggested ? (dark ? "border-gold/50 bg-gold/10" : "border-warn/40 bg-warn/10 text-warn") : dark ? "border-primary-foreground/15 text-primary-foreground/70" : "border-border text-muted-foreground"}`}>
                  {hint.suggested
                    ? <>Price hint: plate cost €{hint.cost.toFixed(2)} → chalk it up at <b>€{hint.suggested.toFixed(2)}</b> to keep {TARGET_MARGIN}%</>
                    : <>Plate cost €{hint.cost.toFixed(2)} · price is right</>}
                </div>
              )}
              <div className="mt-6 flex items-end justify-between gap-4 pt-2">
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${dark ? "text-gold/70" : "text-muted-foreground"}`}>Est. margin</p>
                  <p className="font-display text-3xl font-bold">{hint?.marginNow ?? s.margin}%</p>
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
      )}
      <OwnerSpecialCreator />
      <p className="text-center text-xs font-medium text-muted-foreground">Price hints apply to the specials board only. Printed menu prices stay fixed.</p>
    </AppShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Panel } from "@/components/AppShell";
import { buying } from "@/lib/data";

export const Route = createFileRoute("/buying")({
  head: () => ({
    meta: [
      { title: "What to buy — KitchenSense" },
      { name: "description", content: "Plain-English advice on what to order more of, less of, or stop ordering." },
      { property: "og:title", content: "What to buy — KitchenSense" },
      { property: "og:description", content: "Smarter ordering for your café, based on waste and demand." },
    ],
  }),
  component: BuyingPage,
});

const groups = [
  { key: "more", title: "Buy more", tag: "bg-good/15 text-good", icon: "↑" },
  { key: "less", title: "Buy less", tag: "bg-warn/15 text-warn", icon: "↓" },
  { key: "stop", title: "Stop ordering", tag: "bg-danger/15 text-danger", icon: "■" },
] as const;

function BuyingPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Next delivery · Friday" title="What to buy" />
      <section className="rounded-[2rem] bg-primary p-6 text-primary-foreground shadow-hero sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gold">This week's change</p>
        <p className="mt-2 font-display text-3xl font-extrabold">Save about €62</p>
        <p className="mt-2 max-w-lg text-sm text-primary-foreground/70">Following these tips trims your order without running short on busy days.</p>
      </section>
      <div className="grid gap-6 lg:grid-cols-3">
        {groups.map((g) => (
          <Panel key={g.key} title={g.title} aside={<span className={`grid size-8 place-items-center rounded-full text-sm font-bold ${g.tag}`}>{g.icon}</span>}>
            <div className="space-y-3">
              {buying[g.key].map((i) => (
                <div key={i.name} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-extrabold">{i.name}</p>
                    <span className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold ${g.tag}`}>{i.note}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{i.why}</p>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </AppShell>
  );
}

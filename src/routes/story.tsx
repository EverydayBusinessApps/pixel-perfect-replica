import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader, Panel } from "@/components/AppShell";
import { beforeAfter, mondaySpecials, sundaySurplus } from "@/lib/kitchen";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Monday special from Sunday surplus — KitchenSense" },
      { name: "description", content: "See how a café turns Sunday's leftovers into Monday's best-selling special, and what a week with KitchenSense saves." },
      { property: "og:title", content: "Monday special from Sunday surplus — KitchenSense" },
      { property: "og:description", content: "From Sunday surplus to Monday special: waste down, margins protected." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StoryPage,
});

const eur = (n: number) => `€${n.toFixed(2).replace(/\.00$/, "")}`;

function StoryPage() {
  const surplus = sundaySurplus.reduce((a, s) => a + s.eur, 0);
  const revenue = mondaySpecials.reduce((a, s) => a + s.sold * s.price, 0);
  const { before, after } = beforeAfter;
  const down = Math.round(((before.waste - after.waste) / before.waste) * 100);

  return (
    <AppShell>
      <PageHeader eyebrow="The Corner Pantry · demo story" title="Monday special from Sunday surplus" />

      <section className="relative overflow-hidden rounded-[2.5rem] bg-primary p-6 text-primary-foreground shadow-hero sm:p-8">
        <div className="absolute -right-20 -top-20 size-80 rounded-full bg-gold/10 blur-3xl" />
        <p className="relative text-[10px] font-bold uppercase tracking-widest text-gold">Sunday 17:30 → Monday 12:00</p>
        <h2 className="relative mt-3 max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl">{eur(surplus)} of leftovers became {eur(revenue)} of Monday sales.</h2>
        <div className="relative mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold">1 · Sunday close</p>
            <p className="mt-2 text-sm font-medium text-primary-foreground/80">Marisol logs what's left — 2 taps per item.</p>
            <ul className="mt-3 space-y-1 text-sm font-bold">{sundaySurplus.map((s) => <li key={s.name}>{s.name} <span className="font-medium text-primary-foreground/60">· {s.qty}</span></li>)}</ul>
          </div>
          <div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold">2 · Monday 07:00</p>
            <p className="mt-2 text-sm font-medium text-primary-foreground/80">KitchenSense suggests two specials. No menu reprint.</p>
            <ul className="mt-3 space-y-2 text-sm font-bold">{mondaySpecials.map((s) => <li key={s.name}>{s.name}<span className="block text-xs font-medium text-gold">{s.uses}</span></li>)}</ul>
          </div>
          <div className="rounded-2xl border border-gold/40 bg-gold/10 p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold">3 · Monday lunch</p>
            <p className="mt-2 font-display text-4xl font-bold">{mondaySpecials.reduce((a, s) => a + s.sold, 0)}</p>
            <p className="text-sm font-medium text-primary-foreground/80">specials sold · nothing binned</p>
          </div>
        </div>
      </section>

      <Panel title="Before & after: one week" aside={<span className="rounded-full bg-good/15 px-3 py-1 text-[11px] font-bold text-good">Waste −{down}%</span>}>
        <div className="grid gap-4 md:grid-cols-2">
          {[before, after].map((w, i) => (
            <div key={w.label} className={`rounded-2xl border p-5 ${i ? "border-gold bg-card" : "border-border bg-muted/50"}`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${i ? "text-gold-deep" : "text-muted-foreground"}`}>{w.label}</p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div><p className="font-display text-3xl font-bold">€{w.waste}</p><p className="text-xs font-semibold text-muted-foreground">binned ({w.binned})</p></div>
                <div><p className="font-display text-3xl font-bold">{w.specials}</p><p className="text-xs font-semibold text-muted-foreground">specials suggested</p></div>
                <div><p className="font-display text-3xl font-bold">{w.nudges}</p><p className="text-xs font-semibold text-muted-foreground">price nudge</p></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold-deep">Specials suggested</p>
            <ul className="mt-2 space-y-1 text-sm font-bold">{beforeAfter.specials.map((s) => <li key={s}>✦ {s}</li>)}</ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold-deep">One price nudge — specials board only</p>
            <p className="mt-2 text-sm font-extrabold">{beforeAfter.nudge.dish}</p>
            <p className="text-sm font-bold">€{beforeAfter.nudge.from.toFixed(2)} → €{beforeAfter.nudge.to.toFixed(2)}</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">{beforeAfter.nudge.why}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/waste" className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">Try the waste log</Link>
          <Link to="/specials" className="rounded-full border border-primary bg-card px-6 py-3 text-sm font-bold text-primary">See today's specials</Link>
        </div>
      </Panel>
    </AppShell>
  );
}

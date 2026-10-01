import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, EmptyState, PageHeader, Panel } from "@/components/AppShell";
import { stock } from "@/lib/data";
import { sampleWaste, wasteTypes, type WasteEntry, type WasteType } from "@/lib/kitchen";

export const Route = createFileRoute("/waste")({
  head: () => ({
    meta: [
      { title: "End-of-service waste log — KitchenSense" },
      { name: "description", content: "Log prep scrap, plate returns and spoilage in seconds so your specials get smarter every week." },
      { property: "og:title", content: "End-of-service waste log — KitchenSense" },
      { property: "og:description", content: "A 30-second waste log that teaches KitchenSense what to suggest." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WastePage,
});

const KEY = "ks-waste-log";
const eur = (n: number) => `€${n.toFixed(2)}`;

function WastePage() {
  const [log, setLog] = useState<WasteEntry[]>([]);
  const [type, setType] = useState<WasteType>("spoil");
  const [item, setItem] = useState(stock[0]!.name);
  const [qty, setQty] = useState("");
  const [cost, setCost] = useState("");

  useEffect(() => {
    try { setLog(JSON.parse(localStorage.getItem(KEY) ?? "[]")); } catch { /* ignore */ }
  }, []);
  const save = (next: WasteEntry[]) => { setLog(next); localStorage.setItem(KEY, JSON.stringify(next)); };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qty) return;
    const day = new Date().toLocaleDateString("en-IE", { weekday: "short" });
    save([{ id: crypto.randomUUID(), type, item, qty, eur: Number(cost) || 0, at: day }, ...log]);
    setQty(""); setCost("");
  };

  const totals = (Object.keys(wasteTypes) as WasteType[]).map((t) => ({ t, eur: log.filter((l) => l.type === t).reduce((a, l) => a + l.eur, 0) }));
  const byItem = new Map<string, number>();
  log.forEach((l) => byItem.set(l.item, (byItem.get(l.item) ?? 0) + l.eur));
  const top = [...byItem.entries()].sort((a, b) => b[1] - a[1])[0];
  const services = new Set(log.map((l) => l.at)).size;

  return (
    <AppShell>
      <PageHeader eyebrow="After close · 30 seconds" title="Waste log" />

      <Panel title="What went in the bin today?">
        <form onSubmit={add} className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(wasteTypes) as WasteType[]).map((t) => (
              <button key={t} type="button" onClick={() => setType(t)} className={`rounded-2xl border-2 p-3 text-left transition-colors ${type === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>
                <p className="text-sm font-extrabold">{wasteTypes[t].label}</p>
                <p className={`mt-0.5 hidden text-[11px] font-medium sm:block ${type === t ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{wasteTypes[t].hint}</p>
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_8rem_auto]">
            <select value={item} onChange={(e) => setItem(e.target.value)} className="rounded-xl border border-input bg-card px-3 py-3 text-sm font-semibold">
              {stock.map((s) => <option key={s.name}>{s.name}</option>)}
            </select>
            <input value={qty} onChange={(e) => setQty(e.target.value)} placeholder="How much? e.g. 2 heads" className="rounded-xl border border-input bg-card px-3 py-3 text-sm font-semibold" />
            <input value={cost} onChange={(e) => setCost(e.target.value)} inputMode="decimal" placeholder="€ (optional)" className="rounded-xl border border-input bg-card px-3 py-3 text-sm font-semibold" />
            <button className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">Log it</button>
          </div>
        </form>
      </Panel>

      {log.length === 0 ? (
        <EmptyState
          icon="×"
          title="Log your first service"
          body="Add what was scrapped, sent back or went off tonight. After 5 services, KitchenSense starts shaping specials around what you actually throw away."
          action={<button onClick={() => save(sampleWaste)} className="rounded-full border border-primary bg-card px-5 py-2.5 text-sm font-bold text-primary">Try with a sample week</button>}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <Panel title="This week" className="lg:col-span-1">
            <div className="space-y-3">
              {totals.map(({ t, eur: v }) => (
                <div key={t} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
                  <span className={`rounded-md px-2 py-1 text-[11px] font-bold uppercase ${wasteTypes[t].tone}`}>{wasteTypes[t].label}</span>
                  <span className="font-display text-xl font-bold">{eur(v)}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-primary p-5 text-primary-foreground">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gold">What specials learn</p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-primary-foreground/80">
                {services < 5
                  ? `${services} of 5 services logged — keep going and suggestions start adapting.`
                  : top ? `${top[0]} is your biggest loss (${eur(top[1])}). Next week's specials will lean on it earlier, and we'll suggest ordering less.` : ""}
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary-foreground/10"><div className="h-full bg-gold" style={{ width: `${Math.min(100, services * 20)}%` }} /></div>
            </div>
          </Panel>

          <Panel title="Log" aside={<button onClick={() => save([])} className="text-xs font-bold text-muted-foreground">Clear</button>} className="lg:col-span-2">
            <ul className="space-y-2">
              {log.map((l) => (
                <li key={l.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                  <span className="w-10 text-xs font-bold text-muted-foreground">{l.at}</span>
                  <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase ${wasteTypes[l.type].tone}`}>{wasteTypes[l.type].label}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-extrabold">{l.item} <span className="font-semibold text-muted-foreground">· {l.qty}</span></span>
                  <span className="text-sm font-bold">{l.eur ? eur(l.eur) : "—"}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}
    </AppShell>
  );
}

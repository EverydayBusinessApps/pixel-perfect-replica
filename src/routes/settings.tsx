import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Panel } from "@/components/AppShell";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — KitchenSense" },
      { name: "description", content: "Connect your till, online ordering, staff and business details." },
      { property: "og:title", content: "Settings — KitchenSense" },
      { property: "og:description", content: "Connections and business profile for KitchenSense." },
    ],
  }),
  component: SettingsPage,
});

const connections = [
  { name: "Till / POS", desc: "Square · sales sync every 15 min", on: true },
  { name: "Online ordering", desc: "Deliveroo, Just Eat", on: false },
  { name: "Supplier orders", desc: "Send orders by email", on: true },
];
const staff = [
  { name: "Marisol Alvarez", role: "Owner" },
  { name: "Tom Byrne", role: "Head chef" },
  { name: "Aoife Kelly", role: "Front of house" },
];

function SettingsPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Your café" title="Settings" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Connections">
          <div className="space-y-3">
            {connections.map((c) => (
              <div key={c.name} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
                <div className="min-w-0">
                  <p className="font-extrabold">{c.name}</p>
                  <p className="text-xs font-semibold text-muted-foreground">{c.desc}</p>
                </div>
                <button className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${c.on ? "bg-good/15 text-good" : "bg-primary text-primary-foreground"}`}>{c.on ? "Connected" : "Connect"}</button>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Staff" aside={<button className="text-xs font-bold text-gold">+ Invite</button>}>
          <div className="space-y-3">
            {staff.map((s) => (
              <div key={s.name} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-gold">{s.name.split(" ").map((p) => p[0]).join("")}</div>
                <div className="min-w-0">
                  <p className="font-extrabold">{s.name}</p>
                  <p className="text-xs font-semibold text-muted-foreground">{s.role}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Business profile" className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {[["Name", "The Corner Pantry"], ["Type", "Café & brunch"], ["Location", "Rathmines, Dublin"], ["Opening hours", "Mon–Sun · 7:30–17:00"]].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{k}</p>
                <p className="mt-1 font-bold">{v}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}

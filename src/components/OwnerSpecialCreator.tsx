import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, WandSparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stock } from "@/lib/data";
import { suggestOwnerSpecial } from "@/lib/special.functions";

type Idea = Awaited<ReturnType<typeof suggestOwnerSpecial>>;

export function OwnerSpecialCreator() {
  const generate = useServerFn(suggestOwnerSpecial);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [direction, setDirection] = useState("");
  const [idea, setIdea] = useState<Idea | null>(null);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleIngredient = (name: string) => {
    setSelected((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  };

  const makeIdea = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    setError("");
    setAdded(false);
    try {
      const ingredients = stock.filter((item) => selected.includes(item.name));
      setIdea(await generate({ data: { ingredients, direction } }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "AI could not create an idea right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gold/50 bg-secondary/60">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-gold"><WandSparkles aria-hidden="true" className="size-5" /></span>
          <div>
            <p className="font-extrabold">Create your own special</p>
            <p className="text-xs font-semibold text-muted-foreground">Pick the ingredients. AI helps with the idea.</p>
          </div>
        </div>
        <Button type="button" variant={open ? "ghost" : "default"} size="sm" onClick={() => setOpen((value) => !value)}>
          {open ? <><X aria-hidden="true" /> Close</> : <><Sparkles aria-hidden="true" /> Get creative</>}
        </Button>
      </div>

      {open && (
        <div className="space-y-5 border-t border-gold/30 p-4 sm:p-5">
          <div>
            <p className="text-xs font-extrabold uppercase text-gold-deep">1. Choose from the pantry</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[...stock].sort((a, b) => a.days - b.days).map((item) => {
                const on = selected.includes(item.name);
                return (
                  <Button key={item.name} type="button" size="sm" variant={on ? "default" : "outline"} aria-pressed={on} onClick={() => toggleIngredient(item.name)} className="h-auto whitespace-normal py-2 text-left">
                    {on && <span aria-hidden="true">✓</span>}{item.name} · {item.days}d
                  </Button>
                );
              })}
            </div>
          </div>

          <label className="block">
            <span className="text-xs font-extrabold uppercase text-gold-deep">2. Add your twist <span className="normal-case text-muted-foreground">(optional)</span></span>
            <textarea value={direction} onChange={(event) => setDirection(event.target.value)} maxLength={240} rows={2} placeholder="e.g. warming lunch, vegetarian, something for the counter…" className="mt-2 w-full resize-none rounded-xl border border-input bg-card px-3 py-2.5 text-sm font-semibold text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring" />
          </label>

          <Button type="button" onClick={makeIdea} disabled={selected.length === 0 || loading} className="w-full sm:w-auto">
            <Sparkles aria-hidden="true" /> {loading ? "Creating your special…" : idea ? "Try another idea" : "Create with AI"}
          </Button>

          {selected.length === 0 && <p className="text-xs font-semibold text-muted-foreground">Choose at least one ingredient to begin.</p>}
          {error && <p role="alert" className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm font-semibold text-danger">{error}</p>}

          {idea && (
            <article className="rounded-2xl bg-primary p-5 text-primary-foreground">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase text-gold">Your AI-assisted special</p>
                  <h3 className="mt-1 text-2xl font-extrabold">{idea.name}</h3>
                </div>
                <span className="rounded-full bg-gold px-3 py-1 text-sm font-extrabold text-primary">€{idea.price.toFixed(2)}</span>
              </div>
              <p className="mt-3 text-sm font-medium text-primary-foreground/80">{idea.description}</p>
              <p className="mt-3 text-xs font-bold text-gold">Uses: {idea.ingredients.join(" · ")}</p>
              <p className="mt-1 text-xs font-semibold text-primary-foreground/70">Could save up to €{idea.saves.toFixed(2)} of pantry stock.</p>
              <Button type="button" onClick={() => setAdded((value) => !value)} className="mt-5 bg-gold text-primary hover:bg-gold/90">
                {added ? "✓ On specials" : "Make it a special"}
              </Button>
            </article>
          )}
          <p className="text-xs font-medium text-muted-foreground">AI ideas are a starting point — check portions, allergens and prep before serving.</p>
        </div>
      )}
    </div>
  );
}
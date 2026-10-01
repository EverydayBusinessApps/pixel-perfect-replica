import { stock, type StockItem } from "./data";

/** One-tap special ideas for an ingredient that must be used soon. eur = money at risk if the stock is binned. */
const quickIdeas: Record<string, { dish: string; price: number; eur: number }> = {
  "Chicken breast": { dish: "Chicken, Bacon & Avo Toastie", price: 12.5, eur: 12.0 },
  Lettuce: { dish: "Chicken Caesar Bowl", price: 11.0, eur: 4.8 },
  Avocados: { dish: "Smashed Avo on Sourdough", price: 10.5, eur: 8.6 },
  Sourdough: { dish: "Tomato & Sourdough Panzanella", price: 9.5, eur: 12.0 },
  Croissants: { dish: "Almond Croissant Bake", price: 4.2, eur: 16.0 },
  Tomatoes: { dish: "Roast Tomato Soup", price: 7.0, eur: 6.3 },
  Milk: { dish: "Rice Pudding Pot", price: 4.5, eur: 3.2 },
  "Smoked salmon": { dish: "Salmon & Scrambled Eggs", price: 13.0, eur: 22.5 },
};

/** Spoil radar: everything that must be used within 48 hours. */
export function spoilRadar(items: StockItem[] = stock) {
  return items
    .filter((i) => i.days <= 2)
    .sort((a, b) => a.days - b.days)
    .map((i) => ({ ...i, idea: quickIdeas[i.name] ?? { dish: `${i.name} special`, price: 9, eur: 5 } }));
}

/** Total euro value at risk across the spoil radar. */
export const radarAtRisk = (items: ReturnType<typeof spoilRadar>) =>
  items.reduce((a, i) => a + i.idea.eur, 0);

export interface SuggestedSpecial {
  dish: string;
  price: number;
  ingredients: ReturnType<typeof spoilRadar>;
  days: number;
  eur: number;
  note: string;
}

/** Groups compatible at-risk ingredients into fewer, practical specials. */
export function suggestedSpecials(items: ReturnType<typeof spoilRadar>): SuggestedSpecial[] {
  const remaining = new Map(items.map((item) => [item.name, item]));
  const suggestions: SuggestedSpecial[] = [];

  const combine = (names: string[], dish: string, price: number, note: string) => {
    const ingredients = names.flatMap((name) => {
      const item = remaining.get(name);
      return item ? [item] : [];
    });
    if (ingredients.length < 2) return;

    ingredients.forEach((item) => remaining.delete(item.name));
    suggestions.push({
      dish,
      price,
      ingredients,
      days: Math.min(...ingredients.map((item) => item.days)),
      eur: ingredients.reduce((total, item) => total + item.cost, 0),
      note,
    });
  };

  combine(
    ["Chicken breast", "Avocados", "Lettuce", "Sourdough"],
    "Chicken, Avo & Lettuce Club",
    12.5,
    "One special uses four ingredients that need attention.",
  );
  combine(
    ["Croissants", "Milk"],
    "Almond Croissant Bake",
    4.2,
    "A next-day bake turns leftover pastries into a counter special.",
  );

  remaining.forEach((item) => {
    suggestions.push({
      dish: item.idea.dish,
      price: item.idea.price,
      ingredients: [item],
      days: item.days,
      eur: item.cost,
      note: `A simple way to use ${item.name.toLowerCase()} before it spoils.`,
    });
  });

  return suggestions.sort((a, b) => a.days - b.days || b.eur - a.eur);
}

/** Plate cost for each suggested special — used only for specials price hints (printed menu stays fixed). */
export const specialCost: Record<string, number> = {
  "Chicken, Bacon & Avo Toastie": 4.0,
  "Hearty Potato & Leek Soup": 1.65,
  "Salmon & Scrambled Eggs": 4.95,
  "Almond Croissant Bake": 0.8,
};

export const TARGET_MARGIN = 65;

/** Price hint for a special only when its margin slips below target. */
export function specialPriceHint(name: string, price: number) {
  const cost = specialCost[name];
  if (cost === undefined) return null;
  const marginNow = Math.round(((price - cost) / price) * 100);
  if (marginNow >= TARGET_MARGIN) return { cost, marginNow, suggested: null as number | null };
  const suggested = Math.ceil((cost / (1 - TARGET_MARGIN / 100)) * 2) / 2;
  return { cost, marginNow, suggested };
}

export const parseEur = (s: string) => Number(s.replace(/[^\d.]/g, ""));

/** Hero demo story: Monday special from Sunday surplus. */
export const sundaySurplus = [
  { name: "Sourdough", qty: "4 loaves", eur: 9.6 },
  { name: "Chicken breast", qty: "1.2 kg", eur: 10.4 },
  { name: "Croissants", qty: "8", eur: 8.0 },
  { name: "Tomatoes", qty: "1.5 kg", eur: 2.7 },
];

export const mondaySpecials = [
  { name: "Chicken & Sourdough Panzanella", uses: "Chicken · sourdough · tomatoes", sold: 24, price: 11.5 },
  { name: "Almond Croissant Bake", uses: "Croissants · milk", sold: 16, price: 4.2 },
];

export const beforeAfter = {
  before: { label: "Week before KitchenSense", waste: 312, specials: 0, nudges: 0, binned: "38 kg" },
  after: { label: "First week with KitchenSense", waste: 184, specials: 3, nudges: 1, binned: "21 kg" },
  specials: ["Chicken & Sourdough Panzanella", "Almond Croissant Bake", "Hearty Potato & Leek Soup"],
  nudge: { dish: "Salmon & Scrambled Eggs (special)", from: 13.0, to: 14.5, why: "Smoked salmon up 18% — printed menu untouched." },
};

export type WasteType = "prep" | "plate" | "spoil";
export const wasteTypes: Record<WasteType, { label: string; hint: string; tone: string }> = {
  prep: { label: "Prep scrap", hint: "Trimmings, peelings, over-prepped", tone: "bg-warn/15 text-warn" },
  plate: { label: "Plate return", hint: "Left on the plate by customers", tone: "bg-primary/10 text-primary" },
  spoil: { label: "Spoilage", hint: "Went off before it was used", tone: "bg-danger/15 text-danger" },
};

export interface WasteEntry { id: string; type: WasteType; item: string; qty: string; eur: number; at: string }

export const sampleWaste: WasteEntry[] = [
  { id: "s1", type: "spoil", item: "Lettuce", qty: "3 heads", eur: 2.4, at: "Mon" },
  { id: "s2", type: "plate", item: "Potatoes", qty: "1.1 kg", eur: 1.6, at: "Mon" },
  { id: "s3", type: "prep", item: "Sourdough", qty: "2 loaves (ends)", eur: 4.8, at: "Tue" },
  { id: "s4", type: "spoil", item: "Croissants", qty: "6", eur: 6.0, at: "Wed" },
  { id: "s5", type: "plate", item: "Lettuce", qty: "side salads", eur: 1.9, at: "Wed" },
  { id: "s6", type: "prep", item: "Avocados", qty: "3", eur: 2.6, at: "Thu" },
];

export interface MenuItem {
  name: string;
  sold: number[]; // last 8 weeks, oldest first
  price: number;
  cost: number; // ingredient cost per plate, today
  costPrev: number; // ingredient cost per plate, 3 months ago
  ingredients: string[];
  pairsWith?: string[]; // dishes this is usually ordered alongside
}

export const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

export const menu: MenuItem[] = [
  { name: "Full Irish Breakfast", sold: [210, 198, 225, 240, 232, 251, 246, 262], price: 14.5, cost: 4.9, costPrev: 4.3, ingredients: ["Bacon rashers", "Free-range eggs", "Tomatoes", "Potatoes", "Sourdough"] },
  { name: "Chicken & Avo Toastie", sold: [140, 152, 149, 161, 170, 168, 182, 190], price: 12.5, cost: 4.0, costPrev: 3.5, ingredients: ["Chicken breast", "Avocados", "Sourdough", "Cheddar"] },
  { name: "Flat White", sold: [620, 640, 610, 655, 690, 702, 715, 730], price: 3.8, cost: 0.62, costPrev: 0.55, ingredients: ["Espresso beans", "Milk"] },
  { name: "Salmon & Scrambled Eggs", sold: [96, 102, 99, 110, 118, 121, 130, 128], price: 13.0, cost: 4.9, costPrev: 4.1, ingredients: ["Smoked salmon", "Free-range eggs", "Sourdough", "Milk"] },
  { name: "Porridge & Berries", sold: [88, 84, 90, 79, 75, 82, 80, 77], price: 7.0, cost: 1.1, costPrev: 1.05, ingredients: ["Oats", "Milk"] },
  { name: "Rocket & Pear Salad", sold: [48, 42, 39, 35, 30, 26, 24, 19], price: 10.5, cost: 3.6, costPrev: 3.2, ingredients: ["Rocket", "Pear", "Cheddar"] },
  { name: "Croissant", sold: [160, 150, 148, 141, 139, 130, 128, 124], price: 3.2, cost: 0.95, costPrev: 0.8, ingredients: ["Croissants"] },
  { name: "Caesar Wrap", sold: [64, 60, 58, 51, 49, 44, 40, 38], price: 11.0, cost: 3.9, costPrev: 3.3, ingredients: ["Chicken breast", "Lettuce", "Parmesan", "Tortilla wraps"] },
  { name: "Mocha", sold: [120, 128, 135, 142, 150, 158, 165, 172], price: 4.4, cost: 0.85, costPrev: 0.75, ingredients: ["Espresso beans", "Milk"] },
  { name: "Kids Breakfast", sold: [64, 58, 61, 66, 60, 63, 59, 62], price: 5.5, cost: 4.6, costPrev: 4.2, ingredients: ["Bacon rashers", "Free-range eggs", "Sourdough"], pairsWith: ["Full Irish Breakfast", "Flat White"] },
];

export const total = (m: MenuItem) => m.sold.reduce((a, b) => a + b, 0);
export const trend = (m: MenuItem) => {
  const first = m.sold.slice(0, 4).reduce((a, b) => a + b, 0);
  const last = m.sold.slice(4).reduce((a, b) => a + b, 0);
  return Math.round(((last - first) / first) * 100);
};
export const margin = (price: number, cost: number) => Math.round(((price - cost) / price) * 100);

/** For each ingredient, which menu items use it. */
export function ingredientUsage() {
  const map = new Map<string, string[]>();
  for (const m of menu) for (const i of m.ingredients) map.set(i, [...(map.get(i) ?? []), m.name]);
  return [...map.entries()].map(([name, dishes]) => ({ name, dishes })).sort((a, b) => b.dishes.length - a.dishes.length);
}

/** Approximate purchase price per ingredient (per pack/order unit). */
export const ingredientPrices: Record<string, number> = {
  "Smoked salmon": 22.5,
  "Rocket": 9.4,
  "Avocados": 8.6,
  "Parmesan": 8.9,
  "Bacon rashers": 7.8,
  "Tortilla wraps": 5.4,
  "Croissants": 16.0,
  "Lettuce": 4.8,
  "Pear": 4.2,
  "Tomatoes": 6.3,
  "Potatoes": 5.5,
  "Oats": 9.8,
  "Cheddar": 11.5,
  "Chicken breast": 12.4,
  "Milk": 3.2,
  "Sourdough": 12.0,
  "Espresso beans": 42.0,
  "Free-range eggs": 14.5,
};

export const priceOf = (name: string) => ingredientPrices[name] ?? 0;

/** Low-margin dishes that are usually ordered alongside bigger-ticket items. */
export function lossLeaders() {
  return menu
    .filter((m) => m.pairsWith?.length && margin(m.price, m.cost) < 25)
    .map((m) => {
      const partners = m.pairsWith!.map((n) => menu.find((x) => x.name === n)!).filter(Boolean);
      const price = m.price + partners.reduce((a, p) => a + p.price, 0);
      const cost = m.cost + partners.reduce((a, p) => a + p.cost, 0);
      return { ...m, now: margin(m.price, m.cost), partners, basketMargin: margin(price, cost) };
    });
}

/** Price flags ONLY when a dish is drifting into breakeven territory — menus are printed, so no routine repricing. */
export function priceAlerts() {
  return menu
    .map((m) => {
      const now = margin(m.price, m.cost);
      const projectedCost = m.cost + (m.cost - m.costPrev); // if the same rise happens again
      const projected = margin(m.price, projectedCost);
      const suggested = Math.ceil((projectedCost / 0.75) * 10) / 10; // restores ~25% margin
      return { name: m.name, price: m.price, cost: m.cost, now, projected, suggested };
    })
    .filter((m) => m.now <= 12 || m.projected <= 5)
    .sort((a, b) => a.now - b.now);
}

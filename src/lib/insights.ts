export interface MenuItem {
  name: string;
  sold: number[]; // last 8 weeks, oldest first
  price: number;
  cost: number; // ingredient cost per plate, today
  costPrev: number; // ingredient cost per plate, 3 months ago
  ingredients: string[];
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

const TARGET_MARGIN = 70;

/** Suggest a price that brings margin back to target (rounded to 10c), only when cost has risen and margin dropped below target. */
export function priceSuggestions() {
  return menu
    .map((m) => {
      const now = margin(m.price, m.cost);
      const rise = Math.round(((m.cost - m.costPrev) / m.costPrev) * 100);
      const target = Math.ceil((m.cost / (1 - TARGET_MARGIN / 100)) * 10) / 10;
      const suggested = Math.max(m.price, Math.min(target, m.price * 1.12)); // cap rises at 12%
      return { ...m, now, rise, suggested: Math.round(suggested * 10) / 10, newMargin: margin(suggested, m.cost) };
    })
    .filter((s) => s.rise > 0 && s.now < TARGET_MARGIN && s.suggested > s.price)
    .sort((a, b) => a.now - b.now);
}
export { TARGET_MARGIN };

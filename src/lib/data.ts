export type Status = "good" | "watch" | "urgent";

export interface StockItem {
  name: string;
  qty: string;
  days: number;
  category: "Meat & Fish" | "Produce" | "Dairy" | "Bakery" | "Dry goods";
  /** Purchase cost in euro for the quantity shown. */
  cost: number;
}

export const stock: StockItem[] = [
  { name: "Chicken breast", qty: "1.4 kg", days: 2, category: "Meat & Fish", cost: 12.4 },
  { name: "Smoked salmon", qty: "600 g", days: 4, category: "Meat & Fish", cost: 22.5 },
  { name: "Bacon rashers", qty: "2.2 kg", days: 6, category: "Meat & Fish", cost: 7.8 },
  { name: "Lettuce", qty: "6 heads", days: 1, category: "Produce", cost: 4.8 },
  { name: "Tomatoes", qty: "3.5 kg", days: 3, category: "Produce", cost: 6.3 },
  { name: "Avocados", qty: "14", days: 2, category: "Produce", cost: 8.6 },
  { name: "Potatoes", qty: "12 kg", days: 14, category: "Produce", cost: 5.5 },
  { name: "Milk", qty: "18 L", days: 3, category: "Dairy", cost: 3.2 },
  { name: "Cheddar", qty: "2 kg", days: 12, category: "Dairy", cost: 11.5 },
  { name: "Free-range eggs", qty: "90", days: 9, category: "Dairy", cost: 14.5 },
  { name: "Sourdough", qty: "5 loaves", days: 1, category: "Bakery", cost: 12.0 },
  { name: "Croissants", qty: "16", days: 1, category: "Bakery", cost: 16.0 },
  { name: "Espresso beans", qty: "4 kg", days: 30, category: "Dry goods", cost: 42.0 },
  { name: "Oats", qty: "6 kg", days: 60, category: "Dry goods", cost: 9.8 },
];

export const statusOf = (days: number): Status => (days <= 2 ? "urgent" : days <= 4 ? "watch" : "good");

export const statusStyles: Record<Status, { label: string; badge: string; bar: string; dot: string }> = {
  good: { label: "Fresh", badge: "bg-good/15 text-good", bar: "bg-good", dot: "bg-good" },
  watch: { label: "Use soon", badge: "bg-warn/15 text-warn", bar: "bg-warn", dot: "bg-warn" },
  urgent: { label: "Use now", badge: "bg-danger/15 text-danger", bar: "bg-danger", dot: "bg-danger" },
};

export interface Special {
  name: string;
  why: string;
  reason: "Use it up" | "Over-stocked" | "Trending" | "Weather";
  margin: number;
  price: string;
  uses: string;
}

export const specials: Special[] = [
  { name: "Chicken, Bacon & Avo Toastie", why: "Your chicken and avocados need using in the next 2 days. Toasties sell well on wet days.", reason: "Use it up", margin: 68, price: "€12.50", uses: "Chicken · avocado · sourdough" },
  { name: "Hearty Potato & Leek Soup", why: "You have 12 kg of potatoes and rain is forecast all week.", reason: "Weather", margin: 78, price: "€7.50", uses: "Potatoes · milk" },
  { name: "Salmon & Scrambled Eggs", why: "Brunch searches are up locally and smoked salmon has 4 days left.", reason: "Trending", margin: 62, price: "€13.00", uses: "Salmon · eggs · sourdough" },
  { name: "Almond Croissant Bake", why: "Turn today's leftover croissants into a next-day bake instead of binning them.", reason: "Over-stocked", margin: 81, price: "€4.20", uses: "Croissants · milk" },
];

export const buying = {
  more: [
    { name: "Milk", note: "Order 24 L (+6 L)", why: "Hot drinks jump about 20% when it rains. Rain is forecast Thu–Sat." },
    { name: "Free-range eggs", note: "Order 120 (+30)", why: "Weekend brunch sold out early two weeks running." },
  ],
  less: [
    { name: "Lettuce", note: "Order 4 heads (−3)", why: "You binned 9 heads last month. Salad sales drop in colder weather." },
    { name: "Croissants", note: "Order 12 (−6)", why: "About 5 are left over most afternoons." },
  ],
  stop: [
    { name: "Rocket", note: "Pause orders", why: "Thrown out 4 weeks in a row. Only used in one dish." },
  ],
};

export const forecast = {
  today: { covers: 142, change: 8, weather: "Light rain · 13°C", note: "Busy lunch expected. Soups and hot drinks will do well." },
  next3: [
    { day: "Fri", covers: 156, weather: "Rain · 12°C" },
    { day: "Sat", covers: 210, weather: "Showers · 14°C", event: "Rugby match nearby" },
    { day: "Sun", covers: 188, weather: "Cloudy · 15°C" },
  ],
  week: [
    { day: "Thu", covers: 142 },
    { day: "Fri", covers: 156 },
    { day: "Sat", covers: 210 },
    { day: "Sun", covers: 188 },
    { day: "Mon", covers: 96 },
    { day: "Tue", covers: 104 },
    { day: "Wed", covers: 118 },
  ],
};

export const wasteRisk = 62;

export type LocalEvent = {
  name: string;
  dates: string;
  daysAway: number;
  lift: number;
  kind: "National" | "Local" | "Sport";
  impact: string;
  prep: string[];
};

export const localEvents: LocalEvent[] = [
  {
    name: "Rugby match nearby",
    dates: "Sat 3 Oct",
    daysAway: 2,
    lift: 40,
    kind: "Sport",
    impact: "Pre-match brunch rush 10:00–13:00, quiet once the match starts.",
    prep: ["Extra 30 eggs and 2 kg bacon", "Two baristas on 10:00–13:00", "Skip the afternoon bake"],
  },
  {
    name: "Town Arts & Food Festival",
    dates: "Sat 17 – Sun 25 Oct",
    daysAway: 16,
    lift: 55,
    kind: "Local",
    impact: "A full week of visitors. Takeaway coffee and grab-and-go food sell fastest.",
    prep: ["Order takeaway cups and lids early (+60%)", "Pre-wrap sandwiches each morning", "Book extra weekend staff now", "Short festival specials board"],
  },
  {
    name: "Halloween & mid-term break",
    dates: "Mon 26 Oct – Sat 31 Oct",
    daysAway: 25,
    lift: 25,
    kind: "National",
    impact: "Schools off all week — more families and kids' orders, especially mornings.",
    prep: ["Stock up on kids' breakfast items", "Pumpkin spice latte & barmbrack as specials", "Spooky bakes for the counter on the 30th–31st"],
  },
  {
    name: "October Bank Holiday",
    dates: "Mon 26 Oct",
    daysAway: 25,
    lift: 30,
    kind: "National",
    impact: "Monday trades like a Saturday — don't order light for it.",
    prep: ["Order as for a weekend", "Full brunch menu all day"],
  },
];

export const weekPlan = [
  { day: "Thu", covers: 142, why: "Rain", action: "Soup on early, extra milk for hot drinks" },
  { day: "Fri", covers: 156, why: "Rain + payday", action: "Prep 20% more lunches" },
  { day: "Sat", covers: 210, why: "Rugby match", action: "Brunch rush 10–1, two baristas" },
  { day: "Sun", covers: 188, why: "Usual Sunday", action: "Normal brunch prep" },
  { day: "Mon", covers: 96, why: "Quiet start", action: "Use Sunday surplus in specials, order light" },
  { day: "Tue", covers: 104, why: "Quiet", action: "Half batch of bakes" },
  { day: "Wed", covers: 118, why: "Market day", action: "Standard prep" },
];

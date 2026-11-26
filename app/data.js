// The household and its November 2026 ledger. Every figure the site shows
// is computed from these rows by ledger.js — nothing is hard-coded twice,
// so the overview, the budgets and the report can never disagree.
//
// The household: Aoi and Ren Takahashi, a couple in a one-bedroom flat in
// Setagaya, Tokyo. Two take-home salaries, paid on the 25th. Amounts are
// yen. The ledger runs 1–26 November 2026 (today in the site's world is
// the 26th); October is kept as a finished month for the report.

export const HOUSEHOLD = {
  names: 'Aoi & Ren Takahashi',
  home: 'Setagaya, Tokyo · 1LDK, ¥118,000 a month',
  monthLabel: 'November 2026',
  todayDay: 26,
  daysInMonth: 30,
};

export const INCOME = [
  { date: '2026-11-25', source: 'Salary — Aoi (design studio, take-home)', amount: 298400 },
  { date: '2026-11-25', source: 'Salary — Ren (logistics, take-home)', amount: 171300 },
  { date: '2026-11-08', source: 'Sold the old bicycle on a resale app', amount: 12000 },
];

// kind sorts a category into the 50/30/20 report: needs, wants, or savings.
export const CATEGORIES = [
  { id: 'housing',        name: 'Housing',        kind: 'need',    budget: 120000, colour: '#b5542d' },
  { id: 'utilities',      name: 'Utilities',      kind: 'need',    budget: 21000,  colour: '#d99a26' },
  { id: 'groceries',      name: 'Groceries',      kind: 'need',    budget: 88000,  colour: '#4d7c4d' },
  { id: 'transport',      name: 'Transport',      kind: 'need',    budget: 19000,  colour: '#4d6f8f' },
  { id: 'health',         name: 'Health',         kind: 'need',    budget: 15000,  colour: '#7a9e7e' },
  { id: 'communications', name: 'Communications', kind: 'need',    budget: 14000,  colour: '#5f8a8b' },
  { id: 'insurance',      name: 'Insurance',      kind: 'need',    budget: 10000,  colour: '#8f7a4d' },
  { id: 'household',      name: 'Household goods',kind: 'need',    budget: 15000,  colour: '#a08b62' },
  { id: 'dining',         name: 'Dining out',     kind: 'want',    budget: 24000,  colour: '#c2436b' },
  { id: 'shopping',       name: 'Shopping',       kind: 'want',    budget: 30000,  colour: '#7d5ba6' },
  { id: 'leisure',        name: 'Leisure',        kind: 'want',    budget: 18000,  colour: '#3e7cb1' },
  { id: 'subscriptions',  name: 'Subscriptions',  kind: 'want',    budget: 3000,   colour: '#946846' },
  { id: 'savings',        name: 'Savings transfers', kind: 'saving', budget: 68000, colour: '#2e6e5e' },
];

// One row per purchase or payment, newest last in the file; views sort.
export const TRANSACTIONS = [
  { date: '2026-11-01', payee: 'Rent — Sakura Heights 302', category: 'housing', amount: 118000, method: 'Bank transfer' },
  { date: '2026-11-01', payee: 'Transfer — emergency fund', category: 'savings', amount: 40000, method: 'Bank transfer' },
  { date: '2026-11-01', payee: 'Drugstore — toiletries restock', category: 'household', amount: 3560, method: 'Card' },
  { date: '2026-11-02', payee: 'Supermarket Life — weekly shop', category: 'groceries', amount: 6842, method: 'Card' },
  { date: '2026-11-02', payee: 'Suica charge', category: 'transport', amount: 3000, method: 'Mobile Suica' },
  { date: '2026-11-03', payee: 'Ramen Menya — two bowls', category: 'dining', amount: 2400, method: 'Card' },
  { date: '2026-11-03', payee: 'Cinema — evening screening', category: 'leisure', amount: 3800, method: 'Card' },
  { date: '2026-11-03', payee: 'Convenience store — milk and eggs', category: 'groceries', amount: 1280, method: 'Cash' },
  { date: '2026-11-04', payee: 'Supermarket Life — weekly shop', category: 'groceries', amount: 5219, method: 'Card' },
  { date: '2026-11-04', payee: 'Drugstore — detergent and sponges', category: 'household', amount: 3980, method: 'Card' },
  { date: '2026-11-05', payee: 'Electricity — October bill', category: 'utilities', amount: 8940, method: 'Direct debit' },
  { date: '2026-11-05', payee: 'Mobile phones — two lines', category: 'communications', amount: 7860, method: 'Direct debit' },
  { date: '2026-11-06', payee: 'Market — vegetables and fish', category: 'groceries', amount: 4672, method: 'Cash' },
  { date: '2026-11-06', payee: 'Stationery — notebooks for work', category: 'shopping', amount: 1650, method: 'Card' },
  { date: '2026-11-07', payee: 'Sushi lunch — Sangenjaya', category: 'dining', amount: 4850, method: 'Card' },
  { date: '2026-11-07', payee: 'Bookstore — two paperbacks', category: 'shopping', amount: 2970, method: 'Card' },
  { date: '2026-11-08', payee: 'Taxi — late train home', category: 'transport', amount: 1840, method: 'Card' },
  { date: '2026-11-08', payee: 'Supermarket Life — weekly shop', category: 'groceries', amount: 7315, method: 'Card' },
  { date: '2026-11-09', payee: 'Pharmacy — cold medicine', category: 'health', amount: 2260, method: 'Card' },
  { date: '2026-11-09', payee: 'Lunch — set menu near office', category: 'dining', amount: 1120, method: 'Cash' },
  { date: '2026-11-10', payee: 'City gas — October bill', category: 'utilities', amount: 4120, method: 'Direct debit' },
  { date: '2026-11-10', payee: 'Music and video subscriptions', category: 'subscriptions', amount: 2480, method: 'Card' },
  { date: '2026-11-11', payee: 'Supermarket Life — weekly shop', category: 'groceries', amount: 5904, method: 'Card' },
  { date: '2026-11-11', payee: 'Café — coffee with a friend', category: 'dining', amount: 1560, method: 'Card' },
  { date: '2026-11-12', payee: 'Suica charge', category: 'transport', amount: 3000, method: 'Mobile Suica' },
  { date: '2026-11-12', payee: 'Clothing sale — work shirts', category: 'shopping', amount: 8900, method: 'Card' },
  { date: '2026-11-13', payee: 'Supermarket Life — weekly shop', category: 'groceries', amount: 6238, method: 'Card' },
  { date: '2026-11-13', payee: 'Bus — day pass top-up', category: 'transport', amount: 420, method: 'Cash' },
  { date: '2026-11-14', payee: 'Izakaya — dinner with friends', category: 'dining', amount: 9600, method: 'Card' },
  { date: '2026-11-14', payee: 'Museum — special exhibition', category: 'leisure', amount: 3200, method: 'Card' },
  { date: '2026-11-15', payee: 'Supermarket Life — weekly shop', category: 'groceries', amount: 5487, method: 'Card' },
  { date: '2026-11-15', payee: 'News subscription — monthly', category: 'subscriptions', amount: 980, method: 'Card' },
  { date: '2026-11-15', payee: 'Home centre — cleaning supplies', category: 'household', amount: 2340, method: 'Card' },
  { date: '2026-11-16', payee: 'Dental clinic — checkup and clean', category: 'health', amount: 5500, method: 'Card' },
  { date: '2026-11-16', payee: 'Convenience store — rice balls', category: 'groceries', amount: 3214, method: 'Cash' },
  { date: '2026-11-17', payee: 'Supermarket Life — weekly shop', category: 'groceries', amount: 4958, method: 'Card' },
  { date: '2026-11-17', payee: 'Gift — tea set for Ren’s parents', category: 'shopping', amount: 6500, method: 'Card' },
  { date: '2026-11-18', payee: 'Bakery café — breakfast out', category: 'dining', amount: 2180, method: 'Card' },
  { date: '2026-11-18', payee: 'Home internet — fibre line', category: 'communications', amount: 5280, method: 'Direct debit' },
  { date: '2026-11-19', payee: 'Supermarket Life — weekly shop', category: 'groceries', amount: 6611, method: 'Card' },
  { date: '2026-11-19', payee: 'Bento — station lunch', category: 'dining', amount: 980, method: 'Cash' },
  { date: '2026-11-20', payee: 'Water and sewerage — bill', category: 'utilities', amount: 3860, method: 'Direct debit' },
  { date: '2026-11-20', payee: 'Suica charge', category: 'transport', amount: 2000, method: 'Mobile Suica' },
  { date: '2026-11-20', payee: 'Streaming — one film rental', category: 'leisure', amount: 550, method: 'Card' },
  { date: '2026-11-21', payee: 'Sushi delivery — payday treat', category: 'dining', amount: 5940, method: 'Card' },
  { date: '2026-11-21', payee: 'Winter boots — waterproof pair', category: 'shopping', amount: 12800, method: 'Card' },
  { date: '2026-11-22', payee: 'Supermarket Life — weekly shop', category: 'groceries', amount: 7049, method: 'Card' },
  { date: '2026-11-22', payee: 'Concert ticket — December show', category: 'leisure', amount: 9000, method: 'Card' },
  { date: '2026-11-22', payee: 'Taxi — rain, heavy bags', category: 'transport', amount: 2260, method: 'Card' },
  { date: '2026-11-23', payee: 'Supermarket Life — weekly shop', category: 'groceries', amount: 5376, method: 'Card' },
  { date: '2026-11-23', payee: 'Storage boxes and laundry nets', category: 'household', amount: 4120, method: 'Card' },
  { date: '2026-11-24', payee: 'Lunch sets — two near the station', category: 'dining', amount: 2860, method: 'Card' },
  { date: '2026-11-24', payee: 'Pharmacy — vitamins and eye drops', category: 'health', amount: 3480, method: 'Card' },
  { date: '2026-11-25', payee: 'Transfer — Hokkaido trip fund', category: 'savings', amount: 20000, method: 'Bank transfer' },
  { date: '2026-11-25', payee: 'Transfer — sofa fund', category: 'savings', amount: 8000, method: 'Bank transfer' },
  { date: '2026-11-25', payee: 'Life insurance — monthly premium', category: 'insurance', amount: 9840, method: 'Direct debit' },
  { date: '2026-11-25', payee: 'Supermarket Life — payday shop', category: 'groceries', amount: 8412, method: 'Card' },
  { date: '2026-11-26', payee: 'Supermarket Life — weekly shop', category: 'groceries', amount: 6930, method: 'Card' },
  { date: '2026-11-26', payee: 'Commuter pass top-up', category: 'transport', amount: 3000, method: 'Mobile Suica' },
  { date: '2026-11-26', payee: 'Café — beans and two lattes', category: 'dining', amount: 1240, method: 'Card' },
  { date: '2026-11-26', payee: 'Pharmacy — throat lozenges', category: 'health', amount: 1180, method: 'Cash' },
];

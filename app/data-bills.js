// Recurring bills, savings goals, and the finished months the report and
// the trend chart compare November against. Bill amounts are the usual
// charge; the bills page works out each one's yearly cost and next due
// date itself. Utility bills vary a little month to month — the ledger
// holds what November actually charged.

export const BILLS = [
  { name: 'Rent — Sakura Heights 302', category: 'housing', amount: 118000, dueDay: 1, cycle: 'monthly', method: 'Bank transfer' },
  { name: 'Electricity (TEPCO)', category: 'utilities', amount: 8940, dueDay: 5, cycle: 'monthly', method: 'Direct debit' },
  { name: 'Mobile phones — two lines', category: 'communications', amount: 7860, dueDay: 5, cycle: 'monthly', method: 'Direct debit' },
  { name: 'City gas', category: 'utilities', amount: 4120, dueDay: 10, cycle: 'monthly', method: 'Direct debit' },
  { name: 'Music and video subscriptions', category: 'subscriptions', amount: 2480, dueDay: 10, cycle: 'monthly', method: 'Card' },
  { name: 'News subscription', category: 'subscriptions', amount: 980, dueDay: 15, cycle: 'monthly', method: 'Card' },
  { name: 'Home internet — fibre', category: 'communications', amount: 5280, dueDay: 18, cycle: 'monthly', method: 'Direct debit' },
  { name: 'Water and sewerage', category: 'utilities', amount: 3860, dueDay: 20, cycle: 'every 2 months', method: 'Direct debit' },
  { name: 'Life insurance premium', category: 'insurance', amount: 9840, dueDay: 25, cycle: 'monthly', method: 'Direct debit' },
  { name: 'Gym — one membership', category: 'leisure', amount: 7480, dueDay: 27, cycle: 'monthly', method: 'Card' },
];

export const GOALS = [
  { id: 'emergency', name: 'Emergency fund', target: 1500000, saved: 960000, monthly: 40000,
    note: 'About five months of essential spending (the need envelopes total ¥302,000 a month) if a salary stops. Held in a separate bank account, never invested.' },
  { id: 'hokkaido', name: 'Hokkaido trip — February', target: 260000, saved: 208000, monthly: 20000,
    note: 'Flights, four nights in Sapporo during the snow festival, and a seafood budget that is not negotiable.' },
  { id: 'sofa', name: 'Sofa and dining set', target: 148000, saved: 52000, monthly: 8000,
    note: 'Replacing the sofa whose spring arrived in spring. Measured the lift: it fits, with 4 cm to spare.' },
];

// Finished months, oldest first; November is appended by the report from
// the live ledger, so the trend always ends at the real current figure.
export const HISTORY = [
  { month: 'June', income: 452000, spent: 398200 },
  { month: 'July', income: 455500, spent: 421700 },
  { month: 'August', income: 458000, spent: 445900 },
  { month: 'September', income: 461200, spent: 402300 },
  { month: 'October', income: 466800, spent: 418940 },
];

// October's finished category totals, for the report's month-on-month
// table. They sum to October's spent figure in HISTORY.
export const OCTOBER_BY_CATEGORY = {
  housing: 118000, utilities: 15980, groceries: 92400, transport: 17420,
  health: 9840, communications: 13140, insurance: 9840, household: 11260,
  dining: 28930, shopping: 20100, leisure: 12100, subscriptions: 3460,
  savings: 66470,
};

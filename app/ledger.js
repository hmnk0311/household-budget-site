// Money maths for the whole site. Every page calls these functions on the
// same transaction list (the seeded ledger plus anything the visitor adds
// on the Ledger page), so a figure can never differ between pages.

import { CATEGORIES, INCOME, TRANSACTIONS } from './data.js';

export const yen = (n) => '¥' + Math.round(n).toLocaleString('en-US');

export const categoryById = (id) => CATEGORIES.find((c) => c.id === id);

export const incomeTotal = () => INCOME.reduce((sum, row) => sum + row.amount, 0);

export const spentTotal = (txs) => txs.reduce((sum, row) => sum + row.amount, 0);

export const totalByCategory = (txs) => {
  const totals = new Map(CATEGORIES.map((c) => [c.id, 0]));
  for (const row of txs) totals.set(row.category, (totals.get(row.category) ?? 0) + row.amount);
  return totals;
};

export const budgetTotal = () => CATEGORIES.reduce((sum, c) => sum + c.budget, 0);

// Needs / wants / savings split of a set of transactions, for the 50/30/20
// check: returns yen spent in each of the three kinds.
export const splitByKind = (txs) => {
  const split = { need: 0, want: 0, saving: 0 };
  for (const row of txs) split[categoryById(row.category).kind] += row.amount;
  return split;
};

export const savedTotal = (txs) => splitByKind(txs).saving;

// Categories whose spending has passed their envelope, worst first.
export const overBudget = (txs) => {
  const totals = totalByCategory(txs);
  return CATEGORIES
    .map((c) => ({ category: c, spent: totals.get(c.id) ?? 0 }))
    .filter((row) => row.spent > row.category.budget)
    .sort((a, b) => b.spent / b.category.budget - a.spent / a.category.budget);
};

// What is left of an envelope, and the per-day allowance it works out to
// for the days remaining in the month.
export const envelopeStatus = (category, spent, todayDay, daysInMonth) => {
  const left = category.budget - spent;
  const daysLeft = Math.max(daysInMonth - todayDay, 0);
  return {
    left,
    daysLeft,
    perDay: daysLeft > 0 ? Math.floor(left / daysLeft) : left,
    ratio: category.budget > 0 ? spent / category.budget : spent > 0 ? 9.99 : 0,
  };
};

// Escape visitor-typed text before it is placed into a page, so a payee
// name can never become markup.
export const escapeHtml = (text) => text
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

// The next due date (as a Date at local midnight) for a bill, counting
// from a given "today" day in November 2026. A bill on a two-month cycle
// is anchored to a payment in November 2026, so its next dates fall in
// January, March, … — never in December.
export const nextDue = (bill, todayDay) => {
  if (bill.cycle === 'every 2 months') {
    if (bill.dueDay >= todayDay) return new Date(2026, 10, bill.dueDay);
    return new Date(2027, 0, bill.dueDay);
  }
  const month = bill.dueDay >= todayDay ? 10 : 11; // JS months: Nov = 10, Dec = 11
  return new Date(2026, month, bill.dueDay);
};

export const yearlyCost = (bill) => bill.amount * (bill.cycle === 'every 2 months' ? 6 : 12);

export const DAY_MS = 86400000;

export const daysUntil = (date, todayDay) =>
  Math.round((date - new Date(2026, 10, todayDay)) / DAY_MS);

export const formatDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

export const seedTransactions = () => TRANSACTIONS.map((row) => ({ ...row }));

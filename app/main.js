// Router and control wiring. The state lives here — one transaction list
// (the seeded ledger plus anything added) and one budgets map — and every
// view renders from it, so an edit anywhere is visible everywhere.

import { CATEGORIES } from './data.js';
import { seedTransactions, yen } from './ledger.js';
import { budgetsView, ledgerView, overviewView } from './views.js';
import { billsView, goalsView, reportView, whatIfRows } from './views-more.js';

const STORAGE_KEY = 'kakeibo-ledger-v1';

function loadState() {
  const fresh = {
    transactions: seedTransactions(),
    budgets: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget])),
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fresh;
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved.transactions) || typeof saved.budgets !== 'object') return fresh;
    return {
      transactions: saved.transactions.filter((t) => t && CATEGORIES.some((c) => c.id === t.category) && Number(t.amount) > 0),
      budgets: { ...fresh.budgets, ...saved.budgets },
    };
  } catch {
    return fresh;
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable (private mode); the site still works.
  }
}

const state = loadState();

const app = document.getElementById('app');
const ledgerUi = { query: '', category: 'all', sort: 'newest' };
let whatIfMonthly = 68000;

const routes = {
  '/': { nav: 'overview', title: 'Kakeibo Ledger — November overview', view: () => overviewView(state) },
  '/ledger': { nav: 'ledger', title: 'Kakeibo Ledger — the November ledger', view: () => ledgerView(state, ledgerUi.query, ledgerUi.category, ledgerUi.sort) },
  '/budgets': { nav: 'budgets', title: 'Kakeibo Ledger — budget envelopes', view: () => budgetsView(state) },
  '/bills': { nav: 'bills', title: 'Kakeibo Ledger — bills and subscriptions', view: () => billsView(state) },
  '/goals': { nav: 'goals', title: 'Kakeibo Ledger — savings goals', view: () => goalsView(state, whatIfMonthly) },
  '/report': { nav: 'report', title: 'Kakeibo Ledger — November report', view: () => reportView(state) },
};

function currentRoute() {
  const hash = location.hash.replace(/^#/, '') || '/';
  return routes[hash] ? hash : '/';
}

function render() {
  const route = routes[currentRoute()];
  document.title = route.title;
  app.innerHTML = route.view();
  for (const link of document.querySelectorAll('[data-nav]')) {
    if (link.dataset.nav === route.nav) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  wireControls(currentRoute());
  window.scrollTo(0, 0);
}

function wireControls(path) {
  if (path === '/ledger') wireLedger();
  if (path === '/budgets') wireBudgets();
  if (path === '/goals') wireGoals();
}

function wireLedger() {
  document.getElementById('ledger-controls')?.addEventListener('submit', (e) => e.preventDefault());
  const rerender = () => { app.innerHTML = ledgerView(state, ledgerUi.query, ledgerUi.category, ledgerUi.sort); wireLedger(); restoreFocus(); };
  let focusId = null;
  const restoreFocus = () => { if (focusId) { const el = document.getElementById(focusId); if (el) { el.focus(); el.setSelectionRange?.(el.value.length, el.value.length); } } };
  const q = document.getElementById('q');
  q?.addEventListener('input', () => { focusId = 'q'; ledgerUi.query = q.value; rerender(); });
  document.getElementById('cat')?.addEventListener('change', (e) => { ledgerUi.category = e.target.value; rerender(); });
  document.getElementById('sort')?.addEventListener('change', (e) => { ledgerUi.sort = e.target.value; rerender(); });
  document.getElementById('csv')?.addEventListener('click', downloadCsv);
  document.getElementById('reset-ledger')?.addEventListener('click', () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* nothing stored */ }
    state.transactions = seedTransactions();
    state.budgets = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget]));
    render();
  });
  for (const btn of document.querySelectorAll('[data-remove]')) {
    btn.addEventListener('click', () => {
      state.transactions.splice(Number(btn.dataset.remove), 1);
      persist();
      rerender();
    });
  }
  document.getElementById('add-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = Number(document.getElementById('add-amount').value);
    const payee = document.getElementById('add-payee').value.trim();
    if (!payee || !(amount > 0)) return;
    state.transactions.push({
      date: document.getElementById('add-date').value || '2026-11-26',
      payee,
      category: document.getElementById('add-cat').value,
      amount,
      method: 'Card',
    });
    persist();
    render();
  });
}

function downloadCsv() {
  const lines = ['date,payee,envelope,method,amount_yen'];
  for (const t of state.transactions) {
    const name = (CATEGORIES.find((c) => c.id === t.category)?.name ?? t.category);
    lines.push([t.date, `"${t.payee.replaceAll('"', '""')}"`, name, t.method, t.amount].join(','));
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'kakeibo-ledger-november-2026.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

function wireBudgets() {
  for (const form of document.querySelectorAll('.env-edit')) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = Number(new FormData(form).get('budget'));
      if (Number.isFinite(value) && value >= 0) state.budgets[form.dataset.env] = value;
      persist();
      render();
    });
  }
}

function wireGoals() {
  const slider = document.getElementById('whatif');
  slider?.addEventListener('input', () => {
    whatIfMonthly = Number(slider.value);
    document.getElementById('whatif-amount').textContent = yen(whatIfMonthly);
    document.getElementById('whatif-rows').innerHTML = whatIfRows(whatIfMonthly);
  });
  document.getElementById('goal-calc')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const target = Number(document.getElementById('calc-target').value);
    const saved = Number(document.getElementById('calc-saved').value);
    const months = Number(document.getElementById('calc-months').value);
    const perMonth = Math.max(Math.ceil((target - saved) / Math.max(months, 1)), 0);
    document.getElementById('calc-result').innerHTML =
      `Saving for a ${yen(target)} goal with ${yen(saved)} already in the pot over ${months} months takes <strong>${yen(perMonth)} a month</strong>.`;
  });
}

window.addEventListener('hashchange', render);
render();

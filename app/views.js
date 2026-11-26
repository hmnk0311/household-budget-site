// Page views for the overview, the ledger and the budget envelopes.
// Each view is a pure function of the shared state ({transactions,
// budgets}) and returns an HTML string; main.js wires the controls after
// rendering. All numbers come from ledger.js, never from literals here.

import { CATEGORIES, HOUSEHOLD, INCOME } from './data.js';
import { BILLS, HISTORY } from './data-bills.js';
import {
  categoryById, daysUntil, envelopeStatus, escapeHtml, formatDate,
  incomeTotal, nextDue, savedTotal, spentTotal,
  totalByCategory, yen,
} from './ledger.js';
import { cashflowChart, donutChart, envelopeBar } from './charts.js';

export const budgetOf = (state, category) => state.budgets[category.id] ?? category.budget;

const withBudget = (state, category) => ({ ...category, budget: budgetOf(state, category) });

export function overviewView(state) {
  const txs = state.transactions;
  const income = incomeTotal();
  const spent = spentTotal(txs);
  const saved = savedTotal(txs);
  const left = CATEGORIES.reduce((s, c) => s + budgetOf(state, c), 0) - spent;
  const totals = totalByCategory(txs);
  const overs = CATEGORIES
    .map((c) => ({ category: c, spent: totals.get(c.id) ?? 0 }))
    .filter((row) => row.spent > budgetOf(state, row.category))
    .sort((a, b) => b.spent / budgetOf(state, b.category) - a.spent / budgetOf(state, a.category));
  const donutRows = CATEGORIES
    .map((c) => ({ name: c.name, value: totals.get(c.id) ?? 0, colour: c.colour }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value);
  const topEnvelopes = [...CATEGORIES]
    .sort((a, b) => (totals.get(b.id) ?? 0) / budgetOf(state, b) - (totals.get(a.id) ?? 0) / budgetOf(state, a))
    .slice(0, 6);
  const upcoming = BILLS
    .map((b) => ({ bill: b, due: nextDue(b, HOUSEHOLD.todayDay) }))
    .sort((a, b) => a.due - b.due)
    .slice(0, 4);
  const recent = [...txs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
  const history = [...HISTORY, { month: 'Nov', income, spent }];
  const totalBudget = CATEGORIES.reduce((s, c) => s + budgetOf(state, c), 0);

  return `
<section class="page-head">
  <h1>${HOUSEHOLD.names} — ${HOUSEHOLD.monthLabel}</h1>
  <p class="lede">${HOUSEHOLD.home}. Day ${HOUSEHOLD.todayDay} of ${HOUSEHOLD.daysInMonth}:
  ${txs.length} purchases and payments logged, ${INCOME.length} income credits, every total below computed live from the ledger.</p>
</section>
${overs.length ? `<div class="alert" role="note"><strong>Watch out:</strong> ${overs.map((o) => `${o.category.name} is at ${yen(o.spent)} of ${yen(budgetOf(state, o.category))}`).join(' · ')}. <a href="#/budgets">See the envelopes</a></div>` : ''}
<section class="kpi-row">
  <article class="kpi"><h2>Take-home income</h2><p class="kpi-num">${yen(income)}</p><p>Two salaries on the 25th, plus ${yen(INCOME[2].amount)} from the bicycle sale</p></article>
  <article class="kpi"><h2>Spent so far</h2><p class="kpi-num">${yen(spent)}</p><p>${txs.length} ledger rows, 1–${HOUSEHOLD.todayDay} Nov · ${yen(Math.round(spent / HOUSEHOLD.todayDay))} a day, rent and savings already out</p></article>
  <article class="kpi"><h2>Left in envelopes</h2><p class="kpi-num">${yen(left)}</p><p>of a ${yen(totalBudget)} monthly plan across ${CATEGORIES.length} envelopes</p></article>
  <article class="kpi accent"><h2>Saved this month</h2><p class="kpi-num">${yen(saved)}</p><p>${Math.round((saved / income) * 100)}% of income moved to the emergency and trip funds</p></article>
</section>
<section class="grid two">
  <article class="panel">
    <h2>Where the money went</h2>
    <div class="donut-wrap">${donutChart(donutRows, yen(spent), 'spent in November')}
      <ul class="legend">${donutRows.slice(0, 7).map((r) => `<li><span class="swatch" style="background:${r.colour}"></span>${r.name}<strong>${yen(r.value)}</strong></li>`).join('')}${donutRows.length > 7 ? `<li><span class="swatch" style="background:#cbbfa5"></span>${donutRows.length - 7} smaller envelopes<strong>${yen(donutRows.slice(7).reduce((s, r) => s + r.value, 0))}</strong></li>` : ''}</ul>
    </div>
    <p class="fine">Housing is ${Math.round(((totals.get('housing') ?? 0) / spent) * 100)}% of all spending — the rent alone, paid on the 1st. Full breakdown in the <a href="#/report">report</a>.</p>
  </article>
  <article class="panel">
    <h2>Envelopes closest to empty</h2>
    <ul class="env-list">${topEnvelopes.map((c) => {
      const s = totals.get(c.id) ?? 0;
      const st = envelopeStatus(withBudget(state, c), s, HOUSEHOLD.todayDay, HOUSEHOLD.daysInMonth);
      return `<li><a href="#/budgets">${c.name}</a><span>${yen(s)} / ${yen(budgetOf(state, c))}</span>${envelopeBar(st.ratio)}</li>`;
    }).join('')}</ul>
    <p class="fine">Bars fill red past 100%. The burst envelopes are named in the alert at the top of this page.</p>
  </article>
</section>
<section class="grid two">
  <article class="panel">
    <h2>Six months of cash flow</h2>
    ${cashflowChart(history, totalBudget)}
    <p class="fine"><span class="key income"></span>Income <span class="key spent"></span>Spent · dashed line: the November envelope total. August ran hot (a Hokkaido pre-trip and a new air conditioner); November is back under the line.</p>
  </article>
  <article class="panel">
    <h2>Coming out of the account next</h2>
    <ul class="bill-next">${upcoming.map(({ bill, due }) => `<li><span>${bill.name}</span><strong>${yen(bill.amount)}</strong><em>${daysUntil(due, HOUSEHOLD.todayDay) === 0 ? 'today' : `in ${daysUntil(due, HOUSEHOLD.todayDay)} days`} · ${due.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</em></li>`).join('')}</ul>
    <p class="fine">The gym debit (${yen(7480)}) lands tomorrow: after it, spending passes the ${yen(totalBudget)} plan by ${yen(spent + 7480 - totalBudget)}, with three days still to go — which is why the dining envelope matters. Every recurring charge, with its yearly cost, is on the <a href="#/bills">bills page</a>.</p>
    <h2 class="sub">Latest in the ledger</h2>
    <ul class="recent">${recent.map((t) => `<li><span>${formatDate(t.date)}</span>${escapeHtml(t.payee)}<strong>${yen(t.amount)}</strong></li>`).join('')}</ul>
    <p class="fine"><a href="#/ledger">Open the full ledger</a> — search it, filter it, add to it.</p>
  </article>
</section>`;
}

export function ledgerView(state, query = '', category = 'all', sort = 'newest') {
  const txs = state.transactions;
  const rows = txs
    .filter((t) => (category === 'all' || t.category === category))
    .filter((t) => t.payee.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (sort === 'newest' ? b.date.localeCompare(a.date) || b.amount - a.amount
      : sort === 'oldest' ? a.date.localeCompare(b.date)
      : sort === 'largest' ? b.amount - a.amount
      : a.amount - b.amount));
  const shownTotal = rows.reduce((s, t) => s + t.amount, 0);
  return `
<section class="page-head"><h1>The ledger — every November payment</h1>
<p class="lede">${txs.length} rows, ${yen(spentTotal(txs))} in all. Search by payee, narrow by envelope, sort four ways — the total under the table always matches the rows you can see.</p></section>
<section class="panel">
  <form id="ledger-controls" class="controls">
    <label>Search <input id="q" type="search" value="${query.replaceAll('"', '&quot;')}" placeholder="Try “Suica” or “sushi”"></label>
    <label>Envelope <select id="cat"><option value="all">All envelopes</option>${CATEGORIES.map((c) => `<option value="${c.id}"${c.id === category ? ' selected' : ''}>${c.name}</option>`).join('')}</select></label>
    <label>Sort <select id="sort">
      <option value="newest"${sort === 'newest' ? ' selected' : ''}>Newest first</option>
      <option value="oldest"${sort === 'oldest' ? ' selected' : ''}>Oldest first</option>
      <option value="largest"${sort === 'largest' ? ' selected' : ''}>Largest first</option>
      <option value="smallest"${sort === 'smallest' ? ' selected' : ''}>Smallest first</option></select></label>
    <button type="button" id="csv">Download CSV</button>
    <button type="button" id="reset-ledger">Reset to the original ledger</button>
  </form>
  <p class="fine">Rows you add, remove or re-budget are kept in this browser (local storage) and survive a reload; Reset restores the ledger exactly as published. The ✕ removes a row you entered by mistake.</p>
  <div class="table-scroll"><table class="ledger-table">
    <thead><tr><th>Date</th><th>Payee</th><th>Envelope</th><th>Method</th><th class="num">Amount</th><th></th></tr></thead>
    <tbody>${rows.map((t) => `<tr><td>${formatDate(t.date)}</td><td>${escapeHtml(t.payee)}</td><td>${categoryById(t.category).name}</td><td>${t.method}</td><td class="num">${yen(t.amount)}</td><td><button type="button" class="row-remove" data-remove="${state.transactions.indexOf(t)}" title="Remove this row">✕</button></td></tr>`).join('') || '<tr><td colspan="6">No rows match — clear the search or pick another envelope.</td></tr>'}</tbody>
    <tfoot><tr><td colspan="4">${rows.length} rows shown</td><td class="num">${yen(shownTotal)}</td><td></td></tr></tfoot>
  </table></div>
</section>
<section class="panel">
  <h2>Add a purchase</h2>
  <p>It lands in the ledger at once, and the overview, envelopes and report all recompute around it.</p>
  <form id="add-form" class="controls add-form">
    <label>Date <input id="add-date" type="date" min="2026-11-01" max="2026-11-30" value="2026-11-26" required></label>
    <label>Payee <input id="add-payee" type="text" required maxlength="60" placeholder="e.g. Bakery — croissants"></label>
    <label>Envelope <select id="add-cat">${CATEGORIES.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')}</select></label>
    <label>Amount (¥) <input id="add-amount" type="number" min="1" max="999999" required placeholder="850"></label>
    <button type="submit">Add to ledger</button>
  </form>
</section>`;
}

export function budgetsView(state) {
  const totals = totalByCategory(state.transactions);
  return `
<section class="page-head"><h1>Budget envelopes — the plan for November</h1>
<p class="lede">${CATEGORIES.length} envelopes, ${yen(CATEGORIES.reduce((s, c) => s + budgetOf(state, c), 0))} planned against ${yen(incomeTotal())} of income.
Edit any envelope and every page — overview, report, the lot — plans around the new number.</p></section>
<section class="env-grid">${CATEGORIES.map((c) => {
    const spent = totals.get(c.id) ?? 0;
    const st = envelopeStatus(withBudget(state, c), spent, HOUSEHOLD.todayDay, HOUSEHOLD.daysInMonth);
    const stateLabel = st.left < 0 ? `${yen(-st.left)} over — spending here now borrows from another envelope`
      : st.daysLeft > 0 ? `${yen(st.left)} left · about ${yen(Math.max(st.perDay, 0))} a day for the last ${st.daysLeft} days` : `${yen(st.left)} left`;
    return `<article class="env-card${st.left < 0 ? ' burst' : ''}">
    <h2><span class="swatch" style="background:${c.colour}"></span>${c.name}</h2>
    <p class="env-nums"><strong>${yen(spent)}</strong> of ${yen(budgetOf(state, c))} · ${Math.round(st.ratio * 100)}%</p>
    ${envelopeBar(st.ratio)}
    <p class="env-state">${stateLabel}</p>
    <form class="env-edit" data-env="${c.id}"><label>New envelope ¥ <input type="number" name="budget" min="0" step="100" value="${budgetOf(state, c)}"></label><button type="submit">Set</button></form>
  </article>`;
  }).join('')}</section>`;
}

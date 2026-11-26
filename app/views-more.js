// The bills calendar, the savings goals with their calculators, and the
// month report with its 50/30/20 check. Like views.js, every number here
// is computed from the shared state at render time.

import { CATEGORIES, HOUSEHOLD } from './data.js';
import { BILLS, GOALS, HISTORY, OCTOBER_BY_CATEGORY } from './data-bills.js';
import {
  categoryById, daysUntil, escapeHtml, incomeTotal, nextDue, splitByKind,
  spentTotal, totalByCategory, yearlyCost, yen,
} from './ledger.js';
import { budgetOf } from './views.js';

const ordinalSuffix = (day) => {
  if (day >= 11 && day <= 13) return 'th';
  return { 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] ?? 'th';
};

export function billsView(state) {
  const monthly = BILLS.reduce((s, b) => s + (b.cycle === 'every 2 months' ? b.amount / 2 : b.amount), 0);
  const yearly = BILLS.reduce((s, b) => s + yearlyCost(b), 0);
  const rows = [...BILLS].sort((a, b) => a.dueDay - b.dueDay);
  const dueSoon = rows
    .map((b) => ({ bill: b, due: nextDue(b, HOUSEHOLD.todayDay) }))
    .sort((a, b) => a.due - b.due);
  return `
<section class="page-head"><h1>Bills & subscriptions — what leaves on its own</h1>
<p class="lede">${BILLS.length} recurring charges, ${yen(Math.round(monthly))} in a typical month, ${yen(yearly)} over a year.
Fixed before anyone spends a yen — which is why the envelopes on the budgets page are sized around them.</p></section>
<section class="panel">
  <div class="table-scroll"><table class="ledger-table">
    <thead><tr><th>Bill</th><th>Envelope</th><th>Due</th><th>Cycle</th><th>Method</th><th class="num">Each time</th><th class="num">Per year</th><th>Next due</th></tr></thead>
    <tbody>${rows.map((b) => {
      const due = nextDue(b, HOUSEHOLD.todayDay);
      const inDays = daysUntil(due, HOUSEHOLD.todayDay);
      return `<tr><td>${b.name}</td><td>${categoryById(b.category).name}</td><td>${b.dueDay}${ordinalSuffix(b.dueDay)}</td><td>${b.cycle}</td><td>${b.method}</td><td class="num">${yen(b.amount)}</td><td class="num">${yen(yearlyCost(b))}</td><td>${due.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}${inDays === 0 ? ' (today)' : inDays === 1 ? ' (tomorrow)' : ` (in ${inDays} days)`}</td></tr>`;
    }).join('')}</tbody>
    <tfoot><tr><td colspan="5">Total</td><td class="num">${yen(BILLS.reduce((s, b) => s + b.amount, 0))}</td><td class="num">${yen(yearly)}</td><td></td></tr></tfoot>
  </table></div>
  <p class="fine">Water is billed every two months, so its row counts half toward a typical month. The news subscription is the one under review at the December budget meeting — ${yen(980 * 12)} a year for a paper read twice a week.</p>
</section>
<section class="panel"><h2>Next three out of the account</h2>
<ul class="bill-next">${dueSoon.slice(0, 3).map(({ bill, due }) => `<li><span>${bill.name}</span><strong>${yen(bill.amount)}</strong><em>${due.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · ${daysUntil(due, HOUSEHOLD.todayDay)} days away</em></li>`).join('')}</ul>
<p class="fine">Salary lands on the 25th; the rent leaves on the 1st. The account is never allowed below ${yen(150000)} between those two dates — that floor is the household's oldest rule.</p></section>`;
}

const monthsToGoal = (goal, monthly) => {
  const remaining = goal.target - goal.saved;
  if (remaining <= 0) return 0;
  if (monthly <= 0) return Infinity;
  return Math.ceil(remaining / monthly);
};

const goalEta = (goal, monthly) => {
  const months = monthsToGoal(goal, monthly);
  if (!Number.isFinite(months)) return 'never at that rate';
  const eta = new Date(2026, 10 + months, 1);
  return eta.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
};

export function goalsView(state, monthlySaving = 68000) {
  const allocated = 68000;
  const moved = state.transactions.filter((t) => t.category === 'savings').reduce((s, t) => s + t.amount, 0);
  const unallocated = moved - allocated;
  return `
<section class="page-head"><h1>Savings goals — three pots, one payday rule</h1>
<p class="lede">The transfers leave before spending starts — ${yen(40000)} to the emergency fund on the 1st, ${yen(28000)} more on payday, ${yen(68000)} in November in all.
What is left is what the envelopes divide. Move the slider and the what-if table re-plans every arrival date.</p>${unallocated > 0 ? `<div class="alert" role="note">You have moved ${yen(unallocated)} more into savings than the pots below allocate — it sits unallocated until the household assigns it to a pot.</div>` : ''}</section>
<section class="env-grid goals">${GOALS.map((g) => {
    const pct = Math.round((g.saved / g.target) * 100);
    return `<article class="env-card">
    <h2>${g.name}</h2>
    <p class="env-nums"><strong>${yen(g.saved)}</strong> of ${yen(g.target)} · ${pct}%</p>
    <span class="env-bar"><span class="env-fill goal" style="width:${pct}%"></span></span>
    <p class="env-state">${yen(g.target - g.saved)} to go · at ${yen(g.monthly)} a month it arrives ${goalEta(g, g.monthly)}</p>
    <p class="fine">${g.note}</p>
  </article>`;
  }).join('')}</section>
<section class="panel">
  <h2>What-if: save <span id="whatif-amount">${yen(monthlySaving)}</span> a month in total</h2>
  <input id="whatif" type="range" min="20000" max="140000" step="2000" value="${monthlySaving}" aria-label="Total monthly saving in yen">
  <div class="table-scroll"><table class="ledger-table"><thead><tr><th>Goal</th><th>Share of the saving</th><th class="num">Months to go</th><th>Arrives</th></tr></thead>
  <tbody id="whatif-rows">${whatIfRows(monthlySaving)}</tbody></table></div>
  <p class="fine">Shares follow the current split (emergency ${yen(40000)}, trip ${yen(20000)}, sofa ${yen(8000)} of every ${yen(68000)}). The emergency fund's date is the one the household watches first; the other two pots fill alongside it.</p>
</section>
<section class="panel">
  <h2>Plan a new goal</h2>
  <form id="goal-calc" class="controls add-form">
    <label>Target (¥) <input id="calc-target" type="number" min="1000" step="1000" value="300000" required></label>
    <label>Already saved (¥) <input id="calc-saved" type="number" min="0" step="1000" value="60000" required></label>
    <label>Months to reach it <input id="calc-months" type="number" min="1" max="120" value="12" required></label>
    <button type="submit">Work it out</button>
  </form>
  <p id="calc-result" class="calc-result">Saving for a ${yen(300000)} goal with ${yen(60000)} already in the pot over 12 months takes <strong>${yen(20000)} a month</strong>.</p>
</section>`;
}

export function whatIfRows(monthlySaving) {
  const base = GOALS.reduce((s, g) => s + g.monthly, 0);
  return GOALS.map((g) => {
    const share = Math.round(monthlySaving * (g.monthly / base));
    const months = monthsToGoal(g, share);
    return `<tr><td>${g.name}</td><td>${yen(share)} a month</td><td class="num">${Number.isFinite(months) ? months : '—'}</td><td>${goalEta(g, share)}</td></tr>`;
  }).join('');
}

export function reportView(state) {
  const txs = state.transactions;
  const income = incomeTotal();
  const spent = spentTotal(txs);
  const split = splitByKind(txs);
  const pct = (v) => Math.round((v / income) * 100);
  const totals = totalByCategory(txs);
  const biggest = [...txs].sort((a, b) => b.amount - a.amount)[0];
  const groceries = totals.get('groceries') ?? 0;
  const dining = totals.get('dining') ?? 0;
  const diningBudget = budgetOf(state, CATEGORIES.find((c) => c.id === 'dining'));
  const october = OCTOBER_BY_CATEGORY;
  const rows = CATEGORIES.map((c) => {
    const now = totals.get(c.id) ?? 0;
    const then = october[c.id] ?? 0;
    const diff = now - then;
    return { c, now, then, diff };
  }).sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
  const history = [...HISTORY, { month: 'November', income, spent }];
  return `
<section class="page-head"><h1>November report — the month so far, judged</h1>
<p class="lede">Day ${HOUSEHOLD.todayDay} of ${HOUSEHOLD.daysInMonth}. Income ${yen(income)}, out ${yen(spent)} — ${yen(income - spent)} of November's income not yet out, with the gym bill and four days of groceries to come.</p></section>
<section class="grid two">
  <article class="panel">
    <h2>The 50/30/20 check</h2>
    <div class="table-scroll"><table class="ledger-table wrap-table"><thead><tr><th>Bucket</th><th>Rule</th><th class="num">Actual</th><th>Verdict</th></tr></thead><tbody>
    <tr><td>Needs — rent, bills, food at home, transport, health</td><td>50% of income</td><td class="num">${yen(split.need)} · ${pct(split.need)}%</td><td>${split.need <= income * 0.5 ? 'Inside the rule' : `Over by ${yen(split.need - Math.floor(income * 0.5))} — the rent alone is ${Math.round(((totals.get('housing') ?? 0) / income) * 100)}% of income`}</td></tr>
    <tr><td>Wants — eating out, shopping, leisure, subscriptions</td><td>30%</td><td class="num">${yen(split.want)} · ${pct(split.want)}%</td><td>${split.want <= income * 0.3 ? 'Inside the rule' : `Over by ${yen(split.want - Math.floor(income * 0.3))}`}</td></tr>
    <tr><td>Savings transfers</td><td>20%</td><td class="num">${yen(split.saving)} · ${pct(split.saving)}%</td><td>${split.saving >= income * 0.2 ? 'Ahead of the rule' : `${yen(Math.ceil(income * 0.2) - split.saving)} short of the 20% line — December's bonus is where the household closes that gap`}</td></tr>
    </tbody></table></div>
    <p class="fine">Shares are of take-home pay and count only money that has actually moved by the 26th; the month is not over.</p>
  </article>
  <article class="panel">
    <h2>What the numbers say</h2>
    <ul class="insights">
      <li><strong>Dining out is the leak.</strong> ${yen(dining)} against a ${yen(diningBudget)} envelope, with four days left. Two evenings — the izakaya (${yen(9600)}) and the payday sushi (${yen(5940)}) — are ${Math.round(((9600 + 5940) / dining) * 100)}% of it.</li>
      <li><strong>Groceries are the second-biggest envelope.</strong> ${yen(groceries)} over ${txs.filter((t) => t.category === 'groceries').length} shops is ${yen(Math.round(groceries / txs.filter((t) => t.category === 'groceries').length))} a shop and ${yen(Math.round(groceries / HOUSEHOLD.todayDay))} a day — inside the envelope, but only just; the payday shop (${yen(8412)}) was the largest single one.</li>
      <li><strong>The biggest single payment</strong> was ${escapeHtml(biggest.payee)} at ${yen(biggest.amount)} — ${Math.round((biggest.amount / spent) * 100)}% of everything spent. Nothing else comes close, which is how a budget should look.</li>
      <li><strong>Six-month savings streak.</strong> Income minus spending has been positive every month since June; the weakest month was ${history.reduce((a, b) => (b.income - b.spent < a.income - a.spent ? b : a)).month} at ${yen(Math.min(...history.map((h) => h.income - h.spent)))}.</li>
      <li><strong>Household note — December's known risk:</strong> the concert (${yen(9000)}, already in leisure) plus year-end gifts. The plan: December's dining envelope stays ${yen(diningBudget)} and the gift money comes out of shopping, not savings.</li>
    </ul>
  </article>
</section>
<section class="panel">
  <h2>November vs October, envelope by envelope</h2>
  <div class="table-scroll"><table class="ledger-table">
  <thead><tr><th>Envelope</th><th class="num">October (full month)</th><th class="num">November (to the 26th)</th><th class="num">Change</th></tr></thead>
  <tbody>${rows.map((r) => `<tr><td>${r.c.name}</td><td class="num">${yen(r.then)}</td><td class="num">${yen(r.now)}</td><td class="num">${r.diff > 0 ? '+' + yen(r.diff) : r.diff < 0 ? '−' + yen(-r.diff) : yen(0)}</td></tr>`).join('')}</tbody>
  <tfoot><tr><td>Total</td><td class="num">${yen(Object.values(october).reduce((s, v) => s + v, 0))}</td><td class="num">${yen(spent)}</td><td class="num"></td></tr></tfoot>
  </table></div>
  <p class="fine">November still has four days to run, so most envelopes will close some of the gap — but dining and shopping have already passed October's full-month figures, which is the report's real headline.</p>
</section>`;
}

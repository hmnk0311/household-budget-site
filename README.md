# Kakeibo Ledger — ¥481,700 take-home, 61 November transactions, 13 envelopes, 10 recurring bills, 3 savings goals and a 50/30/20 report, every figure computed from one ledger

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/hmnk0311/household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/hmnk0311/household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

A household budget site for one specific household — Aoi and Ren Takahashi, a couple in Setagaya, Tokyo — built as plain static files that run offline in a desktop or phone browser. No build step, no network requests, no JavaScript libraries. Every total on every page is computed in the browser from a single 59-row November ledger, so the pages can never disagree with each other.

## What a visitor gets

- **Overview** — take-home income ¥481,700, spent ¥438,907, ¥6,093 left across 13 envelopes and ¥68,000 saved, all live from the ledger; a spending donut with legend, the six envelopes closest to empty, a six-month income-vs-spending chart with the budget line, the next four bills out of the account, and the latest ledger rows. An alert names the three burst envelopes (dining out ¥32,730 of ¥24,000; shopping ¥32,820 of ¥30,000; subscriptions ¥3,460 of ¥3,000).
- **Ledger** — all 61 November payments with payee, envelope, method and amount; live search, envelope filter and four sort orders with a running total that always matches the visible rows; a working add-a-purchase form that recomputes the whole site; rows can be removed again, and additions, removals and budget edits persist in the browser; and a CSV download of the full ledger.
- **Budgets** — 13 envelopes with spent/planned bars, what's left, and the per-day allowance for the rest of the month; every envelope's budget is editable in place, and the overview and report replan around the new number at once.
- **Bills** — 10 recurring charges with due day, cycle, method, each charge and its yearly cost (¥2,002,920 a year in all), the next due date worked out for each, and the three leaving the account next.
- **Goals** — three savings pots (a ¥1,500,000 emergency fund at 64%, a February Hokkaido trip at 80%, a sofa fund at 35%) with arrival dates, a what-if slider that re-plans every arrival date as total monthly saving changes, and a plan-a-new-goal calculator.
- **Report** — a 50/30/20 check against take-home pay (needs 59%, wants 18%, savings 14% by the 26th), five findings drawn from the month's own numbers, and a November-vs-October table for all 13 envelopes.

## Run it

```sh
node serve.ts            # serves app/ at http://localhost:8080
```

Or open `app/index.html` through any static file server. To produce the hand-in (`/output/app`, `/output/screenshots`, `/output/dossier.json`):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `main.ts` — the hand-in program (Node 22, standard library only)
- `serve.ts` — a tiny local static server for development
- `app/index.html` — the page shell and navigation
- `app/main.js` — hash router, shared state, and every control's wiring
- `app/views.js` — the overview, ledger and budget-envelope views
- `app/views-more.js` — the bills, goals and report views
- `app/charts.js` — hand-drawn SVG donut and cash-flow charts
- `app/ledger.js` — all the money maths (totals, envelopes, 50/30/20, due dates)
- `app/data.js` — the household, its income, 13 envelopes and the 61-row November ledger
- `app/data-bills.js` — the 10 recurring bills, 3 savings goals, and October's finished figures
- `app/style.css` — the paper-ledger look
- `vendor/makefun-frontend.ts` — the make.fun dossier library, copied from the kit unchanged

// Hand-drawn SVG charts, built as strings from the ledger's own numbers.
// No chart library: the whole site stays a few kilobytes and every arc and
// bar below is computed from the data it labels.

const polar = (cx, cy, r, angle) => [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];

// Donut of category shares. `rows` is [{name, value, colour}]; slices under
// 2% are folded into the last slice's neighbour order but kept labelled in
// the legend the caller renders. Returns an SVG string with a centre label.
export function donutChart(rows, centreTop, centreBottom, size = 210) {
  const total = rows.reduce((s, r) => s + r.value, 0) || 1;
  const cx = size / 2, cy = size / 2, r = size / 2 - 6, inner = r * 0.62;
  let angle = -Math.PI / 2;
  const paths = [];
  for (const row of rows) {
    const sweep = (row.value / total) * Math.PI * 2;
    const end = angle + sweep;
    if (row.value > 0) {
      const large = sweep > Math.PI ? 1 : 0;
      const [x1, y1] = polar(cx, cy, r, angle);
      const [x2, y2] = polar(cx, cy, r, end);
      const [x3, y3] = polar(cx, cy, inner, end);
      const [x4, y4] = polar(cx, cy, inner, angle);
      paths.push(`<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L ${x3.toFixed(1)} ${y3.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${x4.toFixed(1)} ${y4.toFixed(1)} Z" fill="${row.colour}"><title>${row.name}</title></path>`);
    }
    angle = end;
  }
  return `<svg viewBox="0 0 ${size} ${size}" class="chart donut" role="img" aria-label="Spending by category donut chart">${paths.join('')}
<text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-top">${centreTop}</text>
<text x="${cx}" y="${cy + 16}" text-anchor="middle" class="donut-bottom">${centreBottom}</text></svg>`;
}

// Grouped bars: one group per month, income bar beside spent bar, with a
// dashed line at the budget total so a month over plan is visible at once.
export function cashflowChart(history, budgetLine, width = 520, height = 190) {
  const max = Math.max(...history.map((h) => Math.max(h.income, h.spent)), budgetLine) * 1.08;
  const padL = 8, padB = 22, padT = 12;
  const plotH = height - padB - padT;
  const groupW = (width - padL * 2) / history.length;
  const barW = Math.min(groupW * 0.3, 26);
  const y = (v) => padT + plotH - (v / max) * plotH;
  const parts = [];
  history.forEach((h, i) => {
    const gx = padL + i * groupW + groupW / 2;
    parts.push(`<rect x="${(gx - barW - 2).toFixed(1)}" y="${y(h.income).toFixed(1)}" width="${barW}" height="${(padT + plotH - y(h.income)).toFixed(1)}" rx="3" fill="#2e6e5e"><title>${h.month} income</title></rect>`);
    parts.push(`<rect x="${(gx + 2).toFixed(1)}" y="${y(h.spent).toFixed(1)}" width="${barW}" height="${(padT + plotH - y(h.spent)).toFixed(1)}" rx="3" fill="#c2436b"><title>${h.month} spent</title></rect>`);
    parts.push(`<text x="${gx}" y="${height - 6}" text-anchor="middle" class="axis-label">${h.month}</text>`);
  });
  const by = y(budgetLine);
  parts.push(`<line x1="${padL}" y1="${by}" x2="${width - padL}" y2="${by}" stroke="#946846" stroke-dasharray="5 4" stroke-width="1.5"><title>Monthly budget total</title></line>`);
  return `<svg viewBox="0 0 ${width} ${height}" class="chart cashflow" role="img" aria-label="Income and spending by month, June to November">${parts.join('')}</svg>`;
}

// A horizontal envelope bar: spent against budget, red past 100%.
export function envelopeBar(ratio) {
  const pct = Math.min(ratio * 100, 100);
  const over = ratio > 1;
  return `<span class="env-bar${over ? ' over' : ''}"><span class="env-fill" style="width:${pct.toFixed(1)}%"></span>${over ? '<span class="env-over">over</span>' : ''}</span>`;
}

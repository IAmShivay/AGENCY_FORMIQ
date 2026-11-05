const fs = require('fs');
const path = require('path');
const { SENDER, SEGMENTS, FOLLOW_UPS, BOOKING_CATEGORIES, PRIORITY_CITIES } = require('./templates');

const INPUT = path.join(__dirname, '..', 'leads-serp.csv');
const OUT_DIR = path.join(__dirname, 'out');
const PER_DAY = Number(process.env.PER_DAY || 40);
const START = process.env.START ? new Date(process.env.START) : nextWorkingDay(new Date());
const LOW_RATING = 4.0;
const MIN_REVIEWS_FOR_REPUTATION = 10;
const FU1_DAYS = 2;
const FU2_DAYS = 5;
const CALL_DAYS = 7;

function nextWorkingDay(d) {
  const n = new Date(d);
  n.setDate(n.getDate() + 1);
  while (n.getDay() === 0) n.setDate(n.getDate() + 1);
  return n;
}

function addDays(d, days) {
  const n = new Date(d);
  n.setDate(n.getDate() + days);
  return n;
}

function iso(d) {
  return d.toISOString().slice(0, 10);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...body] = rows;
  return body.filter((r) => r.length === header.length).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])));
}

function normalizePhone(raw) {
  let digits = (raw || '').replace(/\D/g, '');
  if (digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length === 10) digits = `91${digits}`;
  if (digits.length !== 12 || !digits.startsWith('91')) return null;
  return digits;
}

function toNumber(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

function segmentFor(lead) {
  if (!lead.website) return 'no_website';
  if (lead.rating !== null && lead.rating < LOW_RATING && (lead.reviews || 0) >= MIN_REVIEWS_FOR_REPUTATION) return 'reputation';
  if (BOOKING_CATEGORIES.includes(lead.category)) return 'booking';
  return 'growth';
}

const SWEET_SPOT_REVIEWS = 300;
const INSTITUTION_REVIEWS = 2000;

function priority(lead) {
  const reviewScore = Math.log10(Math.min(lead.reviews || 0, SWEET_SPOT_REVIEWS) + 1);
  const institutionPenalty = (lead.reviews || 0) > INSTITUTION_REVIEWS ? 3 : 0;
  const cityScore = PRIORITY_CITIES[lead.city] || 0;
  const segmentScore = { no_website: 2, booking: 1.5, reputation: 1, growth: 0.5 }[lead.segment];
  return reviewScore * 2 + cityScore + segmentScore - institutionPenalty;
}

function fill(template, lead, lang) {
  const social = lead.rating !== null && lead.reviews
    ? lang === 'bn'
      ? ` ({reviews}টা review, {rating}★, দারুণ!)`
      : ` ({reviews} reviews, {rating}★, nice!)`
    : '';
  const vars = {
    name: lead.name,
    city: lead.city,
    category: lead.category,
    rating: lead.rating === null ? '' : lead.rating.toFixed(1),
    reviews: lead.reviews || '',
    sender: SENDER.name,
    agency: SENDER.agency,
    senderCity: SENDER.city,
    senderPhone: SENDER.phone,
    asset: SEGMENTS[lead.segment].asset[lang],
    social,
  };
  let out = template;
  for (let pass = 0; pass < 2; pass++) {
    out = out.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : ''));
  }
  return out;
}

function waLink(phone, message) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function csvCell(v) {
  return `"${String(v ?? '').replace(/"/g, '""')}"`;
}

function writeCsv(file, header, rows) {
  const lines = [header.map(csvCell).join(','), ...rows.map((r) => r.map(csvCell).join(','))];
  fs.writeFileSync(file, lines.join('\n'), 'utf8');
}

function build() {
  const raw = parseCsv(fs.readFileSync(INPUT, 'utf8'));
  const seen = new Set();
  const leads = [];
  for (const r of raw) {
    const phone = normalizePhone(r.Phone);
    if (!phone || seen.has(phone)) continue;
    seen.add(phone);
    const lead = {
      name: r.Name.trim().replace(/\s+,/g, ',').replace(/\s{2,}/g, ' '),
      category: r.Category.trim(),
      city: r.City.trim(),
      address: r.Address.trim(),
      phone,
      website: r.Website.trim(),
      rating: toNumber(r.Rating),
      reviews: toNumber(r.Reviews) ? Math.round(toNumber(r.Reviews)) : 0,
    };
    lead.segment = segmentFor(lead);
    lead.score = priority(lead);
    leads.push(lead);
  }
  leads.sort((a, b) => b.score - a.score);

  let day = 1;
  let date = new Date(START);
  leads.forEach((lead, i) => {
    if (i > 0 && i % PER_DAY === 0) {
      day++;
      date = nextWorkingDay(date);
    }
    lead.day = day;
    lead.date = iso(date);
    lead.fu1Date = iso(addDays(date, FU1_DAYS));
    lead.fu2Date = iso(addDays(date, FU2_DAYS));
    lead.callDate = iso(addDays(date, CALL_DAYS));
    lead.messages = {};
    for (const lang of ['en', 'bn']) {
      lead.messages[lang] = {
        first: fill(SEGMENTS[lead.segment].first[lang], lead, lang),
        fu1: fill(FOLLOW_UPS.fu1[lang], lead, lang),
        fu2: fill(FOLLOW_UPS.fu2[lang], lead, lang),
      };
    }
  });

  fs.mkdirSync(OUT_DIR, { recursive: true });

  writeCsv(
    path.join(OUT_DIR, 'outreach-queue.csv'),
    ['day', 'date', 'segment', 'name', 'category', 'city', 'phone', 'rating', 'reviews', 'website', 'wa_link', 'fu1_date', 'fu2_date', 'call_date', 'message_en', 'message_bn'],
    leads.map((l) => [
      l.day, l.date, l.segment, l.name, l.category, l.city, `+${l.phone}`, l.rating ?? '', l.reviews, l.website,
      waLink(l.phone, l.messages.en.first), l.fu1Date, l.fu2Date, l.callDate, l.messages.en.first, l.messages.bn.first,
    ])
  );

  writeCsv(
    path.join(OUT_DIR, 'clearcrm-import.csv'),
    ['Name', 'Email', 'Phone', 'Company', 'Source', 'Priority', 'Value', 'Status', 'Notes'],
    leads.map((l) => [
      l.name, '', `+${l.phone}`, l.name, 'cold_outreach', l.segment === 'no_website' || l.segment === 'booking' ? 'high' : 'medium',
      l.segment === 'no_website' ? 14999 : l.segment === 'booking' ? 4000 : 6999, 'New',
      `[${l.segment}] ${l.category} in ${l.city}. Rating ${l.rating ?? 'n/a'} (${l.reviews} reviews). ${l.website ? `Website: ${l.website}` : 'No website'}. Outreach day ${l.day} (${l.date}).`,
    ])
  );

  const html = renderHtml(leads);
  fs.writeFileSync(path.join(OUT_DIR, 'outreach-queue.html'), html, 'utf8');

  const bySegment = leads.reduce((acc, l) => ((acc[l.segment] = (acc[l.segment] || 0) + 1), acc), {});
  console.log(`leads with usable phone: ${leads.length}`);
  console.log(`days of outreach at ${PER_DAY}/day: ${day} (start ${iso(START)})`);
  console.log('segments:', bySegment);
  console.log(`written to ${OUT_DIR}`);
}

function renderHtml(leads) {
  const data = JSON.stringify(leads.map((l) => ({
    n: l.name, c: l.category, ci: l.city, p: l.phone, r: l.rating, rv: l.reviews, w: l.website,
    s: l.segment, d: l.day, dt: l.date, m: l.messages,
  })));
  const labels = JSON.stringify(Object.fromEntries(Object.entries(SEGMENTS).map(([k, v]) => [k, v.label])));
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>FormiqStudio Outreach Queue</title>
<style>
:root{--bg:#f6f7f9;--card:#fff;--text:#111827;--muted:#6b7280;--border:#e5e7eb;--primary:#16a34a;--primary-text:#fff;--warn:#d97706;--danger:#dc2626;--chip:#eef2ff}
@media (prefers-color-scheme:dark){:root{--bg:#0f1115;--card:#171a21;--text:#e5e7eb;--muted:#9ca3af;--border:#2a2f3a;--chip:#1f2937}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:14px/1.45 system-ui,Segoe UI,Roboto,sans-serif}
header{position:sticky;top:0;background:var(--card);border-bottom:1px solid var(--border);padding:12px 16px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;z-index:2}
header h1{font-size:16px;margin:0 12px 0 0}
select,input,button{font:inherit;padding:6px 10px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text)}
button.primary{background:var(--primary);color:var(--primary-text);border-color:var(--primary);cursor:pointer}
button{cursor:pointer}
.stats{display:flex;gap:12px;flex-wrap:wrap;padding:10px 16px;color:var(--muted)}
.stats b{color:var(--text)}
main{padding:0 16px 40px;display:grid;gap:10px}
.card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;display:grid;grid-template-columns:1fr auto;gap:8px}
.card.done{opacity:.55}
.title{font-weight:600}
.meta{color:var(--muted);font-size:12px}
.chip{display:inline-block;background:var(--chip);border-radius:999px;padding:2px 8px;font-size:11px;margin-right:6px}
.chip.due{background:var(--warn);color:#fff}
.actions{display:flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:flex-end}
.note{width:100%;margin-top:6px}
.msg{white-space:pre-wrap;font-size:12px;color:var(--muted);margin-top:6px;display:none}
.card.open .msg{display:block}
@media(max-width:700px){.card{grid-template-columns:1fr}.actions{justify-content:flex-start}}
</style>
</head>
<body>
<header>
  <h1>Outreach queue</h1>
  <select id="view"><option value="today">Today</option><option value="due">Follow-ups due</option><option value="day">By day</option><option value="all">All</option></select>
  <select id="day"></select>
  <select id="segment"><option value="">All segments</option></select>
  <select id="city"><option value="">All cities</option></select>
  <select id="status"><option value="">Any status</option><option>new</option><option>sent</option><option>replied</option><option>call_booked</option><option>won</option><option>not_interested</option><option>no_whatsapp</option></select>
  <select id="lang"><option value="en">English</option><option value="bn">বাংলা</option></select>
  <input id="q" placeholder="search name / category" style="min-width:180px">
  <button id="export">Export status CSV</button>
</header>
<div class="stats" id="stats"></div>
<main id="list"></main>
<script>
const LEADS = ${data};
const LABELS = ${labels};
const FU1_DAYS = ${FU1_DAYS}, FU2_DAYS = ${FU2_DAYS};
const KEY = 'formiq-outreach';
const todayIso = () => new Date().toISOString().slice(0,10);
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } };
const save = (s) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} };
let state = load();
const rec = (p) => state[p] || { status: 'new' };
const daysSince = (d) => d ? Math.floor((Date.now() - new Date(d).getTime()) / 86400000) : null;
const dueStep = (r) => {
  if (r.status !== 'sent') return null;
  if (!r.fu1At && daysSince(r.sentAt) >= FU1_DAYS) return 'fu1';
  if (r.fu1At && !r.fu2At && daysSince(r.fu1At) >= (FU2_DAYS - FU1_DAYS)) return 'fu2';
  return null;
};
const wa = (p, m) => 'https://wa.me/' + p + '?text=' + encodeURIComponent(m);
const el = (id) => document.getElementById(id);
const days = [...new Set(LEADS.map(l => l.d))];
el('day').innerHTML = days.map(d => { const dt = LEADS.find(l => l.d === d).dt; return '<option value="' + d + '">Day ' + d + ' · ' + dt + '</option>'; }).join('');
el('segment').innerHTML += Object.entries(LABELS).map(([k,v]) => '<option value="' + k + '">' + v + '</option>').join('');
el('city').innerHTML += [...new Set(LEADS.map(l => l.ci))].map(c => '<option>' + c + '</option>').join('');
function visible() {
  const view = el('view').value, day = Number(el('day').value), seg = el('segment').value, city = el('city').value, st = el('status').value, q = el('q').value.toLowerCase();
  const today = todayIso();
  return LEADS.filter(l => {
    const r = rec(l.p);
    if (seg && l.s !== seg) return false;
    if (city && l.ci !== city) return false;
    if (st && r.status !== st) return false;
    if (q && !(l.n.toLowerCase().includes(q) || l.c.includes(q))) return false;
    if (view === 'today') return (l.dt <= today && r.status === 'new') || dueStep(r);
    if (view === 'due') return !!dueStep(r);
    if (view === 'day') return l.d === day;
    return true;
  });
}
function render() {
  const rows = visible();
  const lang = el('lang').value;
  const counts = Object.values(state).reduce((a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a), {});
  el('stats').innerHTML = '<span>Showing <b>' + rows.length + '</b></span><span>Sent <b>' + (counts.sent||0) + '</b></span><span>Replied <b>' + (counts.replied||0) + '</b></span><span>Calls <b>' + (counts.call_booked||0) + '</b></span><span>Won <b>' + (counts.won||0) + '</b></span><span>Follow-ups due <b>' + LEADS.filter(l => dueStep(rec(l.p))).length + '</b></span>';
  el('list').innerHTML = rows.slice(0, 300).map(l => {
    const r = rec(l.p);
    const due = dueStep(r);
    const done = ['won','not_interested','no_whatsapp'].includes(r.status);
    const m = l.m[lang];
    return '<div class="card' + (done ? ' done' : '') + '" data-p="' + l.p + '">' +
      '<div><div class="title">' + l.n + '</div>' +
      '<div class="meta">' + l.c + ' · ' + l.ci + (l.r ? ' · ' + l.r.toFixed(1) + '★ (' + l.rv + ')' : '') + (l.w ? ' · <a href="' + l.w + '" target="_blank" rel="noopener">site</a>' : ' · no site') + ' · +' + l.p + '</div>' +
      '<div style="margin-top:6px"><span class="chip">' + LABELS[l.s] + '</span><span class="chip">Day ' + l.d + '</span>' + (due ? '<span class="chip due">' + due.toUpperCase() + ' due</span>' : '') + (r.sentAt ? '<span class="chip">sent ' + r.sentAt + '</span>' : '') + '</div>' +
      '<div class="msg">' + m.first.replace(/</g,'&lt;') + '</div>' +
      '<input class="note" placeholder="note (owner name, what they said, next step)" value="' + (r.note || '').replace(/"/g,'&quot;') + '"></div>' +
      '<div class="actions">' +
      '<a class="primary" href="' + wa(l.p, m.first) + '" target="_blank" rel="noopener"><button class="primary" type="button">Message</button></a>' +
      '<a href="' + wa(l.p, m.fu1) + '" target="_blank" rel="noopener"><button type="button">FU1</button></a>' +
      '<a href="' + wa(l.p, m.fu2) + '" target="_blank" rel="noopener"><button type="button">FU2</button></a>' +
      '<a href="tel:+' + l.p + '"><button type="button">Call</button></a>' +
      '<button type="button" data-act="preview">Text</button>' +
      '<select data-act="status">' + ['new','sent','replied','call_booked','won','not_interested','no_whatsapp'].map(s => '<option' + (r.status === s ? ' selected' : '') + '>' + s + '</option>').join('') + '</select>' +
      '</div></div>';
  }).join('') || '<p style="padding:20px;color:var(--muted)">Nothing here. Switch the view or pick another day.</p>';
}
function update(p, patch) { state[p] = { ...rec(p), ...patch }; save(state); render(); }
document.addEventListener('click', (e) => {
  const card = e.target.closest('.card'); if (!card) return;
  const p = card.dataset.p;
  const link = e.target.closest('a[href^="https://wa.me"]');
  if (link) {
    const r = rec(p);
    const label = link.querySelector('button').textContent;
    if (label === 'Message' && r.status === 'new') update(p, { status: 'sent', sentAt: todayIso() });
    if (label === 'FU1') update(p, { fu1At: todayIso() });
    if (label === 'FU2') update(p, { fu2At: todayIso() });
    return;
  }
  if (e.target.dataset.act === 'preview') card.classList.toggle('open');
});
document.addEventListener('change', (e) => {
  const card = e.target.closest('.card'); if (!card) return;
  const p = card.dataset.p;
  if (e.target.dataset.act === 'status') update(p, { status: e.target.value, ...(e.target.value === 'sent' && !rec(p).sentAt ? { sentAt: todayIso() } : {}) });
  if (e.target.classList.contains('note')) update(p, { note: e.target.value });
});
['view','day','segment','city','status','lang'].forEach(id => el(id).addEventListener('change', render));
el('q').addEventListener('input', render);
el('export').addEventListener('click', () => {
  const lines = [['name','phone','segment','city','status','sent_at','fu1_at','fu2_at','note']];
  LEADS.forEach(l => { const r = rec(l.p); if (r.status !== 'new' || r.note) lines.push([l.n, '+' + l.p, l.s, l.ci, r.status, r.sentAt || '', r.fu1At || '', r.fu2At || '', r.note || '']); });
  const csv = lines.map(r => r.map(c => '"' + String(c).replace(/"/g,'""') + '"').join(',')).join('\\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'outreach-status-' + todayIso() + '.csv'; a.click();
});
render();
</script>
</body>
</html>`;
}

build();

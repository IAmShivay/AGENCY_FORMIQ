/**
 * Business Lead Collector using SerpAPI Google Maps
 * Saves to CSV after EVERY single API call — never loses data
 * Max 250 API calls
 */

const fs = require('fs');
const path = require('path');

const API_KEY = 'a17af789dade3ead9b5404aaff5ef438c4aeaab00dabc84a19de56e803cb2a77';
const CSV_PATH = path.join(__dirname, 'leads-serp.csv');
const JSON_PATH = path.join(__dirname, 'leads-serp.json');
const CSV_HEADER = 'Name,Category,City,Address,Phone,Email,Website,Rating,Reviews\n';

const CITIES = [
  { name: 'Durgapur', ll: '@23.5204,87.3119,13z' },
  { name: 'Asansol', ll: '@23.6889,86.9661,13z' },
  { name: 'Burdwan', ll: '@23.2324,87.8615,13z' },
  { name: 'Kolkata', ll: '@22.5726,88.3639,12z' },
  { name: 'Kolkata South', ll: '@22.5000,88.3500,13z' },
  { name: 'Kolkata North', ll: '@22.6500,88.3800,13z' },
  { name: 'Salt Lake', ll: '@22.5800,88.4200,13z' },
  { name: 'Howrah', ll: '@22.5958,88.2636,13z' },
];

const QUERIES = [
  'restaurant',
  'cafe',
  'bakery',
  'beauty salon',
  'hair salon',
  'spa',
  'gym',
  'fitness center',
  'doctor',
  'dentist',
  'hospital',
  'pharmacy',
  'clinic',
  'diagnostic center',
  'pathology lab',
  'eye clinic',
  'school',
  'coaching center',
  'tuition center',
  'play school',
  'real estate agent',
  'hotel',
  'jewellery shop',
  'clothing store',
  'boutique',
  'saree shop',
  'furniture store',
  'car dealer',
  'car repair',
  'wedding planner',
  'photographer',
  'electronics store',
  'mobile shop',
  'grocery store',
  'sweet shop',
  'caterer',
  'travel agency',
  'interior designer',
  'florist',
  'pet shop',
  'laundry',
  'insurance agent',
  'chartered accountant',
  'lawyer',
  'veterinary',
  'plumber',
  'electrician',
  'packers and movers',
  'printing press',
  'optical shop',
  'driving school',
  'pest control',
  'AC repair',
  'construction company',
  'tile shop',
  'paint shop',
  'nursery plant',
  'fast food',
  'biryani restaurant',
  'nursing home',
  'medical store',
  'dental clinic',
];

const EXCLUDE_KEYWORDS = [
  'web design', 'website design', 'web development', 'web developer',
  'app development', 'app developer', 'mobile app', 'software company',
  'software development', 'it company', 'it services', 'digital marketing',
  'seo services', 'seo agency', 'web agency', 'digital agency',
];

const allLeads = new Map();
let totalApiCalls = 0;
const MAX_API_CALLS = 250;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isExcluded(biz) {
  const combined = `${biz.title || ''} ${biz.type || ''} ${(biz.types || []).join(' ')}`.toLowerCase();
  return EXCLUDE_KEYWORDS.some(kw => combined.includes(kw));
}

function normalizeCity(name) {
  if (name === 'Salt Lake' || name === 'Howrah' || name.startsWith('Kolkata')) return 'Kolkata';
  return name;
}

function addLead(biz, cityName, category) {
  if (isExcluded(biz)) return false;
  const phone = biz.phone || '';
  const name = biz.title || '';
  const address = biz.address || '';
  const key = phone ? phone.replace(/\D/g, '').slice(-10) : `${name}|${address}`.toLowerCase();
  if (!key || allLeads.has(key)) return false;

  allLeads.set(key, {
    name: name.replace(/"/g, '""'),
    category,
    city: normalizeCity(cityName),
    address: address.replace(/"/g, '""'),
    phone,
    email: '',
    website: biz.website || '',
    rating: biz.rating || '',
    reviews: biz.reviews || '',
  });
  return true;
}

// SAVE after every query — never lose data
function saveToFile() {
  const leadsArr = Array.from(allLeads.values());
  const rows = leadsArr.map(l =>
    `"${l.name}","${l.category}","${l.city}","${l.address}","${l.phone}","${l.email}","${l.website}","${l.rating}","${l.reviews}"`
  ).join('\n');
  fs.writeFileSync(CSV_PATH, CSV_HEADER + rows, 'utf-8');
  fs.writeFileSync(JSON_PATH, JSON.stringify(leadsArr, null, 2), 'utf-8');
}

async function serpSearch(query, city) {
  if (totalApiCalls >= MAX_API_CALLS) {
    console.log(`  STOPPED: Hit ${MAX_API_CALLS} API call limit`);
    return [];
  }

  const params = new URLSearchParams({
    engine: 'google_maps',
    q: query,
    ll: city.ll,
    type: 'search',
    api_key: API_KEY,
  });

  try {
    const res = await fetch(`https://serpapi.com/search.json?${params.toString()}`);
    totalApiCalls++;
    const data = await res.json();
    if (data.error) {
      console.error(`  ERROR: ${data.error}`);
      return [];
    }
    return data.local_results || [];
  } catch (err) {
    console.error(`  Fetch error: ${err.message}`);
    return [];
  }
}

async function scrapeEmail(url) {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' },
      redirect: 'follow',
    });
    clearTimeout(t);
    const html = await res.text();
    const emails = (html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [])
      .filter(e => !e.match(/\.(png|jpg|svg|webp)$/i) && !e.includes('example.com') && !e.includes('sentry') && !e.includes('wixpress') && !e.includes('schema.org'));
    return emails[0] || '';
  } catch { return ''; }
}

async function main() {
  console.log('=== SerpAPI Lead Collector ===');
  console.log(`Max API calls: ${MAX_API_CALLS}`);
  console.log(`Cities: ${CITIES.length} | Queries: ${QUERIES.length}`);
  console.log(`Total possible calls: ${CITIES.length * QUERIES.length}`);
  console.log(`Saving to CSV after EVERY query\n`);

  // Write header
  fs.writeFileSync(CSV_PATH, CSV_HEADER, 'utf-8');

  for (const city of CITIES) {
    console.log(`\n=== ${city.name} ===`);

    for (const query of QUERIES) {
      if (totalApiCalls >= MAX_API_CALLS) {
        console.log(`\nREACHED ${MAX_API_CALLS} CALL LIMIT — stopping`);
        break;
      }

      const results = await serpSearch(query, city);
      let added = 0;
      for (const biz of results) {
        if (addLead(biz, city.name, query)) added++;
      }

      console.log(`  [#${totalApiCalls}] "${query}" => ${results.length} found, +${added} new | TOTAL: ${allLeads.size}`);

      // SAVE IMMEDIATELY after every query
      saveToFile();

      await sleep(300);
    }

    if (totalApiCalls >= MAX_API_CALLS) break;
  }

  // Phase 2: Scrape emails from websites
  const leadsArr = Array.from(allLeads.values());
  const withSite = leadsArr.filter(l => l.website && !l.website.includes('facebook.com') && !l.website.includes('instagram.com'));
  console.log(`\nScraping emails from ${withSite.length} websites...`);

  let emailCount = 0;
  for (let i = 0; i < withSite.length; i++) {
    if ((i + 1) % 25 === 0) {
      console.log(`  ${i + 1}/${withSite.length} scraped | ${emailCount} emails`);
      saveToFile(); // Save progress during email scraping too
    }
    const email = await scrapeEmail(withSite[i].website);
    if (email) { withSite[i].email = email; emailCount++; }
    await sleep(80);
  }

  // Final save
  saveToFile();

  // Filter version — only leads with phone or email
  const withContact = leadsArr.filter(l =>
    (l.phone && l.phone.trim().length >= 8) || (l.email && l.email.includes('@'))
  );

  const filteredCsvPath = path.join(__dirname, 'leads-serp-filtered.csv');
  const filteredRows = withContact.map(l =>
    `"${l.name}","${l.category}","${l.city}","${l.address}","${l.phone}","${l.email}","${l.website}","${l.rating}","${l.reviews}"`
  ).join('\n');
  fs.writeFileSync(filteredCsvPath, CSV_HEADER + filteredRows, 'utf-8');

  console.log(`\n=== DONE ===`);
  console.log(`API calls used: ${totalApiCalls}/${MAX_API_CALLS}`);
  console.log(`Total leads: ${leadsArr.length}`);
  console.log(`With phone/email: ${withContact.length}`);
  console.log(`Emails found: ${emailCount}`);
  console.log(`\nAll leads: ${CSV_PATH}`);
  console.log(`Filtered (has contact): ${filteredCsvPath}`);

  const byCity = {};
  withContact.forEach(l => { byCity[l.city] = (byCity[l.city] || 0) + 1; });
  console.log(`\nBy city:`);
  Object.entries(byCity).forEach(([c, n]) => console.log(`  ${c}: ${n}`));
}

main().catch(console.error);

/**
 * Local Business Lead Collector
 * Uses Google Places API to collect business leads from Durgapur, Asansol, Burdwan, Kolkata
 *
 * SETUP:
 * 1. Get a Google Places API key from https://console.cloud.google.com
 * 2. Enable "Places API" and "Places API (New)" in your Google Cloud project
 * 3. Run: GOOGLE_PLACES_API_KEY=your_key node scripts/collect-leads.js
 *
 * OUTPUT: scripts/leads.csv with all collected business leads
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!API_KEY) {
  console.error('ERROR: Set GOOGLE_PLACES_API_KEY environment variable');
  console.error('Run: GOOGLE_PLACES_API_KEY=your_key node scripts/collect-leads.js');
  process.exit(1);
}

const CITIES = [
  { name: 'Durgapur', lat: 23.5204, lng: 87.3119, radius: 15000 },
  { name: 'Asansol', lat: 23.6889, lng: 86.9661, radius: 15000 },
  { name: 'Burdwan', lat: 23.2324, lng: 87.8615, radius: 12000 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, radius: 25000 },
  // Kolkata sub-areas for better coverage
  { name: 'Kolkata-SaltLake', lat: 22.5800, lng: 88.4200, radius: 10000 },
  { name: 'Kolkata-Howrah', lat: 22.5958, lng: 88.2636, radius: 10000 },
  { name: 'Kolkata-South', lat: 22.5000, lng: 88.3500, radius: 10000 },
  { name: 'Kolkata-Newtown', lat: 22.5922, lng: 88.4847, radius: 10000 },
  { name: 'Kolkata-North', lat: 22.6500, lng: 88.3800, radius: 10000 },
];

const CATEGORIES = [
  'restaurant', 'cafe', 'bakery',
  'beauty_salon', 'hair_care', 'spa',
  'gym', 'fitness_center',
  'doctor', 'dentist', 'hospital', 'pharmacy', 'physiotherapist',
  'school', 'university',
  'real_estate_agency',
  'lodging', 'hotel',
  'jewelry_store',
  'clothing_store', 'shoe_store',
  'furniture_store', 'home_goods_store',
  'car_dealer', 'car_repair',
  'wedding_planning',
  'photographer',
  'hardware_store',
  'electronics_store',
  'grocery_store', 'supermarket',
  'travel_agency',
  'interior_designer',
  'florist',
  'pet_store',
  'laundry',
  'insurance_agency',
  'accounting',
  'lawyer',
  'veterinary_care',
  'plumber',
  'electrician',
  'painter',
  'moving_company',
  'storage',
  'printing',
  'locksmith',
];

// Additional text search queries for businesses Google Places types don't cover well
const TEXT_QUERIES = [
  'coaching center',
  'tuition center',
  'diagnostic center',
  'pathology lab',
  'eye clinic',
  'optical shop',
  'mobile repair shop',
  'computer shop',
  'stationery shop',
  'sweet shop',
  'caterer',
  'event management',
  'banquet hall',
  'interior designer',
  'architect',
  'boutique',
  'saree shop',
  'gold jewellery',
  'car showroom',
  'bike showroom',
  'driving school',
  'dance class',
  'yoga center',
  'music class',
  'nursery school',
  'play school',
  'daycare',
  'old age home',
  'courier service',
  'pest control',
  'water purifier',
  'solar panel',
  'CCTV installation',
  'AC repair',
  'washing machine repair',
  'packers and movers',
  'PG accommodation',
  'hostel',
  'paying guest',
  'co-working space',
];

const allLeads = new Map(); // Use Map to deduplicate by phone or name+address
let totalApiCalls = 0;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function searchNearby(city, type) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${city.lat},${city.lng}&radius=${city.radius}&type=${type}&key=${API_KEY}`;

  try {
    const res = await fetch(url);
    totalApiCalls++;
    const data = await res.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error(`  API error for ${type} in ${city.name}: ${data.status} - ${data.error_message || ''}`);
      return [];
    }

    let results = data.results || [];

    // Get next page if available
    if (data.next_page_token) {
      await sleep(2000); // Google requires delay before using next_page_token
      const nextUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${data.next_page_token}&key=${API_KEY}`;
      const nextRes = await fetch(nextUrl);
      totalApiCalls++;
      const nextData = await nextRes.json();
      if (nextData.results) results = results.concat(nextData.results);

      // Third page
      if (nextData.next_page_token) {
        await sleep(2000);
        const thirdUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${nextData.next_page_token}&key=${API_KEY}`;
        const thirdRes = await fetch(thirdUrl);
        totalApiCalls++;
        const thirdData = await thirdRes.json();
        if (thirdData.results) results = results.concat(thirdData.results);
      }
    }

    return results;
  } catch (err) {
    console.error(`  Fetch error for ${type} in ${city.name}: ${err.message}`);
    return [];
  }
}

async function textSearch(city, query) {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + ' in ' + city.name)}&location=${city.lat},${city.lng}&radius=${city.radius}&key=${API_KEY}`;

  try {
    const res = await fetch(url);
    totalApiCalls++;
    const data = await res.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return [];
    }

    let results = data.results || [];

    if (data.next_page_token) {
      await sleep(2000);
      const nextUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${data.next_page_token}&key=${API_KEY}`;
      const nextRes = await fetch(nextUrl);
      totalApiCalls++;
      const nextData = await nextRes.json();
      if (nextData.results) results = results.concat(nextData.results);
    }

    return results;
  } catch (err) {
    return [];
  }
}

async function getPhoneNumber(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_phone_number,website,opening_hours&key=${API_KEY}`;

  try {
    const res = await fetch(url);
    totalApiCalls++;
    const data = await res.json();
    return {
      phone: data.result?.formatted_phone_number || '',
      website: data.result?.website || '',
      open_now: data.result?.opening_hours?.open_now ? 'Yes' : 'No',
    };
  } catch {
    return { phone: '', website: '', open_now: '' };
  }
}

function addLead(place, city, category) {
  const key = `${place.name}|${place.vicinity || place.formatted_address || ''}`.toLowerCase();

  if (allLeads.has(key)) return false;

  allLeads.set(key, {
    name: (place.name || '').replace(/,/g, ' '),
    category: category,
    city: city.name.replace(/^Kolkata-.*/, 'Kolkata'),
    address: (place.vicinity || place.formatted_address || '').replace(/,/g, ' |'),
    rating: place.rating || '',
    total_ratings: place.user_ratings_total || '',
    place_id: place.place_id,
    phone: '', // Will be filled later
    website: '',
  });

  return true;
}

async function main() {
  console.log('=== FormiqStudio Lead Collector ===');
  console.log(`Cities: ${CITIES.map(c => c.name).join(', ')}`);
  console.log(`Categories: ${CATEGORIES.length} types + ${TEXT_QUERIES.length} text queries`);
  console.log('');

  // Phase 1: Nearby Search by type
  for (const city of CITIES) {
    console.log(`\n📍 ${city.name} — Nearby Search`);

    for (const type of CATEGORIES) {
      const results = await searchNearby(city, type);
      let newCount = 0;

      for (const place of results) {
        if (addLead(place, city, type)) newCount++;
      }

      if (newCount > 0) {
        process.stdout.write(`  ${type}: +${newCount} (total: ${allLeads.size})\n`);
      }

      await sleep(200); // Rate limiting
    }
  }

  // Phase 2: Text Search for niche categories
  for (const city of CITIES) {
    console.log(`\n🔍 ${city.name} — Text Search`);

    for (const query of TEXT_QUERIES) {
      const results = await textSearch(city, query);
      let newCount = 0;

      for (const place of results) {
        if (addLead(place, city, query)) newCount++;
      }

      if (newCount > 0) {
        process.stdout.write(`  "${query}": +${newCount} (total: ${allLeads.size})\n`);
      }

      await sleep(200);
    }
  }

  const allLeadsArr = Array.from(allLeads.values());
  console.log(`\n📊 Total unique places found: ${allLeadsArr.length}`);
  console.log(`📊 Total API calls so far: ${totalApiCalls}`);

  // Phase 3: Get phone numbers for ALL leads — only keep ones with phone
  console.log(`\n📞 Fetching phone numbers for ALL ${allLeadsArr.length} leads...`);
  console.log(`   (Only leads WITH a mobile number will be saved)\n`);

  const leadsWithPhone = [];
  let skippedNoPhone = 0;
  let processed = 0;

  // Process in batches of 5 for speed
  for (let i = 0; i < allLeadsArr.length; i++) {
    processed++;
    if (processed % 50 === 0) {
      console.log(`  Progress: ${processed}/${allLeadsArr.length} | With phone: ${leadsWithPhone.length} | Skipped: ${skippedNoPhone}`);
    }

    const details = await getPhoneNumber(allLeadsArr[i].place_id);
    const phone = details.phone || '';

    // Only keep leads that have a phone number
    if (phone && phone.trim().length >= 8) {
      allLeadsArr[i].phone = phone;
      allLeadsArr[i].website = details.website;
      leadsWithPhone.push(allLeadsArr[i]);
    } else {
      skippedNoPhone++;
    }

    await sleep(80); // Rate limiting for details API

    // Save intermediate results every 500 leads (in case of crash)
    if (leadsWithPhone.length > 0 && leadsWithPhone.length % 500 === 0) {
      const tempPath = path.join(__dirname, 'leads_partial.csv');
      const tempHeader = 'Name,Category,City,Address,Phone,Website,Rating,Total Reviews\n';
      const tempRows = leadsWithPhone.map(l =>
        `"${l.name}","${l.category}","${l.city}","${l.address}","${l.phone}","${l.website}","${l.rating}","${l.total_ratings}"`
      ).join('\n');
      fs.writeFileSync(tempPath, tempHeader + tempRows, 'utf-8');
      console.log(`  💾 Intermediate save: ${leadsWithPhone.length} leads saved to leads_partial.csv`);
    }
  }

  // Phase 4: Write final CSV — ONLY leads with phone numbers
  const csvPath = path.join(__dirname, 'leads.csv');
  const header = 'Name,Category,City,Address,Phone,Website,Rating,Total Reviews\n';

  const rows = leadsWithPhone.map(l =>
    `"${l.name}","${l.category}","${l.city}","${l.address}","${l.phone}","${l.website}","${l.rating}","${l.total_ratings}"`
  ).join('\n');

  fs.writeFileSync(csvPath, header + rows, 'utf-8');

  // Cleanup partial file
  const partialPath = path.join(__dirname, 'leads_partial.csv');
  if (fs.existsSync(partialPath)) fs.unlinkSync(partialPath);

  console.log(`\n✅ Done!`);
  console.log(`📊 Total places scanned: ${allLeadsArr.length}`);
  console.log(`📞 Leads WITH phone number: ${leadsWithPhone.length}`);
  console.log(`❌ Skipped (no phone): ${skippedNoPhone}`);
  console.log(`📁 Saved to: ${csvPath}`);
  console.log(`📊 Total API calls: ${totalApiCalls}`);
  console.log(`\nBreakdown by city:`);

  const byCityCount = {};
  leadsWithPhone.forEach(l => {
    byCityCount[l.city] = (byCityCount[l.city] || 0) + 1;
  });
  Object.entries(byCityCount).forEach(([city, count]) => {
    console.log(`  ${city}: ${count} leads`);
  });
}

main().catch(console.error);

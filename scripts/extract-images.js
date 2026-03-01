#!/usr/bin/env node
/**
 * extract-images.js
 * Parses public_derivative_report.xlsx and scrapes existing HTML PDPs
 * Outputs server/data/product-images.json mapping SKUs to mediahub image URLs
 */
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const REPORT = path.join(ROOT, 'public_derivative_report.xlsx');
const PDP_DIR = path.join(ROOT, 'sites', 'beechfield', 'products');
const PRODUCTS_JSON = path.join(ROOT, 'server', 'data', 'products.json');
const OUTPUT = path.join(ROOT, 'server', 'data', 'product-images.json');

// --- SKU Regex ---
// Matches Beechfield (B), BagBase (BG), Quadra (QD), Westford Mill (W/WM) SKUs
const SKU_REGEX = /(?:^|[\s_\-\/])((?:B|BG|QD|W|WM)\d{1,4}[A-Z]?)(?:[\s_\-\/.]|$)/i;

// --- Image type keywords ---
const LIFESTYLE_KEYWORDS = ['lifestyle', 'life-style', 'model', 'on-model', 'worn', 'wearing'];
const REAR_KEYWORDS = ['rear', 'back', 'behind'];
const DETAIL_KEYWORDS = ['detail', 'close-up', 'closeup', 'stitching', 'eyelets', 'closure', 'pocket', 'label', 'buckle', 'adjuster', 'lining', 'sweatband'];
const STILLLIFE_KEYWORDS = ['still-life', 'still_life', 'stilllife', 'flat-shot', 'flat_shot', 'flatshot', 'flat-lay'];
const GROUP_KEYWORDS = ['group', 'collection', 'range', 'family', 'stack', 'pile'];
const FRONT_KEYWORDS = ['front', 'front-on', 'product-shot', 'hero'];

function classifyImage(mediaName) {
  const name = mediaName.toLowerCase();
  if (LIFESTYLE_KEYWORDS.some(k => name.includes(k))) return 'lifestyle';
  if (REAR_KEYWORDS.some(k => name.includes(k))) return 'rear';
  if (DETAIL_KEYWORDS.some(k => name.includes(k))) return 'detail';
  if (STILLLIFE_KEYWORDS.some(k => name.includes(k))) return 'still-life';
  if (GROUP_KEYWORDS.some(k => name.includes(k))) return 'group';
  if (FRONT_KEYWORDS.some(k => name.includes(k))) return 'front';
  return 'product'; // default: product shot
}

function extractColour(mediaName, sku) {
  const name = mediaName.toLowerCase();
  // Remove brand prefix and SKU, then extract colour
  const stripped = name
    .replace(/^(beechfield|bagbase|quadra|westford[\s_]mill)[\s_]/i, '')
    .replace(new RegExp(`${sku.toLowerCase()}[\\s_]?`, 'i'), '')
    .trim();

  // Take the part before any view type keyword
  const allKeywords = [...LIFESTYLE_KEYWORDS, ...REAR_KEYWORDS, ...DETAIL_KEYWORDS, ...STILLLIFE_KEYWORDS, ...GROUP_KEYWORDS, ...FRONT_KEYWORDS];
  let colourPart = stripped;
  for (const kw of allKeywords) {
    const idx = colourPart.indexOf(kw);
    if (idx > 0) {
      colourPart = colourPart.substring(0, idx).trim();
      break;
    }
  }

  // Clean up
  colourPart = colourPart
    .replace(/[_\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\d{3,}$/, '') // Remove trailing numbers (image IDs)
    .trim();

  // Title case
  if (colourPart.length > 1) {
    return colourPart.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  return '';
}

// --- Step 1: Parse derivatives report ---
console.log('Reading public derivative report...');
const wb = XLSX.readFile(REPORT);
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
console.log(`  ${rows.length} entries`);

// Build per-SKU image map from report
const imageMap = {}; // { SKU: { images: [...] } }
let matchedRows = 0;

for (const row of rows) {
  const mediaName = String(row.media_name || '').trim();
  const mediumUrl = String(row.Product_medium || '').trim();
  const smallUrl = String(row.Product_small || '').trim();

  if (!mediumUrl) continue;

  // Extract SKU from media_name
  const match = mediaName.match(SKU_REGEX);
  if (!match) continue;

  const sku = match[1].toUpperCase();
  matchedRows++;

  if (!imageMap[sku]) {
    imageMap[sku] = { images: [] };
  }

  const imageType = classifyImage(mediaName);
  const colour = extractColour(mediaName, sku);

  imageMap[sku].images.push({
    mediaName,
    type: imageType,
    colour,
    medium: mediumUrl,
    small: smallUrl || null,
  });
}

console.log(`  Matched ${matchedRows} images to SKUs`);
console.log(`  Unique SKUs with images: ${Object.keys(imageMap).length}`);

// --- Step 2: Scrape existing HTML PDPs for mediahub URLs ---
console.log('\nScraping existing PDP HTML files...');
const MEDIAHUB_URL_REGEX = /https?:\/\/mediahub\.beechfieldbrands\.com\/[^\s"'<>]+/g;

const htmlFiles = fs.readdirSync(PDP_DIR)
  .filter(f => f.endsWith('.html') && f !== 'index.html');

for (const file of htmlFiles) {
  const filePath = path.join(PDP_DIR, file);
  const html = fs.readFileSync(filePath, 'utf8');

  // Extract SKU from filename
  const skuMatch = file.match(/^(b\d+[a-z]?)-/i);
  if (!skuMatch) continue;
  const sku = skuMatch[1].toUpperCase();

  // Find all mediahub URLs in the HTML
  const urls = html.match(MEDIAHUB_URL_REGEX) || [];
  const uniqueUrls = [...new Set(urls)];

  if (!imageMap[sku]) {
    imageMap[sku] = { images: [] };
  }

  // Track existing URLs for this SKU to avoid duplicates
  const existingUrls = new Set(imageMap[sku].images.map(i => i.medium));

  for (const url of uniqueUrls) {
    // Skip logo/branding images
    if (url.includes('Logo') || url.includes('logo')) continue;

    if (!existingUrls.has(url)) {
      existingUrls.add(url);

      // Try to classify from URL
      const urlLower = url.toLowerCase();
      let type = 'product';
      if (LIFESTYLE_KEYWORDS.some(k => urlLower.includes(k))) type = 'lifestyle';
      else if (REAR_KEYWORDS.some(k => urlLower.includes(k))) type = 'rear';
      else if (DETAIL_KEYWORDS.some(k => urlLower.includes(k))) type = 'detail';

      imageMap[sku].images.push({
        mediaName: `html-scraped-${file}`,
        type,
        colour: '',
        medium: url,
        small: null,
        source: 'html',
      });
    }
  }

  console.log(`  ${file}: ${uniqueUrls.length} URLs found for ${sku}`);
}

// --- Step 3: Build final output ---
// For each SKU, select hero, lifestyle, rear, detail, and colour variants
const output = {};

for (const [sku, data] of Object.entries(imageMap)) {
  // Filter to Beechfield SKUs only (starts with B, not BG)
  if (!sku.match(/^B\d/)) continue;

  const images = data.images;

  // Prioritise hero image: front > product > first available
  const hero = images.find(i => i.type === 'front')
    || images.find(i => i.type === 'product')
    || images[0];

  // Lifestyle images
  const lifestyle = images.filter(i => i.type === 'lifestyle');

  // Rear views
  const rear = images.filter(i => i.type === 'rear');

  // Detail shots
  const detail = images.filter(i => i.type === 'detail');

  // Still life
  const stillLife = images.filter(i => i.type === 'still-life');

  // Group shots
  const group = images.filter(i => i.type === 'group');

  // Colour variants (product shots with colour info)
  const colourVariants = {};
  for (const img of images) {
    if (img.colour && (img.type === 'product' || img.type === 'front')) {
      if (!colourVariants[img.colour]) {
        colourVariants[img.colour] = img.medium;
      }
    }
  }

  output[sku] = {
    hero: hero ? hero.medium : null,
    lifestyle: lifestyle.slice(0, 4).map(i => i.medium),
    rear: rear.slice(0, 2).map(i => i.medium),
    detail: detail.slice(0, 4).map(i => i.medium),
    stillLife: stillLife.slice(0, 2).map(i => i.medium),
    group: group.slice(0, 2).map(i => i.medium),
    colours: colourVariants,
    totalImages: images.length,
  };
}

// --- Write output ---
fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));

// --- Report ---
const beechfieldSkus = Object.keys(output);
const withHero = beechfieldSkus.filter(s => output[s].hero);
const withLifestyle = beechfieldSkus.filter(s => output[s].lifestyle.length > 0);
const withColours = beechfieldSkus.filter(s => Object.keys(output[s].colours).length > 0);

console.log(`\nWrote ${beechfieldSkus.length} Beechfield SKUs to ${OUTPUT}`);
console.log(`  With hero image: ${withHero.length}`);
console.log(`  With lifestyle: ${withLifestyle.length}`);
console.log(`  With colour variants: ${withColours.length}`);

// Check against products.json if it exists
if (fs.existsSync(PRODUCTS_JSON)) {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
  const productSkus = new Set(products.map(p => p.sku.toUpperCase()));
  const covered = [...productSkus].filter(s => output[s]);
  const missing = [...productSkus].filter(s => !output[s]);

  console.log(`\nCoverage against products.json:`);
  console.log(`  Products in database: ${productSkus.size}`);
  console.log(`  With images: ${covered.length} (${(covered.length / productSkus.size * 100).toFixed(1)}%)`);
  console.log(`  Missing images: ${missing.length}`);
  if (missing.length > 0 && missing.length <= 20) {
    console.log(`  Missing SKUs: ${missing.join(', ')}`);
  }
}

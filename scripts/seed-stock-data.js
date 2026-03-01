#!/usr/bin/env node
/**
 * seed-stock-data.js
 * Generates placeholder stock data per product × colour × distributor
 * Uses image-derived colours cleaned up, plus common fallback colours
 * Outputs server/data/stock.json
 */
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const PRODUCTS_JSON = path.join(ROOT, 'server', 'data', 'products.json');
const IMAGES_JSON = path.join(ROOT, 'server', 'data', 'product-images.json');
const DISTRIBUTORS_JSON = path.join(ROOT, 'server', 'data', 'distributors.json');
const OUTPUT = path.join(ROOT, 'server', 'data', 'stock.json');

// --- Noise filters for colour extraction from image names ---
const NOISE_PATTERNS = [
  /web banner/i, /e shot/i, /template/i, /reference/i, /illustration/i,
  /decoration/i, /silicon/i, /1920/i, /600\s?x/i, /px$/i, /ecomm/i,
  /product shot/i, /ecommerce/i, /cropped/i, /\d{4}px/i, /printers panel/i,
  /fabric swatch/i, /heat/i, /patch$/i,
];

const SUFFIX_STRIPS = [
  / slouch$/i, / cuff$/i, / interior$/i, / marl$/i,
  / \d{1,2}\s?\d{1,2}mths$/i, / \d+ \d+mths$/i,
];

// Common Beechfield colours (fallback when image data is missing or sparse)
const COMMON_COLOURS = [
  'Black', 'French Navy', 'Classic Red', 'Bottle Green', 'White',
  'Graphite Grey', 'Oxford Navy', 'Bright Royal', 'Burgundy', 'Charcoal',
  'Heather Grey', 'Sand', 'Olive Green',
];

// Popular colour families — get higher stock numbers
const POPULAR_COLOURS = new Set([
  'black', 'french navy', 'oxford navy', 'classic red', 'white',
  'graphite grey', 'charcoal', 'heather grey', 'bright royal', 'bottle green',
  'burgundy', 'sand',
]);

// --- Helpers ---
function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function cleanColourName(raw) {
  let name = raw.trim();

  // Filter out noise
  for (const p of NOISE_PATTERNS) {
    if (p.test(name)) return null;
  }

  // Strip suffixes
  for (const s of SUFFIX_STRIPS) {
    name = name.replace(s, '');
  }

  name = name.trim();

  // Filter out remaining garbage
  if (name.length < 3 || name.length > 40) return null;
  if (/^\d/.test(name)) return null;
  if (/\//.test(name) && name.length > 30) return null;

  return name;
}

// --- Load data ---
const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
const images = JSON.parse(fs.readFileSync(IMAGES_JSON, 'utf8'));
const distributors = JSON.parse(fs.readFileSync(DISTRIBUTORS_JSON, 'utf8'));

console.log(`Products: ${products.length}`);
console.log(`Images: ${Object.keys(images).length} SKUs`);
console.log(`Distributors: ${distributors.length}`);

// --- Extract clean colours per product ---
const productColours = {};

for (const product of products) {
  const sku = product.sku.toUpperCase();
  const imageData = images[sku];

  const colours = new Set();

  if (imageData && imageData.colours) {
    for (const rawColour of Object.keys(imageData.colours)) {
      const clean = cleanColourName(rawColour);
      if (clean) colours.add(clean);
    }
  }

  // If we got fewer than 3 colours from images, add common fallbacks
  if (colours.size < 3) {
    for (const c of COMMON_COLOURS.slice(0, 6)) {
      colours.add(c);
    }
  }

  productColours[sku] = [...colours].sort();
}

// --- Generate stock data ---
const stockData = {};
const distributorIds = distributors.map(d => d.id);

// Each distributor carries a subset of products
// Major distributors (Ralawise, Pencarrie, BTC) carry most products
// Smaller distributors carry fewer
const distributorCoverage = {
  1: 0.95,  // Ralawise — 95% of products
  2: 0.85,  // Pencarrie
  3: 0.80,  // BTC activewear
  4: 0.70,  // Tresham
  5: 0.65,  // Essentials
  6: 0.60,  // Harrisons Direct
  7: 0.50,  // Prestige Leisure
  8: 0.55,  // Impression Direct
  9: 0.45,  // Kingly
  10: 0.50, // MyWorkwear
  11: 0.40, // Wilkinson Plus
};

for (const product of products) {
  const sku = product.sku.toUpperCase();
  const colours = productColours[sku] || COMMON_COLOURS.slice(0, 5);
  const rand = seededRandom(sku.split('').reduce((a, c) => a + c.charCodeAt(0), 0));

  stockData[sku] = { colours: {} };

  for (const colour of colours) {
    const isPopular = POPULAR_COLOURS.has(colour.toLowerCase());

    // Beechfield central stock
    let centralStock;
    if (isPopular) {
      centralStock = Math.floor(rand() * 15000) + 5000; // 5,000-20,000
    } else {
      centralStock = Math.floor(rand() * 4000) + 500; // 500-4,500
    }

    const distributorStock = {};
    let totalDistributor = 0;

    for (const dist of distributors) {
      const coverage = distributorCoverage[dist.id] || 0.5;
      // Check if this distributor carries this product
      if (rand() > coverage) continue;

      let qty;
      if (isPopular) {
        qty = Math.floor(rand() * 8000) + 1000; // 1,000-9,000
      } else {
        qty = Math.floor(rand() * 2000) + 100; // 100-2,100
      }

      distributorStock[dist.slug] = qty;
      totalDistributor += qty;
    }

    stockData[sku].colours[colour] = {
      central: centralStock,
      distributors: distributorStock,
      total: centralStock + totalDistributor,
    };
  }
}

// --- Write output ---
fs.writeFileSync(OUTPUT, JSON.stringify(stockData, null, 2));

// --- Summary ---
const skuCount = Object.keys(stockData).length;
const colourEntries = Object.values(stockData).reduce((sum, s) => sum + Object.keys(s.colours).length, 0);
console.log(`\nWrote stock data for ${skuCount} products, ${colourEntries} colour entries to ${OUTPUT}`);

// Show an example
const example = stockData['B45'];
if (example) {
  const exColours = Object.keys(example.colours);
  console.log(`\nExample — B45 (${exColours.length} colours):`);
  for (const c of exColours.slice(0, 3)) {
    const d = example.colours[c];
    console.log(`  ${c}: central=${d.central}, total=${d.total}, distributors=${Object.keys(d.distributors).length}`);
  }
}

#!/usr/bin/env node
/**
 * import-product-data.js
 * Reads Product Categories MASTER DATABASE.xlsx and Caps Classification.xlsx
 * Outputs server/data/products.json with all Beechfield products
 */
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const MASTER_DB = path.join(ROOT, 'Product Categories MASTER DATABASE.xlsx');
const CAPS_CLASS = path.join(ROOT, 'Caps Classification.xlsx');
const OUTPUT = path.join(ROOT, 'server', 'data', 'products.json');

// --- Helpers ---
function trim(v) { return v != null ? String(v).trim() : ''; }
function normaliseColour(c) { return trim(c).toLowerCase().replace(/[\s\/]+/g, '-'); }

// --- Read Master Database ---
console.log('Reading master database...');
const masterWb = XLSX.readFile(MASTER_DB);

// "Beechfield ALL" sheet has all products with Knit or Cap discriminator
const allSheet = masterWb.Sheets['Beechfield ALL'];
const allRows = XLSX.utils.sheet_to_json(allSheet, { defval: '' });
console.log(`  Beechfield ALL: ${allRows.length} rows`);

// "Beechfield Caps" sheet has cap-specific fields (Panel, Crown Profile, Structure, Closure)
const capsSheet = masterWb.Sheets['Beechfield Caps'];
const capsRows = XLSX.utils.sheet_to_json(capsSheet, { defval: '' });
console.log(`  Beechfield Caps: ${capsRows.length} rows`);

// "Beechfield Knits" sheet
const knitsSheet = masterWb.Sheets['Beechfield Knits'];
const knitsRows = XLSX.utils.sheet_to_json(knitsSheet, { defval: '' });
console.log(`  Beechfield Knits: ${knitsRows.length} rows`);

// --- Read Caps Classification for detailed specs ---
console.log('Reading caps classification...');
const classWb = XLSX.readFile(CAPS_CLASS);

// "Classification" sheet has 41 detailed columns
const classSheet = classWb.Sheets['Classification'];
const classRows = XLSX.utils.sheet_to_json(classSheet, { defval: '' });
console.log(`  Classification: ${classRows.length} rows`);

// "Cap's Guide" sheet has style/panel/profile/closure classification matrix
const guideSheet = classWb.Sheets["Cap's Guide"];
const guideData = XLSX.utils.sheet_to_json(guideSheet, { defval: '' });
console.log(`  Cap's Guide: ${guideData.length} rows`);

// --- Build classification lookup ---
const classLookup = {};
for (const row of classRows) {
  const code = trim(row['PRODUCT CODE']);
  if (!code) continue;
  classLookup[code.toUpperCase()] = {
    style: trim(row['STYLE']),
    typePurpose: trim(row['TYPE (PURPOSE/ACTIVITY)']),
    category: trim(row['CATEGORY']),
    genre: trim(row['PROPOSED GENRE']),
    tier: trim(row['GOOD / BETTER / BEST']),
    fabric: trim(row['FABRIC (BF website)']),
    fabricWeight: trim(row['FABRIC WEIGHT']),
    secondFabric: trim(row['2nd FABRIC']),
    panelDesign: trim(row['PANEL DESIGN']),
    crownProfile: trim(row['CROWN PROFILE']),
    frontPanel: trim(row['FRONT PANEL in cm']),
    sidePanel: trim(row['SIDE PANEL in cm']),
    structure: trim(row['STRUCTURE / BUCKRAM']),
    peak: trim(row['PEAK']),
    peakHeight: trim(row['PEAK HEIGHT in cm']),
    closure: trim(row['CLOSURE / ADJUSTER']),
    closureSimplified: trim(row['(SIMPLIFIED CLOSURE)']),
    eyelets: trim(row['EYELETS']),
    interior: trim(row['INTERIOR (LINING, TAPING, SWEATBAND)']),
    sustainability: trim(row['SUSTAINABILITY / CERTIFICATION']),
    otherDetails: trim(row['OTHER DETAILS']),
    decoration: trim(row['DECORATION']),
    sizing: trim(row['SIZING']),
    circumference: trim(row['CIRCUMF. in cm']),
    circumferenceRange: trim(row['CIRCUMFERENCE RANGE']),
    label: trim(row['LABEL']),
    peakShape: trim(row['PEAK SHAPE']),
  };
}

// --- Build guide classification lookup ---
const guideLookup = {};
for (const row of guideData) {
  // Column 0 is "." which contains "B10 Original 5 Panel Cap" format
  const rawName = trim(row['.'] || row[Object.keys(row)[0]] || '');
  if (!rawName) continue;
  // Extract SKU from start of name
  const skuMatch = rawName.match(/^(B\d+[A-Z]?)\s/i);
  if (!skuMatch) continue;
  const sku = skuMatch[1].toUpperCase();

  const classify = (cols, labels) => {
    for (let i = 0; i < cols.length; i++) {
      if (trim(row[cols[i]]) === 'a') return labels[i];
    }
    return '';
  };

  guideLookup[sku] = {
    styleClass: classify(
      ['CLASSIC', 'TRUCKER', 'SNAPBACK', 'DAD HAT', 'CAMPER', 'OTHER'],
      ['Classic', 'Trucker', 'Snapback', 'Dad Hat', 'Camper', 'Other']
    ),
    panelClass: classify(
      ['5 PANEL', '6 PANEL', 'OTHER'],
      ['5 Panel', '6 Panel', 'Other']
    ),
    profileClass: classify(
      ['HIGH', 'MID', 'LOW', 'no profile'],
      ['High', 'Mid', 'Low', 'No Profile']
    ),
    crownStructure: classify(
      ['STRUCTURED', 'SEMI-STRUCTURED', 'UNSTRUCTURED', 'no crown'],
      ['Structured', 'Semi-Structured', 'Unstructured', 'No Crown']
    ),
    peakType: classify(
      ['CURVED', 'SEMI-CURVED', 'FLAT'],
      ['Curved', 'Semi-Curved', 'Flat']
    ),
    closureType: classify(
      ['SNAP-BACK', 'STRAP-BACK', 'STRETCH-FIT', 'OTHER'],
      ['Snapback', 'Strapback', 'Stretch-Fit', 'Other']
    ),
    qualityTier: classify(
      ['GOOD/ORIGINAL', 'BETTER/AUTHENTIC', 'BEST/ULTIMATE'],
      ['Good / Original', 'Better / Authentic', 'Best / Ultimate']
    ),
  };
}

// --- Build Beechfield Caps lookup for extra fields ---
const capsLookup = {};
for (const row of capsRows) {
  const code = trim(row['Product Code']);
  if (!code) continue;
  capsLookup[code.toUpperCase()] = {
    panel: trim(row['Panel'] || row['Panel ']),
    crownProfile: trim(row['Crown Profile']),
    structure: trim(row['Structure']),
    closure: trim(row['Closure']),
  };
}

// --- Merge all data into products array ---
const products = [];

for (const row of allRows) {
  const code = trim(row['Product Code']);
  if (!code) continue;

  const sku = code.toUpperCase();
  const knitOrCap = trim(row['Knit or Cap']).toLowerCase();
  const capExtra = capsLookup[sku] || {};
  const classExtra = classLookup[sku] || {};
  const guideExtra = guideLookup[sku] || {};

  // Generate URL-safe slug
  const name = trim(row['Product Name']);
  const slug = `${code.toLowerCase()}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

  const product = {
    sku: code,
    name,
    slug,
    type: knitOrCap, // "cap" or "knit"
    productType: trim(row['Product Type']),
    silo: trim(row['Silo'] || row['Silo ']),
    silo2: trim(row['Silo 2']),
    collection: trim(row['Collection'] || row['Collection ']),
    size: trim(row['Size'] || row['Size ']),
    ecoCredentials: trim(row['Eco-Credentials']),

    // Cap-specific from Beechfield Caps sheet
    panel: capExtra.panel || '',
    crownProfile: capExtra.crownProfile || '',
    structure: capExtra.structure || '',
    closure: capExtra.closure || '',

    // Detailed specs from Classification sheet (41 columns)
    style: classExtra.style || '',
    typePurpose: classExtra.typePurpose || '',
    category: classExtra.category || '',
    genre: classExtra.genre || '',
    tier: classExtra.tier || guideExtra.qualityTier || '',
    fabric: classExtra.fabric || '',
    fabricWeight: classExtra.fabricWeight || '',
    secondFabric: classExtra.secondFabric || '',
    panelDesign: classExtra.panelDesign || capExtra.panel || '',
    crownProfileDetail: classExtra.crownProfile || capExtra.crownProfile || '',
    frontPanel: classExtra.frontPanel || '',
    sidePanel: classExtra.sidePanel || '',
    structureDetail: classExtra.structure || capExtra.structure || '',
    peak: classExtra.peak || '',
    peakHeight: classExtra.peakHeight || '',
    closureDetail: classExtra.closure || capExtra.closure || '',
    closureSimplified: classExtra.closureSimplified || '',
    eyelets: classExtra.eyelets || '',
    interior: classExtra.interior || '',
    sustainability: classExtra.sustainability || '',
    otherDetails: classExtra.otherDetails || '',
    decoration: classExtra.decoration || '',
    sizing: classExtra.sizing || '',
    circumference: classExtra.circumference || '',
    circumferenceRange: classExtra.circumferenceRange || '',
    label: classExtra.label || '',
    peakShape: classExtra.peakShape || '',

    // Guide classification (style, panel, profile categories)
    styleClass: guideExtra.styleClass || '',
    panelClass: guideExtra.panelClass || '',
    profileClass: guideExtra.profileClass || '',
    crownStructureClass: guideExtra.crownStructure || '',
    peakType: guideExtra.peakType || '',
    closureType: guideExtra.closureType || '',
    qualityTier: guideExtra.qualityTier || '',
  };

  products.push(product);
}

// --- Sort by SKU ---
products.sort((a, b) => {
  const numA = parseInt(a.sku.replace(/[^0-9]/g, '')) || 0;
  const numB = parseInt(b.sku.replace(/[^0-9]/g, '')) || 0;
  return numA - numB;
});

// --- Write output ---
fs.writeFileSync(OUTPUT, JSON.stringify(products, null, 2));
console.log(`\nWrote ${products.length} products to ${OUTPUT}`);

// --- Summary ---
const caps = products.filter(p => p.type === 'cap');
const knits = products.filter(p => p.type === 'knit');
const withClass = products.filter(p => p.fabric);
const withGuide = products.filter(p => p.styleClass);
console.log(`  Caps: ${caps.length}`);
console.log(`  Knits: ${knits.length}`);
console.log(`  With classification data: ${withClass.length}`);
console.log(`  With guide data: ${withGuide.length}`);

// Show collections
const collections = {};
for (const p of products) {
  const c = p.collection || 'Uncategorised';
  collections[c] = (collections[c] || 0) + 1;
}
console.log('\nCollections:');
for (const [c, count] of Object.entries(collections).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${c}: ${count}`);
}

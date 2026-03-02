#!/usr/bin/env node
/**
 * generate-products.js
 * Generates 248+ PDP HTML files and 6 category PLP files
 * Uses B673 template structure with data from products.json + product-images.json
 */
const path = require('path');
const fs = require('fs');
const { getHeader, getFooter, getSearchOverlay } = require('./nav-fragments');

const ROOT = path.resolve(__dirname, '..');
const PRODUCTS_JSON = path.join(ROOT, 'server', 'data', 'products.json');
const IMAGES_JSON = path.join(ROOT, 'server', 'data', 'product-images.json');
const OUTPUT_DIR = path.join(ROOT, 'sites', 'beechfield', 'products');

const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
const images = JSON.parse(fs.readFileSync(IMAGES_JSON, 'utf8'));

// --- Colour name → hex lookup ---
const COLOUR_HEX = {
  'black': '#000000', 'french navy': '#1b2a4a', 'oxford navy': '#002147',
  'classic red': '#dc2626', 'white': '#ffffff', 'graphite grey': '#555555',
  'charcoal': '#333333', 'heather grey': '#9ca3af', 'bottle green': '#166534',
  'burgundy': '#800020', 'sand': '#c2b280', 'olive green': '#556b2f',
  'bright royal': '#1d4ed8', 'kelly green': '#4ade80', 'fuchsia': '#d946ef',
  'gold': '#d4a017', 'sky blue': '#7dd3fc', 'lime green': '#84cc16',
  'mustard': '#e3a018', 'purple': '#7e22ce', 'teal': '#14b8a6',
  'orange': '#f97316', 'coral': '#f97171', 'plum': '#581c87',
  'chocolate': '#3e2723', 'emerald': '#10b981', 'fire red': '#ef4444',
  'bright red': '#ef4444', 'fluorescent green': '#22c55e', 'fluorescent yellow': '#facc15',
  'fluorescent pink': '#f472b6', 'surf blue': '#38bdf8', 'pastel pink': '#fbcfe8',
  'sapphire blue': '#2563eb', 'heather navy': '#1e3a5f', 'heather oatmeal': '#d4c4a0',
  'dusky pink': '#ce7e8e', 'classic pink': '#f9a8d4', 'airforce blue': '#5b7fa5',
  'true pink': '#ec4899', 'magenta': '#a21caf', 'lavender': '#a78bfa',
  'moss green': '#4a6741', 'light grey': '#d1d5db', 'yellow': '#fbbf24',
  'natural': '#f5f0e8', 'desert sand': '#c8b99a', 'caramel': '#c4883e',
  'stone': '#b4a78f', 'granite': '#5a5a5a', 'ash': '#b0b0b0',
  'mint': '#86efac', 'petrol': '#1a535c', 'soft white': '#f5f5f0',
  'navy': '#1b2a4a', 'red': '#dc2626', 'green': '#166534', 'blue': '#2563eb',
  'grey': '#888888', 'pink': '#ec4899', 'brown': '#8b4513', 'cream': '#f5f0e8',
  'almond': '#efdecd', 'dusty rose': '#c4868c', 'pistachio': '#93c572',
  'oatmeal': '#d4c4a0', 'antique grey': '#9e9487', 'antique moss green': '#6b7a4f',
  'antique royal blue': '#3b5fa8', 'antique burgundy': '#8c2e3a',
  'antique mustard': '#c4953a', 'antique petrol': '#3d6b73', 'antique teal': '#2c7873',
  'blush pink': '#fbcfe8', 'classic red/white': '#dc2626',
};

function getColourHex(name) {
  const lower = name.toLowerCase().replace(/\s+/g, ' ').trim();
  if (COLOUR_HEX[lower]) return COLOUR_HEX[lower];
  // Try first word
  const first = lower.split(/[\s\/]/)[0];
  if (COLOUR_HEX[first]) return COLOUR_HEX[first];
  // Fallback: generate from name hash
  let hash = 0;
  for (const ch of lower) hash = ((hash << 5) - hash + ch.charCodeAt(0)) | 0;
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 30%, 50%)`;
}

function escHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// --- Description generator ---
function generateDescription(p) {
  const parts = [];
  if (p.type === 'cap') {
    const fabric = p.fabric || 'quality construction';
    const panel = p.panelDesign || (p.panel ? p.panel + ' design' : '');
    const closure = p.closureDetail || p.closure || '';
    parts.push(`The ${p.name} — ${fabric.toLowerCase()}${panel ? ', ' + panel.toLowerCase() : ''}${closure ? ' with ' + closure.toLowerCase() : ''}.`);
  } else {
    const fabric = p.fabric || 'quality knit construction';
    parts.push(`The ${p.name} — ${fabric.toLowerCase()}.`);
  }
  if (p.collection && p.collection !== 'Uncategorised') {
    parts.push(`Part of the ${p.collection} collection.`);
  }
  if (p.decoration) {
    parts.push(`Decoration area: ${p.decoration}.`);
  }
  return parts.join(' ');
}

// --- Decoration suitability ---
function getDecorationCards(p) {
  const cards = [];
  const isCap = p.type === 'cap';
  const isKnit = p.type === 'knit';
  const productType = (p.productType || '').toLowerCase();

  // Embroidery
  cards.push({
    title: 'Embroidery',
    rating: 'Recommended',
    ease: isCap ? 'Excellent' : 'Good',
    text: isCap
      ? `Structured front panel provides a stable, flat surface for clean stitch work. ${p.decoration ? 'Decoration area: ' + p.decoration + '.' : ''} Cotton twill holds thread without distortion.`
      : `Double-knit construction provides good stability for embroidery. Best results with backing to prevent stretch. Keep stitch counts moderate for knit fabrics.`,
    icon: '<path d="M7 19L17 6"/><path d="M15 7l2-1 1 2-2 1"/><path d="M15 9c2-1 5 1 4 5s-5 7-8 6"/>',
  });

  // Transfer
  cards.push({
    title: 'Screen Print & Transfer',
    rating: isCap ? 'Recommended' : 'Good',
    ease: 'Good',
    text: isCap
      ? 'Consistent fabric weave delivers predictable heat transfer adhesion on the front panel. DTF and vinyl transfers both perform well on cotton twill.'
      : 'Heat transfer works well on smooth knit surfaces. Ensure even pressure across curved surfaces. Vinyl and DTF transfers recommended.',
    icon: '<rect x="3" y="4" width="18" height="14" rx="1"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="6" y1="15" x2="18" y2="15"/>',
  });

  // Patches (caps and bucket hats)
  if (isCap || productType.includes('bucket') || productType.includes('hat')) {
    cards.push({
      title: 'Patches & Labels',
      rating: 'Good',
      ease: 'Good',
      text: 'Woven, rubber and PVC patches bond cleanly to the fabric panels. Front panel is the primary placement zone. Heat-seal or sew-on methods both work well.',
      icon: '<rect x="5" y="7" width="14" height="10" rx="1"/><path d="M5 10h14"/><line x1="8" y1="13" x2="16" y2="13"/>',
    });
  }

  return cards;
}

// --- Breadcrumb type mapping ---
function getBreadcrumbType(p) {
  const pt = (p.productType || '').toLowerCase();
  if (pt.includes('beanie') || pt.includes('knit')) return { label: 'Beanies', slug: 'beanies' };
  if (pt.includes('bucket')) return { label: 'Bucket Hats', slug: 'bucket-hats' };
  if (pt.includes('visor')) return { label: 'Visors', slug: 'visors' };
  if (pt.includes('snood') || pt.includes('morf') || pt.includes('scarf') || pt.includes('band')) return { label: 'Accessories', slug: 'accessories' };
  return { label: 'Caps', slug: 'caps' };
}

// --- Get clean image colours ---
function getCleanColours(sku) {
  const imgData = images[sku.toUpperCase()];
  if (!imgData || !imgData.colours) return [];
  const noise = /web banner|e shot|template|reference|illustration|decoration|silicon|1920|600\s?x|px$|ecomm|product shot|ecommerce|cropped|printers panel|fabric swatch|heat|patch$/i;
  const stripSuffix = / slouch$| cuff$| interior$| marl$| \d{1,2}\s?\d{1,2}mths$/i;
  const colours = [];
  for (const [name, url] of Object.entries(imgData.colours)) {
    let clean = name.trim();
    if (noise.test(clean)) continue;
    clean = clean.replace(stripSuffix, '').trim();
    if (clean.length < 3 || clean.length > 40 || /^\d/.test(clean)) continue;
    colours.push({ name: clean, url });
  }
  // Deduplicate by lowercase name
  const seen = new Set();
  return colours.filter(c => {
    const key = c.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 24); // Max 24 swatches
}

// --- Derive filter data attributes ---
function getPurposes(p) {
  const purposes = new Set();
  const tp = (p.typePurpose || '').toLowerCase();
  const s1 = (p.silo || '').toLowerCase();
  const s2 = (p.silo2 || '').toLowerCase();
  const all = `${tp} ${s1} ${s2}`;
  if (/outdoor|active|sport|running|cycling/i.test(all)) purposes.add('outdoors');
  if (/sport|team|athletic|running|cycling/i.test(all)) purposes.add('sports');
  if (/promo|corporate|event|giveaway/i.test(all)) purposes.add('promotion');
  if (/fashion|street|vintage|urban|lifestyle/i.test(all)) purposes.add('fashion');
  if (/work|hi-vis|safety|industrial/i.test(all)) purposes.add('workwear');
  if (/gift|premium|luxury/i.test(all)) purposes.add('gifting');
  if (purposes.size === 0) purposes.add('promotion');
  return Array.from(purposes).join(' ');
}

function getDecoMethods(p) {
  const methods = ['embroidery', 'transfer'];
  const isCap = p.type === 'cap';
  const pt = (p.productType || '').toLowerCase();
  if (isCap || pt.includes('bucket') || pt.includes('hat')) methods.push('patches');
  if (isCap) methods.push('screen');
  return methods.join(' ');
}

function getFeatures(p) {
  const features = [];
  const label = (p.label || '').toLowerCase();
  if (label.includes('tear') || label.includes('rip')) features.push('tearaway');
  if ((p.ecoCredentials || '').toLowerCase() !== 'n/a' && (p.ecoCredentials || '').trim()) features.push('eco');
  return features.join(' ');
}

function getColourNames(sku) {
  const colours = getCleanColours(sku);
  return colours.map(c => c.name.toLowerCase()).join(' ');
}

// --- Find related products ---
function findRelated(product, count = 4) {
  const related = products.filter(p =>
    p.sku !== product.sku &&
    (p.collection === product.collection || p.productType === product.productType)
  );
  return related.slice(0, count);
}

// --- Find comparison products ---
function findComparison(product) {
  return products.filter(p =>
    p.sku !== product.sku && p.productType === product.productType
  ).slice(0, 3);
}

// --- PDP CSS (extracted from B673 template) ---
const PDP_CSS = `
    :root { --brand-primary: #0e1520; --brand-accent: #1f614d; --brand-cream: #f5f0e8; }
    .breadcrumb { background: var(--brand-cream); padding: 0.75rem 2rem; font-size: 0.8rem; }
    .breadcrumb__inner { max-width: 1200px; margin: 0 auto; display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
    .breadcrumb a { color: var(--brand-primary); text-decoration: none; opacity: 0.65; }
    .breadcrumb a:hover { opacity: 1; }
    .breadcrumb__sep { opacity: 0.35; }
    .breadcrumb__current { color: var(--brand-accent); font-weight: 600; }
    .product-header { max-width: 1200px; margin: 0 auto; padding: 2.5rem 2rem 3rem; display: grid; grid-template-columns: 55% 45%; gap: 3rem; align-items: start; }
    @media (max-width: 900px) { .product-header { grid-template-columns: 1fr; gap: 2rem; padding: 1.5rem 1rem 2rem; } }
    .gallery__main { width: 100%; aspect-ratio: 1/1; background: #eaeaea; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .gallery__main img { width: 100%; height: 100%; object-fit: contain; }
    .gallery__thumbs { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
    .gallery__thumb { width: 72px; height: 72px; background: #eaeaea; border: 2px solid transparent; cursor: pointer; overflow: hidden; padding: 0; transition: border-color 0.2s; }
    .gallery__thumb--active, .gallery__thumb:hover { border-color: var(--brand-primary); }
    .gallery__thumb img { width: 100%; height: 100%; object-fit: contain; }
    .product-info { padding-top: 0.5rem; }
    .product-info__collection { display: inline-block; background: rgba(31,97,77,0.1); border: 1px solid var(--brand-accent); color: var(--brand-accent); font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.25rem 0.75rem; margin-bottom: 0.75rem; }
    .product-info__sku { display: block; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #999; margin-bottom: 0.35rem; }
    .product-info__name { font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 800; color: var(--brand-primary); line-height: 1.15; margin-bottom: 0.75rem; }
    .product-info__desc { font-size: 0.95rem; line-height: 1.7; color: #555; margin-bottom: 1.5rem; }
    .colour-picker { margin-bottom: 1.5rem; }
    .colour-picker__label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #999; margin-bottom: 0.5rem; }
    .colour-picker__swatches { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 0.4rem; }
    .colour-picker__swatch { width: 32px; height: 32px; border-radius: 50%; border: 2px solid #ddd; cursor: pointer; transition: border-color 0.2s; padding: 0; background: none; }
    .colour-picker__swatch--active, .colour-picker__swatch:hover { border-color: var(--brand-primary); box-shadow: 0 0 0 2px rgba(14,21,32,0.25); }
    .colour-picker__name { font-size: 0.82rem; color: var(--brand-primary); font-weight: 500; }
    .deco-techniques { margin-bottom: 1.5rem; }
    .deco-techniques__label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #999; margin-bottom: 0.5rem; }
    .deco-techniques__pills { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .deco-pill { display: inline-flex; align-items: center; gap: 6px; background: var(--brand-primary); color: #fff; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 0.4rem 0.9rem; text-decoration: none; transition: background 0.2s; }
    .deco-pill:hover { background: #2a3545; }
    .deco-pill svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; }
    .product-ctas { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .product-ctas__btn { flex: 1; min-width: 180px; text-align: center; padding: 0.85rem 1.25rem; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; text-decoration: none; transition: background 0.2s, color 0.2s; }
    .product-ctas__btn--primary { background: var(--brand-primary); color: #fff; }
    .product-ctas__btn--primary:hover { background: #2a3545; }
    .product-ctas__btn--outline { background: transparent; color: var(--brand-primary); border: 2px solid var(--brand-primary); }
    .product-ctas__btn--outline:hover { background: var(--brand-primary); color: #fff; }
    .quick-specs { display: flex; gap: 0; border-top: 1px solid #e4ddd6; border-bottom: 1px solid #e4ddd6; }
    .quick-spec { flex: 1; padding: 0.75rem 0; text-align: center; border-right: 1px solid #e4ddd6; }
    .quick-spec:last-child { border-right: none; }
    .quick-spec__label { font-size: 0.63rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #999; margin-bottom: 2px; }
    .quick-spec__value { font-size: 0.82rem; font-weight: 600; color: var(--brand-primary); }
    .section-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--brand-accent); font-weight: 700; margin-bottom: 0.5rem; }
    .section-heading { font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 800; margin-bottom: 2rem; }
    .specs-section { background: #f5f5f0; padding: 4rem 2rem; }
    .specs-section__inner { max-width: 1200px; margin: 0 auto; }
    .specs-table { width: 100%; border-collapse: collapse; }
    .specs-table tr { border-bottom: 1px solid #ddd8d0; }
    .specs-table td { padding: 0.85rem 1rem; font-size: 0.88rem; vertical-align: top; }
    .specs-table td:first-child { font-weight: 700; font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--brand-accent); width: 240px; white-space: nowrap; }
    .specs-table td:last-child { color: var(--brand-primary); }
    .decoration-section { background: #111111; color: #fff; padding: 5rem 2rem; }
    .decoration-section__inner { max-width: 1200px; margin: 0 auto; }
    .decoration-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; margin-top: 2.5rem; }
    @media (max-width: 768px) { .decoration-grid { grid-template-columns: 1fr; } }
    .decoration-card { border-top: 2px solid var(--brand-accent); padding-top: 1.5rem; }
    .decoration-card--recommended { border-top-color: #fff; }
    .decoration-card__icon { width: 40px; height: 40px; background: rgba(31,97,77,0.25); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
    .decoration-card__icon svg { width: 20px; height: 20px; stroke: var(--brand-accent); fill: none; stroke-width: 1.75; }
    .decoration-card__title { font-size: 1rem; font-weight: 700; margin-bottom: 0.35rem; }
    .decoration-card__badge { display: inline-block; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.2rem 0.6rem; margin-bottom: 0.75rem; }
    .decoration-card__badge--recommended { background: var(--brand-accent); color: #fff; }
    .decoration-card__badge--good { background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.7); }
    .decoration-card__text { font-size: 0.88rem; line-height: 1.7; opacity: 0.75; }
    .family-section { padding: 5rem 2rem; background: #fff; }
    .family-section__inner { max-width: 1200px; margin: 0 auto; }
    .cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-top: 2rem; }
    @media (max-width: 900px) { .cards-grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 580px) { .cards-grid { grid-template-columns: 1fr; } }
    .card { display: block; text-decoration: none; color: var(--brand-primary); overflow: hidden; border: 1px solid #e4ddd6; transition: box-shadow 0.2s, transform 0.2s; }
    .card:hover { box-shadow: 0 8px 24px rgba(14,21,32,0.1); transform: translateY(-3px); }
    .card__image { aspect-ratio: 1/1; overflow: hidden; background: #f5f5f0; }
    .card__image img { width: 100%; height: 100%; object-fit: contain; }
    .card__body { padding: 1rem 1.1rem 1.2rem; }
    .card__sku { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.12em; color: #aaa; font-weight: 600; }
    .card__title { font-size: 0.88rem; font-weight: 700; margin: 0.3rem 0 0; line-height: 1.3; }
    .cross-brand { background: var(--brand-cream); padding: 4rem 2rem; }
    .cross-brand__inner { max-width: 1200px; margin: 0 auto; text-align: center; }
    .cross-brand__heading { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; }
    .cross-brand__text { font-size: 0.88rem; color: #666; margin-bottom: 1.5rem; }
    .cross-brand__link { display: inline-block; padding: 0.7rem 1.5rem; border: 2px solid var(--brand-primary); color: var(--brand-primary); font-size: 0.78rem; font-weight: 700; text-transform: uppercase; text-decoration: none; letter-spacing: 0.06em; }
    .cross-brand__link:hover { background: var(--brand-primary); color: #fff; }
    @media print { .top-bar,.site-header,.breadcrumb,.site-footer,.gallery__thumbs,.product-ctas,.deco-techniques,.colour-picker,.decoration-section,.family-section,.cross-brand { display: none !important; } }
`;

// --- Navigation HTML (from shared nav-fragments module) ---
// PDP pages are at /products/slug.html → prefix '../'
const NAV_HTML = getHeader('../', 'products');
const FOOTER_HTML = getFooter('../');

const PLACEHOLDER_IMG = '/sites/shared/images/placeholder-product.svg';

// --- Generate PDP HTML ---
function generatePDP(product) {
  const sku = product.sku.toUpperCase();
  const imgData = images[sku] || {};
  const heroImg = imgData.hero || PLACEHOLDER_IMG;
  const lifestyleImgs = imgData.lifestyle || [];
  const rearImgs = imgData.rear || [];
  const colours = getCleanColours(sku);
  const bc = getBreadcrumbType(product);
  const desc = generateDescription(product);
  const decoCards = getDecorationCards(product);
  const related = findRelated(product);
  const comparison = findComparison(product);

  // Build thumbnail gallery
  const thumbs = [heroImg, ...lifestyleImgs.slice(0, 2), ...rearImgs.slice(0, 1)].filter(Boolean);

  // Eco badge
  const hasEco = product.ecoCredentials && product.ecoCredentials.toLowerCase() !== 'n/a' && product.ecoCredentials.trim() !== '';

  // Specs rows
  const specRows = [
    ['Product Code', product.sku],
    ['Product Name', product.name],
    product.collection && product.collection !== 'Uncategorised' ? ['Collection', product.collection] : null,
    ['Category', `${bc.label} ${product.productType ? '&rsaquo; ' + product.productType : ''}`],
    product.fabric ? ['Material', product.fabric] : null,
    product.fabricWeight ? ['Weight', product.fabricWeight] : null,
    product.panelDesign ? ['Panel Design', product.panelDesign] : null,
    product.crownProfileDetail ? ['Crown Profile', product.crownProfileDetail] : null,
    product.structureDetail ? ['Structure', product.structureDetail] : null,
    product.peak ? ['Peak / Visor', product.peak] : null,
    product.closureDetail ? ['Closure', product.closureDetail] : null,
    product.eyelets ? ['Eyelets', product.eyelets] : null,
    product.interior ? ['Interior', product.interior] : null,
    product.sizing ? ['Sizing', product.sizing] : null,
    product.circumferenceRange ? ['Circumference', product.circumferenceRange] : null,
    product.label ? ['Label', product.label] : null,
    colours.length > 0 ? ['Colours', `${colours.length} colourways`] : null,
    product.ecoCredentials && product.ecoCredentials !== 'n/a' ? ['Sustainability', product.ecoCredentials] : ['Sustainability', '&mdash;'],
    product.decoration ? ['Decoration Area', product.decoration] : null,
  ].filter(Boolean);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(product.sku)} ${escHtml(product.name)} | Beechfield Original Headwear</title>
  <meta name="description" content="${escHtml(product.sku)} ${escHtml(product.name)} — ${escHtml(desc)}">
  <link rel="stylesheet" href="../../shared/css/variables.css">
  <link rel="stylesheet" href="../../shared/css/reset.css">
  <link rel="stylesheet" href="../../shared/css/base.css">
  <link rel="stylesheet" href="../../shared/css/layout.css">
  <link rel="stylesheet" href="../../shared/css/components.css">
  <link rel="stylesheet" href="../../shared/css/navigation.css">
  <link rel="stylesheet" href="../../shared/css/footer.css">
  <link rel="stylesheet" href="../css/brand.css">
  <link rel="stylesheet" href="https://use.typekit.net/sep5cxb.css">
  <style>${PDP_CSS}</style>
</head>
<body>
  ${NAV_HTML}
  <main>
    <div class="breadcrumb">
      <div class="breadcrumb__inner">
        <a href="../">Home</a><span class="breadcrumb__sep">/</span>
        <a href="../products/">Products</a><span class="breadcrumb__sep">/</span>
        <a href="../products/${bc.slug}/">${bc.label}</a><span class="breadcrumb__sep">/</span>
        <span class="breadcrumb__current">${escHtml(product.sku)} ${escHtml(product.name)}</span>
      </div>
    </div>

    <section class="product-header" aria-label="${escHtml(product.name)}">
      <div class="gallery">
        <div class="gallery__main" id="gallery-main">
          <img id="main-image" src="${heroImg}" alt="${escHtml(product.name)}" loading="lazy">
        </div>
        ${thumbs.length > 1 ? `<div class="gallery__thumbs" id="thumb-strip">
          ${thumbs.map((url, i) => `<button class="gallery__thumb${i === 0 ? ' gallery__thumb--active' : ''}" data-img="${url}" aria-label="View ${i + 1}"><img src="${url}" alt="View ${i + 1}" loading="lazy"></button>`).join('\n          ')}
        </div>` : ''}
      </div>
      <div class="product-info">
        ${product.collection && product.collection !== 'Uncategorised' ? `<span class="product-info__collection">${escHtml(product.collection)} Collection</span>` : ''}
        ${hasEco ? `<span class="product-info__collection" style="background:rgba(31,97,77,0.15);margin-left:0.5rem;">${escHtml(product.ecoCredentials)}</span>` : ''}
        <span class="product-info__sku">${escHtml(product.sku)}</span>
        <h1 class="product-info__name">${escHtml(product.name)}</h1>
        <p class="product-info__desc">${escHtml(desc)}</p>

        ${colours.length > 0 ? `<div class="colour-picker">
          <p class="colour-picker__label">Colours (${colours.length})</p>
          <div class="colour-picker__swatches">
            ${colours.map((c, i) => `<button class="colour-picker__swatch${i === 0 ? ' colour-picker__swatch--active' : ''}" style="background:${getColourHex(c.name)}${c.name.toLowerCase() === 'white' ? ';border-color:#ccc' : ''}" data-img="${c.url}" data-name="${escHtml(c.name)}" aria-label="${escHtml(c.name)}"></button>`).join('\n            ')}
          </div>
          <p class="colour-picker__name" id="colour-name">${colours.length > 0 ? escHtml(colours[0].name) : ''}</p>
        </div>` : ''}

        <div class="deco-techniques">
          <p class="deco-techniques__label">Recommended Decoration</p>
          <div class="deco-techniques__pills">
            <a href="#decoration" class="deco-pill"><svg viewBox="0 0 24 24"><path d="M7 19L17 6"/><path d="M15 7l2-1 1 2-2 1"/></svg> Embroidery</a>
            <a href="#decoration" class="deco-pill"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="14" rx="1"/><line x1="3" y1="9" x2="21" y2="9"/></svg> Transfer</a>
          </div>
        </div>

        <div class="product-ctas">
          <a href="/api/products/${sku}/assets" class="product-ctas__btn product-ctas__btn--primary" target="_blank">Get Marketing Assets</a>
          <a href="#stock" class="product-ctas__btn product-ctas__btn--outline">Check Stock</a>
        </div>

        <div class="quick-specs">
          <div class="quick-spec"><p class="quick-spec__label">Material</p><p class="quick-spec__value">${escHtml(product.fabric || 'See specs')}</p></div>
          <div class="quick-spec"><p class="quick-spec__label">Weight</p><p class="quick-spec__value">${escHtml(product.fabricWeight || '—')}</p></div>
          <div class="quick-spec"><p class="quick-spec__label">${product.type === 'cap' ? 'Closure' : 'Type'}</p><p class="quick-spec__value">${escHtml(product.type === 'cap' ? (product.closureSimplified || product.closure || '—') : (product.productType || '—'))}</p></div>
        </div>
      </div>
    </section>

    <section class="specs-section" aria-label="Specifications">
      <div class="specs-section__inner">
        <p class="section-label">Specifications</p>
        <h2 class="section-heading" style="color:var(--brand-primary);">Full product details.</h2>
        <table class="specs-table">
          ${specRows.map(([label, value]) => `<tr><td>${label}</td><td>${value}</td></tr>`).join('\n          ')}
        </table>
      </div>
    </section>

    <section class="decoration-section" id="decoration" aria-label="Decoration suitability">
      <div class="decoration-section__inner">
        <p class="section-label" style="color:rgba(255,255,255,0.5);">Decoration Suitability</p>
        <h2 class="section-heading">Built for branding.</h2>
        <div class="decoration-grid">
          ${decoCards.map(card => `
          <div class="decoration-card${card.rating === 'Recommended' ? ' decoration-card--recommended' : ''}">
            <div class="decoration-card__icon"><svg viewBox="0 0 24 24">${card.icon}</svg></div>
            <h3 class="decoration-card__title">${card.title}</h3>
            <span class="decoration-card__badge decoration-card__badge--${card.rating === 'Recommended' ? 'recommended' : 'good'}">${card.rating}</span>
            <p class="decoration-card__text">${card.text}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>

    <section class="specs-section" id="stock" aria-label="Stock availability">
      <div class="specs-section__inner">
        <p class="section-label">Stock &amp; Availability</p>
        <h2 class="section-heading" style="color:var(--brand-primary);">Check availability.</h2>
        <div id="stock-checker" style="min-height:100px;">
          <p style="color:#888;font-size:0.88rem;">Loading stock data...</p>
        </div>
      </div>
    </section>

    ${related.length > 0 ? `
    <section class="family-section" aria-label="Related products">
      <div class="family-section__inner">
        <p class="section-label">Related Products</p>
        <h2 class="section-heading" style="color:var(--brand-primary);">You might also like.</h2>
        <div class="cards-grid">
          ${related.map(r => {
            const rImg = images[r.sku.toUpperCase()]?.hero || PLACEHOLDER_IMG;
            return `<a href="${r.slug}.html" class="card">
            <div class="card__image"><img src="${rImg}" alt="${escHtml(r.name)}" loading="lazy"></div>
            <div class="card__body"><span class="card__sku">${escHtml(r.sku)}</span><h3 class="card__title">${escHtml(r.name)}</h3></div>
          </a>`;
          }).join('\n          ')}
        </div>
      </div>
    </section>` : ''}

    <section class="cross-brand">
      <div class="cross-brand__inner">
        <p class="section-label">Complete the Look</p>
        <h2 class="cross-brand__heading">Pairs well with bags.</h2>
        <p class="cross-brand__text">Headwear and bags — the natural pairing. Browse matching accessories from BagBase and Quadra.</p>
        <a href="#" class="cross-brand__link">Browse BagBase</a>
      </div>
    </section>
  </main>

  ${FOOTER_HTML}

  <script src="../../shared/js/navigation.js"></script>
  <script src="../../shared/js/auth.js"></script>
  <script>
    // Gallery thumbnail switching
    document.querySelectorAll('.gallery__thumb').forEach(function(thumb) {
      thumb.addEventListener('click', function() {
        document.querySelectorAll('.gallery__thumb').forEach(function(t) { t.classList.remove('gallery__thumb--active'); });
        thumb.classList.add('gallery__thumb--active');
        var img = thumb.dataset.img;
        if (img) document.getElementById('main-image').src = img;
      });
    });
    // Colour swatch switching
    document.querySelectorAll('.colour-picker__swatch').forEach(function(swatch) {
      swatch.addEventListener('click', function() {
        document.querySelectorAll('.colour-picker__swatch').forEach(function(s) { s.classList.remove('colour-picker__swatch--active'); });
        swatch.classList.add('colour-picker__swatch--active');
        var name = swatch.dataset.name;
        var img = swatch.dataset.img;
        if (name) document.getElementById('colour-name').textContent = name;
        if (img) document.getElementById('main-image').src = img;
      });
    });
    // Stock checker
    fetch('/api/stock/${sku}').then(function(r){return r.json()}).then(function(data) {
      var el = document.getElementById('stock-checker');
      var colours = Object.entries(data.colours || {}).slice(0, 20);
      if (colours.length === 0) { el.innerHTML = '<p style="color:#888;">Stock data not available.</p>'; return; }
      var html = '<table class="specs-table"><tr><td style="font-weight:700;">Colour</td><td style="font-weight:700;">Central Stock</td><td style="font-weight:700;">Total Available</td></tr>';
      colours.forEach(function(entry) {
        var colour = entry[0], stock = entry[1];
        html += '<tr><td>' + colour + '</td><td>' + (stock.central || 0).toLocaleString() + '</td><td style="font-weight:700;">' + (stock.total || 0).toLocaleString() + '</td></tr>';
      });
      html += '</table>';
      el.innerHTML = html;
    }).catch(function() {
      document.getElementById('stock-checker').innerHTML = '<p style="color:#888;">Could not load stock data. Please try again.</p>';
    });
  </script>
</body>
</html>`;
}

// --- Generate Category PLP HTML ---
function generatePLP(category, title, introText, filterFn) {
  const filteredProducts = products.filter(filterFn);

  // Collect unique sub-types and collections for filter tabs
  const subTypes = [...new Set(filteredProducts.map(p => p.productType || '').filter(Boolean))].sort();
  const collections = [...new Set(filteredProducts.map(p => p.collection || '').filter(c => c && c !== 'Uncategorised'))].sort();

  const productCards = filteredProducts.map(p => {
    const sku = p.sku.toUpperCase();
    const img = images[sku]?.hero || PLACEHOLDER_IMG;
    const hasEco = p.ecoCredentials && p.ecoCredentials.toLowerCase() !== 'n/a' && p.ecoCredentials.trim();
    const colours = getCleanColours(sku);
    const colourDots = colours.slice(0, 8).map(c =>
      `<li class="pc__dot" style="background:${getColourHex(c.name)}${c.name.toLowerCase() === 'white' ? ';border:1px solid #ddd' : ''}" title="${escHtml(c.name)}"></li>`
    ).join('');
    return `
        <a href="../${p.slug}.html" class="pc" role="listitem"
           data-type="${escHtml(p.productType || '')}" data-collection="${escHtml(p.collection || '')}"
           data-purpose="${escHtml(getPurposes(p))}" data-deco="${escHtml(getDecoMethods(p))}"
           data-feature="${escHtml(getFeatures(p))}" data-colour="${escHtml(getColourNames(sku))}"
           data-sku="${escHtml(p.sku)}" data-name="${escHtml(p.name)}" data-date="${escHtml(p.dateAdded || '2020-01-01')}"
           data-eco="${hasEco ? '1' : '0'}">
          <div class="pc__img"><img src="${img}" alt="${escHtml(p.name)}" loading="lazy"></div>
          <div class="pc__body">
            <span class="pc__sku">${escHtml(p.sku)}</span>
            <h3 class="pc__name">${escHtml(p.name)}</h3>
            ${p.collection && p.collection !== 'Uncategorised' ? `<span class="pc__collection">${escHtml(p.collection)}</span>` : ''}
            ${hasEco ? `<span class="pc__eco">${escHtml(p.ecoCredentials)}</span>` : ''}
            ${colours.length > 0 ? `<ul class="pc__dots">${colourDots}${colours.length > 8 ? `<li class="pc__dot-more">+${colours.length - 8}</li>` : ''}</ul>` : ''}
          </div>
        </a>`;
  }).join('');

  // PLP nav: category PLPs are at /products/{category}/index.html → prefix '../../'
  const plpNav = getHeader('../../', 'products');
  const plpFooter = getFooter('../../');

  // Filter tabs HTML
  const typeTabsHtml = subTypes.length > 1 ? subTypes.map(t =>
    `<button class="plp-filter__tab" data-filter-group="type" data-filter-value="${escHtml(t)}">${escHtml(t)}</button>`
  ).join('\n              ') : '';

  const collectionTabsHtml = collections.length > 1 ? collections.map(c =>
    `<button class="plp-filter__tab" data-filter-group="collection" data-filter-value="${escHtml(c)}">${escHtml(c)}</button>`
  ).join('\n              ') : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(title)} | Beechfield Original Headwear</title>
  <meta name="description" content="Browse Beechfield ${escHtml(title).toLowerCase()} — ${filteredProducts.length} products designed for decoration.">
  <link rel="stylesheet" href="../../../shared/css/variables.css">
  <link rel="stylesheet" href="../../../shared/css/reset.css">
  <link rel="stylesheet" href="../../../shared/css/base.css">
  <link rel="stylesheet" href="../../../shared/css/layout.css">
  <link rel="stylesheet" href="../../../shared/css/components.css">
  <link rel="stylesheet" href="../../../shared/css/navigation.css">
  <link rel="stylesheet" href="../../../shared/css/footer.css">
  <link rel="stylesheet" href="../../css/brand.css">
  <link rel="stylesheet" href="https://use.typekit.net/sep5cxb.css">
  <style>
    .plp-hero { background: var(--bfb-cool-black, #0e1520); color: #fff; padding: 4rem 2rem; }
    .plp-hero__inner { max-width: 1200px; margin: 0 auto; }
    .plp-hero__label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-bottom: 0.5rem; }
    .plp-hero__title { font-family: var(--font-heading); font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; margin-bottom: 1rem; }
    .plp-hero__text { font-size: 0.95rem; line-height: 1.7; max-width: 600px; opacity: 0.8; }
    .plp-toolbar { max-width: 1200px; margin: 0 auto; padding: 1.5rem 2rem 0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
    .plp-toolbar__count { font-size: 0.82rem; color: #888; }
    .plp-toolbar__sort select { font-size: 0.82rem; padding: 0.4rem 0.8rem; border: 1px solid #ddd; border-radius: 4px; background: #fff; }
    .plp-filters { max-width: 1200px; margin: 0 auto; padding: 1rem 2rem 0; display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .plp-filters__group-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #888; width: 100%; margin-bottom: -0.25rem; }
    .plp-filter__tab { background: none; border: 1px solid #ddd; padding: 0.4rem 1rem; font-size: 0.78rem; font-weight: 600; cursor: pointer; border-radius: 4px; transition: all 0.15s; }
    .plp-filter__tab:hover { border-color: #111; }
    .plp-filter__tab--active { background: #111; color: #fff; border-color: #111; }
    .plp-active-filters { max-width: 1200px; margin: 0 auto; padding: 0.75rem 2rem 0; display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .plp-active-pill { display: inline-flex; align-items: center; gap: 0.3rem; background: #f0f0f0; font-size: 0.72rem; font-weight: 600; padding: 0.3rem 0.7rem; border-radius: 3px; cursor: pointer; border: none; }
    .plp-active-pill:hover { background: #e0e0e0; }
    .plp-grid { max-width: 1200px; margin: 0 auto; padding: 1.5rem 2rem 4rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem; }
    .pc { display: block; text-decoration: none; color: var(--bfb-cool-black, #0e1520); border: 1px solid #e7e5e4; transition: box-shadow 0.2s, transform 0.2s; }
    .pc:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
    .pc__img { aspect-ratio: 1/1; background: #f5f5f0; overflow: hidden; }
    .pc__img img { width: 100%; height: 100%; object-fit: contain; }
    .pc__body { padding: 0.9rem 1rem 1.1rem; }
    .pc__sku { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #aaa; }
    .pc__name { font-size: 0.88rem; font-weight: 700; margin: 0.25rem 0 0.4rem; line-height: 1.3; }
    .pc__collection { display: inline-block; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; background: #f5f5f0; padding: 2px 6px; color: #666; margin-right: 0.25rem; }
    .pc__eco { display: inline-block; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; background: rgba(31,97,77,0.1); color: #1f614d; padding: 2px 6px; }
    .pc__dots { display: flex; gap: 4px; flex-wrap: wrap; list-style: none; padding: 0; margin: 0.35rem 0 0; }
    .pc__dot { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; }
    .pc__dot-more { font-size: 0.6rem; color: #888; line-height: 14px; }
  </style>
</head>
<body>
  ${plpNav}
  ${getSearchOverlay()}

  <main>
    <section class="plp-hero">
      <div class="plp-hero__inner">
        <p class="plp-hero__label">Product Range</p>
        <h1 class="plp-hero__title">${escHtml(title)}.</h1>
        <p class="plp-hero__text">${escHtml(introText)}</p>
      </div>
    </section>

    <div class="plp-toolbar">
      <span class="plp-toolbar__count"><span id="plp-visible-count">${filteredProducts.length}</span> products</span>
      <div class="plp-toolbar__sort">
        <label for="plp-sort" style="font-size:0.78rem;color:#888;margin-right:0.5rem;">Sort by</label>
        <select id="plp-sort">
          <option value="name-az">A – Z</option>
          <option value="name-za">Z – A</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>

    ${typeTabsHtml ? `<div class="plp-filters">
      <span class="plp-filters__group-label">Type</span>
      <button class="plp-filter__tab plp-filter__tab--active" data-filter-group="type" data-filter-value="">All</button>
      ${typeTabsHtml}
    </div>` : ''}

    ${collectionTabsHtml ? `<div class="plp-filters" style="margin-top:0.5rem;">
      <span class="plp-filters__group-label">Collection</span>
      <button class="plp-filter__tab plp-filter__tab--active" data-filter-group="collection" data-filter-value="">All</button>
      ${collectionTabsHtml}
    </div>` : ''}

    <div class="plp-active-filters" id="plp-active-filters"></div>

    <div class="plp-grid" id="plp-grid">${productCards}
    </div>
  </main>

  ${plpFooter}
  <script src="../../../shared/js/navigation.js"></script>
  <script src="../../../shared/js/auth.js"></script>
  <script src="../../../shared/js/filters.js"></script>
</body>
</html>`;
}

// === MAIN ===
console.log(`Generating PDPs for ${products.length} products...`);

let generated = 0;
let missing = 0;

for (const product of products) {
  const filename = `${product.slug}.html`;
  const filepath = path.join(OUTPUT_DIR, filename);

  // Skip existing hand-built PDPs
  if (fs.existsSync(filepath)) {
    const stat = fs.statSync(filepath);
    // Only skip if the file was modified before today (hand-built)
    // Actually, regenerate all to keep consistent
  }

  const html = generatePDP(product);
  fs.writeFileSync(filepath, html);
  generated++;

  if (!images[product.sku.toUpperCase()]?.hero) {
    missing++;
  }
}

console.log(`Generated ${generated} PDP files`);
console.log(`Products missing hero images: ${missing}`);

// --- Generate Category PLPs ---
const categories = [
  {
    dir: 'caps',
    title: 'Caps',
    intro: 'The broadest range of rebrandable caps in the industry. Baseball, trucker, snapback, dad hat, 5-panel, 6-panel — structured and unstructured, in every colour and fabric a decorator needs.',
    filter: p => p.type === 'cap' && !((p.productType || '').toLowerCase().includes('bucket')) && !((p.productType || '').toLowerCase().includes('visor')),
  },
  {
    dir: 'beanies',
    title: 'Beanies & Knits',
    intro: 'Cuffed, slouch, oversized, pom-pom — double-knit construction built for embroidery and transfer. Seasonal essentials for every brief, from corporate giveaways to premium retail.',
    filter: p => p.type === 'knit' || (p.productType || '').toLowerCase().includes('beanie'),
  },
  {
    dir: 'bucket-hats',
    title: 'Bucket Hats',
    intro: 'Festival-ready, streetwear-approved, corporate-friendly. Bucket hats have become the go-to silhouette for events and outdoor campaigns. Decoration-ready with flat panels for clean branding.',
    filter: p => (p.productType || '').toLowerCase().includes('bucket'),
  },
  {
    dir: 'visors',
    title: 'Visors',
    intro: 'Sun protection meets branding opportunity. Lightweight, breathable, and designed for outdoor events, sports days, and activewear lines. Clean front panel for embroidery or transfer.',
    filter: p => (p.productType || '').toLowerCase().includes('visor'),
  },
  {
    dir: 'performance',
    title: 'Performance Headwear',
    intro: 'Technical fabrics, moisture-wicking construction, and athletic silhouettes. Built for sports teams, outdoor brands, and activewear decorators who need headwear that performs.',
    filter: p => (p.collection || '').toLowerCase() === 'performance' || (p.silo || '').toLowerCase() === 'performance' || (p.typePurpose || '').toLowerCase().includes('sport'),
  },
  {
    dir: 'accessories',
    title: 'Accessories & Neckwear',
    intro: 'Morfs, snoods, scarves, headbands, and more. Multifunctional accessories that complement the headwear range. Transfer and DTG decoration-ready.',
    filter: p => {
      const pt = (p.productType || '').toLowerCase();
      return pt.includes('snood') || pt.includes('morf') || pt.includes('scarf') || pt.includes('band') || pt.includes('neck') || (p.silo || '').toLowerCase() === 'accessories';
    },
  },
];

for (const cat of categories) {
  const catDir = path.join(OUTPUT_DIR, cat.dir);
  if (!fs.existsSync(catDir)) fs.mkdirSync(catDir, { recursive: true });
  const html = generatePLP(cat.dir, cat.title, cat.intro, cat.filter);
  fs.writeFileSync(path.join(catDir, 'index.html'), html);
  const count = products.filter(cat.filter).length;
  console.log(`  ${cat.dir}/index.html — ${count} products`);
}

// --- Inject all 248 products into main PLP ---
console.log('\nUpdating main PLP (products/index.html)...');
const mainPlpPath = path.join(OUTPUT_DIR, 'index.html');
let mainPlp = fs.readFileSync(mainPlpPath, 'utf8');

// 1. Replace nav: from <div class="top-bar"> to </header>
const mainPlpNav = getHeader('../', 'products');
mainPlp = mainPlp.replace(
  /[ \t]*<div class="top-bar">[\s\S]*?<\/header>/,
  mainPlpNav
);

// 2. Replace footer: from <footer class="site-footer"> to </footer>
const mainPlpFooter = getFooter('../');
mainPlp = mainPlp.replace(
  /[ \t]*(?:<!-- Footer -->\s*)?<footer class="site-footer">[\s\S]*?<\/footer>/,
  mainPlpFooter
);

// 3. Generate all 248 product cards in main PLP format
const allProductCards = products.map(p => {
  const sku = p.sku.toUpperCase();
  const imgData = images[sku] || {};
  const heroImg = imgData.hero || PLACEHOLDER_IMG;
  const colours = getCleanColours(sku);
  const hasEco = p.ecoCredentials && p.ecoCredentials.toLowerCase() !== 'n/a' && p.ecoCredentials.trim();
  const bc = getBreadcrumbType(p);
  const colourDots = colours.slice(0, 5).map(c =>
    `<span class="pc__colour-dot" style="background:${getColourHex(c.name)}${c.name.toLowerCase() === 'white' ? ';border-color:#ddd' : ''}"></span>`
  ).join('');
  const colourMore = colours.length > 5 ? `<span class="pc__colour-more">+${colours.length - 5}</span>` : '';

  return `
            <a href="${p.slug}.html" class="pc" role="listitem"
               data-type="${escHtml(bc.slug)}" data-collection="${escHtml((p.collection || '').toLowerCase())}"
               data-purpose="${escHtml(getPurposes(p))}" data-deco="${escHtml(getDecoMethods(p))}"
               data-feature="${escHtml(getFeatures(p))}" data-colour="${escHtml(getColourNames(sku))}"
               data-sku="${escHtml(p.sku)}" data-name="${escHtml(p.name)}" data-date="${escHtml(p.dateAdded || '2020-01-01')}">
              <div class="pc__img">
                <img src="${heroImg}" alt="${escHtml(p.sku)} ${escHtml(p.name)}" loading="lazy">
                ${hasEco ? '<span class="pc__badge pc__badge--eco">EarthAware</span>' : ''}
              </div>
              <div class="pc__body">
                <p class="pc__sku">${escHtml(p.sku)}</p>
                <p class="pc__name">${escHtml(p.name)}</p>
                ${colours.length > 0 ? `<div class="pc__colours">${colourDots}${colourMore}</div>` : ''}
              </div>
            </a>`;
}).join('');

// 4. Replace grid content between <div class="plp-grid" role="list"> and </div><!-- /plp-grid -->
mainPlp = mainPlp.replace(
  /(<div class="plp-grid" role="list">)[\s\S]*?(<\/div><!-- \/plp-grid -->)/,
  `$1${allProductCards}\n          $2`
);

// 5. Update product count display
mainPlp = mainPlp.replace(
  /(<span[^>]*id="plp-count"[^>]*>)\d+/,
  `$1${products.length}`
);
// Also try class-based count
mainPlp = mainPlp.replace(
  /(<span class="plp-header__count">)[\s\S]*?(<\/span>)/,
  `$1${products.length} products$2`
);

fs.writeFileSync(mainPlpPath, mainPlp);
console.log(`  products/index.html — injected ${products.length} product cards`);

console.log('\nDone.');

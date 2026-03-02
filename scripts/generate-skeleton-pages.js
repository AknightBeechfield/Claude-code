#!/usr/bin/env node
/**
 * generate-skeleton-pages.js
 * Creates 21+ missing pages: Decorator Academy, Cap Studio guides,
 * Marketing Centre, and technique redirects.
 */
const fs = require('fs');
const path = require('path');
const { getHeader, getFooter, getSearchOverlay } = require('./nav-fragments');

const BASE = path.join(__dirname, '..', 'sites', 'beechfield');

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }

function pageShell({ title, description, heroColor, heroH1, heroSubtitle, breadcrumbHtml, bodyHtml, activeNav, depth }) {
  const p = depth === 2 ? '../../' : '../../../';
  const css = depth === 2 ? '../../shared/css' : '../../../shared/css';
  const js  = depth === 2 ? '../../shared/js'  : '../../../shared/js';
  const brand = depth === 2 ? '../css/brand.css' : '../../css/brand.css';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Beechfield Original Headwear</title>
  <meta name="description" content="${description}">
  <link rel="stylesheet" href="${css}/variables.css">
  <link rel="stylesheet" href="${css}/reset.css">
  <link rel="stylesheet" href="${css}/base.css">
  <link rel="stylesheet" href="${css}/layout.css">
  <link rel="stylesheet" href="${css}/components.css">
  <link rel="stylesheet" href="${css}/navigation.css">
  <link rel="stylesheet" href="${css}/footer.css">
  <link rel="stylesheet" href="${brand}">
  <link rel="stylesheet" href="https://use.typekit.net/sep5cxb.css">
  <style>
    .ed-hero { background: ${heroColor}; color: #fff; padding: clamp(60px, 8vw, 120px) 0; }
    .ed-hero .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
    .ed-hero__breadcrumb { font-size: 0.8rem; opacity: 0.5; margin-bottom: 1.5rem; }
    .ed-hero__breadcrumb a { color: inherit; text-decoration: none; }
    .ed-hero h1 { font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 800; letter-spacing: -0.03em; margin-bottom: 1rem; max-width: 700px; line-height: 1.1; }
    .ed-hero__sub { font-size: 1.1rem; opacity: 0.7; max-width: 540px; line-height: 1.6; }
    .ed-section { padding: clamp(48px, 6vw, 80px) 0; }
    .ed-section .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
    .ed-section--alt { background: #f5f0e8; }
    .ed-section--dark { background: #0e1520; color: #fff; }
    .ed-section--green { background: #1f614d; color: #fff; }
    .ed-split { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
    .ed-split--reverse { direction: rtl; }
    .ed-split--reverse > * { direction: ltr; }
    .ed-split__img { border-radius: 8px; overflow: hidden; background: #eee; aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center; color: #999; font-size: 0.9rem; }
    .ed-split__img img { width: 100%; height: 100%; object-fit: cover; }
    .ed-split__text h2 { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em; }
    .ed-split__text p { font-size: 1rem; line-height: 1.8; color: #444; margin-bottom: 1rem; }
    .ed-section--dark .ed-split__text p, .ed-section--green .ed-split__text p { color: rgba(255,255,255,0.75); }
    .ed-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; }
    .ed-card { background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid #e8e4dc; transition: box-shadow 0.2s; }
    .ed-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .ed-card__img { aspect-ratio: 16/9; background: #eee; display: flex; align-items: center; justify-content: center; color: #999; font-size: 0.85rem; }
    .ed-card__body { padding: 1.25rem; }
    .ed-card__body h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; }
    .ed-card__body p { font-size: 0.9rem; color: #555; line-height: 1.6; }
    .ed-cta { text-align: center; padding: clamp(48px, 6vw, 80px) 0; background: #f5f0e8; }
    .ed-cta h2 { font-size: 1.6rem; font-weight: 700; margin-bottom: 0.75rem; }
    .ed-cta p { color: #555; margin-bottom: 2rem; }
    .btn { display: inline-block; padding: 0.85rem 2rem; border-radius: 6px; font-weight: 600; font-size: 0.95rem; text-decoration: none; transition: background 0.2s; }
    .btn--primary { background: #0e1520; color: #fff; }
    .btn--primary:hover { background: #1c2940; }
    .btn--accent { background: #1f614d; color: #fff; }
    .btn--accent:hover { background: #174e3e; }
    .ed-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 2rem; text-align: center; margin-top: 2rem; }
    .ed-stat__num { font-size: 2rem; font-weight: 800; color: #1f614d; }
    .ed-stat__label { font-size: 0.85rem; color: #555; margin-top: 0.25rem; }
    .ed-technique { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }
    .ed-technique-card { background: #fff; border-radius: 8px; padding: 2rem; border: 1px solid #e8e4dc; }
    .ed-technique-card h3 { font-size: 1.15rem; font-weight: 700; margin-bottom: 0.75rem; }
    .ed-technique-card p { font-size: 0.92rem; color: #555; line-height: 1.7; }
    .ed-technique-card .tag { display: inline-block; background: #f0f0f0; color: #333; font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.6rem; border-radius: 3px; margin-right: 0.5rem; margin-top: 0.75rem; }
    .ed-faq { max-width: 760px; margin: 0 auto; }
    .ed-faq details { border-bottom: 1px solid #e8e4dc; padding: 1.25rem 0; }
    .ed-faq summary { font-weight: 600; cursor: pointer; font-size: 1rem; list-style: none; display: flex; justify-content: space-between; align-items: center; }
    .ed-faq summary::after { content: '+'; font-size: 1.4rem; font-weight: 300; }
    .ed-faq details[open] summary::after { content: '\\2212'; }
    .ed-faq .answer { padding-top: 0.75rem; color: #555; line-height: 1.7; font-size: 0.95rem; }
    .colour-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem; }
    .colour-swatch { text-align: center; }
    .colour-swatch__box { width: 100%; aspect-ratio: 1; border-radius: 8px; border: 1px solid #e8e4dc; margin-bottom: 0.5rem; }
    .colour-swatch__name { font-size: 0.75rem; font-weight: 600; color: #333; }
    .colour-swatch__hex { font-size: 0.65rem; color: #999; }
    .glossary-nav { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; }
    .glossary-nav a { display: inline-flex; width: 2rem; height: 2rem; align-items: center; justify-content: center; border-radius: 4px; background: #f5f0e8; font-weight: 700; font-size: 0.85rem; text-decoration: none; color: #333; }
    .glossary-nav a:hover { background: #0e1520; color: #fff; }
    .glossary-term { border-bottom: 1px solid #e8e4dc; padding: 1rem 0; }
    .glossary-term dt { font-weight: 700; font-size: 1rem; margin-bottom: 0.25rem; }
    .glossary-term dd { font-size: 0.92rem; color: #555; line-height: 1.7; margin: 0; }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.4rem; color: #333; }
    .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.7rem 1rem; border: 1px solid #ddd; border-radius: 6px; font-size: 0.95rem; font-family: inherit; }
    .form-group input:focus, .form-group select:focus { outline: none; border-color: #1f614d; box-shadow: 0 0 0 3px rgba(31,97,77,0.1); }
    .checkbox-group { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .checkbox-group label { display: flex; align-items: center; gap: 0.4rem; font-weight: 400; cursor: pointer; }
    .video-card { position: relative; }
    .video-card__duration { position: absolute; bottom: 0.5rem; right: 0.5rem; background: rgba(0,0,0,0.75); color: #fff; font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 3px; }
    .case-study { background: #fff; border-radius: 8px; padding: 2rem; border: 1px solid #e8e4dc; }
    .case-study h3 { font-size: 1.15rem; font-weight: 700; margin-bottom: 0.75rem; }
    .case-study__label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #1f614d; margin-bottom: 0.25rem; }
    .case-study p { font-size: 0.92rem; color: #555; line-height: 1.7; margin-bottom: 0.75rem; }
    .anatomy-part { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center; padding: 2rem 0; border-bottom: 1px solid #e8e4dc; }
    .anatomy-part:last-child { border-bottom: none; }
    .anatomy-part h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem; }
    .anatomy-part p { font-size: 0.92rem; color: #555; line-height: 1.7; }
    .anatomy-part__visual { background: #f5f0e8; border-radius: 8px; aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center; color: #888; font-size: 0.85rem; }
    .shape-section { padding: 3rem 0; border-bottom: 1px solid #e8e4dc; }
    .shape-section:last-child { border-bottom: none; }
    .shape-section h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; }
    .shape-section__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .shape-section__visual { background: #f5f0e8; border-radius: 8px; aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center; color: #888; }
    .shape-features { list-style: none; padding: 0; margin: 1rem 0; }
    .shape-features li { padding: 0.4rem 0; font-size: 0.92rem; color: #555; border-bottom: 1px solid #f0ece4; }
    .shape-features li::before { content: '\\2713'; color: #1f614d; font-weight: 700; margin-right: 0.5rem; }
    .zone-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem; }
    .zone-card { background: #fff; border-radius: 8px; padding: 1.5rem; border: 1px solid #e8e4dc; text-align: center; }
    .zone-card__visual { width: 80px; height: 80px; border-radius: 50%; background: #f5f0e8; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
    .zone-card h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
    .zone-card p { font-size: 0.85rem; color: #555; line-height: 1.6; }
    .material-card { background: #fff; border-radius: 8px; padding: 2rem; border: 1px solid #e8e4dc; margin-bottom: 1.5rem; }
    .material-card h3 { font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem; }
    .material-card__props { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0.75rem 0; }
    .material-card__prop { background: #f5f0e8; font-size: 0.75rem; font-weight: 600; padding: 0.3rem 0.7rem; border-radius: 3px; }
    .material-card p { font-size: 0.92rem; color: #555; line-height: 1.7; }
    .method-matrix { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.85rem; }
    .method-matrix th, .method-matrix td { padding: 0.6rem 0.8rem; border: 1px solid #e8e4dc; text-align: center; }
    .method-matrix th { background: #f5f0e8; font-weight: 700; }
    .method-matrix .yes { color: #1f614d; font-weight: 700; }
    .method-matrix .no { color: #ccc; }
    @media (max-width: 768px) {
      .ed-split, .anatomy-part, .shape-section__grid { grid-template-columns: 1fr; }
      .ed-split--reverse { direction: ltr; }
    }
  </style>
</head>
<body>
  ${getHeader(p, activeNav)}
  ${getSearchOverlay()}

  <main>
    <section class="ed-hero">
      <div class="container">
        <p class="ed-hero__breadcrumb">${breadcrumbHtml}</p>
        <h1>${heroH1}</h1>
        <p class="ed-hero__sub">${heroSubtitle}</p>
      </div>
    </section>

    ${bodyHtml}
  </main>

  ${getFooter(p)}

  <script src="${js}/navigation.js" defer></script>
  <script src="${js}/auth.js"></script>
</body>
</html>`;
}

function redirectPage(targetUrl, label) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=${targetUrl}">
  <title>Redirecting to ${label}...</title>
</head>
<body>
  <p>Redirecting to <a href="${targetUrl}">${label}</a>...</p>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════════════
// DECORATOR ACADEMY PAGES (depth=2)
// ═══════════════════════════════════════════════════════════════

const DECORATOR_PAGES = [];


// --- Designed for Decoration ---
DECORATOR_PAGES.push({
  file: 'decorator-academy/designed-for-decoration.html',
  title: 'Designed for Decoration',
  description: 'Discover why Beechfield headwear is purpose-built for professional decoration — embroidery, print, transfer, patches, and more.',
  heroColor: '#0e1520',
  heroH1: 'Designed for Decoration.',
  heroSubtitle: 'Every Beechfield product is engineered from the ground up to deliver exceptional decoration results. From tear-away labels to flat embroidery areas, decoration is in our DNA.',
  breadcrumbHtml: '<a href="../../">Home</a> / <a href="../">Decorator Academy</a> / Designed for Decoration',
  activeNav: 'decorator', depth: 2,
  bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>Decoration Is Our Foundation</h2>
            <p>Since 1994, Beechfield has been the headwear brand of choice for professional decorators across Europe. Every product in our range has been designed with one question in mind: <strong>how will this be decorated?</strong></p>
            <p>We work closely with embroiderers, printers, and decoration specialists to ensure our headwear delivers outstanding results every time — whether you're running a single sample or a bulk order of thousands.</p>
          </div>
          <div class="ed-split__img">Decoration lifestyle</div>
        </div>
      </div>
    </section>

    <section class="ed-section ed-section--alt">
      <div class="container">
        <h2 style="text-align:center; margin-bottom:2rem;">Decoration Techniques</h2>
        <p style="text-align:center; max-width:600px; margin:0 auto 2.5rem; color:#555;">Beechfield headwear is compatible with all major decoration methods. Choose the technique that suits your project.</p>
        <div class="ed-grid">
          <a href="../../decoration/embroidery.html" class="ed-card" style="text-decoration:none; color:inherit;">
            <div class="ed-card__img">Embroidery</div>
            <div class="ed-card__body">
              <h3>Embroidery</h3>
              <p>The gold standard for headwear branding. Our structured panels and flat embroidery areas ensure clean, precise stitch quality with up to 15,000 stitches.</p>
            </div>
          </a>
          <a href="../../decoration/transfer.html" class="ed-card" style="text-decoration:none; color:inherit;">
            <div class="ed-card__img">Transfer &amp; DTG</div>
            <div class="ed-card__body">
              <h3>Transfer &amp; DTG</h3>
              <p>Full-colour, photographic-quality prints with no colour limitations. Ideal for complex logos, gradients, and detailed artwork on cotton and poly blends.</p>
            </div>
          </a>
          <a href="../../decoration/patches.html" class="ed-card" style="text-decoration:none; color:inherit;">
            <div class="ed-card__img">Patches</div>
            <div class="ed-card__body">
              <h3>Patches</h3>
              <p>Woven, embroidered, PVC, and leather patches add tactile dimension. Our structured panels provide the ideal surface for sew-on and iron-on applications.</p>
            </div>
          </a>
          <a href="../../decoration/screen-print.html" class="ed-card" style="text-decoration:none; color:inherit;">
            <div class="ed-card__img">Screen Print</div>
            <div class="ed-card__body">
              <h3>Screen Print</h3>
              <p>Cost-effective for high-volume runs with bold, vibrant colours. Works brilliantly on our flat-front structured caps and beanies.</p>
            </div>
          </a>
          <a href="../../decoration/laser.html" class="ed-card" style="text-decoration:none; color:inherit;">
            <div class="ed-card__img">Laser Engraving</div>
            <div class="ed-card__body">
              <h3>Laser Engraving</h3>
              <p>Premium, subtle branding through precision laser etching. Creates a tone-on-tone effect perfect for leather patches, suede peaks, and fabric panels.</p>
            </div>
          </a>
          <a href="../../decoration/deboss-foil.html" class="ed-card" style="text-decoration:none; color:inherit;">
            <div class="ed-card__img">Deboss &amp; Foil</div>
            <div class="ed-card__body">
              <h3>Deboss &amp; Foil</h3>
              <p>Luxury finishing through heat-stamped debossing and metallic foil transfer. Adds a tactile, high-end dimension to leather straps, suede panels, and patches.</p>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="ed-section">
      <div class="container">
        <h2 style="text-align:center; margin-bottom:2rem;">Decoration-Friendly Features</h2>
        <div class="ed-technique">
          <div class="ed-technique-card">
            <h3>Tear-Away Labels</h3>
            <p>Our tear-away neck labels can be cleanly removed without residue, leaving a blank canvas for your own branding. No cutting, no fraying — just tear and it's gone.</p>
            <span class="tag">All Products</span>
          </div>
          <div class="ed-technique-card">
            <h3>Flat Embroidery Areas</h3>
            <p>Carefully engineered flat panels with consistent tension provide the ideal surface for machine embroidery. No puckering, no distortion — just crisp, clean results.</p>
            <span class="tag">Caps</span><span class="tag">Bucket Hats</span>
          </div>
          <div class="ed-technique-card">
            <h3>Fold-Down Buckram</h3>
            <p>Our proprietary fold-down buckram system on structured caps allows the front panels to be hooped flat for embroidery, dramatically reducing setup time and improving stitch quality.</p>
            <span class="tag">Structured Caps</span>
          </div>
          <div class="ed-technique-card">
            <h3>Reinforced Panels</h3>
            <p>Double-layer panel construction on key styles provides extra stability during decoration, preventing needle damage and ensuring the embroidery frame holds securely.</p>
            <span class="tag">Pro-Style Caps</span>
          </div>
          <div class="ed-technique-card">
            <h3>Consistent Colourways</h3>
            <p>Dye-lot consistency across production runs means your decorated products match perfectly — even when reordering months apart. Our 40+ colourways are held to strict Pantone tolerances.</p>
            <span class="tag">All Products</span>
          </div>
          <div class="ed-technique-card">
            <h3>Oversized Branding Zones</h3>
            <p>Generous front, side, and back decoration areas accommodate even the largest logos and multi-position branding. Our caps offer up to 90mm height on the front panel.</p>
            <span class="tag">Caps</span><span class="tag">Beanies</span>
          </div>
        </div>
      </div>
    </section>

    <section class="ed-cta">
      <h2>Ready to Start Decorating?</h2>
      <p>Explore our full Decorator Academy for technique guides, videos, and expert tips.</p>
      <a href="../" class="btn btn--primary">Visit Decorator Academy</a>
    </section>`
});

// --- Videos ---
DECORATOR_PAGES.push({
  file: 'decorator-academy/videos.html',
  title: 'Decoration Videos',
  description: 'Watch expert tutorials on embroidery, transfer printing, patch application, and more decoration techniques for Beechfield headwear.',
  heroColor: '#1b2a4a',
  heroH1: 'How-to Videos.',
  heroSubtitle: 'Watch our expert decorators demonstrate techniques, share tips, and walk you through the best approaches for decorating Beechfield headwear.',
  breadcrumbHtml: '<a href="../../">Home</a> / <a href="../">Decorator Academy</a> / Videos',
  activeNav: 'decorator', depth: 2,
  bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-grid">
          <div class="ed-card video-card">
            <div class="ed-card__img">Embroidery Setup<span class="video-card__duration">8:24</span></div>
            <div class="ed-card__body">
              <h3>Setting Up a Cap for Embroidery</h3>
              <p>Learn how to properly hoop a structured cap using the fold-down buckram system for perfect stitch results every time.</p>
              <span class="tag" style="display:inline-block;background:#f0f0f0;color:#333;font-size:0.75rem;font-weight:600;padding:0.25rem 0.6rem;border-radius:3px;">Embroidery</span>
            </div>
          </div>
          <div class="ed-card video-card">
            <div class="ed-card__img">Heat Transfer<span class="video-card__duration">6:12</span></div>
            <div class="ed-card__body">
              <h3>Heat Transfer on Beanies</h3>
              <p>A step-by-step guide to applying heat transfers on knitted beanies — temperature, pressure, and timing for flawless results.</p>
              <span class="tag" style="display:inline-block;background:#f0f0f0;color:#333;font-size:0.75rem;font-weight:600;padding:0.25rem 0.6rem;border-radius:3px;">Transfer</span>
            </div>
          </div>
          <div class="ed-card video-card">
            <div class="ed-card__img">Patch Application<span class="video-card__duration">5:45</span></div>
            <div class="ed-card__body">
              <h3>Applying Patches to Caps</h3>
              <p>Iron-on vs. sew-on patches: when to use each method and how to achieve a professional, durable finish on any Beechfield cap.</p>
              <span class="tag" style="display:inline-block;background:#f0f0f0;color:#333;font-size:0.75rem;font-weight:600;padding:0.25rem 0.6rem;border-radius:3px;">Patches</span>
            </div>
          </div>
          <div class="ed-card video-card">
            <div class="ed-card__img">Screen Print Setup<span class="video-card__duration">7:38</span></div>
            <div class="ed-card__body">
              <h3>Screen Printing Flat Caps</h3>
              <p>Setting up screens, choosing ink, and printing on flat-front caps. Covers single and multi-colour print techniques.</p>
              <span class="tag" style="display:inline-block;background:#f0f0f0;color:#333;font-size:0.75rem;font-weight:600;padding:0.25rem 0.6rem;border-radius:3px;">Screen Print</span>
            </div>
          </div>
          <div class="ed-card video-card">
            <div class="ed-card__img">Product Overview<span class="video-card__duration">4:15</span></div>
            <div class="ed-card__body">
              <h3>B15 Ultimate 5-Panel Cap Review</h3>
              <p>An in-depth look at our best-selling cap: construction quality, decoration potential, and colour range overview.</p>
              <span class="tag" style="display:inline-block;background:#f0f0f0;color:#333;font-size:0.75rem;font-weight:600;padding:0.25rem 0.6rem;border-radius:3px;">Product Review</span>
            </div>
          </div>
          <div class="ed-card video-card">
            <div class="ed-card__img">Laser Technique<span class="video-card__duration">6:50</span></div>
            <div class="ed-card__body">
              <h3>Laser Engraving on Suede</h3>
              <p>Precision laser engraving on suede-effect peaks and panels — settings, preparation, and finishing for premium results.</p>
              <span class="tag" style="display:inline-block;background:#f0f0f0;color:#333;font-size:0.75rem;font-weight:600;padding:0.25rem 0.6rem;border-radius:3px;">Laser</span>
            </div>
          </div>
          <div class="ed-card video-card">
            <div class="ed-card__img">Beanie Embroidery<span class="video-card__duration">9:10</span></div>
            <div class="ed-card__body">
              <h3>Embroidering Cuffed Beanies</h3>
              <p>Specialist tips for embroidering on knitted fabric: stabiliser selection, needle choice, and design adaptation for stretch materials.</p>
              <span class="tag" style="display:inline-block;background:#f0f0f0;color:#333;font-size:0.75rem;font-weight:600;padding:0.25rem 0.6rem;border-radius:3px;">Embroidery</span>
            </div>
          </div>
          <div class="ed-card video-card">
            <div class="ed-card__img">DTG Printing<span class="video-card__duration">7:02</span></div>
            <div class="ed-card__body">
              <h3>DTG Printing on Bucket Hats</h3>
              <p>Direct-to-garment printing on cotton bucket hats — pre-treatment, printer settings, and curing for wash-fast results.</p>
              <span class="tag" style="display:inline-block;background:#f0f0f0;color:#333;font-size:0.75rem;font-weight:600;padding:0.25rem 0.6rem;border-radius:3px;">DTG</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="ed-cta">
      <h2>Want More Tutorials?</h2>
      <p>Subscribe to our channel for the latest decoration guides and product reviews.</p>
      <a href="../../decorator-academy/" class="btn btn--primary">Back to Decorator Academy</a>
    </section>`
});


// --- Glossary ---
DECORATOR_PAGES.push({
  file: 'decorator-academy/glossary.html',
  title: 'Headwear Glossary',
  description: 'A comprehensive A-Z glossary of headwear and decoration terminology used by Beechfield and the professional decoration industry.',
  heroColor: '#333',
  heroH1: 'Glossary.',
  heroSubtitle: 'A comprehensive reference guide to headwear construction, decoration techniques, and industry terminology.',
  breadcrumbHtml: '<a href="../../">Home</a> / <a href="../">Decorator Academy</a> / Glossary',
  activeNav: 'decorator', depth: 2,
  bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <nav class="glossary-nav">
          ${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => '<a href="#' + l + '">' + l + '</a>').join('')}
        </nav>
        <dl>
          <div class="glossary-term" id="A"><dt>Acrylic</dt><dd>A synthetic fibre used in knitted beanies and winter accessories. Lightweight, warm, and holds colour well. Machine-washable and hypoallergenic.</dd></div>
          <div class="glossary-term"><dt>Appliqué</dt><dd>A decoration technique where fabric pieces are sewn onto a garment to create a design. Often combined with embroidery for textured, dimensional branding.</dd></div>
          <div class="glossary-term" id="B"><dt>Backstitch</dt><dd>A reinforcing stitch used in embroidery to prevent unravelling. Critical for ensuring logo durability on headwear that undergoes regular washing.</dd></div>
          <div class="glossary-term"><dt>Buckram</dt><dd>A stiff interlining material used inside the front panels of structured caps to maintain shape. Beechfield's fold-down buckram allows easy hooping for embroidery.</dd></div>
          <div class="glossary-term"><dt>Bill / Brim</dt><dd>The projecting front piece of a cap that shades the eyes. Also called a peak or visor. Can be flat, pre-curved, or sandwich-style with contrasting colour.</dd></div>
          <div class="glossary-term" id="C"><dt>Closure</dt><dd>The adjustable mechanism at the back of a cap. Common types include snapback, strapback (buckle/slide), Velcro, fitted (no closure), and tri-glide.</dd></div>
          <div class="glossary-term"><dt>Crown</dt><dd>The main body of a cap that covers the top of the head. Constructed from multiple panels (typically 5 or 6) sewn together. Crown height varies by style.</dd></div>
          <div class="glossary-term"><dt>Cuff</dt><dd>The folded-up brim of a beanie. Can be single-fold or double-fold. The cuff provides a flat, stable surface ideal for embroidered logos.</dd></div>
          <div class="glossary-term" id="D"><dt>DTG (Direct to Garment)</dt><dd>A digital printing method that sprays water-based ink directly onto fabric. Produces photographic-quality, full-colour prints. Best on cotton and cotton-blend substrates.</dd></div>
          <div class="glossary-term"><dt>Debossing</dt><dd>A technique where a heated die is pressed into material to create an indented design. Creates a subtle, premium, tone-on-tone effect on leather, suede, and heavy fabric.</dd></div>
          <div class="glossary-term" id="E"><dt>Eyelets</dt><dd>Small ventilation holes on cap panels, usually reinforced with metal or embroidered surrounds. Typically 6 eyelets (one per panel on 6-panel caps). Provide airflow and a design detail.</dd></div>
          <div class="glossary-term"><dt>Embroidery Area</dt><dd>The recommended zone on a product for embroidery placement. Beechfield provides specific measurement guides for each product's front, side, and back embroidery areas.</dd></div>
          <div class="glossary-term" id="F"><dt>Flat Embroidery Area</dt><dd>A specially constructed zone on structured caps where the fabric lies completely flat, allowing for precise machine embroidery without puckering or distortion.</dd></div>
          <div class="glossary-term"><dt>Fleece</dt><dd>A soft, warm synthetic fabric made from polyester. Used in winter headwear. Beechfield's Suprafleece® is an anti-pill variant that maintains appearance after repeated washing.</dd></div>
          <div class="glossary-term"><dt>Foil Transfer</dt><dd>A decoration method using metallic or coloured foil applied with heat and pressure. Creates a shiny, eye-catching finish. Often combined with debossing for luxury branding.</dd></div>
          <div class="glossary-term" id="G"><dt>GSM (Grams per Square Metre)</dt><dd>A measurement of fabric weight and density. Higher GSM indicates heavier, thicker fabric. Typical ranges: lightweight caps 150-200 GSM, heavy beanies 300-400 GSM.</dd></div>
          <div class="glossary-term"><dt>Gauge</dt><dd>In knitted fabrics, the number of stitches per inch. Higher gauge means a finer, tighter knit. Affects appearance, warmth, and decoration suitability.</dd></div>
          <div class="glossary-term" id="H"><dt>Heat Transfer</dt><dd>A decoration process using heat and pressure to apply a pre-printed design from a carrier sheet to a garment. Versatile, full-colour, and suitable for most Beechfield products.</dd></div>
          <div class="glossary-term"><dt>Hooping</dt><dd>The process of securing fabric in an embroidery frame (hoop) before stitching. Proper hooping is critical for registration accuracy and stitch quality on caps.</dd></div>
          <div class="glossary-term" id="I"><dt>Interlining</dt><dd>A layer of material between the outer fabric and lining of a cap. Provides structure, shape retention, and improved decoration surface. See also: Buckram.</dd></div>
          <div class="glossary-term" id="J"><dt>Jacquard</dt><dd>A weaving technique that creates intricate patterns directly in the fabric. Used in premium headwear for all-over tonal designs without additional decoration.</dd></div>
          <div class="glossary-term" id="K"><dt>Knit</dt><dd>Fabric constructed by interlocking loops of yarn. Used in beanies, headbands, and winter accessories. Requires specific embroidery techniques due to stretch properties.</dd></div>
          <div class="glossary-term" id="L"><dt>Logo Placement</dt><dd>The positioning of a brand mark on headwear. Key zones: front centre (primary), left/right side (secondary), back (tertiary), and peak/underbill (accent).</dd></div>
          <div class="glossary-term" id="M"><dt>Mesh</dt><dd>An open-weave fabric used on trucker cap backs for ventilation. Typically polyester. Creates a breathable, lightweight construction ideal for warm weather.</dd></div>
          <div class="glossary-term" id="N"><dt>Nylon</dt><dd>A strong, lightweight synthetic fibre with excellent durability and water resistance. Used in performance caps, bucket hats, and ripstop constructions.</dd></div>
          <div class="glossary-term" id="O"><dt>Organic Cotton</dt><dd>Cotton grown without synthetic pesticides or fertilisers. Beechfield's EarthAware® range uses certified organic cotton for reduced environmental impact.</dd></div>
          <div class="glossary-term" id="P"><dt>Panels</dt><dd>The individual fabric sections sewn together to form a cap's crown. Standard caps use 5 or 6 panels. Panel count affects shape, structure, and decoration area.</dd></div>
          <div class="glossary-term"><dt>Peak</dt><dd>See Bill/Brim. The projecting shade at the front of a cap. Can be pre-curved (classic), flat (urban/snapback), or short (camper style).</dd></div>
          <div class="glossary-term" id="Q"><dt>Quick-Dry</dt><dd>Moisture-wicking fabric technology that pulls sweat away from skin and evaporates it quickly. Used in Beechfield's performance and sports headwear range.</dd></div>
          <div class="glossary-term" id="R"><dt>Reinforced Seam</dt><dd>Double or triple stitched seams that add durability and prevent tearing during decoration processes and everyday wear.</dd></div>
          <div class="glossary-term"><dt>Ripstop</dt><dd>A fabric woven with a reinforcing grid pattern that prevents tears from spreading. Lightweight yet extremely durable. Used in outdoor and performance headwear.</dd></div>
          <div class="glossary-term" id="S"><dt>Sandwich Peak</dt><dd>A cap peak/brim with a contrasting colour layer visible between the top and bottom fabrics. Adds a distinctive design detail and colour accent.</dd></div>
          <div class="glossary-term"><dt>Snapback</dt><dd>An adjustable closure system using plastic snaps. Classic 80s/90s style with flat peak. One-size-fits-most with multiple adjustment points.</dd></div>
          <div class="glossary-term"><dt>Stabiliser</dt><dd>A backing material placed behind fabric during embroidery to prevent stretching, puckering, and needle damage. Cut-away and tear-away types available.</dd></div>
          <div class="glossary-term"><dt>Suprafleece®</dt><dd>Beechfield's proprietary anti-pill fleece fabric. Maintains a smooth, professional appearance even after repeated washing and wear.</dd></div>
          <div class="glossary-term" id="T"><dt>Tear-Away Label</dt><dd>A garment label designed to be cleanly removed by hand. Beechfield uses tear-away labels so decorators and brands can replace them with custom branding.</dd></div>
          <div class="glossary-term"><dt>Tri-Glide</dt><dd>A metal or plastic sliding buckle closure commonly used on dad hats and unstructured caps. Allows infinite size adjustment within range.</dd></div>
          <div class="glossary-term" id="U"><dt>Underbill</dt><dd>The underside of a cap's peak/brim. Often a different colour from the top (especially on snapbacks). Can be decorated with subtle branding or left plain.</dd></div>
          <div class="glossary-term"><dt>Unstructured</dt><dd>A cap construction without buckram interlining, creating a relaxed, soft silhouette. Dad hats and camper caps are typically unstructured.</dd></div>
          <div class="glossary-term" id="V"><dt>Visor</dt><dd>1. A sun shade without a crown (open-top headwear). 2. Another term for a cap's peak or bill.</dd></div>
          <div class="glossary-term" id="W"><dt>Woven Label</dt><dd>A fabric label with text or logos woven directly into the material. Used for branding on headwear interiors, closures, and as decorative external details.</dd></div>
        </dl>
      </div>
    </section>

    <section class="ed-cta">
      <h2>Explore the Decorator Academy</h2>
      <p>Put these terms into practice with our technique guides and video tutorials.</p>
      <a href="../" class="btn btn--primary">Decorator Academy</a>
    </section>`
});

// --- Decorator Studio ---
DECORATOR_PAGES.push({
  file: 'decorator-academy/decorator-studio.html',
  title: 'Decorator Studio',
  description: 'Visualise your logo placement on Beechfield headwear with our interactive Decorator Studio tool.',
  heroColor: '#1f614d',
  heroH1: 'Decorator Studio.',
  heroSubtitle: 'Our logo placement visualisation tool helps you plan the perfect decoration before committing to production.',
  breadcrumbHtml: '<a href="../../">Home</a> / <a href="../">Decorator Academy</a> / Decorator Studio',
  activeNav: 'decorator', depth: 2,
  bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>Visualise Before You Decorate</h2>
            <p>The Decorator Studio is our upcoming interactive tool that lets you upload your logo, choose a Beechfield product, select a colour, and preview how your decoration will look — all before placing an order.</p>
            <p>Plan front, side, and back placements. Compare embroidery, transfer, and patch options. Generate specification sheets to share with your decoration partner.</p>
          </div>
          <div class="ed-split__img" style="background:#e8f5e9;font-weight:600;">Coming Soon</div>
        </div>
      </div>
    </section>

    <section class="ed-section ed-section--alt">
      <div class="container">
        <h2 style="text-align:center;margin-bottom:2rem;">What You'll Be Able to Do</h2>
        <div class="ed-grid">
          <div class="ed-card">
            <div class="ed-card__body">
              <h3>Upload Your Logo</h3>
              <p>Drop in your artwork in any format — AI, EPS, PNG, SVG, or JPG. The studio will automatically detect colours and suggest optimal placement zones.</p>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__body">
              <h3>Choose Your Product</h3>
              <p>Select from the full Beechfield range. See accurate product renders in every available colour with proper proportions and angles.</p>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__body">
              <h3>Preview Decoration Methods</h3>
              <p>Toggle between embroidery, transfer, patch, and screen print visualisations. Each method renders differently to give you a realistic preview.</p>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__body">
              <h3>Generate Spec Sheets</h3>
              <p>Export a professional specification sheet with product details, decoration method, placement coordinates, thread colours, and artwork dimensions.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="ed-section">
      <div class="container" style="max-width:700px;">
        <h2 style="text-align:center;margin-bottom:1rem;">Interim Placement Tips</h2>
        <p style="text-align:center;color:#555;margin-bottom:2rem;">While we build the Decorator Studio, here are our recommended logo placement guidelines.</p>
        <div class="ed-faq">
          <details open>
            <summary>Front Panel — Primary Branding</summary>
            <div class="answer">
              <p>Centre your logo on the front panel(s). For 5-panel caps, use the single front panel. For 6-panel caps, bridge the centre seam. Recommended max size: 60mm H × 100mm W for caps, 80mm H × 100mm W for beanies.</p>
            </div>
          </details>
          <details>
            <summary>Side Panels — Secondary Branding</summary>
            <div class="answer">
              <p>Left or right side panels work for smaller secondary logos, initials, or icons. Position 25mm from front seam, centred vertically. Max size: 40mm H × 40mm W.</p>
            </div>
          </details>
          <details>
            <summary>Back Panel — Subtle Branding</summary>
            <div class="answer">
              <p>The back panel above the closure is ideal for website URLs, small logos, or taglines. Centre horizontally above the closure strap. Max size: 25mm H × 60mm W.</p>
            </div>
          </details>
          <details>
            <summary>Peak / Underbill — Premium Accent</summary>
            <div class="answer">
              <p>Peak-top or underbill decoration adds a premium touch. Laser engraving works on suede peaks; embroidery or print for fabric underbills. Max size: 30mm H × 50mm W.</p>
            </div>
          </details>
        </div>
      </div>
    </section>

    <section class="ed-cta">
      <h2>Get Notified When We Launch</h2>
      <p>Be the first to try the Decorator Studio. Sign up and we'll let you know when it's ready.</p>
      <a href="../join-the-community.html" class="btn btn--accent">Join the Community</a>
    </section>`
});


// --- Colours ---
DECORATOR_PAGES.push({
  file: 'decorator-academy/colours.html',
  title: 'Colour Palette',
  description: 'Browse the complete Beechfield colour palette — 40+ colours across neutrals, brights, pastels, and antique tones.',
  heroColor: '#0e1520',
  heroH1: 'Colour Palette.',
  heroSubtitle: 'Over 40 colourways held to strict Pantone tolerances, ensuring consistent results across production runs and reorders.',
  breadcrumbHtml: '<a href="../../">Home</a> / <a href="../">Decorator Academy</a> / Colours',
  activeNav: 'decorator', depth: 2,
  bodyHtml: (() => {
    const groups = {
      'Neutrals': { 'Black':'#000000','White':'#ffffff','Soft White':'#f5f5f0','Natural':'#f5f0e8','Cream':'#f5f0e8','Sand':'#c2b280','Stone':'#b4a78f','Oatmeal':'#d4c4a0' },
      'Greys': { 'Graphite Grey':'#555555','Charcoal':'#333333','Heather Grey':'#9ca3af','Light Grey':'#d1d5db','Granite':'#5a5a5a','Ash':'#b0b0b0' },
      'Blues': { 'French Navy':'#1b2a4a','Oxford Navy':'#002147','Bright Royal':'#1d4ed8','Sapphire Blue':'#2563eb','Sky Blue':'#7dd3fc','Surf Blue':'#38bdf8','Airforce Blue':'#5b7fa5','Petrol':'#1a535c','Heather Navy':'#1e3a5f' },
      'Reds & Pinks': { 'Classic Red':'#dc2626','Fire Red':'#ef4444','Bright Red':'#ef4444','Burgundy':'#800020','Fuchsia':'#d946ef','True Pink':'#ec4899','Classic Pink':'#f9a8d4','Dusky Pink':'#ce7e8e','Coral':'#f97171','Pastel Pink':'#fbcfe8','Blush Pink':'#fbcfe8' },
      'Greens': { 'Bottle Green':'#166534','Kelly Green':'#4ade80','Olive Green':'#556b2f','Moss Green':'#4a6741','Emerald':'#10b981','Teal':'#14b8a6' },
      'Earth Tones': { 'Chocolate':'#3e2723','Caramel':'#c4883e','Desert Sand':'#c8b99a','Almond':'#efdecd','Dusty Rose':'#c4868c' },
      'Brights': { 'Orange':'#f97316','Gold':'#d4a017','Mustard':'#e3a018','Yellow':'#fbbf24','Lime Green':'#84cc16','Purple':'#7e22ce','Magenta':'#a21caf','Lavender':'#a78bfa','Pistachio':'#93c572','Mint':'#86efac' },
      'Fluorescents': { 'Fluorescent Green':'#22c55e','Fluorescent Yellow':'#facc15','Fluorescent Pink':'#f472b6' },
      'Antiques': { 'Antique Grey':'#9e9487','Antique Moss Green':'#6b7a4f','Antique Royal Blue':'#3b5fa8','Antique Burgundy':'#8c2e3a','Antique Mustard':'#c4953a','Antique Petrol':'#3d6b73','Antique Teal':'#2c7873' }
    };
    let html = '';
    for (const [group, colours] of Object.entries(groups)) {
      html += `
    <section class="ed-section${html ? ' ed-section--alt' : ''}">
      <div class="container">
        <h2 style="margin-bottom:1.5rem;">${group}</h2>
        <div class="colour-grid">`;
      for (const [name, hex] of Object.entries(colours)) {
        const border = (hex === '#ffffff' || hex === '#f5f5f0' || hex === '#f5f0e8') ? ';border:1px solid #ddd' : '';
        html += `
          <div class="colour-swatch">
            <div class="colour-swatch__box" style="background:${hex}${border}"></div>
            <div class="colour-swatch__name">${name}</div>
            <div class="colour-swatch__hex">${hex}</div>
          </div>`;
      }
      html += `
        </div>
      </div>
    </section>`;
    }
    html += `
    <section class="ed-section">
      <div class="container" style="max-width:700px;text-align:center;">
        <h2>Colour Matching Note</h2>
        <p style="color:#555;line-height:1.8;">Screen colours are approximate. For accurate colour matching, please request physical fabric swatches from your Beechfield distributor. All Beechfield colours are held to strict dye-lot tolerances for consistency across production runs.</p>
        <a href="../../where-to-buy/" class="btn btn--primary" style="margin-top:1.5rem;">Find a Distributor</a>
      </div>
    </section>`;
    return html;
  })()
});

// --- In the Wild (Case Studies) ---
DECORATOR_PAGES.push({
  file: 'decorator-academy/in-the-wild.html',
  title: 'In the Wild — Case Studies',
  description: 'See how brands, clubs, and organisations use Beechfield headwear for their decorated merchandise projects.',
  heroColor: '#1b2a4a',
  heroH1: 'In the Wild.',
  heroSubtitle: 'Real-world examples of Beechfield headwear decorated for brands, events, teams, and organisations across Europe.',
  breadcrumbHtml: '<a href="../../">Home</a> / <a href="../">Decorator Academy</a> / In the Wild',
  activeNav: 'decorator', depth: 2,
  bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <p style="max-width:600px;color:#555;line-height:1.8;margin-bottom:2.5rem;">From local sports clubs to international brands, Beechfield headwear is the canvas of choice for professional decorators. Here are some of our favourite projects.</p>
        <div class="ed-grid">
          <div class="case-study">
            <div class="ed-card__img" style="margin-bottom:1.5rem;">Sports Club</div>
            <p class="case-study__label">Sports &amp; Teams</p>
            <h3>Local Football Club Matchday Merchandise</h3>
            <p><strong>Challenge:</strong> Create affordable, high-quality branded caps for a grassroots football club with 200 members — needed within 2 weeks for the season opener.</p>
            <p><strong>Solution:</strong> B15 Ultimate 5-Panel Caps in club colours (French Navy/Classic Red) with front-panel embroidery and back-strap URL. 250 units decorated and delivered in 10 working days.</p>
            <p><strong>Products:</strong> B15, B45</p>
          </div>
          <div class="case-study">
            <div class="ed-card__img" style="margin-bottom:1.5rem;">Corporate</div>
            <p class="case-study__label">Corporate &amp; Events</p>
            <h3>Tech Company All-Hands Conference</h3>
            <p><strong>Challenge:</strong> A fast-growing tech startup needed branded beanies as welcome gifts for 500 attendees at their annual company conference.</p>
            <p><strong>Solution:</strong> B45 Acrylic Knit Cuffed Beanies in Oxford Navy with side-panel embroidered logo. Custom woven labels replaced tear-away tags for premium feel. Delivered in 14 days.</p>
            <p><strong>Products:</strong> B45, BB44</p>
          </div>
          <div class="case-study">
            <div class="ed-card__img" style="margin-bottom:1.5rem;">Festival</div>
            <p class="case-study__label">Music &amp; Festivals</p>
            <h3>Summer Music Festival Merchandise Range</h3>
            <p><strong>Challenge:</strong> Create a multi-product merchandise range for a 3-day music festival — needed bold, festival-ready styles with full-colour artwork.</p>
            <p><strong>Solution:</strong> Mix of B686 Bucket Hats (all-over sublimation print), B15 Caps (front embroidery + back print), and B45 Beanies (cuff embroidery). 1,500 units across 6 designs.</p>
            <p><strong>Products:</strong> B686, B15, B45</p>
          </div>
          <div class="case-study">
            <div class="ed-card__img" style="margin-bottom:1.5rem;">Charity</div>
            <p class="case-study__label">Charity &amp; Fundraising</p>
            <h3>Charity Walk Participation Caps</h3>
            <p><strong>Challenge:</strong> A national charity needed 2,000 branded caps for participants in their annual sponsored walk — budget was tight, timeline was 3 weeks.</p>
            <p><strong>Solution:</strong> B15 caps in Bright Royal with single-colour front transfer print (most cost-effective method at this volume). Charity's web URL screen printed on back strap.</p>
            <p><strong>Products:</strong> B15</p>
          </div>
          <div class="case-study">
            <div class="ed-card__img" style="margin-bottom:1.5rem;">Hospitality</div>
            <p class="case-study__label">Hospitality &amp; Food</p>
            <h3>Artisan Coffee Roaster Staff Uniform</h3>
            <p><strong>Challenge:</strong> A premium coffee roaster needed staff headwear that reflected their artisan brand values — subtle, high-quality, and comfortable for all-day wear.</p>
            <p><strong>Solution:</strong> B677 Cord Caps in Caramel with debossed leather patch featuring laser-engraved logo. Tear-away labels replaced with custom woven tags. 50 units for 12 locations.</p>
            <p><strong>Products:</strong> B677, B690</p>
          </div>
          <div class="case-study">
            <div class="ed-card__img" style="margin-bottom:1.5rem;">Education</div>
            <p class="case-study__label">Education</p>
            <h3>University Freshers' Week Welcome Packs</h3>
            <p><strong>Challenge:</strong> A university students' union needed branded headwear for 3,000 freshers' welcome packs across multiple faculties — each faculty wanted their own colour.</p>
            <p><strong>Solution:</strong> B15 caps in 8 faculty colours with consistent white embroidered university crest and faculty name. Delivered in 3 staggered batches over 4 weeks.</p>
            <p><strong>Products:</strong> B15, B45</p>
          </div>
        </div>
      </div>
    </section>

    <section class="ed-cta">
      <h2>Share Your Project</h2>
      <p>Decorated Beechfield headwear for a client? We'd love to feature your work. Get in touch to be included.</p>
      <a href="../../resources/contact.html" class="btn btn--primary">Contact Us</a>
    </section>`
});

// --- Decoration Protection ---
DECORATOR_PAGES.push({
  file: 'decorator-academy/decoration-protection.html',
  title: 'Decoration-Friendly Construction',
  description: 'Learn about Beechfield construction features designed for decoration: tear-away labels, fold-down buckram, reinforced panels, and more.',
  heroColor: '#333',
  heroH1: 'Decoration-Friendly Construction.',
  heroSubtitle: 'How Beechfield headwear is engineered from the inside out to deliver the best possible decoration results.',
  breadcrumbHtml: '<a href="../../">Home</a> / <a href="../">Decorator Academy</a> / Decoration Protection',
  activeNav: 'decorator', depth: 2,
  bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>Tear-Away Labels</h2>
            <p>Every Beechfield product features tear-away neck and care labels that can be cleanly removed by hand. No scissors needed, no residue left behind — just a clean surface ready for your own branding.</p>
            <p>This allows decorators and brands to replace standard labels with custom woven labels, printed tags, or heat-sealed branding for a fully white-labelled product.</p>
            <p><strong>Available on:</strong> All Beechfield products</p>
          </div>
          <div class="ed-split__img">Tear-away label close-up</div>
        </div>
      </div>
    </section>

    <section class="ed-section ed-section--alt">
      <div class="container">
        <div class="ed-split ed-split--reverse">
          <div class="ed-split__text">
            <h2>Fold-Down Buckram</h2>
            <p>Our structured caps feature a proprietary fold-down buckram system. The stiff interlining that shapes the front panels can be folded down, allowing the fabric to be hooped flat in an embroidery frame.</p>
            <p>This dramatically reduces setup time and eliminates the puckering and distortion common when embroidering over rigid buckram. Once the buckram is folded back up after embroidery, the cap returns to its structured shape with a perfect front panel.</p>
            <p><strong>Available on:</strong> All structured 5-panel and 6-panel caps</p>
          </div>
          <div class="ed-split__img">Fold-down buckram demonstration</div>
        </div>
      </div>
    </section>

    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>Reinforced Front Panels</h2>
            <p>Key styles in the Beechfield range feature double-layer front panel construction. The additional inner layer provides extra stability during the embroidery process, preventing needle damage and ensuring the hoop holds the fabric securely without slippage.</p>
            <p>The reinforcement also improves the finished appearance of embroidered designs by providing a firmer backing, reducing the "pillowing" effect that can occur on single-layer fabric.</p>
            <p><strong>Available on:</strong> Pro-Style caps, Ultimate range, selected Heritage styles</p>
          </div>
          <div class="ed-split__img">Reinforced panel construction</div>
        </div>
      </div>
    </section>

    <section class="ed-section ed-section--alt">
      <div class="container">
        <div class="ed-split ed-split--reverse">
          <div class="ed-split__text">
            <h2>Flat Embroidery Areas</h2>
            <p>Beechfield caps are constructed with precisely engineered flat embroidery zones. The front panels are cut and sewn to ensure the fabric lies completely flat within the designated decoration area, with no seams, wrinkles, or tension points.</p>
            <p>Combined with fold-down buckram and proper stabiliser backing, this creates the ideal surface for high-stitch-count, detailed machine embroidery.</p>
            <p><strong>Available on:</strong> All cap styles with structured front panels</p>
          </div>
          <div class="ed-split__img">Flat embroidery area detail</div>
        </div>
      </div>
    </section>

    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>Sweatband Construction</h2>
            <p>The internal sweatband on Beechfield caps is designed to sit below the decoration zone, so it doesn't interfere with hooping or stitching. The cotton or moisture-wicking sweatband provides comfort while keeping the decoration area clean and accessible.</p>
            <p>On embroidery-optimised styles, the sweatband can be folded out of the way during the hooping process for maximum clearance.</p>
            <p><strong>Available on:</strong> All caps and visors</p>
          </div>
          <div class="ed-split__img">Sweatband construction detail</div>
        </div>
      </div>
    </section>

    <section class="ed-cta">
      <h2>See These Features in Action</h2>
      <p>Watch our how-to videos to see Beechfield's decoration-friendly features demonstrated by expert decorators.</p>
      <a href="../videos.html" class="btn btn--primary">Watch Videos</a>
    </section>`
});

// --- Join the Community ---
DECORATOR_PAGES.push({
  file: 'decorator-academy/join-the-community.html',
  title: 'Join the Community',
  description: 'Join the Beechfield decorator community for early access, expert tips, exclusive resources, and networking with fellow decorators.',
  heroColor: '#1f614d',
  heroH1: 'Join the Community.',
  heroSubtitle: 'Connect with fellow decorators, get early access to new products, and receive expert tips directly from the Beechfield team.',
  breadcrumbHtml: '<a href="../../">Home</a> / <a href="../">Decorator Academy</a> / Join the Community',
  activeNav: 'decorator', depth: 2,
  bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-grid">
          <div class="ed-card">
            <div class="ed-card__body">
              <h3>Early Access</h3>
              <p>Be the first to see new season products, colours, and collections before they launch. Get a head start on planning your decoration offering.</p>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__body">
              <h3>Expert Tips &amp; Tutorials</h3>
              <p>Monthly newsletter with decoration tips, technique guides, and best-practice advice from professional decorators and the Beechfield product team.</p>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__body">
              <h3>Exclusive Resources</h3>
              <p>Access to downloadable decoration guides, embroidery templates, colour charts, and product specification sheets before general release.</p>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__body">
              <h3>Community Forum</h3>
              <p>Connect with decorators across Europe. Share techniques, troubleshoot challenges, and showcase your decorated Beechfield products.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="ed-section ed-section--alt">
      <div class="container" style="max-width:600px;">
        <h2 style="text-align:center;margin-bottom:2rem;">Sign Up</h2>
        <form action="#" method="post" style="background:#fff;padding:2rem;border-radius:8px;border:1px solid #e8e4dc;">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" name="name" placeholder="Your name" required>
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" placeholder="you@company.com" required>
          </div>
          <div class="form-group">
            <label for="company">Company / Business Name</label>
            <input type="text" id="company" name="company" placeholder="Your business name">
          </div>
          <div class="form-group">
            <label>Decoration Methods (select all that apply)</label>
            <div class="checkbox-group">
              <label><input type="checkbox" name="methods" value="embroidery"> Embroidery</label>
              <label><input type="checkbox" name="methods" value="transfer"> Transfer/DTG</label>
              <label><input type="checkbox" name="methods" value="screen"> Screen Print</label>
              <label><input type="checkbox" name="methods" value="patches"> Patches</label>
              <label><input type="checkbox" name="methods" value="laser"> Laser</label>
              <label><input type="checkbox" name="methods" value="other"> Other</label>
            </div>
          </div>
          <button type="submit" class="btn btn--accent" style="width:100%;text-align:center;">Join the Community</button>
        </form>
      </div>
    </section>`
});


// ═══════════════════════════════════════════════════════════════
// TECHNIQUE REDIRECTS (depth=3)
// ═══════════════════════════════════════════════════════════════

const REDIRECT_PAGES = [
  { file: 'decorator-academy/techniques/embroidery.html', target: '../../decoration/embroidery.html', label: 'Embroidery' },
  { file: 'decorator-academy/techniques/transfer.html', target: '../../decoration/transfer.html', label: 'Print & Transfer' },
  { file: 'decorator-academy/techniques/patches.html', target: '../../decoration/patches.html', label: 'Patches' },
];

// ═══════════════════════════════════════════════════════════════
// CAP STUDIO GUIDES (depth=3)
// ═══════════════════════════════════════════════════════════════

const GUIDE_PAGES = [];

// --- Anatomy of a Cap ---
GUIDE_PAGES.push({
  file: 'cap-studio/guides/anatomy.html',
  title: 'Anatomy of a Cap',
  description: 'A detailed guide to every component of a cap — crown, panels, peak, eyelets, closure, sweatband, buckram, and more.',
  heroColor: '#0e1520',
  heroH1: 'Anatomy of a Cap.',
  heroSubtitle: 'Understanding every component of a cap — from crown to closure — and how each affects decoration, fit, and performance.',
  breadcrumbHtml: '<a href="../../../">Home</a> / <a href="../../cap-studio/">Cap Studio</a> / <a href="./">Guides</a> / Anatomy',
  activeNav: 'cap-studio', depth: 3,
  bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <div class="anatomy-part">
          <div>
            <h3>Crown &amp; Panels</h3>
            <p>The crown is the main body of the cap, constructed from multiple fabric panels sewn together. Most caps use 5 or 6 panels, though some designs use 2 (trucker-style) or a single unstructured piece.</p>
            <p>Panel count directly affects the cap's silhouette and the available decoration area. 6-panel caps offer a centre-front seam that can be bridged with embroidery, while 5-panel caps provide a single, uninterrupted front panel — ideal for large logos.</p>
            <p><strong>Decoration relevance:</strong> The front panel(s) are the primary branding zone. 5-panel caps provide up to 90mm × 130mm of uninterrupted decoration space.</p>
          </div>
          <div class="anatomy-part__visual">Crown &amp; panels diagram</div>
        </div>

        <div class="anatomy-part">
          <div>
            <h3>Peak / Brim / Bill</h3>
            <p>The projecting front piece that shades the eyes. Constructed from fabric-covered stiff board or plastic, the peak can be flat (snapback style), pre-curved (classic), or short (camper style).</p>
            <p>Sandwich peaks feature a contrasting colour layer between the top and bottom fabrics. Some premium styles feature suede or leather-look peaks suitable for laser engraving.</p>
            <p><strong>Decoration relevance:</strong> Peak tops and underbills offer premium accent branding zones. Suede peaks are ideal for laser-engraved logos.</p>
          </div>
          <div class="anatomy-part__visual">Peak / brim diagram</div>
        </div>

        <div class="anatomy-part">
          <div>
            <h3>Eyelets &amp; Ventilation</h3>
            <p>Small holes on the cap panels that allow air circulation. Typically 6 eyelets (one per panel on 6-panel caps), positioned near the top of the crown. Can be metal-reinforced, embroidered, or laser-cut.</p>
            <p>Some performance styles use mesh panels or perforated fabric instead of traditional eyelets for enhanced airflow.</p>
            <p><strong>Decoration relevance:</strong> Eyelets are positioned to avoid the primary embroidery area. When placing side logos, account for eyelet positions.</p>
          </div>
          <div class="anatomy-part__visual">Eyelets diagram</div>
        </div>

        <div class="anatomy-part">
          <div>
            <h3>Closure Types</h3>
            <p>The adjustment mechanism at the back of the cap. Common types include:</p>
            <p><strong>Snapback:</strong> Plastic snaps with multiple size positions. Classic urban/streetwear style.<br>
            <strong>Strapback:</strong> Fabric or leather strap with metal buckle or tri-glide slider. Infinite adjustment.<br>
            <strong>Velcro:</strong> Hook-and-loop fastener. Easy on/off. Common on sport and workwear styles.<br>
            <strong>Fitted:</strong> No closure — sized to fit. Premium feel but requires size selection.</p>
            <p><strong>Decoration relevance:</strong> The back panel above the closure offers a secondary branding zone (25mm × 60mm typical).</p>
          </div>
          <div class="anatomy-part__visual">Closure types diagram</div>
        </div>

        <div class="anatomy-part">
          <div>
            <h3>Sweatband</h3>
            <p>The interior band around the inside of the crown, sitting against the wearer's forehead. Usually cotton or moisture-wicking polyester. Absorbs perspiration and adds comfort.</p>
            <p>On Beechfield caps, the sweatband is positioned below the primary decoration zone so it doesn't interfere with embroidery hooping.</p>
            <p><strong>Decoration relevance:</strong> Can be folded down during hooping. Some brands add interior branding to the sweatband.</p>
          </div>
          <div class="anatomy-part__visual">Sweatband diagram</div>
        </div>

        <div class="anatomy-part">
          <div>
            <h3>Top Button</h3>
            <p>The fabric-covered button at the crown's apex where all panels meet. Covers the seam junction and adds a finished look. Can be self-colour or contrasting.</p>
            <p>Some camper and minimalist styles omit the top button for a cleaner aesthetic.</p>
            <p><strong>Decoration relevance:</strong> The button is not a decoration zone but should be considered when planning top-of-crown placement.</p>
          </div>
          <div class="anatomy-part__visual">Top button diagram</div>
        </div>

        <div class="anatomy-part">
          <div>
            <h3>Buckram &amp; Structure</h3>
            <p>Buckram is a stiff interlining material sewn between the front panels and lining. It provides the structured, upright shape characteristic of baseball caps and snapbacks.</p>
            <p>Beechfield's proprietary fold-down buckram can be bent down flat for embroidery hooping, then returns to shape. Unstructured caps (dad hats, campers) have no buckram, creating a softer silhouette.</p>
            <p><strong>Decoration relevance:</strong> Fold-down buckram is one of the most important features for embroidery quality. See our <a href="../../decorator-academy/decoration-protection.html">Decoration Protection</a> guide.</p>
          </div>
          <div class="anatomy-part__visual">Buckram diagram</div>
        </div>

        <div class="anatomy-part">
          <div>
            <h3>Underbill</h3>
            <p>The underside of the peak/brim. Traditionally grey or green to reduce glare, modern styles often use contrasting colours (white, neon, prints) as a design feature.</p>
            <p>The underbill is sometimes branded with logos, pattern prints, or motivational text for a premium, reveal-when-removed effect.</p>
            <p><strong>Decoration relevance:</strong> Underbill embroidery or printing adds a premium hidden branding element. Max size typically 30mm × 50mm.</p>
          </div>
          <div class="anatomy-part__visual">Underbill diagram</div>
        </div>
      </div>
    </section>

    <section class="ed-cta">
      <h2>Explore More Guides</h2>
      <p>Learn about shapes, materials, and decoration placement in our other Cap Studio guides.</p>
      <a href="shapes.html" class="btn btn--primary" style="margin-right:0.5rem;">Shapes Guide</a>
      <a href="materials.html" class="btn btn--accent">Materials Guide</a>
    </section>`
});

// --- Shapes Guide ---
GUIDE_PAGES.push({
  file: 'cap-studio/guides/shapes.html',
  title: 'Cap Shapes Guide',
  description: 'A visual guide to every cap shape: baseball, trucker, dad hat, flat peak, army, camper, visor, and flat cap — with decoration tips.',
  heroColor: '#1b2a4a',
  heroH1: 'Shapes Guide.',
  heroSubtitle: 'From the structured 6-panel baseball cap to the relaxed dad hat — understand every silhouette and its decoration potential.',
  breadcrumbHtml: '<a href="../../../">Home</a> / <a href="../../cap-studio/">Cap Studio</a> / <a href="./">Guides</a> / Shapes',
  activeNav: 'cap-studio', depth: 3,
  bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <div class="shape-section" id="baseball">
          <h2>Baseball Cap</h2>
          <div class="shape-section__grid">
            <div>
              <p style="font-size:0.95rem;color:#555;line-height:1.8;margin-bottom:1rem;">The classic structured cap with a curved or flat peak. Available in 5 and 6-panel configurations. The most popular cap shape globally and the go-to choice for branded headwear.</p>
              <p style="font-size:0.95rem;color:#555;line-height:1.8;margin-bottom:1rem;">Beechfield baseball caps feature fold-down buckram, reinforced front panels, and generous embroidery areas — making them the ideal canvas for professional decoration.</p>
              <ul class="shape-features">
                <li>5 or 6 panel construction</li>
                <li>Structured front with buckram</li>
                <li>Pre-curved or flat peak options</li>
                <li>Multiple closure types available</li>
                <li>Largest front decoration area of any cap style</li>
                <li>Compatible with all decoration methods</li>
              </ul>
              <p style="font-size:0.85rem;color:#555;"><strong>Recommended products:</strong> B15, B59, B57, B10</p>
            </div>
            <div class="shape-section__visual">Baseball cap silhouette</div>
          </div>
        </div>

        <div class="shape-section" id="trucker">
          <h2>Trucker Cap</h2>
          <div class="shape-section__grid">
            <div>
              <p style="font-size:0.95rem;color:#555;line-height:1.8;margin-bottom:1rem;">The trucker cap features a foam or structured front panel with mesh back panels for maximum breathability. Originally designed as promotional giveaways, now a fashion staple.</p>
              <p style="font-size:0.95rem;color:#555;line-height:1.8;margin-bottom:1rem;">The foam front panel provides a slightly raised, padded surface that's ideal for bold embroidered logos and dimensional patches.</p>
              <ul class="shape-features">
                <li>Foam or structured front panel</li>
                <li>Mesh back panels for ventilation</li>
                <li>Typically snapback closure</li>
                <li>Higher crown profile than standard baseball</li>
                <li>Excellent for patches and large front embroidery</li>
              </ul>
              <p style="font-size:0.85rem;color:#555;"><strong>Recommended products:</strong> B640, B645, B647</p>
            </div>
            <div class="shape-section__visual">Trucker cap silhouette</div>
          </div>
        </div>

        <div class="shape-section" id="dad-hat">
          <h2>Dad Hat</h2>
          <div class="shape-section__grid">
            <div>
              <p style="font-size:0.95rem;color:#555;line-height:1.8;margin-bottom:1rem;">The relaxed, unstructured cap with a pre-curved peak and low-profile crown. No buckram means a soft, broken-in feel from day one. Strapback closure with metal buckle or tri-glide.</p>
              <p style="font-size:0.95rem;color:#555;line-height:1.8;margin-bottom:1rem;">While the unstructured construction requires more care during embroidery (proper stabiliser is essential), the casual aesthetic makes dad hats incredibly popular for lifestyle and fashion branding.</p>
              <ul class="shape-features">
                <li>Unstructured / no buckram</li>
                <li>Low-profile, relaxed crown</li>
                <li>Pre-curved peak</li>
                <li>Metal buckle or tri-glide closure</li>
                <li>Vintage/washed variations available</li>
                <li>Requires stabiliser backing for embroidery</li>
              </ul>
              <p style="font-size:0.85rem;color:#555;"><strong>Recommended products:</strong> B653, B655, B677</p>
            </div>
            <div class="shape-section__visual">Dad hat silhouette</div>
          </div>
        </div>

        <div class="shape-section" id="flat-peak">
          <h2>Flat Peak / Snapback</h2>
          <div class="shape-section__grid">
            <div>
              <p style="font-size:0.95rem;color:#555;line-height:1.8;margin-bottom:1rem;">The urban-style cap with a flat, uncurved peak and structured high crown. Snap closure at back. Bold silhouette associated with streetwear, hip-hop culture, and youth fashion.</p>
              <p style="font-size:0.95rem;color:#555;line-height:1.8;margin-bottom:1rem;">The large, flat front panel provides an excellent surface for oversized logos, patches, and detailed embroidery. The rigid structure makes hooping straightforward.</p>
              <ul class="shape-features">
                <li>Flat, uncurved peak</li>
                <li>High-profile structured crown</li>
                <li>Plastic snap closure</li>
                <li>Green or contrasting underbill</li>
                <li>Oversized front branding area</li>
              </ul>
              <p style="font-size:0.85rem;color:#555;"><strong>Recommended products:</strong> B610, B615, B660</p>
            </div>
            <div class="shape-section__visual">Flat peak silhouette</div>
          </div>
        </div>

        <div class="shape-section" id="army">
          <h2>Army / Cadet Cap</h2>
          <div class="shape-section__grid">
            <div>
              <p style="font-size:0.95rem;color:#555;line-height:1.8;margin-bottom:1rem;">Military-inspired cap with a flat top, short peak, and structured crown. Also known as a cadet cap, patrol cap, or castro cap. Clean, angular silhouette.</p>
              <p style="font-size:0.95rem;color:#555;line-height:1.8;margin-bottom:1rem;">The flat front panel sits slightly forward, providing a unique decoration angle. Works particularly well with centred logos and military-style patch applications.</p>
              <ul class="shape-features">
                <li>Flat-top, angular crown</li>
                <li>Short, straight peak</li>
                <li>Structured construction</li>
                <li>Front-centre decoration area</li>
                <li>Great for woven patches and badges</li>
              </ul>
              <p style="font-size:0.85rem;color:#555;"><strong>Recommended products:</strong> B34, B33</p>
            </div>
            <div class="shape-section__visual">Army cap silhouette</div>
          </div>
        </div>

        <div class="shape-section" id="camper">
          <h2>Camper Cap</h2>
          <div class="shape-section__grid">
            <div>
              <p style="font-size:0.95rem;color:#555;line-height:1.8;margin-bottom:1rem;">A minimalist 5-panel cap with a flat or slightly curved short peak and shallow crown. Clean lines, no top button. The aesthetic is understated and contemporary.</p>
              <p style="font-size:0.95rem;color:#555;line-height:1.8;margin-bottom:1rem;">Popular with outdoor brands, surf labels, and lifestyle brands that want a more refined, less sporty look than a traditional baseball cap.</p>
              <ul class="shape-features">
                <li>5-panel construction</li>
                <li>Shallow, minimalist crown</li>
                <li>Short, flat peak</li>
                <li>No top button</li>
                <li>Nylon or cotton construction</li>
                <li>Often features a nylon strapback closure</li>
              </ul>
              <p style="font-size:0.85rem;color:#555;"><strong>Recommended products:</strong> B694, B691</p>
            </div>
            <div class="shape-section__visual">Camper cap silhouette</div>
          </div>
        </div>

        <div class="shape-section" id="visor">
          <h2>Visor</h2>
          <div class="shape-section__grid">
            <div>
              <p style="font-size:0.95rem;color:#555;line-height:1.8;margin-bottom:1rem;">An open-top headband with a peak. No crown — the top of the head is exposed. Popular for sport (tennis, golf), outdoor activities, and promotional use.</p>
              <p style="font-size:0.95rem;color:#555;line-height:1.8;margin-bottom:1rem;">The front band provides a focused decoration area. Embroidery must account for the curved, relatively narrow surface.</p>
              <ul class="shape-features">
                <li>Open-top design</li>
                <li>Elasticated or adjustable band</li>
                <li>Curved or flat peak</li>
                <li>Lightweight construction</li>
                <li>Narrow front decoration area</li>
              </ul>
              <p style="font-size:0.85rem;color:#555;"><strong>Recommended products:</strong> B41</p>
            </div>
            <div class="shape-section__visual">Visor silhouette</div>
          </div>
        </div>

        <div class="shape-section" id="flat-cap">
          <h2>Flat Cap / Ivy Cap</h2>
          <div class="shape-section__grid">
            <div>
              <p style="font-size:0.95rem;color:#555;line-height:1.8;margin-bottom:1rem;">A traditional British style with a rounded, low-profile crown and short front peak. Often made from wool, tweed, or linen. Classic, heritage aesthetic.</p>
              <p style="font-size:0.95rem;color:#555;line-height:1.8;margin-bottom:1rem;">Decoration options are more limited due to the construction — embroidery on the side panel is the most common approach. Woven labels and leather patches also work well.</p>
              <ul class="shape-features">
                <li>Rounded, low-profile crown</li>
                <li>Short, integrated peak</li>
                <li>Heritage/traditional aesthetic</li>
                <li>Wool, tweed, or cotton construction</li>
                <li>Side-panel embroidery preferred</li>
              </ul>
              <p style="font-size:0.85rem;color:#555;"><strong>Recommended products:</strong> B623, B626</p>
            </div>
            <div class="shape-section__visual">Flat cap silhouette</div>
          </div>
        </div>
      </div>
    </section>

    <section class="ed-cta">
      <h2>Browse the Full Range</h2>
      <p>See every Beechfield cap shape in our product range.</p>
      <a href="../../../products/caps/" class="btn btn--primary">Shop Caps</a>
    </section>`
});


// --- Branding & Decoration Guide ---
GUIDE_PAGES.push({
  file: 'cap-studio/guides/branding-decoration.html',
  title: 'Branding & Decoration Guide',
  description: 'A comprehensive guide to decoration placement zones, method selection, and design tips for Beechfield headwear.',
  heroColor: '#1f614d',
  heroH1: 'Branding &amp; Decoration.',
  heroSubtitle: 'Maximise your brand impact with strategic decoration placement, the right technique for each zone, and design optimisation tips.',
  breadcrumbHtml: '<a href="../../../">Home</a> / <a href="../../cap-studio/">Cap Studio</a> / <a href="./">Guides</a> / Branding &amp; Decoration',
  activeNav: 'cap-studio', depth: 3,
  bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <h2 style="text-align:center;margin-bottom:0.5rem;">Decoration Zones</h2>
        <p style="text-align:center;max-width:600px;margin:0 auto 2.5rem;color:#555;">Every cap has four primary decoration zones. Each offers different sizes, visibility, and method compatibility.</p>
        <div class="zone-grid">
          <div class="zone-card">
            <div class="zone-card__visual">F</div>
            <h3>Front Panel</h3>
            <p>The primary branding zone. Maximum visibility. Largest decoration area (up to 90mm H × 130mm W on 5-panel caps). Compatible with all decoration methods.</p>
          </div>
          <div class="zone-card">
            <div class="zone-card__visual">S</div>
            <h3>Side Panels</h3>
            <p>Secondary branding. Left or right panel. Ideal for smaller logos, initials, or icons. Typical max: 40mm × 40mm. Best for embroidery and small transfers.</p>
          </div>
          <div class="zone-card">
            <div class="zone-card__visual">B</div>
            <h3>Back Panel</h3>
            <p>Tertiary branding above the closure. Suitable for URLs, taglines, or small logos. Typical max: 25mm H × 60mm W. Embroidery, transfer, or screen print.</p>
          </div>
          <div class="zone-card">
            <div class="zone-card__visual">P</div>
            <h3>Peak / Underbill</h3>
            <p>Premium accent zone. Peak-top (laser/deboss) or underbill (embroidery/print). Subtle, reveal-on-removal branding. Max: 30mm × 50mm.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="ed-section ed-section--alt">
      <div class="container">
        <h2 style="text-align:center;margin-bottom:2rem;">Method × Zone Compatibility</h2>
        <div style="overflow-x:auto;">
          <table class="method-matrix">
            <thead>
              <tr>
                <th>Method</th>
                <th>Front Panel</th>
                <th>Side Panel</th>
                <th>Back Panel</th>
                <th>Peak Top</th>
                <th>Underbill</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Embroidery</strong></td>
                <td class="yes">Excellent</td>
                <td class="yes">Good</td>
                <td class="yes">Good</td>
                <td class="no">—</td>
                <td class="yes">Good</td>
              </tr>
              <tr>
                <td><strong>Transfer / DTG</strong></td>
                <td class="yes">Excellent</td>
                <td class="yes">Good</td>
                <td class="yes">Good</td>
                <td class="no">—</td>
                <td class="yes">Good</td>
              </tr>
              <tr>
                <td><strong>Screen Print</strong></td>
                <td class="yes">Excellent</td>
                <td class="yes">Good</td>
                <td class="yes">Good</td>
                <td class="no">—</td>
                <td class="no">—</td>
              </tr>
              <tr>
                <td><strong>Patches</strong></td>
                <td class="yes">Excellent</td>
                <td class="yes">Good</td>
                <td class="no">—</td>
                <td class="no">—</td>
                <td class="no">—</td>
              </tr>
              <tr>
                <td><strong>Laser Engraving</strong></td>
                <td class="no">—</td>
                <td class="no">—</td>
                <td class="no">—</td>
                <td class="yes">Excellent</td>
                <td class="no">—</td>
              </tr>
              <tr>
                <td><strong>Deboss / Foil</strong></td>
                <td class="yes">Good</td>
                <td class="no">—</td>
                <td class="yes">Good</td>
                <td class="yes">Good</td>
                <td class="no">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="ed-section">
      <div class="container">
        <h2 style="text-align:center;margin-bottom:2rem;">Design Tips</h2>
        <div class="ed-technique">
          <div class="ed-technique-card">
            <h3>Size Your Artwork Correctly</h3>
            <p>Always design to the maximum recommended area for your chosen zone. Leaving some margin (5mm on all sides) prevents the design from running into seams or eyelets. For embroidery, remember that stitch width adds approximately 2mm per side.</p>
          </div>
          <div class="ed-technique-card">
            <h3>Thread Count Considerations</h3>
            <p>High stitch-count designs (10,000+) look premium but take longer to produce and can stiffen the fabric. For everyday branding, 5,000-8,000 stitches delivers excellent results. Bold, simple logos with filled areas embroider better than intricate line work.</p>
          </div>
          <div class="ed-technique-card">
            <h3>Colour Matching</h3>
            <p>Match your thread or ink colours to the cap colour for complementary branding. White and light thread on dark caps provides maximum contrast and visibility. Request a sew-out or print sample before committing to production runs.</p>
          </div>
          <div class="ed-technique-card">
            <h3>Multi-Position Branding</h3>
            <p>Combining front embroidery with a side icon and back URL creates a professional, multi-angle brand presence. Keep secondary positions simple and complementary to avoid visual clutter.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="ed-section ed-section--alt">
      <div class="container" style="text-align:center;">
        <h2 style="margin-bottom:1rem;">Learn the Techniques</h2>
        <p style="max-width:600px;margin:0 auto 2rem;color:#555;">Dive deeper into each decoration method with our Decorator Academy technique pages.</p>
        <a href="../../../decoration/embroidery.html" class="btn btn--primary" style="margin:0.25rem;">Embroidery</a>
        <a href="../../../decoration/transfer.html" class="btn btn--primary" style="margin:0.25rem;">Transfer</a>
        <a href="../../../decoration/patches.html" class="btn btn--primary" style="margin:0.25rem;">Patches</a>
        <a href="../../../decoration/screen-print.html" class="btn btn--primary" style="margin:0.25rem;">Screen Print</a>
        <a href="../../../decoration/laser.html" class="btn btn--primary" style="margin:0.25rem;">Laser</a>
      </div>
    </section>`
});

// --- Materials Guide ---
GUIDE_PAGES.push({
  file: 'cap-studio/guides/materials.html',
  title: 'Materials & Fabrics Guide',
  description: 'A guide to headwear materials: cotton twill, polyester, recycled poly, organic cotton, nylon, corduroy, fleece, mesh, and more.',
  heroColor: '#333',
  heroH1: 'Materials &amp; Fabrics.',
  heroSubtitle: 'From cotton twill to recycled polyester — understand the properties, decoration compatibility, and sustainability credentials of every fabric in the Beechfield range.',
  breadcrumbHtml: '<a href="../../../">Home</a> / <a href="../../cap-studio/">Cap Studio</a> / <a href="./">Guides</a> / Materials',
  activeNav: 'cap-studio', depth: 3,
  bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <div class="material-card">
          <h3>Cotton Twill</h3>
          <div class="material-card__props">
            <span class="material-card__prop">200-260 GSM</span>
            <span class="material-card__prop">Natural Fibre</span>
            <span class="material-card__prop">Breathable</span>
          </div>
          <p>The classic cap fabric. A tightly woven cotton with a diagonal rib pattern that provides excellent structure, durability, and a smooth surface for decoration. Available in heavy-brushed, peach-finished, and standard twill variants.</p>
          <p><strong>Decoration:</strong> Excellent for embroidery (stable, minimal puckering), transfer, screen print, and DTG. The natural fibre absorbs ink well for vibrant print colours.</p>
          <p><strong>Care:</strong> Machine washable at 30°C. May shrink slightly on first wash. Iron on medium. Colourfast.</p>
        </div>

        <div class="material-card">
          <h3>Brushed Cotton</h3>
          <div class="material-card__props">
            <span class="material-card__prop">200-230 GSM</span>
            <span class="material-card__prop">Soft Finish</span>
            <span class="material-card__prop">Premium Feel</span>
          </div>
          <p>Cotton twill that has been mechanically brushed to raise the fibre surface, creating a soft, velvety hand-feel. Popular for dad hats and relaxed-fit styles where comfort is paramount.</p>
          <p><strong>Decoration:</strong> Excellent for embroidery. The brushed surface can slightly affect transfer adhesion — test samples recommended for heat-applied methods.</p>
          <p><strong>Care:</strong> Machine washable at 30°C. Fabric will continue to soften with washing, enhancing the vintage aesthetic.</p>
        </div>

        <div class="material-card">
          <h3>Polyester</h3>
          <div class="material-card__props">
            <span class="material-card__prop">150-200 GSM</span>
            <span class="material-card__prop">Synthetic</span>
            <span class="material-card__prop">Quick-Dry</span>
            <span class="material-card__prop">Colourfast</span>
          </div>
          <p>Lightweight, durable synthetic fibre with excellent colour retention and moisture-wicking properties. The go-to choice for performance and sports headwear. Does not shrink or wrinkle.</p>
          <p><strong>Decoration:</strong> Good for embroidery (use appropriate stabiliser). Excellent for sublimation printing. Heat transfers require lower temperatures than cotton to avoid melting.</p>
          <p><strong>Care:</strong> Machine washable at 40°C. Quick drying. Do not iron at high temperatures.</p>
        </div>

        <div class="material-card">
          <h3>Recycled Polyester</h3>
          <div class="material-card__props">
            <span class="material-card__prop">150-200 GSM</span>
            <span class="material-card__prop">Recycled Content</span>
            <span class="material-card__prop">EarthAware®</span>
          </div>
          <p>Polyester fibre made from recycled PET plastic bottles. Same performance properties as virgin polyester but with significantly reduced environmental impact. Used in Beechfield's EarthAware® range.</p>
          <p><strong>Decoration:</strong> Identical to standard polyester — same methods, same settings, same results. The recycled content has no impact on decoration quality.</p>
          <p><strong>Sustainability:</strong> Each cap uses approximately 3-5 recycled PET bottles. GRS (Global Recycled Standard) certified. Audited supply chain.</p>
        </div>

        <div class="material-card">
          <h3>Organic Cotton</h3>
          <div class="material-card__props">
            <span class="material-card__prop">200-240 GSM</span>
            <span class="material-card__prop">Organic</span>
            <span class="material-card__prop">EarthAware®</span>
          </div>
          <p>Cotton grown without synthetic pesticides, herbicides, or fertilisers. Certified to OCS (Organic Content Standard) or GOTS. Slightly softer hand-feel than conventional cotton.</p>
          <p><strong>Decoration:</strong> Identical to standard cotton twill. All decoration methods work perfectly. No difference in embroidery or print quality.</p>
          <p><strong>Sustainability:</strong> Reduced water usage, no toxic chemicals, healthier soil. Part of Beechfield's EarthAware® sustainability programme.</p>
        </div>

        <div class="material-card">
          <h3>Nylon / Ripstop</h3>
          <div class="material-card__props">
            <span class="material-card__prop">80-150 GSM</span>
            <span class="material-card__prop">Lightweight</span>
            <span class="material-card__prop">Water-Resistant</span>
            <span class="material-card__prop">Packable</span>
          </div>
          <p>Strong, lightweight synthetic fabric. Ripstop variants have a reinforcing grid woven in to prevent tear propagation. Used in outdoor, performance, and camper-style caps.</p>
          <p><strong>Decoration:</strong> Good for embroidery with lightweight stabiliser. Excellent for heat transfer. Screen print is possible but the smooth surface requires careful ink selection. Not suitable for DTG.</p>
          <p><strong>Care:</strong> Machine washable. Air dry recommended. Very quick drying. Packable without creasing.</p>
        </div>

        <div class="material-card">
          <h3>Corduroy</h3>
          <div class="material-card__props">
            <span class="material-card__prop">250-300 GSM</span>
            <span class="material-card__prop">Textured</span>
            <span class="material-card__prop">Heritage Feel</span>
          </div>
          <p>A distinctive ribbed (waled) fabric with a vintage, tactile aesthetic. Available in fine-wale (pinwale) and wide-wale variants. Popular for dad hats and heritage-style caps.</p>
          <p><strong>Decoration:</strong> Good for embroidery — the ribs can cause slight registration variation on very fine details, so bold designs work best. Patches and woven labels are excellent alternatives.</p>
          <p><strong>Care:</strong> Machine washable at 30°C. Iron on reverse. Brush with a soft brush to maintain nap direction.</p>
        </div>

        <div class="material-card">
          <h3>Fleece / Suprafleece®</h3>
          <div class="material-card__props">
            <span class="material-card__prop">200-300 GSM</span>
            <span class="material-card__prop">Warm</span>
            <span class="material-card__prop">Anti-Pill</span>
          </div>
          <p>Soft, warm polyester fabric used in winter headwear. Beechfield's Suprafleece® is an anti-pill variant that maintains a smooth surface even after repeated washing and wear.</p>
          <p><strong>Decoration:</strong> Embroidery works well with cut-away stabiliser. Heat transfer is good on the smooth surface. The fabric's stretch must be accounted for during hooping.</p>
          <p><strong>Care:</strong> Machine washable at 40°C. Do not tumble dry at high heat. Do not iron directly.</p>
        </div>

        <div class="material-card">
          <h3>Mesh</h3>
          <div class="material-card__props">
            <span class="material-card__prop">100-150 GSM</span>
            <span class="material-card__prop">Breathable</span>
            <span class="material-card__prop">Lightweight</span>
          </div>
          <p>Open-weave polyester fabric used for trucker cap back panels. Provides maximum ventilation. Available in various densities from fine to coarse mesh.</p>
          <p><strong>Decoration:</strong> Mesh panels are generally not decorated. If required, patches are the best option as they cover the open weave. Embroidery on mesh requires heavy stabiliser backing.</p>
          <p><strong>Care:</strong> Machine washable. Very quick drying. Shape may deform at high temperatures.</p>
        </div>
      </div>
    </section>

    <section class="ed-section ed-section--alt">
      <div class="container">
        <h2 style="text-align:center;margin-bottom:2rem;">Decoration Compatibility by Material</h2>
        <div style="overflow-x:auto;">
          <table class="method-matrix">
            <thead>
              <tr>
                <th>Material</th>
                <th>Embroidery</th>
                <th>Transfer</th>
                <th>Screen Print</th>
                <th>DTG</th>
                <th>Patches</th>
                <th>Laser</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><strong>Cotton Twill</strong></td><td class="yes">★★★</td><td class="yes">★★★</td><td class="yes">★★★</td><td class="yes">★★★</td><td class="yes">★★★</td><td class="no">—</td></tr>
              <tr><td><strong>Brushed Cotton</strong></td><td class="yes">★★★</td><td class="yes">★★</td><td class="yes">★★</td><td class="yes">★★★</td><td class="yes">★★★</td><td class="no">—</td></tr>
              <tr><td><strong>Polyester</strong></td><td class="yes">★★★</td><td class="yes">★★</td><td class="yes">★★</td><td class="no">—</td><td class="yes">★★★</td><td class="no">—</td></tr>
              <tr><td><strong>Nylon/Ripstop</strong></td><td class="yes">★★</td><td class="yes">★★★</td><td class="yes">★★</td><td class="no">—</td><td class="yes">★★</td><td class="no">—</td></tr>
              <tr><td><strong>Corduroy</strong></td><td class="yes">★★</td><td class="yes">★</td><td class="no">—</td><td class="no">—</td><td class="yes">★★★</td><td class="no">—</td></tr>
              <tr><td><strong>Fleece</strong></td><td class="yes">★★</td><td class="yes">★★</td><td class="no">—</td><td class="no">—</td><td class="yes">★★</td><td class="no">—</td></tr>
              <tr><td><strong>Mesh</strong></td><td class="no">—</td><td class="no">—</td><td class="no">—</td><td class="no">—</td><td class="yes">★★</td><td class="no">—</td></tr>
              <tr><td><strong>Suede/Leather</strong></td><td class="no">—</td><td class="no">—</td><td class="no">—</td><td class="no">—</td><td class="no">—</td><td class="yes">★★★</td></tr>
            </tbody>
          </table>
        </div>
        <p style="text-align:center;font-size:0.8rem;color:#888;margin-top:1rem;">★★★ = Excellent | ★★ = Good | ★ = Possible with care | — = Not recommended</p>
      </div>
    </section>

    <section class="ed-cta">
      <h2>See Materials In-Person</h2>
      <p>Nothing beats touching the fabric. Order swatches from your Beechfield distributor or visit our full materials guide.</p>
      <a href="../../../about/materials-and-fabrics.html" class="btn btn--primary" style="margin-right:0.5rem;">Materials &amp; Fabrics</a>
      <a href="../../../where-to-buy/" class="btn btn--accent">Find a Distributor</a>
    </section>`
});


// ═══════════════════════════════════════════════════════════════
// MARKETING CENTRE PAGES (depth=2)
// ═══════════════════════════════════════════════════════════════

const MARKETING_PAGES = [];

// --- Marketing Centre Hub ---
MARKETING_PAGES.push({
  file: 'marketing-centre/index.html',
  title: 'Marketing Centre',
  description: 'Access Beechfield marketing resources: asset library, campaign toolkits, product documents, templates, and brand guidelines.',
  heroColor: '#0e1520',
  heroH1: 'Marketing Centre.',
  heroSubtitle: 'Your hub for Beechfield marketing resources — product photography, campaign assets, brand guidelines, and sales tools to help you sell more headwear.',
  breadcrumbHtml: '<a href="../../">Home</a> / Marketing Centre',
  activeNav: 'about', depth: 2,
  bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-grid">
          <a href="library.html" class="ed-card" style="text-decoration:none;color:inherit;">
            <div class="ed-card__img">Asset Library</div>
            <div class="ed-card__body">
              <h3>Asset Library</h3>
              <p>Product photography, lifestyle images, logos, social media assets, point-of-sale materials, and video content — all ready to download.</p>
            </div>
          </a>
          <a href="campaign-toolkits.html" class="ed-card" style="text-decoration:none;color:inherit;">
            <div class="ed-card__img">Campaign Toolkits</div>
            <div class="ed-card__body">
              <h3>Campaign Toolkits</h3>
              <p>Seasonal and thematic campaign packages with ready-to-use creative assets, messaging guides, and social media content calendars.</p>
            </div>
          </a>
          <a href="product-documents.html" class="ed-card" style="text-decoration:none;color:inherit;">
            <div class="ed-card__img">Product Documents</div>
            <div class="ed-card__body">
              <h3>Product Documents</h3>
              <p>Specification sheets, colour charts, size guides, care instructions, decoration guides, and sustainability certifications for every product.</p>
            </div>
          </a>
          <a href="templates-guidelines.html" class="ed-card" style="text-decoration:none;color:inherit;">
            <div class="ed-card__img">Templates &amp; Guidelines</div>
            <div class="ed-card__body">
              <h3>Templates &amp; Guidelines</h3>
              <p>Brand guidelines, co-branding rules, and downloadable templates for social media, email, print, and point-of-sale materials.</p>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="ed-section ed-section--alt">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>Partner Benefits</h2>
            <p>As a Beechfield partner, you get access to our full suite of marketing resources designed to help you sell more headwear. From product photography to campaign-ready creative assets, everything you need is in one place.</p>
            <p>Our marketing team regularly updates resources with new season content, ensuring you always have fresh, on-brand materials to work with.</p>
            <p>Don't have access yet? <a href="sign-up.html">Register for the Marketing Centre</a> to get started.</p>
          </div>
          <div class="ed-split__img">Partner marketing support</div>
        </div>
      </div>
    </section>

    <section class="ed-cta">
      <h2>Need Access?</h2>
      <p>Register for the Marketing Centre to unlock all resources, downloads, and campaign materials.</p>
      <a href="sign-up.html" class="btn btn--accent">Request Access</a>
    </section>`
});

// --- Sign Up ---
MARKETING_PAGES.push({
  file: 'marketing-centre/sign-up.html',
  title: 'Marketing Centre — Sign Up',
  description: 'Register for access to the Beechfield Marketing Centre and unlock product photography, campaign assets, and brand resources.',
  heroColor: '#1f614d',
  heroH1: 'Request Access.',
  heroSubtitle: 'Fill in the form below to request access to the Beechfield Marketing Centre. We will review your application and get back to you within 2 working days.',
  breadcrumbHtml: '<a href="../../">Home</a> / <a href="./">Marketing Centre</a> / Sign Up',
  activeNav: 'about', depth: 2,
  bodyHtml: `
    <section class="ed-section">
      <div class="container" style="max-width:600px;">
        <form action="#" method="post" style="background:#fff;padding:2rem;border-radius:8px;border:1px solid #e8e4dc;">
          <div class="form-group">
            <label for="mc-name">Full Name *</label>
            <input type="text" id="mc-name" name="name" placeholder="Your full name" required>
          </div>
          <div class="form-group">
            <label for="mc-company">Company / Business Name *</label>
            <input type="text" id="mc-company" name="company" placeholder="Your business name" required>
          </div>
          <div class="form-group">
            <label for="mc-email">Business Email *</label>
            <input type="email" id="mc-email" name="email" placeholder="you@company.com" required>
          </div>
          <div class="form-group">
            <label for="mc-phone">Phone Number</label>
            <input type="tel" id="mc-phone" name="phone" placeholder="+44 1234 567890">
          </div>
          <div class="form-group">
            <label for="mc-distributor">Your Beechfield Distributor</label>
            <select id="mc-distributor" name="distributor">
              <option value="">Select your distributor...</option>
              <option value="direct">I buy direct</option>
              <option value="unknown">I don't know my distributor</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="form-group">
            <label>Areas of Interest</label>
            <div class="checkbox-group">
              <label><input type="checkbox" name="interest" value="photography"> Product Photography</label>
              <label><input type="checkbox" name="interest" value="lifestyle"> Lifestyle Images</label>
              <label><input type="checkbox" name="interest" value="campaigns"> Campaign Assets</label>
              <label><input type="checkbox" name="interest" value="specs"> Product Specs</label>
              <label><input type="checkbox" name="interest" value="social"> Social Media</label>
              <label><input type="checkbox" name="interest" value="pos"> Point of Sale</label>
            </div>
          </div>
          <div class="form-group" style="margin-top:1.5rem;">
            <label style="font-weight:400;font-size:0.85rem;color:#555;display:flex;align-items:flex-start;gap:0.5rem;">
              <input type="checkbox" name="terms" required style="margin-top:0.15rem;width:auto;">
              I agree to the Beechfield Marketing Centre terms of use and understand that access is subject to approval.
            </label>
          </div>
          <button type="submit" class="btn btn--accent" style="width:100%;text-align:center;margin-top:0.5rem;">Submit Application</button>
        </form>
      </div>
    </section>`
});

// --- Asset Library ---
MARKETING_PAGES.push({
  file: 'marketing-centre/library.html',
  title: 'Asset Library',
  description: 'Download Beechfield product photography, lifestyle images, logos, social media assets, and video content.',
  heroColor: '#1b2a4a',
  heroH1: 'Asset Library.',
  heroSubtitle: 'Browse and download high-resolution product photography, lifestyle imagery, logos, social media assets, and video content.',
  breadcrumbHtml: '<a href="../../">Home</a> / <a href="./">Marketing Centre</a> / Asset Library',
  activeNav: 'about', depth: 2,
  bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-grid">
          <div class="ed-card">
            <div class="ed-card__img">Product Photography</div>
            <div class="ed-card__body">
              <h3>Product Photography</h3>
              <p>High-resolution packshot images on white background for every product in the Beechfield range. Available in multiple angles: front, side, back, detail, and flat-lay.</p>
              <p style="font-size:0.8rem;color:#888;">248 products • JPEG & PNG • Up to 3000×3000px</p>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__img">Lifestyle Images</div>
            <div class="ed-card__body">
              <h3>Lifestyle Images</h3>
              <p>Professionally shot lifestyle photography featuring Beechfield headwear in real-world settings — outdoor, urban, sport, workwear, and casual lifestyle contexts.</p>
              <p style="font-size:0.8rem;color:#888;">500+ images • JPEG • Up to 5000×3333px</p>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__img">Logos &amp; Branding</div>
            <div class="ed-card__body">
              <h3>Logos &amp; Branding</h3>
              <p>Beechfield brand logos in all formats and colour variants. Primary, secondary, icon, and wordmark versions. Includes EarthAware® and collection-specific logos.</p>
              <p style="font-size:0.8rem;color:#888;">AI, EPS, SVG, PNG formats</p>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__img">Social Media</div>
            <div class="ed-card__body">
              <h3>Social Media Assets</h3>
              <p>Pre-designed social media content sized for Instagram, Facebook, LinkedIn, and TikTok. Product features, styling tips, and seasonal campaign posts ready to publish.</p>
              <p style="font-size:0.8rem;color:#888;">JPEG & MP4 • Multiple aspect ratios</p>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__img">Point of Sale</div>
            <div class="ed-card__body">
              <h3>Point of Sale Materials</h3>
              <p>Shelf talkers, hang tags, display headers, counter cards, and window graphics for retail environments. Customisable templates available.</p>
              <p style="font-size:0.8rem;color:#888;">PDF & AI formats • Print-ready</p>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__img">Video Content</div>
            <div class="ed-card__body">
              <h3>Video Content</h3>
              <p>Product showcase videos, lookbook trailers, decoration tutorials, and brand story content. Ready for website embedding, social media, and presentations.</p>
              <p style="font-size:0.8rem;color:#888;">MP4 • 1080p & 4K • Various lengths</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="ed-section ed-section--alt">
      <div class="container" style="max-width:700px; text-align:center;">
        <h2>Usage Guidelines</h2>
        <p style="color:#555;line-height:1.8;">All assets are provided for use by authorised Beechfield partners for the promotion and sale of Beechfield products. Assets must not be altered, recoloured, or used in conjunction with competing brands without prior written approval. For custom asset requests or high-resolution originals, please contact the Beechfield marketing team.</p>
        <a href="../../resources/contact.html" class="btn btn--primary" style="margin-top:1.5rem;">Contact Marketing Team</a>
      </div>
    </section>`
});

// --- Campaign Toolkits ---
MARKETING_PAGES.push({
  file: 'marketing-centre/campaign-toolkits.html',
  title: 'Campaign Toolkits',
  description: 'Download ready-to-use Beechfield campaign toolkits with creative assets, messaging guides, and social media calendars.',
  heroColor: '#0e1520',
  heroH1: 'Campaign Toolkits.',
  heroSubtitle: 'Ready-made campaign packages with creative assets, messaging frameworks, and social content calendars for every season.',
  breadcrumbHtml: '<a href="../../">Home</a> / <a href="./">Marketing Centre</a> / Campaign Toolkits',
  activeNav: 'about', depth: 2,
  bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-grid">
          <div class="ed-card">
            <div class="ed-card__img" style="background:#e8f5e9;">Spring/Summer 2026</div>
            <div class="ed-card__body">
              <h3>Spring/Summer 2026 Collection Launch</h3>
              <p>Full campaign toolkit for the SS26 collection launch. Includes hero images, social media content (30 posts), email templates, and press release draft.</p>
              <a href="#" class="btn btn--accent" style="margin-top:0.75rem;font-size:0.85rem;padding:0.6rem 1.2rem;">Download Toolkit</a>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__img" style="background:#fff3e0;">Festival Season</div>
            <div class="ed-card__body">
              <h3>Festival Season Campaign</h3>
              <p>Target festival-goers and event organisers. Features bucket hats, trucker caps, and beanies. Includes festival styling guide and social content.</p>
              <a href="#" class="btn btn--accent" style="margin-top:0.75rem;font-size:0.85rem;padding:0.6rem 1.2rem;">Download Toolkit</a>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__img" style="background:#e3f2fd;">Back to School</div>
            <div class="ed-card__body">
              <h3>Back to School / University</h3>
              <p>Campaign assets for educational institution merchandise. Focuses on bulk-order decorated caps and beanies for schools, colleges, and universities.</p>
              <a href="#" class="btn btn--accent" style="margin-top:0.75rem;font-size:0.85rem;padding:0.6rem 1.2rem;">Download Toolkit</a>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__img" style="background:#fce4ec;">Corporate Gifting</div>
            <div class="ed-card__body">
              <h3>Corporate Gifting Guide</h3>
              <p>Positioning Beechfield headwear as premium corporate gifts. Includes product recommendations by price point, decoration ideas, and presentation options.</p>
              <a href="#" class="btn btn--accent" style="margin-top:0.75rem;font-size:0.85rem;padding:0.6rem 1.2rem;">Download Toolkit</a>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__img" style="background:#e0f2f1;">EarthAware®</div>
            <div class="ed-card__body">
              <h3>EarthAware® Sustainability</h3>
              <p>Campaign toolkit focused on the EarthAware® sustainable range. Includes certification details, sustainability messaging, and eco-conscious branding assets.</p>
              <a href="#" class="btn btn--accent" style="margin-top:0.75rem;font-size:0.85rem;padding:0.6rem 1.2rem;">Download Toolkit</a>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__img" style="background:#f3e5f5;">Winter Warmers</div>
            <div class="ed-card__body">
              <h3>Winter Warmers Campaign</h3>
              <p>Autumn/winter campaign highlighting beanies, fleece headwear, and cold-weather accessories. Includes cosy lifestyle imagery and gifting angle content.</p>
              <a href="#" class="btn btn--accent" style="margin-top:0.75rem;font-size:0.85rem;padding:0.6rem 1.2rem;">Download Toolkit</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="ed-section ed-section--alt">
      <div class="container" style="text-align:center;max-width:600px;">
        <h2>Request a Custom Campaign</h2>
        <p style="color:#555;line-height:1.8;">Need a bespoke campaign toolkit for a specific market, event, or product focus? Our marketing team can create custom campaign packages tailored to your needs.</p>
        <a href="../../resources/contact.html" class="btn btn--primary" style="margin-top:1rem;">Contact Marketing</a>
      </div>
    </section>`
});

// --- Product Documents ---
MARKETING_PAGES.push({
  file: 'marketing-centre/product-documents.html',
  title: 'Product Documents',
  description: 'Download Beechfield product specification sheets, colour charts, size guides, care instructions, and decoration guides.',
  heroColor: '#333',
  heroH1: 'Product Documents.',
  heroSubtitle: 'Specification sheets, colour charts, size guides, care instructions, and decoration guides for every product in the range.',
  breadcrumbHtml: '<a href="../../">Home</a> / <a href="./">Marketing Centre</a> / Product Documents',
  activeNav: 'about', depth: 2,
  bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-grid">
          <div class="ed-card">
            <div class="ed-card__body">
              <h3>Specification Sheets</h3>
              <p>Full product specifications for every Beechfield product: dimensions, weight, fabric composition, construction details, decoration areas, and available colours.</p>
              <p style="font-size:0.8rem;color:#888;">PDF format • Updated quarterly</p>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__body">
              <h3>Colour Charts</h3>
              <p>Complete colour reference charts showing all available colourways across the range. Includes Pantone references, fabric swatches, and colour availability by product.</p>
              <p style="font-size:0.8rem;color:#888;">PDF format • Season-specific</p>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__body">
              <h3>Size Guides</h3>
              <p>Detailed size guides with head circumference measurements, adjustment ranges, and fit advice for every product style. Includes children's sizing.</p>
              <p style="font-size:0.8rem;color:#888;">PDF format</p>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__body">
              <h3>Care Instructions</h3>
              <p>Washing, drying, and care guidance by fabric type. Includes post-decoration care advice for embroidered, printed, and patched products.</p>
              <p style="font-size:0.8rem;color:#888;">PDF format</p>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__body">
              <h3>Decoration Guides</h3>
              <p>Product-specific decoration area templates with exact measurements, recommended methods, and placement guidelines for front, side, back, and peak zones.</p>
              <p style="font-size:0.8rem;color:#888;">PDF & AI format</p>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__body">
              <h3>Sustainability Certifications</h3>
              <p>EarthAware® range certifications: GRS (Global Recycled Standard), OCS (Organic Content Standard), and supply chain audit documentation.</p>
              <p style="font-size:0.8rem;color:#888;">PDF format</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="ed-cta">
      <h2>Need Something Specific?</h2>
      <p>Can't find the document you need? Our product team can provide custom specifications and documentation.</p>
      <a href="../../resources/contact.html" class="btn btn--primary">Contact Product Team</a>
    </section>`
});

// --- Templates & Guidelines ---
MARKETING_PAGES.push({
  file: 'marketing-centre/templates-guidelines.html',
  title: 'Templates & Brand Guidelines',
  description: 'Download Beechfield brand guidelines, co-branding rules, and ready-to-use templates for social media, email, print, and POS.',
  heroColor: '#1b2a4a',
  heroH1: 'Templates &amp; Guidelines.',
  heroSubtitle: 'Brand guidelines, co-branding rules, and downloadable templates to ensure your Beechfield marketing is always on-brand.',
  breadcrumbHtml: '<a href="../../">Home</a> / <a href="./">Marketing Centre</a> / Templates &amp; Guidelines',
  activeNav: 'about', depth: 2,
  bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>Brand Guidelines</h2>
            <p>Our brand guidelines ensure Beechfield is represented consistently across all touchpoints. The guidelines cover:</p>
            <p><strong>Logo Usage:</strong> Clear space, minimum sizes, acceptable colour variants, and placement rules for the Beechfield and EarthAware® logos.</p>
            <p><strong>Colour Palette:</strong> Primary, secondary, and accent colours with Pantone, CMYK, RGB, and HEX values.</p>
            <p><strong>Typography:</strong> Approved typefaces, weights, and usage hierarchy for headings, body text, and captions.</p>
            <p><strong>Photography:</strong> Image style guidelines for product, lifestyle, and editorial photography.</p>
          </div>
          <div class="ed-split__img">Brand guidelines preview</div>
        </div>
      </div>
    </section>

    <section class="ed-section ed-section--alt">
      <div class="container">
        <h2 style="text-align:center;margin-bottom:2rem;">Downloadable Templates</h2>
        <div class="ed-grid">
          <div class="ed-card">
            <div class="ed-card__body">
              <h3>Social Media Templates</h3>
              <p>Editable templates for Instagram posts, stories, carousels, Facebook covers, and LinkedIn posts. Layered PSD and Canva-compatible formats.</p>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__body">
              <h3>Email Templates</h3>
              <p>HTML email templates for product launches, promotional campaigns, and newsletters. Mobile-responsive with editable content blocks.</p>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__body">
              <h3>Print Templates</h3>
              <p>Print-ready templates for flyers, catalogues, price lists, and brochures. A4 and A5 formats with bleed marks and crop marks.</p>
            </div>
          </div>
          <div class="ed-card">
            <div class="ed-card__body">
              <h3>Point of Sale Templates</h3>
              <p>Shelf talkers, counter cards, window graphics, and display headers. Customisable with your business details and pricing.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="ed-section">
      <div class="container" style="max-width:700px;">
        <h2 style="text-align:center;margin-bottom:1.5rem;">Co-Branding Guidelines</h2>
        <p style="color:#555;line-height:1.8;margin-bottom:1rem;">When featuring your brand alongside Beechfield, please follow these co-branding rules:</p>
        <div class="ed-faq">
          <details open>
            <summary>Logo Placement</summary>
            <div class="answer">
              <p>The Beechfield logo should always appear in its approved form (no stretching, recolouring, or modification). Maintain the specified clear space around the logo. Your brand logo may appear alongside but should not overlap or crowd the Beechfield mark.</p>
            </div>
          </details>
          <details>
            <summary>Colour Usage</summary>
            <div class="answer">
              <p>You may use Beechfield brand colours in your materials, but they should complement — not replace — your own brand palette. The Beechfield green (#1f614d) and navy (#0e1520) are the primary brand colours.</p>
            </div>
          </details>
          <details>
            <summary>Product Claims</summary>
            <div class="answer">
              <p>Any claims about Beechfield products (sustainability, quality, specifications) must use approved language from our product documentation. Do not make claims that are not supported by official Beechfield materials.</p>
            </div>
          </details>
          <details>
            <summary>Approval Process</summary>
            <div class="answer">
              <p>All co-branded materials should be submitted to the Beechfield marketing team for approval before publication. Allow 5 working days for review. Submit to your distributor contact or via the contact form.</p>
            </div>
          </details>
        </div>
      </div>
    </section>`
});


// ═══════════════════════════════════════════════════════════════
// GENERATION
// ═══════════════════════════════════════════════════════════════

let generated = 0;

// Decorator Academy pages
for (const page of DECORATOR_PAGES) {
  const filePath = path.join(BASE, page.file);
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, pageShell(page), 'utf8');
  console.log(`  ${page.file}`);
  generated++;
}

// Technique redirect pages
for (const redir of REDIRECT_PAGES) {
  const filePath = path.join(BASE, redir.file);
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, redirectPage(redir.target, redir.label), 'utf8');
  console.log(`  ${redir.file} → ${redir.target}`);
  generated++;
}

// Cap Studio guide pages
for (const page of GUIDE_PAGES) {
  const filePath = path.join(BASE, page.file);
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, pageShell(page), 'utf8');
  console.log(`  ${page.file}`);
  generated++;
}

// Marketing Centre pages
for (const page of MARKETING_PAGES) {
  const filePath = path.join(BASE, page.file);
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, pageShell(page), 'utf8');
  console.log(`  ${page.file}`);
  generated++;
}

console.log(`\nGenerated ${generated} pages.`);

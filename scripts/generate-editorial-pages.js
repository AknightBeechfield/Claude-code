#!/usr/bin/env node
/**
 * Generate editorial content pages for Beechfield site
 * Creates: purpose pages, decoration technique pages, resources, where-to-buy, campaign pages
 */
const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'sites', 'beechfield');

// Common page shell — matches existing site template patterns
function pageShell({ title, description, breadcrumbHtml, heroColor, heroH1, heroSubtitle, bodyHtml, activeNav, cssPath }) {
  const rel = cssPath || '../../shared/css';
  const brandCss = cssPath ? '../css/brand.css' : '../css/brand.css';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Beechfield Original Headwear</title>
  <meta name="description" content="${description}">
  <link rel="stylesheet" href="${rel}/variables.css">
  <link rel="stylesheet" href="${rel}/reset.css">
  <link rel="stylesheet" href="${rel}/base.css">
  <link rel="stylesheet" href="${rel}/layout.css">
  <link rel="stylesheet" href="${rel}/components.css">
  <link rel="stylesheet" href="${rel}/navigation.css">
  <link rel="stylesheet" href="${rel}/footer.css">
  <link rel="stylesheet" href="${brandCss}">
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
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem; }
    .pc { background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid #e8e4dc; text-decoration: none; color: inherit; display: block; transition: box-shadow 0.2s; }
    .pc:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .pc__img { aspect-ratio: 1; background: #f5f5f5; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .pc__img img { width: 100%; height: 100%; object-fit: contain; }
    .pc__body { padding: 1rem; }
    .pc__name { font-weight: 600; font-size: 0.95rem; margin-bottom: 0.25rem; }
    .pc__sku { font-size: 0.8rem; color: #888; }
    @media (max-width: 768px) {
      .ed-split { grid-template-columns: 1fr; }
      .ed-split--reverse { direction: ltr; }
    }
  </style>
</head>
<body>

  <!-- Top bar -->
  <div class="top-bar" style="background:#0e1520;color:#fff;font-size:0.78rem;padding:0.5rem 0;">
    <div class="container" style="max-width:1200px;margin:0 auto;padding:0 1.5rem;display:flex;align-items:center;justify-content:space-between;">
      <nav aria-label="Beechfield Brands family" style="display:flex;align-items:center;gap:1rem;">
        <span style="opacity:0.6;font-size:0.72rem;text-transform:uppercase;letter-spacing:0.05em;">Our Brands</span>
        <div style="display:flex;gap:1rem;">
          <a href="../../beechfield-brands/" style="color:rgba(255,255,255,0.7);text-decoration:none;">Beechfield Brands</a>
          <a href="../" style="color:#fff;font-weight:600;text-decoration:none;">Beechfield</a>
          <a href="../../bagbase/" style="color:rgba(255,255,255,0.7);text-decoration:none;">BagBase</a>
          <a href="../../quadra/" style="color:rgba(255,255,255,0.7);text-decoration:none;">Quadra</a>
          <a href="../../westford-mill/" style="color:rgba(255,255,255,0.7);text-decoration:none;">Westford Mill</a>
        </div>
      </nav>
      <a href="../where-to-buy/find-a-distributor.html" style="color:rgba(255,255,255,0.7);text-decoration:none;font-size:0.78rem;">Find a Distributor</a>
    </div>
  </div>

  <!-- Header -->
  <header class="site-header" style="background:#fff;border-bottom:1px solid #e8e4dc;position:sticky;top:0;z-index:100;">
    <div class="container" style="max-width:1200px;margin:0 auto;padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;">
      <a href="../" style="font-size:1.25rem;font-weight:800;color:#0e1520;text-decoration:none;line-height:1.1;">Beechfield<span style="display:block;font-size:0.6rem;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;opacity:0.6;">Original Headwear</span></a>
      <nav aria-label="Main navigation">
        <ul style="display:flex;list-style:none;gap:0.25rem;">
          <li><a href="../products/" style="display:block;padding:0.5rem 0.85rem;color:#0e1520;text-decoration:none;font-size:0.9rem;font-weight:500;border-radius:4px;${activeNav === 'products' ? 'color:#1f614d;font-weight:700;' : ''}">Products</a></li>
          <li><a href="../collections/" style="display:block;padding:0.5rem 0.85rem;color:#0e1520;text-decoration:none;font-size:0.9rem;font-weight:500;border-radius:4px;${activeNav === 'collections' ? 'color:#1f614d;font-weight:700;' : ''}">Collections</a></li>
          <li><a href="../cap-studio/" style="display:block;padding:0.5rem 0.85rem;color:#0e1520;text-decoration:none;font-size:0.9rem;font-weight:500;border-radius:4px;${activeNav === 'cap-studio' ? 'color:#1f614d;font-weight:700;' : ''}">Cap Studio</a></li>
          <li><a href="../decorator-academy/" style="display:block;padding:0.5rem 0.85rem;color:#0e1520;text-decoration:none;font-size:0.9rem;font-weight:500;border-radius:4px;${activeNav === 'decorator-academy' ? 'color:#1f614d;font-weight:700;' : ''}">Decorator Academy</a></li>
          <li><a href="../resources/" style="display:block;padding:0.5rem 0.85rem;color:#0e1520;text-decoration:none;font-size:0.9rem;font-weight:500;border-radius:4px;${activeNav === 'resources' ? 'color:#1f614d;font-weight:700;' : ''}">Resources</a></li>
          <li><a href="../where-to-buy/" style="display:block;padding:0.5rem 0.85rem;color:#0e1520;text-decoration:none;font-size:0.9rem;font-weight:500;border-radius:4px;${activeNav === 'where-to-buy' ? 'color:#1f614d;font-weight:700;' : ''}">Where to Buy</a></li>
          <li><a href="../about/" style="display:block;padding:0.5rem 0.85rem;color:#0e1520;text-decoration:none;font-size:0.9rem;font-weight:500;border-radius:4px;${activeNav === 'about' ? 'color:#1f614d;font-weight:700;' : ''}">About</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main>
    <!-- Hero -->
    <section class="ed-hero">
      <div class="container">
        <p class="ed-hero__breadcrumb">${breadcrumbHtml}</p>
        <h1>${heroH1}</h1>
        <p class="ed-hero__sub">${heroSubtitle}</p>
      </div>
    </section>

    ${bodyHtml}
  </main>

  <!-- Footer -->
  <footer style="background:#0e1520;color:rgba(255,255,255,0.75);padding:3.5rem 0 0;">
    <div class="container" style="max-width:1200px;margin:0 auto;padding:0 1.5rem;">
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:2rem;margin-bottom:3rem;">
        <div>
          <h4 style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#fff;margin-bottom:1rem;">Products</h4>
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <a href="../products/caps/" style="color:rgba(255,255,255,0.65);text-decoration:none;font-size:0.88rem;">Caps</a>
            <a href="../products/beanies/" style="color:rgba(255,255,255,0.65);text-decoration:none;font-size:0.88rem;">Beanies</a>
            <a href="../products/bucket-hats/" style="color:rgba(255,255,255,0.65);text-decoration:none;font-size:0.88rem;">Bucket Hats</a>
            <a href="../products/" style="color:rgba(255,255,255,0.65);text-decoration:none;font-size:0.88rem;">All Products</a>
          </div>
        </div>
        <div>
          <h4 style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#fff;margin-bottom:1rem;">Resources</h4>
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <a href="../cap-studio/" style="color:rgba(255,255,255,0.65);text-decoration:none;font-size:0.88rem;">Cap Studio</a>
            <a href="../decorator-academy/" style="color:rgba(255,255,255,0.65);text-decoration:none;font-size:0.88rem;">Decorator Academy</a>
            <a href="../lookbooks/" style="color:rgba(255,255,255,0.65);text-decoration:none;font-size:0.88rem;">Lookbooks</a>
            <a href="../resources/faqs.html" style="color:rgba(255,255,255,0.65);text-decoration:none;font-size:0.88rem;">FAQs</a>
          </div>
        </div>
        <div>
          <h4 style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#fff;margin-bottom:1rem;">About</h4>
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <a href="../about/about-beechfield.html" style="color:rgba(255,255,255,0.65);text-decoration:none;font-size:0.88rem;">Our Story</a>
            <a href="../about/sustainability.html" style="color:rgba(255,255,255,0.65);text-decoration:none;font-size:0.88rem;">Sustainability</a>
            <a href="../where-to-buy/" style="color:rgba(255,255,255,0.65);text-decoration:none;font-size:0.88rem;">Where to Buy</a>
            <a href="../resources/contact.html" style="color:rgba(255,255,255,0.65);text-decoration:none;font-size:0.88rem;">Contact</a>
          </div>
        </div>
        <div>
          <h4 style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#fff;margin-bottom:1rem;">Beechfield Brands</h4>
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <a href="../../bagbase/" style="color:rgba(255,255,255,0.65);text-decoration:none;font-size:0.88rem;">BagBase</a>
            <a href="../../quadra/" style="color:rgba(255,255,255,0.65);text-decoration:none;font-size:0.88rem;">Quadra</a>
            <a href="../../westford-mill/" style="color:rgba(255,255,255,0.65);text-decoration:none;font-size:0.88rem;">Westford Mill</a>
          </div>
        </div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:1.25rem 0;border-top:1px solid rgba(255,255,255,0.08);flex-wrap:wrap;gap:1rem;">
        <span style="font-size:0.78rem;">&copy; 2026 Beechfield Brands. All rights reserved.</span>
        <div style="display:flex;gap:1.25rem;">
          <a href="../about/privacy.html" style="color:rgba(255,255,255,0.5);text-decoration:none;font-size:0.78rem;">Privacy</a>
          <a href="../about/terms.html" style="color:rgba(255,255,255,0.5);text-decoration:none;font-size:0.78rem;">Terms</a>
        </div>
      </div>
    </div>
  </footer>

  <script src="../../shared/js/navigation.js" defer></script>
</body>
</html>`;
}

// ─── Page Definitions ───

const PAGES = [];

// ── PURPOSE PAGES (8) ──
const purposes = [
  {
    slug: 'outdoors', title: 'Outdoors & Activewear', heroColor: '#1f614d',
    h1: 'Built for the Outdoors', sub: 'Headwear that performs when conditions demand it. Windproof, insulating, decoration-ready.',
    body: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>Headwear for Every Outdoor Brief</h2>
            <p>From charity treks to corporate team-building, outdoor events need headwear that performs. Beechfield's outdoor range combines insulating fabrics, wind-resistant construction and proven decoration surfaces — so your branded headwear works as hard as the people wearing it.</p>
            <p>Fleece-lined beanies for winter events. Breathable caps for summer trails. Bucket hats for festival season. Every product is engineered for decoration — embroidery, print, patch — so your client's logo looks sharp whatever the weather.</p>
          </div>
          <div class="ed-split__img">[Outdoor lifestyle imagery]</div>
        </div>
      </div>
    </section>
    <section class="ed-section ed-section--alt">
      <div class="container">
        <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:2rem;">Recommended for Outdoors</h2>
        <div class="product-grid" id="purpose-products"></div>
        <p style="text-align:center;margin-top:2rem;"><a href="../products/?purpose=outdoors" class="btn btn--primary">View All Outdoor Products</a></p>
      </div>
    </section>`
  },
  {
    slug: 'sports', title: 'Sports', heroColor: '#0e1520',
    h1: 'Team Headwear. Match-Ready.', sub: 'Performance caps, moisture-wicking beanies and sideline warmers — all built for decoration.',
    body: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>From Pitch to Podium</h2>
            <p>Sports teams, clubs and events need headwear that looks professional and performs under pressure. Beechfield's sports range features moisture-wicking fabrics, structured profiles for clean embroidery, and colours that match team palettes.</p>
            <p>Whether it's a 5-a-side team ordering 20 caps or a national event needing 5,000 branded beanies, the range scales. Consistent sizing, consistent colours, consistent decoration results — order after order.</p>
          </div>
          <div class="ed-split__img">[Sports lifestyle imagery]</div>
        </div>
      </div>
    </section>
    <section class="ed-section ed-section--alt">
      <div class="container">
        <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:2rem;">Recommended for Sports</h2>
        <div class="product-grid" id="purpose-products"></div>
        <p style="text-align:center;margin-top:2rem;"><a href="../products/?purpose=sports" class="btn btn--primary">View All Sports Products</a></p>
      </div>
    </section>`
  },
  {
    slug: 'promotion', title: 'Promotion', heroColor: '#594fdf',
    h1: 'Promotional Headwear That Works', sub: 'High-impact branded headwear for events, giveaways and campaigns — at volume.',
    body: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>Branding That Stays On</h2>
            <p>Promotional headwear is one of the few branded items people actually keep and wear. A well-made cap or beanie carries your client's logo for years — at events, on commutes, in photos. That's thousands of impressions from a single unit.</p>
            <p>Beechfield's promotional range is built for exactly this. Clean, structured decoration surfaces. Deep stock across core colours. Consistent quality at volume — whether the order is 200 or 20,000.</p>
          </div>
          <div class="ed-split__img">[Promotional event imagery]</div>
        </div>
      </div>
    </section>
    <section class="ed-section ed-section--alt">
      <div class="container">
        <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:2rem;">Recommended for Promotion</h2>
        <div class="product-grid" id="purpose-products"></div>
        <p style="text-align:center;margin-top:2rem;"><a href="../products/?purpose=promotion" class="btn btn--primary">View All Promotional Products</a></p>
      </div>
    </section>`
  },
  {
    slug: 'fashion', title: 'Fashion & Lifestyle', heroColor: '#0e1520',
    h1: 'Streetwear Roots. Decoration Ready.', sub: 'Fashion-forward silhouettes for brands that want headwear with edge.',
    body: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>For Brands With a Point of View</h2>
            <p>Fashion headwear demands more than function — it needs attitude. Beechfield's fashion range features contemporary silhouettes — dad caps, flat peaks, bucket hats, cord caps — in on-trend colourways and premium fabrications.</p>
            <p>These are the styles streetwear brands, independent labels and creative agencies reach for. Decoration-ready by design — structured panels, clean surfaces, TearAway labels — so the blank becomes the canvas.</p>
          </div>
          <div class="ed-split__img">[Fashion lifestyle imagery]</div>
        </div>
      </div>
    </section>
    <section class="ed-section ed-section--alt">
      <div class="container">
        <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:2rem;">Recommended for Fashion</h2>
        <div class="product-grid" id="purpose-products"></div>
        <p style="text-align:center;margin-top:2rem;"><a href="../products/?purpose=fashion" class="btn btn--primary">View All Fashion Products</a></p>
      </div>
    </section>`
  },
  {
    slug: 'kids', title: 'Kids', heroColor: '#fc614d',
    h1: 'Kids Headwear. Sized Right.', sub: 'Junior sizes in trusted Beechfield quality — for schools, clubs, events and gifting.',
    body: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>Proper Fit for Young Heads</h2>
            <p>Kids headwear isn't just adult headwear made smaller. Beechfield's junior range is specifically sized and proportioned for children — with the same decoration performance, quality standards and colour consistency as the adult range.</p>
            <p>Schools, youth clubs, holiday camps, children's parties — wherever kids need branded headwear, the junior range delivers. Matching styles available in adult sizes too, so the whole group can coordinate.</p>
          </div>
          <div class="ed-split__img">[Kids lifestyle imagery]</div>
        </div>
      </div>
    </section>
    <section class="ed-section ed-section--alt">
      <div class="container">
        <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:2rem;">Junior Range</h2>
        <div class="product-grid" id="purpose-products"></div>
        <p style="text-align:center;margin-top:2rem;"><a href="../products/?purpose=kids" class="btn btn--primary">View All Kids Products</a></p>
      </div>
    </section>`
  },
  {
    slug: 'workwear', title: 'Workwear', heroColor: '#0e1520',
    h1: 'Workwear Headwear. Tough Enough.', sub: 'Hi-vis, thermal and durable headwear for trade, construction and industrial branding.',
    body: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>Built for the Job</h2>
            <p>Workwear headwear needs to survive the conditions and carry the brand. Beechfield's workwear range includes hi-vis beanies, thermal fleece hats, heavy-duty caps and insulated options — all designed for embroidery or print branding.</p>
            <p>Construction sites, logistics teams, outdoor maintenance crews — these are environments where durability matters. Consistent branding across teams, repeat ordering when stock runs low, and the quality to last a working year.</p>
          </div>
          <div class="ed-split__img">[Workwear lifestyle imagery]</div>
        </div>
      </div>
    </section>
    <section class="ed-section ed-section--alt">
      <div class="container">
        <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:2rem;">Recommended for Workwear</h2>
        <div class="product-grid" id="purpose-products"></div>
        <p style="text-align:center;margin-top:2rem;"><a href="../products/?purpose=workwear" class="btn btn--primary">View All Workwear Products</a></p>
      </div>
    </section>`
  },
  {
    slug: 'gifting', title: 'Gifting', heroColor: '#ffb58d', heroTextColor: '#0e1520',
    h1: 'Headwear Worth Giving', sub: 'Premium headwear for corporate gifts, seasonal promotions and brand merchandise.',
    body: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>The Gift They Actually Wear</h2>
            <p>A branded cap or beanie makes a better corporate gift than most things that end up in a drawer. It's visible, useful, and if it's well-made — it gets worn for years. That's the point.</p>
            <p>Beechfield's gifting range focuses on premium fabrications, on-trend silhouettes and colours that people genuinely want. Pair with subtle embroidery or a tonal patch for a branded gift that feels personal rather than promotional.</p>
          </div>
          <div class="ed-split__img">[Gifting lifestyle imagery]</div>
        </div>
      </div>
    </section>
    <section class="ed-section ed-section--alt">
      <div class="container">
        <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:2rem;">Recommended for Gifting</h2>
        <div class="product-grid" id="purpose-products"></div>
        <p style="text-align:center;margin-top:2rem;"><a href="../products/?purpose=gifting" class="btn btn--primary">View All Gifting Products</a></p>
      </div>
    </section>`
  },
  {
    slug: 'sustainability', title: 'Sustainable Headwear', heroColor: '#1f614d',
    h1: 'Better Materials. Honest Claims.', sub: 'Organic cotton, recycled polyester, certified supply chains. No greenwash. Just the facts.',
    body: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>EarthAware and Beyond</h2>
            <p>Where we can, we use organic, recycled or lower-impact materials. Where we can't yet, we're working on it. The EarthAware collection brings together our certified sustainable products — OCS organic cotton, GRS recycled polyester, OEKO-TEX tested fabrics.</p>
            <p>We don't over-celebrate the basics. Polybag-free where possible. Recycled content where not. We choose suppliers based on quality, compliance and conditions — not just price. That's the honest position.</p>
          </div>
          <div class="ed-split__img">[Sustainability imagery]</div>
        </div>
      </div>
    </section>
    <section class="ed-section ed-section--dark">
      <div class="container">
        <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:2rem;">Certifications</h2>
        <div class="ed-technique">
          <div class="ed-technique-card" style="background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.1);">
            <h3 style="color:#fff;">OCS — Organic Content Standard</h3>
            <p style="color:rgba(255,255,255,0.7);">Verifies the presence and amount of organic material in a product. Tracked from source to final product.</p>
          </div>
          <div class="ed-technique-card" style="background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.1);">
            <h3 style="color:#fff;">GRS — Global Recycled Standard</h3>
            <p style="color:rgba(255,255,255,0.7);">Certifies recycled content and responsible production. Verified recycled polyester in our performance fabrics.</p>
          </div>
          <div class="ed-technique-card" style="background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.1);">
            <h3 style="color:#fff;">OEKO-TEX Standard 100</h3>
            <p style="color:rgba(255,255,255,0.7);">Tests for harmful substances. Confirms products are safe for human use. Applied across key product lines.</p>
          </div>
        </div>
      </div>
    </section>
    <section class="ed-section ed-section--alt">
      <div class="container">
        <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:2rem;">EarthAware Products</h2>
        <div class="product-grid" id="purpose-products"></div>
        <p style="text-align:center;margin-top:2rem;"><a href="../products/?eco=true" class="btn btn--accent">View All Sustainable Products</a></p>
      </div>
    </section>`
  }
];

purposes.forEach(p => {
  const heroC = p.heroTextColor ? `${p.heroColor}; color: ${p.heroTextColor}` : p.heroColor;
  PAGES.push({
    dir: 'purpose',
    file: `${p.slug}.html`,
    content: pageShell({
      title: p.title, description: `${p.title} headwear from Beechfield. Designed for decoration.`,
      breadcrumbHtml: `<a href="../">Home</a> / <a href="./">Purpose</a> / ${p.title}`,
      heroColor: heroC, heroH1: p.h1, heroSubtitle: p.sub,
      bodyHtml: p.body, activeNav: 'products'
    })
  });
});

// ── DECORATION TECHNIQUE PAGES (7) ──
const decorations = [
  {
    slug: 'embroidery', title: 'Embroidery',
    h1: 'Embroidery on Headwear', sub: 'The gold standard for branded headwear. Durable, premium, proven.',
    body: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>The Decorator's Go-To</h2>
            <p>Embroidery is the most popular decoration method for headwear — and for good reason. It's durable, it looks premium, and it survives wash after wash. Every Beechfield cap and beanie is engineered with embroidery in mind — reinforced front panels, consistent fabric tension, stable substrates.</p>
            <p>Direct embroidery works on almost every Beechfield product. For best results, look for structured front panels (5-panel and 6-panel caps), stable knit beanies, and fabrics with sufficient weight to support stitch density without puckering.</p>
          </div>
          <div class="ed-split__img">[Embroidery close-up imagery]</div>
        </div>
      </div>
    </section>
    <section class="ed-section ed-section--dark">
      <div class="container">
        <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:0.5rem;">Technical Specifications</h2>
        <p style="opacity:0.6;margin-bottom:2rem;">Typical decoration areas for Beechfield headwear</p>
        <div class="ed-technique">
          <div class="ed-technique-card" style="background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.1);">
            <h3 style="color:#fff;">Front Panel (Caps)</h3>
            <p style="color:rgba(255,255,255,0.7);">Typical area: 100mm x 60mm. Up to 12,000 stitches. Structured panels recommended for clean results.</p>
            <span class="tag">Recommended</span>
          </div>
          <div class="ed-technique-card" style="background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.1);">
            <h3 style="color:#fff;">Side Panel (Caps)</h3>
            <p style="color:rgba(255,255,255,0.7);">Typical area: 50mm x 40mm. Ideal for secondary logos or text. Works on both structured and unstructured.</p>
            <span class="tag">Good</span>
          </div>
          <div class="ed-technique-card" style="background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.1);">
            <h3 style="color:#fff;">Cuff (Beanies)</h3>
            <p style="color:rgba(255,255,255,0.7);">Typical area: 80mm x 30mm. Turn-up cuff provides a stable, flat surface. Best with backing stabiliser.</p>
            <span class="tag">Recommended</span>
          </div>
        </div>
      </div>
    </section>`
  },
  {
    slug: 'screen-print', title: 'Screen Print',
    h1: 'Screen Print on Headwear', sub: 'Bold, vibrant branding for high-volume orders. Cost-effective at scale.',
    body: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>High Impact at Volume</h2>
            <p>Screen print delivers bold, vibrant graphics on headwear — and it scales cost-effectively for large orders. Flat surfaces like unstructured cap fronts and flat-peak brims work particularly well. The key is choosing the right product-ink combination.</p>
            <p>For best results on headwear, use plastisol inks on cotton and polycotton fabrics. Water-based inks work well on lighter colours. Always test dark-on-light and light-on-dark combinations before committing to a full run.</p>
          </div>
          <div class="ed-split__img">[Screen print imagery]</div>
        </div>
      </div>
    </section>
    <section class="ed-section ed-section--alt">
      <div class="container">
        <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:2rem;">Best Products for Screen Print</h2>
        <div class="product-grid" id="purpose-products"></div>
        <p style="text-align:center;margin-top:2rem;"><a href="../products/?decoration=screen-print" class="btn btn--primary">View All Screen Print Products</a></p>
      </div>
    </section>`
  },
  {
    slug: 'transfer', title: 'Heat Transfer',
    h1: 'Heat Transfer on Headwear', sub: 'Full-colour, photo-quality branding. Ideal for complex logos and small runs.',
    body: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>Full-Colour Precision</h2>
            <p>Heat transfer is the go-to for complex, multi-colour logos and photographic designs on headwear. It's cost-effective for smaller runs and delivers consistent results across different fabric types. Digital transfers can reproduce gradients, fine detail and unlimited colours.</p>
            <p>Smooth, flat surfaces give the best adhesion. Structured cap fronts, flat peak surfaces, and stable-knit beanies all work well. Avoid heavily textured fabrics where the transfer can't make full contact.</p>
          </div>
          <div class="ed-split__img">[Transfer application imagery]</div>
        </div>
      </div>
    </section>
    <section class="ed-section ed-section--alt">
      <div class="container">
        <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:2rem;">Best Products for Transfer</h2>
        <div class="product-grid" id="purpose-products"></div>
      </div>
    </section>`
  },
  {
    slug: 'patches', title: 'Patches',
    h1: 'Patches on Headwear', sub: 'Woven, embroidered or PVC patches — a premium, interchangeable branding option.',
    body: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>Premium. Removable. Distinctive.</h2>
            <p>Patches add a premium, tactile quality to headwear that other decoration methods can't match. Woven patches deliver fine detail. Embroidered patches add texture. PVC patches give a modern, durable finish. All can be sewn or heat-applied to Beechfield products.</p>
            <p>The Patch Beanie (B445) is specifically designed for patch application — with a flat-knit front panel that provides the ideal surface. Caps with structured fronts work equally well. For best results, keep patches under 80mm wide on cap fronts.</p>
          </div>
          <div class="ed-split__img">[Patch detail imagery]</div>
        </div>
      </div>
    </section>
    <section class="ed-section ed-section--alt">
      <div class="container">
        <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:2rem;">Best Products for Patches</h2>
        <div class="product-grid" id="purpose-products"></div>
      </div>
    </section>`
  },
  {
    slug: 'dtg', title: 'DTG — Direct to Garment',
    h1: 'DTG Print on Headwear', sub: 'Digital printing for complex designs. No minimum quantities. Fast turnaround.',
    body: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>Print On Demand</h2>
            <p>DTG (Direct to Garment) printing applies ink directly to the fabric using inkjet technology. It's ideal for complex, full-colour designs with no minimum order quantity — perfect for samples, short runs, and personalised items.</p>
            <p>Cotton and cotton-rich fabrics give the best DTG results. Look for products with high cotton content and smooth weave for sharpest reproduction. Pre-treatment is essential for dark fabrics.</p>
          </div>
          <div class="ed-split__img">[DTG printing imagery]</div>
        </div>
      </div>
    </section>
    <section class="ed-section ed-section--alt">
      <div class="container">
        <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:2rem;">Best Products for DTG</h2>
        <div class="product-grid" id="purpose-products"></div>
      </div>
    </section>`
  },
  {
    slug: 'sublimation', title: 'Sublimation',
    h1: 'Sublimation on Headwear', sub: 'All-over print. Vibrant colours. Permanent. Best on polyester substrates.',
    body: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>All-Over Colour</h2>
            <p>Sublimation printing uses heat to permanently bond ink into polyester fabric — creating vibrant, all-over designs that won't crack, peel or fade. It's the method of choice for photo-realistic prints, complex patterns and edge-to-edge colour on headwear.</p>
            <p>Sublimation only works on white or light polyester fabrics. The ink becomes part of the fabric rather than sitting on top — so it's breathable, soft to the touch, and extremely durable. Beechfield's polyester performance range is ideal.</p>
          </div>
          <div class="ed-split__img">[Sublimation print imagery]</div>
        </div>
      </div>
    </section>
    <section class="ed-section ed-section--alt">
      <div class="container">
        <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:2rem;">Best Products for Sublimation</h2>
        <div class="product-grid" id="purpose-products"></div>
      </div>
    </section>`
  },
  {
    slug: 'deboss-foil-laser', title: 'Deboss, Foil & Laser',
    h1: 'Deboss, Foil & Laser Decoration', sub: 'Premium finishing techniques for a subtle, high-end branded look.',
    body: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>Subtle Branding. Maximum Impact.</h2>
            <p>Not every brand wants a loud logo. Debossing presses your design into the fabric for a tonal, textured finish. Foil stamping adds metallic accents — gold, silver, copper. Laser etching removes surface fibres to reveal the design beneath. All three deliver a premium, understated branded look.</p>
            <p>These techniques work best on smooth, dense fabrics — brushed cotton caps, felt beanies, suede-effect peaks. The result is headwear that feels premium and exclusive. Perfect for high-end corporate gifting and luxury brand merchandise.</p>
          </div>
          <div class="ed-split__img">[Deboss/foil detail imagery]</div>
        </div>
      </div>
    </section>
    <section class="ed-section ed-section--alt">
      <div class="container">
        <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:2rem;">Best Products for Premium Techniques</h2>
        <div class="product-grid" id="purpose-products"></div>
      </div>
    </section>`
  }
];

decorations.forEach(d => {
  PAGES.push({
    dir: 'decoration',
    file: `${d.slug}.html`,
    content: pageShell({
      title: d.title, description: `${d.title} decoration on Beechfield headwear. Guides, best products and specifications.`,
      breadcrumbHtml: `<a href="../">Home</a> / <a href="../decorator-academy/">Decorator Academy</a> / ${d.title}`,
      heroColor: d.heroColor || '#0e1520', heroH1: d.h1, heroSubtitle: d.sub,
      bodyHtml: d.body, activeNav: 'decorator-academy'
    })
  });
});

// ── RESOURCES PAGES (3) ──
// Blog index
PAGES.push({
  dir: 'resources',
  file: 'index.html',
  content: pageShell({
    title: 'Resources', description: 'Beechfield resources — blog, FAQs, downloads and support.',
    breadcrumbHtml: '<a href="../">Home</a> / Resources',
    heroColor: '#0e1520', heroH1: 'Resources', heroSubtitle: 'Guides, downloads and support for decorators and distributors.',
    bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-grid">
          <a href="faqs.html" class="ed-card" style="text-decoration:none;color:inherit;">
            <div class="ed-card__img">[FAQ icon]</div>
            <div class="ed-card__body">
              <h3>FAQs</h3>
              <p>Common questions about Beechfield products, ordering, decoration and sustainability.</p>
            </div>
          </a>
          <a href="contact.html" class="ed-card" style="text-decoration:none;color:inherit;">
            <div class="ed-card__img">[Contact icon]</div>
            <div class="ed-card__body">
              <h3>Contact Us</h3>
              <p>Get in touch with the Beechfield team for product enquiries, samples and support.</p>
            </div>
          </a>
          <a href="../lookbooks/" class="ed-card" style="text-decoration:none;color:inherit;">
            <div class="ed-card__img">[Lookbook imagery]</div>
            <div class="ed-card__body">
              <h3>Lookbooks</h3>
              <p>Seasonal lookbooks showcasing the latest collections and campaigns.</p>
            </div>
          </a>
          <a href="../decorator-academy/" class="ed-card" style="text-decoration:none;color:inherit;">
            <div class="ed-card__img">[Academy icon]</div>
            <div class="ed-card__body">
              <h3>Decorator Academy</h3>
              <p>Decoration guides, technique pages and expert resources for decorators.</p>
            </div>
          </a>
        </div>
      </div>
    </section>`,
    activeNav: 'resources'
  })
});

// FAQs
PAGES.push({
  dir: 'resources',
  file: 'faqs.html',
  content: pageShell({
    title: 'FAQs', description: 'Frequently asked questions about Beechfield headwear, ordering and decoration.',
    breadcrumbHtml: '<a href="../">Home</a> / <a href="./">Resources</a> / FAQs',
    heroColor: '#0e1520', heroH1: 'Frequently Asked Questions', heroSubtitle: 'Everything you need to know about Beechfield products, ordering and decoration.',
    bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-faq">
          <details>
            <summary>Where can I buy Beechfield products?</summary>
            <div class="answer">Beechfield products are available exclusively through our authorised distributor network. Visit our <a href="../where-to-buy/find-a-distributor.html">Find a Distributor</a> page to locate your nearest stockist. We do not sell directly to the public or end-users.</div>
          </details>
          <details>
            <summary>What decoration methods work best on Beechfield headwear?</summary>
            <div class="answer">Every Beechfield product is designed for decoration. Embroidery is the most popular method and works on virtually all our products. Screen print, heat transfer, DTG, sublimation and patches also work well — see our <a href="../decorator-academy/">Decorator Academy</a> for technique-specific guidance and product recommendations.</div>
          </details>
          <details>
            <summary>What is EarthAware?</summary>
            <div class="answer">EarthAware is our range of products made with certified organic cotton (OCS) or recycled polyester (GRS). These products meet independently verified sustainability standards. We're honest about what we can and can't claim — see our <a href="../about/sustainability.html">Sustainability</a> page for full details.</div>
          </details>
          <details>
            <summary>How do I check stock availability?</summary>
            <div class="answer">Every product page includes a live stock checker showing availability by colour across our distributor network. For large orders, we recommend contacting your preferred distributor directly or submitting a stock enquiry through the product page.</div>
          </details>
          <details>
            <summary>What is the minimum order quantity?</summary>
            <div class="answer">Beechfield has no minimum order requirement — order quantities depend on your distributor. Most distributors offer single-unit ordering for sampling and small quantities for short runs. For volume pricing, contact your distributor directly.</div>
          </details>
          <details>
            <summary>Can I get product samples?</summary>
            <div class="answer">Yes — contact your preferred distributor to request samples. Most distributors offer sample services for evaluation before placing larger orders.</div>
          </details>
          <details>
            <summary>What certifications do Beechfield products hold?</summary>
            <div class="answer">Depending on the product: OCS (Organic Content Standard) for organic cotton products, GRS (Global Recycled Standard) for recycled polyester products, and OEKO-TEX Standard 100 for tested fabric safety. Certifications are listed on each product page.</div>
          </details>
          <details>
            <summary>Do you offer custom/bespoke headwear?</summary>
            <div class="answer">Beechfield specialises in decoration-ready blank headwear. For fully bespoke/custom manufactured headwear, please contact our sales team to discuss options and minimum quantities.</div>
          </details>
        </div>
      </div>
    </section>`,
    activeNav: 'resources'
  })
});

// Contact
PAGES.push({
  dir: 'resources',
  file: 'contact.html',
  content: pageShell({
    title: 'Contact Us', description: 'Get in touch with Beechfield for product enquiries, samples and support.',
    breadcrumbHtml: '<a href="../">Home</a> / <a href="./">Resources</a> / Contact',
    heroColor: '#0e1520', heroH1: 'Get in Touch', heroSubtitle: 'Product enquiries, sample requests, partnership opportunities — we are here to help.',
    bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>Contact Beechfield</h2>
            <p>For product enquiries, sample requests and general information, get in touch with our team.</p>
            <div style="margin-top:2rem;">
              <p style="margin-bottom:0.75rem;"><strong>Email:</strong> info@beechfield.com</p>
              <p style="margin-bottom:0.75rem;"><strong>Phone:</strong> +44 (0)161 123 4567</p>
              <p style="margin-bottom:0.75rem;"><strong>Address:</strong> Beechfield Brands, Wigan, Lancashire, UK</p>
            </div>
            <p style="margin-top:1.5rem;font-size:0.92rem;color:#555;">For ordering and stock enquiries, please contact your <a href="../where-to-buy/find-a-distributor.html">preferred distributor</a> directly.</p>
          </div>
          <div style="background:#f5f0e8;border-radius:8px;padding:2rem;">
            <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:1.5rem;">Send Us a Message</h3>
            <form id="contact-form" style="display:flex;flex-direction:column;gap:1rem;">
              <input type="text" placeholder="Your name" required style="padding:0.75rem;border:1px solid #ddd;border-radius:4px;font-size:0.95rem;">
              <input type="email" placeholder="Email address" required style="padding:0.75rem;border:1px solid #ddd;border-radius:4px;font-size:0.95rem;">
              <input type="text" placeholder="Company" style="padding:0.75rem;border:1px solid #ddd;border-radius:4px;font-size:0.95rem;">
              <select style="padding:0.75rem;border:1px solid #ddd;border-radius:4px;font-size:0.95rem;">
                <option>Subject...</option>
                <option>Product enquiry</option>
                <option>Sample request</option>
                <option>Partnership</option>
                <option>Press / Media</option>
                <option>Other</option>
              </select>
              <textarea rows="4" placeholder="Your message" required style="padding:0.75rem;border:1px solid #ddd;border-radius:4px;font-size:0.95rem;resize:vertical;"></textarea>
              <button type="submit" class="btn btn--primary" style="border:none;cursor:pointer;">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>`,
    activeNav: 'resources'
  })
});

// ── WHERE TO BUY PAGES (3) ──
PAGES.push({
  dir: 'where-to-buy',
  file: 'index.html',
  content: pageShell({
    title: 'Where to Buy', description: 'Buy Beechfield headwear through our authorised distributor network.',
    breadcrumbHtml: '<a href="../">Home</a> / Where to Buy',
    heroColor: '#0e1520', heroH1: 'Where to Buy Beechfield', heroSubtitle: 'Available exclusively through our authorised distributor network across the UK and Europe.',
    bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>How It Works</h2>
            <p>Beechfield products are sold through authorised distributors — not directly from us. This means you get local stock, fast delivery and dedicated account support from specialist distributors who know the decoration industry.</p>
            <p>Find your nearest distributor, check stock availability on any product page, or submit an enquiry and we'll connect you with the right partner.</p>
          </div>
          <div class="ed-split__img">[Distribution network map]</div>
        </div>
      </div>
    </section>
    <section class="ed-section ed-section--alt">
      <div class="container">
        <div class="ed-grid">
          <a href="find-a-distributor.html" class="ed-card" style="text-decoration:none;color:inherit;">
            <div class="ed-card__body">
              <h3>Find a Distributor</h3>
              <p>Browse our network of authorised distributors across the UK and Europe.</p>
            </div>
          </a>
          <a href="how-to-buy.html" class="ed-card" style="text-decoration:none;color:inherit;">
            <div class="ed-card__body">
              <h3>How to Buy</h3>
              <p>Step-by-step guide to ordering Beechfield products through our distribution network.</p>
            </div>
          </a>
          <a href="inventory-finder.html" class="ed-card" style="text-decoration:none;color:inherit;">
            <div class="ed-card__body">
              <h3>Inventory Finder</h3>
              <p>Check real-time stock availability across our distributor network.</p>
            </div>
          </a>
        </div>
      </div>
    </section>`,
    activeNav: 'where-to-buy'
  })
});

PAGES.push({
  dir: 'where-to-buy',
  file: 'how-to-buy.html',
  content: pageShell({
    title: 'How to Buy', description: 'Step-by-step guide to buying Beechfield headwear through authorised distributors.',
    breadcrumbHtml: '<a href="../">Home</a> / <a href="./">Where to Buy</a> / How to Buy',
    heroColor: '#0e1520', heroH1: 'How to Buy Beechfield', heroSubtitle: 'Three simple steps from browsing to ordering.',
    bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-technique">
          <div class="ed-technique-card">
            <h3>01 — Find Your Products</h3>
            <p>Browse our full range of 250+ products. Use filters to narrow by type, colour, decoration method, purpose or sustainability credentials. Save products to a shortlist for easy reference.</p>
          </div>
          <div class="ed-technique-card">
            <h3>02 — Check Stock</h3>
            <p>Every product page shows live stock availability by colour across our distributor network. Check that your required colours and quantities are available before placing your order.</p>
          </div>
          <div class="ed-technique-card">
            <h3>03 — Order via Distributor</h3>
            <p>Choose your preferred distributor and place your order directly with them. They'll handle decoration, fulfilment and delivery. Need help choosing? Contact us and we'll recommend the right partner.</p>
          </div>
        </div>
      </div>
    </section>
    <section class="ed-cta">
      <div class="container">
        <h2>Ready to Order?</h2>
        <p>Find your nearest authorised distributor and get started.</p>
        <a href="find-a-distributor.html" class="btn btn--primary">Find a Distributor</a>
      </div>
    </section>`,
    activeNav: 'where-to-buy'
  })
});

PAGES.push({
  dir: 'where-to-buy',
  file: 'inventory-finder.html',
  content: pageShell({
    title: 'Inventory Finder', description: 'Check stock availability for Beechfield products across our distributor network.',
    breadcrumbHtml: '<a href="../">Home</a> / <a href="./">Where to Buy</a> / Inventory Finder',
    heroColor: '#0e1520', heroH1: 'Inventory Finder', heroSubtitle: 'Check product availability across our authorised distributor network.',
    bodyHtml: `
    <section class="ed-section">
      <div class="container" style="max-width:700px;">
        <div style="background:#f5f0e8;border-radius:8px;padding:2rem;">
          <h2 style="font-size:1.3rem;font-weight:700;margin-bottom:1rem;">Search Stock</h2>
          <p style="color:#555;margin-bottom:1.5rem;">Enter a product SKU or name to check stock availability across all distributors.</p>
          <form id="inventory-search" style="display:flex;gap:0.75rem;flex-wrap:wrap;">
            <input type="text" id="stock-sku" placeholder="Enter SKU (e.g. B45, B655, B90N)" style="flex:1;min-width:200px;padding:0.75rem;border:1px solid #ddd;border-radius:4px;font-size:0.95rem;">
            <button type="submit" class="btn btn--primary" style="border:none;cursor:pointer;">Check Stock</button>
          </form>
        </div>
        <div id="stock-results" style="margin-top:2rem;"></div>
        <p style="margin-top:2rem;font-size:0.9rem;color:#888;">Stock figures are indicative and updated regularly. For confirmed availability, contact your preferred distributor directly.</p>
      </div>
    </section>
    <script>
      document.getElementById('inventory-search').addEventListener('submit', async function(e) {
        e.preventDefault();
        const sku = document.getElementById('stock-sku').value.trim().toUpperCase();
        if (!sku) return;
        const results = document.getElementById('stock-results');
        results.innerHTML = '<p>Checking stock for ' + sku + '...</p>';
        try {
          const res = await fetch('/api/stock/' + sku);
          if (!res.ok) { results.innerHTML = '<p>No stock data found for ' + sku + '.</p>'; return; }
          const data = await res.json();
          let html = '<h3 style="margin-bottom:1rem;">' + sku + ' Stock Availability</h3>';
          html += '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.9rem;">';
          html += '<thead><tr style="border-bottom:2px solid #ddd;"><th style="text-align:left;padding:0.5rem;">Colour</th><th style="text-align:right;padding:0.5rem;">Total</th></tr></thead><tbody>';
          if (data.colours) {
            Object.entries(data.colours).forEach(([colour, info]) => {
              html += '<tr style="border-bottom:1px solid #eee;"><td style="padding:0.5rem;">' + colour + '</td><td style="text-align:right;padding:0.5rem;">' + (info.total || 0).toLocaleString() + '</td></tr>';
            });
          }
          html += '</tbody></table></div>';
          results.innerHTML = html;
        } catch(err) { results.innerHTML = '<p>Unable to check stock. Please try again.</p>'; }
      });
    </script>`,
    activeNav: 'where-to-buy'
  })
});

// ── CAMPAIGN PAGES (2) ──
PAGES.push({
  dir: 'campaign',
  file: 'ss26.html',
  content: pageShell({
    title: 'SS26 Campaign', description: 'Beechfield Spring/Summer 2026 seasonal campaign — new products, fresh colours, summer-ready headwear.',
    breadcrumbHtml: '<a href="../">Home</a> / <a href="./">Campaigns</a> / SS26',
    heroColor: 'linear-gradient(135deg, #594fdf 0%, #1496f7 100%)', heroH1: 'Spring/Summer 2026', heroSubtitle: 'New season. New colours. Same decoration-first commitment.',
    bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>What's New for SS26</h2>
            <p>Spring/Summer 2026 brings fresh colourways, updated silhouettes and expanded sustainable options across the Beechfield range. The seasonal edit focuses on three themes: outdoor performance, festival-ready fashion, and sustainable choices.</p>
            <p>All new products are decoration-ready from day one — engineered for embroidery, print, patch and transfer. Stock is pre-loaded across our distributor network, so you can pitch with confidence.</p>
          </div>
          <div class="ed-split__img">[SS26 campaign hero imagery]</div>
        </div>
      </div>
    </section>
    <section class="ed-section ed-section--alt">
      <div class="container">
        <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:2rem;">SS26 Featured Products</h2>
        <div class="product-grid" id="purpose-products"></div>
        <p style="text-align:center;margin-top:2rem;"><a href="../products/?collection=ss26" class="btn btn--primary">View Full SS26 Range</a></p>
      </div>
    </section>
    <section class="ed-section">
      <div class="container" style="text-align:center;">
        <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:0.75rem;">Campaign Assets</h2>
        <p style="color:#555;margin-bottom:2rem;">Download lifestyle imagery, product shots and campaign materials for SS26.</p>
        <a href="../account/login.html" class="btn btn--accent">Login for Campaign Assets</a>
      </div>
    </section>`,
    activeNav: 'products'
  })
});

PAGES.push({
  dir: 'campaign',
  file: 'micro-edit-template.html',
  content: pageShell({
    title: 'Monthly Edit', description: 'Beechfield monthly product edit — curated headwear picks for this month.',
    breadcrumbHtml: '<a href="../">Home</a> / <a href="./">Campaigns</a> / Monthly Edit',
    heroColor: '#0e1520', heroH1: 'The Monthly Edit', heroSubtitle: 'Curated picks. Fresh ideas. Updated every month.',
    bodyHtml: `
    <section class="ed-section">
      <div class="container">
        <div class="ed-split">
          <div class="ed-split__text">
            <h2>This Month's Theme</h2>
            <p>Each month we curate a selection of products around a theme — whether it's colour stories, seasonal trends, sustainability spotlights or decoration technique showcases. Use these edits as inspiration for client pitches or to update your own product listings.</p>
            <p>This month: <strong>Heritage Corduroy</strong> — premium cord caps and bucket hats in rich autumn tones. Perfect for fashion-forward brand merchandise and upmarket corporate gifting.</p>
          </div>
          <div class="ed-split__img">[Monthly edit imagery]</div>
        </div>
      </div>
    </section>
    <section class="ed-section ed-section--alt">
      <div class="container">
        <h2 style="font-size:1.6rem;font-weight:700;margin-bottom:2rem;">This Month's Picks</h2>
        <div class="product-grid" id="purpose-products"></div>
      </div>
    </section>
    <section class="ed-cta">
      <div class="container">
        <h2>Get Monthly Edits in Your Inbox</h2>
        <p>Sign up for our monthly newsletter — curated product picks, campaign updates and decoration tips.</p>
        <a href="../account/register.html" class="btn btn--primary">Join Club Beech</a>
      </div>
    </section>`,
    activeNav: 'products'
  })
});

// ── Write all pages ──
let count = 0;
PAGES.forEach(page => {
  const dir = path.join(BASE, page.dir);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, page.file), page.content);
  count++;
});

console.log(`Generated ${count} editorial pages:`);
const byDir = {};
PAGES.forEach(p => { byDir[p.dir] = (byDir[p.dir] || 0) + 1; });
Object.entries(byDir).forEach(([dir, n]) => console.log(`  ${dir}/ — ${n} pages`));
console.log('\nDone.');

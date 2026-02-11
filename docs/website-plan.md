# Beechfield Brands Website Plan

## Context

Beechfield Brands Limited operates four product brands — **Beechfield Original Headwear**, **BagBase**, **Quadra**, and **Westford Mill** — serving decorators, distributors, and specifiers in the rebrandable accessories market. The current websites are viewed as brand showcases but lack utility: decorators default to distributor portals (Ralawise, Binder) for daily tasks, and the sites need to evolve from passive catalogues into proactive resource hubs.

This plan synthesises insights from 10+ discovery documents including: site structure spreadsheets for all 5 domains, a site architecture proposal, user journey research, decorator interviews, customer surveys (75% of respondents are decorators), brand guidelines, a Search & AI strategy, product taxonomy databases, stock data requirements, campaign page systems, and CMS role/permission workflows.

The goal is to deliver a detailed implementation plan for **5 interconnected websites** that serve as the primary digital platform for the Beechfield Brands ecosystem.

---

## 1. Site Ecosystem Overview

| Site | Domain | Purpose | Primary Audiences |
|------|--------|---------|-------------------|
| **Beechfield Brands** | beechfieldbrands.com | Corporate parent — partner enablement, responsibility, careers | Distributors, employees, corporate stakeholders |
| **Beechfield Original Headwear** | beechfield.com | Headwear brand — caps, beanies, bucket hats, visors, performance | Decorators, distributors, industry buyers |
| **BagBase** | bagbase.com | Trend-led bags & accessories — backpacks, totes, holdalls | Decorators, distributors, promo buyers |
| **Quadra** | quadrabags.com | Premium purpose-built bags — work, travel, sport, technical | Decorators, distributors, corporate buyers |
| **Westford Mill** | westfordmill.com | Sustainable natural & eco bags — cotton, jute, recycled | Decorators, distributors, conscious buyers |

### Shared Cross-Site Features
- Unified Decorator Academy (decoration guides, techniques, logo placement tool, videos)
- Shared Media Hub / Binder integration for asset downloads
- Consistent "Where to Buy" flow (How to Buy > Find a Distributor > Inventory Finder)
- Shared footer pattern (About, FAQs, Distributor links, Legal)
- Cross-brand navigation (brand switcher in header)
- Community / gated area ("Club Beech") for registered decorators & distributors

---

## 2. Beechfield Brands (Corporate Site)

### 2.1 Navigation Structure
```
Home
├── Our Brands
│   ├── Beechfield Original Headwear  → links to beechfield.com
│   ├── BagBase                        → links to bagbase.com
│   ├── Quadra                         → links to quadrabags.com
│   └── Westford Mill                  → links to westfordmill.com
├── Sustainability Hub
│   ├── Our Commitment
│   ├── Responsible Sourcing
│   ├── Manufacturing
│   ├── Certifications
│   ├── Materials & Fibres
│   ├── Impact Updates
│   └── 1% for the Planet
├── Distributor Hub
│   ├── Why Partner
│   ├── Brand Ambassadors
│   ├── Request a Visit
│   ├── Media Hub (external link)
│   ├── Become a Distributor (form)
│   ├── Request POS
│   └── My Account / Login
├── About Us
│   ├── Our Story
│   ├── Our Impact
│   ├── Our Values
│   ├── Meet the Team
│   ├── Press
│   ├── Events
│   └── Careers
└── Contact Us
```

### 2.2 Key Page Types
- **Homepage**: Corporate positioning + quick links to Brands, Responsibility, Distributor Hub, Careers
- **Brand showcase pages**: `/our-brands/beechfield`, `/our-brands/bagbase`, etc. — one-pager per brand linking out to brand sites
- **Responsibility Hub**: Rich content pages with commitments, certifications, manufacturing transparency, impact reports
- **Distributor Hub**: Partner enablement — why partner, stock & logistics overview, support, apply form
- **About pages**: Story, values, team, events, press, careers

### 2.3 Key URLs (Current → Proposed)
| Page | Current URL | Proposed URL |
|------|-------------|--------------|
| Our Brands | /our-brands | /our-brands |
| Beechfield brand page | /welcome-beechfield-original-headwear | /our-brands/beechfield |
| BagBase brand page | /welcome-bagbase | /our-brands/bagbase |
| Quadra brand page | /welcome-quadra | /our-brands/quadra |
| Westford Mill brand page | /welcome-westford-mill | /our-brands/westford-mill |
| Distributor Hub | /distributors | /distributors |
| Brand Ambassadors | /partnerships | /distributors/brand-ambassadors |
| Become a Distributor | /jointhecommunity | /distributors/become-a-distributor |
| About Us | /about-us | /about-us |

### 2.4 Design System (from Brand Guidelines)
- **Primary Colours**: Cool Black (#0e1520), White (#FFFFFF), Light Grey (#f5f0eb)
- **Accent Colours**: Peach (#ffb58d), Dark Green (#1f614d), Blue (#594fdf), Light Green (#bde4ba), Red (#fc614d)
- **Typography**: Helvetica Neue LT Pro 75 Bold (headlines), Helvetica Neue LT Pro 45 Light (body), Source Serif Pro Regular (editorial)
- **Iconography**: Custom icon set (Community, Company, Environment, Green, Growth, Partnership)

---

## 3. Beechfield Original Headwear

### 3.1 Navigation Structure
```
Home
├── Product Ranges (mega menu)
│   ├── Featured: New In, Hero Products, Best Sellers, Trending, Eco-Styles, All Products
│   ├── By Type: Caps, Beanies, Bucket Hats, Visors, Performance, Accessories
│   ├── By Purpose: Outdoors, Sports, Promotion, Fashion, Kids, Workwear, Gifting
│   ├── By Decoration: Embroidery, Patches, Transfer, Screen Print, DTG, Sublimation, Deboss/Foil Laser
│   └── By Colour: 15 colour families (Black through Pattern/Neutral)
├── Collections: Originals, Morf, Snowstar, Suprafleece, EarthAware, Vintage, Urbanwear
├── Cap Studio
│   ├── By Shape: Baseball, Trucker, Dad Hat, Flat Peak, Army, Camper, Visor, Flat Cap
│   ├── By Fabric: Cotton, Organic Cotton, Recycled Polyester, Polyester, Corduroy, etc.
│   └── Cap Studio Resources: Shape Guide, Fabric Guide, Colours, Glossary
├── Lookbooks: SS26, AW25/26, Mid-Year 25
├── Decorator Academy
│   ├── Designed for Decoration
│   ├── Techniques (embroidery, patches, transfers, 360IQ)
│   ├── Logo Placement Tool (external)
│   ├── Decoration Protection
│   ├── How to Videos
│   └── Join the Community
├── Resources: Blog, Media Hub, Brochure, Campaign Assets, Product Assets, FAQs, Contact
├── Where to Buy: How to Buy, Find a Distributor, Inventory Finder
└── About: Our Values, Sustainability
```

### 3.2 Key Product Categories & URLs
| Category | URL | Top Keyword | SV |
|----------|-----|-------------|-----|
| Caps | /caps | blank caps for embroidery | 10 |
| Beanies | /beanies | wholesale beanies | 70 |
| Bucket Hats | /bucket-hats | wholesale bucket hats | 30 |
| Visors | /visors | custom visors | 20 |
| Performance | /performance | custom performance headwear | 0-10 |
| Accessories | /accessories | headwear accessories | 0-10 |

**Cap sub-types** (from Caps Classification data): Baseball Caps, Trucker Caps, Dad Caps, Snapback Caps, 5 Panel Caps, 6 Panel Caps, Flat Peak Caps, Army/Cadet Caps, Camper Caps

### 3.3 Unique Feature: Cap Studio
A dedicated section differentiating Beechfield from competitors (Atlantis, Flexfit). Combines:
- **Shape Guide**: Visual comparison of all cap silhouettes (baseball, trucker, dad hat, flat peak, army, camper, visor, flat cap)
- **Fabric Guide**: Cotton, organic cotton, recycled polyester, polyester, corduroy, polycotton, brushed cotton twill, nylon, denim, fleece
- **Colour Library**: Visual swatches with decoration compatibility notes
- **Glossary**: Industry terminology explained

---

## 4. BagBase

### 4.1 Navigation Structure
```
Home
├── Product Ranges (mega menu)
│   ├── Featured: New In, Best Sellers, Trending Now, Recommended, Eco Essentials, All Products
│   ├── By Type: Backpacks (→ Roll Top, Laptop, Kids), Holdalls & Duffels (→ Weekend, Gym),
│   │           Tote Bags & Shoppers (→ Totes, Shoppers), Cross Body Bags,
│   │           Messenger & Laptop Bags (→ Cases & Sleeves), Gymsacs,
│   │           Travel & Luggage (→ Wheelie, Packing Cubes, Coolers),
│   │           Accessories (→ Pouches, Wallets, Keyrings, Gift Bags, Patches, Organisers, Shoe Bags, Pencil Cases)
│   ├── By Purpose: Work & Commute, Gifting, Kids & School, Outdoors & Adventure,
│   │              Promo & Events, Sport & Team, Travel
│   ├── By Colour: 15 colour families
│   └── By Decoration: Embroidery, Patches, Transfer, Screen Print, DTG, Sublimation, Deboss/Foil Laser
├── Collections: Sundae, Recycled, Simplicity, Training, Matte PU, Velvet, Boutique, Premium Recycled
├── Lookbooks: AW25, SS26
├── Decorator Academy
│   ├── Designed for Decoration
│   ├── Logo Placement Tool
│   ├── Creator Spotlight
│   ├── How to Videos
│   ├── Tools
│   └── Join the Community
├── Resources: Brochure, Media Hub, Campaign Assets, Product Assets, BagBase Blog, FAQs, Contact
├── Where to Buy: How to Buy, Find a Distributor, Inventory Finder
└── About Us: Our Values, Sustainability
```

### 4.2 Key Product Categories & URLs
| Category | URL | Top Keyword | SV |
|----------|-----|-------------|-----|
| Backpacks | /backpacks | wholesale backpacks | 80 |
| Tote Bags & Shoppers | /tote-bags-shoppers | - | - |
| Holdalls & Duffels | /holdalls-duffels | wholesale holdalls | 0-10 |
| Cross Body Bags | /cross-body-bags | blank cross body bag | 0-10 |
| Messenger & Laptop | /messenger-laptop-bags | wholesale laptop bags | 20 |
| Gymsacs | /gymsacs | drawstring bag wholesale | 20 |
| Travel & Luggage | /travel-luggage | luggage bags wholesale | 10 |
| Accessories | /accessories | bag accessories wholesale | 0-10 |

### 4.3 Product Data Model (from BagBase Backpacks Fields)
The product data structure for bags includes:
- **Type**: Category, Product Type (Primary)
- **Colour**: Colour Family (15 options)
- **Size & Fit**: Capacity (L), Capacity Band (XS/S/M/L/XL), Height/Width/Depth (cm), Weight (g), Weight Band, A4 Compatible, Laptop Sleeve, Max Laptop Size
- **Materials & Build**: Outer Material, Lining, Base Material, Hardware, Zip Type, Water Resistance
- **Features**: Compartments, Pocket Count, Key Clip, Reflective Elements, Bottle Holder
- **Decoration**: Embroidery (Y/N), Print (Y/N), DTG (Y/N), Sublimation (Y/N), Recommended Position, Max Logo Size
- **Sustainability**: Recycled Content %, Certifications, EarthAware Badge
- **Commercial**: SKU, Carton Qty, Carton Dims, MOQ, Distributor Stock

---

## 5. Quadra

### 5.1 Navigation Structure
```
Home
├── Product Ranges (mega menu)
│   ├── Featured: New Arrivals, Bestsellers, Signature Collections, Responsible Choices,
│   │            Monthly Edit, Embroidery Ready, Print/Transfer Ready, Premium Finishes, All Products
│   ├── By Purpose: Work & Office (→ Commuter, Business Travel), Travel & Weekender,
│   │              Sport & Team (→ Gym Bags, Yoga & Studio), School & Education,
│   │              Outdoor & Adventure, Events & Promotion, Workwear & Utility,
│   │              Lifestyle & Premium (→ Weekend Getaways)
│   ├── By Type: Backpacks (→ Roll-Top, Gymsacs), Crossbody & Shoulder (→ Cross Body, Shoulder, Messenger, Sacoches),
│   │           Briefcases, Holdalls & Duffles (→ Holdalls, Hybrid, Duffle Bags, Weekenders),
│   │           Travel Cases (→ Wheelie, Suit Covers), Totes & Shoppers (→ Totes, Shoppers),
│   │           Pouches/Wash Bags/Organisers (→ Accessory, Organisers, Wash Bags, Pencil Cases),
│   │           Shoe & Boot Bags, Drinks & Coolers (→ Water Bottle Holders, Bottle Carriers, Coolers),
│   │           Specialist (→ Camera, Record Bags, Puller Packs, Drytubes, Umbrellas)
│   └── Collections: SLX, Zurich, Studio, NuHide, Tailored Luxe, Vessel, Pro Team, Teamwear,
│                    Multi-Sport, Puerto, Heritage Waxed, Tungsten, Airside
├── Lookbooks: SS26
├── Decorator Academy: Designed for Decoration, Logo Placement Tool, Case Studies, How to Videos,
│                      Join the Community
├── Guides: Technique Guides, Material Guides
├── Resources: Journal, Media Hub, Campaign Assets, Product Assets, Brochure, FAQs, Contact
├── Where to Buy: How to Buy, Find a Distributor, Inventory Finder
└── About: Built for Purpose, Craft & Quality, Sustainability
```

### 5.2 Key Product Categories & URLs
| Category | URL | Top Keyword | SV |
|----------|-----|-------------|-----|
| Backpacks | /backpacks | wholesale backpacks | 80 |
| Crossbody & Shoulder | /crossbody-shoulder | - | - |
| Briefcases | /briefcases | wholesale briefcases | 20 |
| Holdalls & Duffles | /holdalls-duffles | - | - |
| Travel Cases | /travel-cases | wholesale travel case | 0-10 |
| Totes & Shoppers | /totes-shoppers | - | - |
| Specialist | /specialist | - | - |

---

## 6. Westford Mill

### 6.1 Navigation Structure
```
Home
├── Product Ranges (mega menu)
│   ├── Featured: New In, Best Sellers, Trending Now, Seasonal Favourites, Designer's Picks, All Products
│   ├── By Type: Tote Bags, Bags, Gymsacs & Stuff Bags, Backpacks, Holdalls, Pouches,
│   │           Shoppers, Gift Bags, Beach Bags, Bags for Life, Travel Accessories, Homeware
│   ├── By Purpose: Gifting (→ Gift Bags & Wrap, Pouches & Personal, Home & Craft, Giftable Totes),
│   │              Promo (→ Giveaways & Events, Retail-Ready, Jute & Natural, Merch Packs)
│   ├── By Decoration: Embroidery, Patches, Transfer, Screen Print, DTG, Sublimation, Deboss/Foil Laser
│   └── By Fabric: Cotton (organic, fairtrade, recycled), Jute, Recycled Polyester, Blends
├── Collections: EarthAware, Nautical, Garment Dyed, Leopard Print, Canvas, Courtside,
│               Revive, Jute Collection, Premium
├── Lookbooks: SS26, SS25
├── Decorator Academy: Designed for Decoration, Logo Placement Tool, Guides, How to Videos,
│                      Case Studies, Join the Community
├── Resources: Journal, Brochure, Media Hub, FAQs, Assets, Campaign Assets, Product Assets
├── Sustainability Hub
│   ├── Our Commitment
│   ├── Materials & Certifications (GOTS, GRS, OEKO-TEX)
│   ├── Traceability & Origin
│   ├── Our Impact
│   ├── Ethics
│   └── 1% for the Planet
├── Where to Buy: How to Buy, Find a Distributor, Inventory Finder
└── About Us: Design Philosophy, Contact Us
```

### 6.2 Key Product Categories & URLs
| Category | URL | Top Keyword | SV |
|----------|-----|-------------|-----|
| Tote Bags | /tote-bags | blank tote bags | 300 |
| Shoppers | /shopper-bags | shopper bags wholesale | 30 |
| Gift Bags | /gifting | gift bags wholesale | 150 |
| Homeware | /homeware | plain aprons for printing | 100 |
| Bags | /bags | blank canvas bags | 50 |
| Beach Bags | /beach-bags | wholesale beach bags | 30 |
| Gymsacs & Stuff Bags | /gymsacs-stuff-bags | blank drawstring bags | 20 |

### 6.3 Unique Feature: Fabric & Origin Guide
- **Fabric groups**: Cotton, Jute, Recycled Polyester, Blends
- **Sub-filters** (on-page, not navigation): Credentials (Organic/Fairtrade/Recycled/In Conversion), Construction/finish, Weight buckets (3-4oz, 5-6oz, 7-9oz, 10-12oz, 14-18oz)
- **Tote Weight Guide**: GSM explainer (140/180/270 gsm)
- **"Which Tote for Which Job?" selector**: Interactive tool helping users choose the right bag weight/material

---

## 7. Content & Campaign System

### 7.1 Page Hierarchy (5 Levels)

```
Seasonal Hub (quarterly)          ← SS26, AW25 campaign landing pages
  └── Micro-Edits (monthly)       ← Monthly themed campaigns (3-6 products, 100-200 word editorial)
      └── Evergreen Edits          ← Permanent thematic pages (Workwear, Sustainability, Festival, etc.)
          └── Category Pages (PLPs) ← Product type listings with filters (Beanies, Backpacks, etc.)
              └── Product Pages (PDPs) ← Individual product detail pages
```

### 7.2 Seasonal Hubs
- Published once per season (4/year)
- Contains seasonal message, visual identity, links to all current micro-edits
- Acts as SEO anchor page
- Traffic from: homepage secondary banners, navigation, search, launch emails

### 7.3 Micro-Edits (Monthly Campaigns)
- 100-200 word editorial intro + monthly theme
- 3-6 hero products curated per month
- Links "up" to seasonal hub, "down" to PDPs and categories
- **Primary landing pages** for: monthly email, homepage hero, social campaigns
- Themes: New Year fitness, gifting, colour stories, sustainability, festival, heritage

### 7.4 Category Pages (PLPs)
- Permanent product listings by type
- Intro paragraph + filters + product grid
- "Featured in this month's edit" dynamic module
- Always-on SEO pages for generic searches

### 7.5 Evergreen Edits
- Permanent interest-based pages (Workwear, Sustainability, Festival, Outdoor, Back to School)
- 150-250 words of intent-based content + product highlights
- Connected to monthly micro-edits

### 7.6 Product Detail Pages (PDPs)
Core conversion pages containing:
- Product images (multiple angles — currently a gap noted in feedback)
- Decorated/use-case imagery (key feedback from decorators)
- Full specifications (dimensions, weight, materials, carton info)
- Decoration guidance (compatible methods, placement guides, max logo sizes)
- Sustainability information (recycled content %, certifications, EarthAware badges)
- Stock availability signals (Beechfield stock daily, distributor stock post-login)
- "Where to Buy" CTA with distributor finder
- Related products / "Also good for" recommendations
- Links to categories, evergreen edits, and current micro-edits

---

## 8. Key Functional Requirements

### 8.1 Stock Visibility
- **Beechfield Brands stock**: Daily CSV feed at 3am, visible to all users, with "last updated" disclaimer
- **Distributor stock**: Monthly CSV from distributors (currently manual reconciliation), visible to decorators **post-login only**
- **Reference implementation**: Stormtech inventory level display
- **Future**: Work with distributors for daily stock feed

### 8.2 Search & Navigation
- Predictive search with SKU recognition
- Simplified filters (reduce granularity per decorator feedback)
- Colour filters should tag similar shades (e.g., "lilac" surfaces nearby purples)
- Quick-compare from search/PLP (especially for BagBase — no separate comparison page)
- Cross-category linking via "Also good for" chips on PLPs/PDPs

### 8.3 Asset Management
- Basic ungated assets (product images, basic spec sheets) available publicly
- Full asset packs (campaign kits, seasonal imagery, decoration templates) gated behind login
- Direct one-click links from PDPs to relevant Binder/Media Hub assets
- Consider embedding Binder collections on-site for public assets

### 8.4 User Authentication & Gated Content
| Feature | Public | Login Required |
|---------|--------|----------------|
| PDPs, Category Pages, Evergreen Pages | Yes | - |
| Micro-Edits, Seasonal Hubs | Yes | - |
| Distributor Finder | Yes | - |
| Single Product RFQ | Yes | - |
| Multi-Product Project RFQ | - | Yes |
| Save Projects | - | Yes |
| Basic asset pack | Yes | - |
| Full asset pack | - | Yes |
| Community kits & alerts | - | Yes |
| Distributor stock levels | - | Yes |

### 8.5 Lead Generation & CRM
- **Single Product RFQ**: Clear CTA on PDP → postcode lookup → distributor list → contact form
- **Multi-Product Project Builder**: Build multi-SKU shortlist → add notes → export → multi-distributor RFQ (login required)
- **Distributor Enquiry**: Corporate pages → value prop → enquiry form → CRM routing
- **Approved Decorators Directory**: Decorator directory (like Stanley Stella's) allowing decorators to receive leads through the site
- **Industry Pages**: Curated product suggestions by industry → decorator search → brief form

### 8.6 Decorator Academy (Cross-Brand)
Shared across all 4 brand sites:
- Designed for Decoration (method compatibility per product)
- Techniques hub (embroidery, patches, transfers, screen print, DTG, sublimation, deboss/foil/laser)
- Logo Placement Tool (external integration)
- How to Videos (YouTube integration)
- Creator Spotlight / Case Studies
- Join the Community (registration)

---

## 9. SEO & Search Strategy

### 9.1 Brand Positioning for Search
| Brand | Primary Intent Cluster | Lead Language |
|-------|----------------------|----------------|
| Beechfield Brands | Rebrandable accessories partner (decoration-first) | trusted partner, responsible, expertise, "brand behind the brand" |
| Beechfield Headwear | Rebrandable headwear designed for decoration | original, consistent, craftsmanship, reliable decoration performance |
| BagBase | Fashion-forward rebrandable bags designed for decoration | bold, expressive, trend-led, colour-focused |
| Quadra | Purpose-built rebrandable bags designed for decoration | purpose-built, durable, premium, performance-led |
| Westford Mill | Sustainable blank bags designed for decoration | sustainable, considered design, conscious decoration, refined canvas |

### 9.2 Shared Lead Language
All brands share: "Designed for decoration", "Rebrandable", "Blank" (where appropriate)

### 9.3 Category Authority Hubs (Priority SEO targets)
- **Beechfield**: Blank caps for decoration, blank beanies, rebrandable headwear programmes, promotional headwear, workwear headwear
- **BagBase**: Colourful promotional bags, lifestyle backpacks, totes for branding, event bags, trend-led seasonal collections
- **Quadra**: Purpose-built backpacks, work & travel bags, sports & technical bags, durable promotional bags, premium corporate bags
- **Westford Mill**: Sustainable blank tote bags, cotton bags for branding, recycled bags, jute & natural fibre, ethical promotional bags

---

## 10. User Roles & CMS Workflows

### 10.1 Roles
| Role | Purpose |
|------|---------|
| Website Manager | Full admin, governance, publishing authority, navigation/search tuning, A/B tests, redirects |
| Digital Editor | Senior editor — all content types, advanced digital tasks, QA |
| Product Content Editor | Product pages, taxonomy, attributes, variants, imagery |
| Editorial Content Editor | Brand pages, sustainability, campaigns, micro-edits, seasonal hubs |
| Reviewer | Creative/campaign/brand/sustainability input — view/comment/approve only |
| Legal Reviewer | Privacy, cookies, T&Cs approval |
| Technical Administrator | Deployments, rollbacks, access roles, integrations |

### 10.2 Publishing Workflows
All content follows a **Create → QA → Review → Publish** pipeline:
- **Product Pages**: Product Content Editor → Digital Editor (QA) → Reviewer → Website Manager (publish)
- **Editorial Pages**: Editorial Content Editor → Digital Editor (QA) → Reviewer → Website Manager (publish)
- **Micro-Edits**: Editorial Content Editor → Creative Reviewer → Campaign Reviewer → Digital Editor (QA) → Website Manager
- **Seasonal Hubs**: Campaign/Brand Reviewer (theme) → Editorial Content Editor (build) → Creative Reviewer → Digital Editor (QA) → Website Manager
- **Legal Pages**: Editorial Content Editor → Legal Reviewer → Website Manager

---

## 11. User Journey Priorities

Based on discovery research, the top 10 user journeys to support:

1. **Single Product RFQ** — Check price & availability quickly (decorators, distributors, specifiers)
2. **Browse Category → PDP** — Explore a product type (all audiences)
3. **Search → Shortlist → PDP** — Find known SKU/style (all audiences)
4. **Download Assets** — Get product images and artwork (decorators, marketers)
5. **Distributor Enquiry** — Evaluate becoming a partner (potential distributors)
6. **Industries → Find a Decorator** — Find products + decorator for a project (specifiers)
7. **Corporate Programme Enquiry** — Understand bespoke programmes (corporate buyers)
8. **Community Gated Area** — Access exclusive assets & alerts (registered users)
9. **Multi-Product Project Builder** — Build multi-SKU shortlist with notes/export (decorators, specifiers)
10. **Monthly Micro-Edit Journey** — Engage with campaigns, see trend products (all audiences)

---

## 12. Customer Insights Summary

### From Survey (32 responses)
- **75% are decorators**, 18.8% distributors
- **68.8% purchasing 3+ years** — loyal, experienced base
- **71.9% visit for product details** — PDP is the #1 destination
- **50% find info "very easy"**, but 6.3% find it "somewhat difficult"
- Key requests: better sizing details (hat circumference), decoration instructions, social-media-ready images, stock availability

### From Decorator Interviews
- Site is secondary to distributor portals (Ralawise, Binder) — needs stronger reasons to visit
- Need **decorated/use-case imagery** (not just blank products)
- Need **stock visibility** across distributors
- Need **approved decorator directory** for lead generation
- Navigation filters are too granular — simplify
- Want trend-based SEO and campaign-tied content
- Want **2-3 clicks max** to reach core info
- Consider split landing ("Decorator / Distributor") for immediate journey guidance

---

## 13. Implementation Approach

**Technology**: Static HTML, CSS, and vanilla JavaScript
**Lead Site**: Beechfield Original Headwear (built first as the template for the other 3 brand sites)

### Project Structure
```
Claude-code/
├── sites/
│   ├── shared/                          # Shared CSS, JS, and HTML partials
│   │   ├── css/
│   │   │   ├── variables.css            # CSS custom properties (colours, typography, spacing)
│   │   │   ├── reset.css                # CSS reset/normalize
│   │   │   ├── base.css                 # Base typography, links, headings
│   │   │   ├── layout.css               # Grid system, containers, responsive breakpoints
│   │   │   ├── components.css           # Shared components (buttons, cards, forms, tables)
│   │   │   ├── navigation.css           # Mega menu, mobile nav, brand switcher
│   │   │   └── footer.css               # Shared footer styles
│   │   ├── js/
│   │   │   ├── navigation.js            # Mega menu toggle, mobile hamburger, dropdowns
│   │   │   ├── search.js                # Predictive search with SKU support
│   │   │   ├── filters.js               # PLP filter/sort functionality
│   │   │   └── utils.js                 # Shared utilities
│   │   └── partials/                    # Reusable HTML snippets (for copy/include)
│   │       ├── header.html              # Brand switcher + main nav shell
│   │       ├── footer.html              # Footer template
│   │       ├── decorator-academy.html   # Shared Decorator Academy section
│   │       └── where-to-buy.html        # Where to Buy section
│   │
│   ├── beechfield-brands/               # Corporate site (beechfieldbrands.com)
│   │   ├── index.html                   # Homepage
│   │   ├── css/brand.css                # Brand-specific overrides & colours
│   │   ├── our-brands/
│   │   │   ├── index.html               # Brands overview
│   │   │   ├── beechfield.html
│   │   │   ├── bagbase.html
│   │   │   ├── quadra.html
│   │   │   └── westford-mill.html
│   │   ├── sustainability/
│   │   │   ├── index.html               # Sustainability Hub
│   │   │   ├── our-commitment.html
│   │   │   ├── responsible-sourcing.html
│   │   │   ├── manufacturing.html
│   │   │   ├── certifications.html
│   │   │   ├── materials-fibres.html
│   │   │   └── impact-updates.html
│   │   ├── distributors/
│   │   │   ├── index.html               # Distributor Hub
│   │   │   ├── why-partner.html
│   │   │   ├── brand-ambassadors.html
│   │   │   ├── request-a-visit.html
│   │   │   ├── become-a-distributor.html
│   │   │   └── request-pos.html
│   │   ├── about-us/
│   │   │   ├── index.html
│   │   │   ├── our-story.html
│   │   │   ├── our-impact.html
│   │   │   ├── our-values.html
│   │   │   ├── meet-the-team.html
│   │   │   ├── press.html
│   │   │   ├── events.html
│   │   │   └── careers.html
│   │   └── contact.html
│   │
│   ├── beechfield/                      # Beechfield Original Headwear (beechfield.com) — BUILD FIRST
│   │   ├── index.html                   # Homepage (hero → micro-edit, seasonal hub)
│   │   ├── css/brand.css                # Beechfield-specific colours & overrides
│   │   ├── products/
│   │   │   ├── caps/index.html          # PLP: Caps
│   │   │   ├── beanies/index.html       # PLP: Beanies
│   │   │   ├── bucket-hats/index.html   # PLP: Bucket Hats
│   │   │   ├── visors/index.html        # PLP: Visors
│   │   │   ├── performance/index.html   # PLP: Performance
│   │   │   ├── accessories/index.html   # PLP: Accessories
│   │   │   └── [sku]/index.html         # PDP template (e.g., b688.html)
│   │   ├── purpose/
│   │   │   ├── outdoors.html
│   │   │   ├── sports.html
│   │   │   ├── promotion.html
│   │   │   ├── fashion.html
│   │   │   ├── kids.html
│   │   │   ├── workwear.html
│   │   │   └── gifting.html
│   │   ├── decoration/
│   │   │   ├── embroidery.html
│   │   │   ├── patches.html
│   │   │   ├── transfer.html
│   │   │   ├── screen-print.html
│   │   │   ├── dtg.html
│   │   │   ├── sublimation.html
│   │   │   └── deboss-foil-laser.html
│   │   ├── cap-studio/                  # Unique to Beechfield
│   │   │   ├── index.html               # Cap Studio landing
│   │   │   ├── shapes.html              # Shape guide (baseball, trucker, dad hat, etc.)
│   │   │   ├── fabrics.html             # Fabric guide
│   │   │   ├── colours.html             # Colour library
│   │   │   └── glossary.html            # Terminology glossary
│   │   ├── collections/
│   │   │   ├── originals.html
│   │   │   ├── morf.html
│   │   │   ├── snowstar.html
│   │   │   ├── suprafleece.html
│   │   │   ├── earthaware.html
│   │   │   ├── vintage.html
│   │   │   └── urbanwear.html
│   │   ├── lookbooks/
│   │   │   ├── ss26.html
│   │   │   └── aw25-26.html
│   │   ├── decorator-academy/
│   │   │   ├── index.html
│   │   │   ├── designed-for-decoration.html
│   │   │   ├── techniques.html
│   │   │   ├── decoration-protection.html
│   │   │   ├── how-to-videos.html
│   │   │   └── join-the-community.html
│   │   ├── resources/
│   │   │   ├── blog/index.html
│   │   │   └── faqs.html
│   │   ├── where-to-buy/
│   │   │   ├── how-to-buy.html
│   │   │   ├── find-a-distributor.html
│   │   │   └── inventory-finder.html
│   │   ├── about/
│   │   │   ├── our-values.html
│   │   │   └── sustainability.html
│   │   └── campaign/                    # Campaign content
│   │       ├── ss26/index.html          # Seasonal hub
│   │       └── micro-edits/
│   │           └── [month].html         # Monthly micro-edit template
│   │
│   ├── bagbase/                         # BagBase (bagbase.com) — Phase 3b
│   │   └── ... (same pattern as beechfield, with brand-specific categories)
│   │
│   ├── quadra/                          # Quadra (quadrabags.com) — Phase 3c
│   │   └── ... (same pattern, + guides/ for technique & material guides)
│   │
│   └── westford-mill/                   # Westford Mill (westfordmill.com) — Phase 3d
│       └── ... (same pattern, + fabric/ for fabric & origin guide, tote selector)
│
├── docs/
│   └── website-plan.md                  # This plan document
│
└── assets/                              # Placeholder images, icons
    ├── icons/
    └── images/
```

### Build Order

**Phase 1: Shared Foundation** (files: `sites/shared/`)
1. CSS design system — `variables.css` with brand colour tokens, typography scale, spacing
2. Base styles — `reset.css`, `base.css`, `layout.css` (responsive grid)
3. Component styles — `components.css` (buttons, cards, product cards, forms, tables, badges)
4. Navigation — `navigation.css` + `navigation.js` (mega menu with hover/click, mobile hamburger, brand switcher)
5. Footer — `footer.css` + `partials/footer.html`
6. Search — `search.js` (predictive search bar)
7. Filters — `filters.js` (PLP filter/sort)

**Phase 2: Beechfield Original Headwear** (lead site — `sites/beechfield/`)
1. Homepage (`index.html`) — hero banner → current micro-edit, secondary modules → seasonal hub, featured products, collections
2. Mega menu navigation — full Product Ranges mega menu with Featured/Type/Purpose/Decoration/Colour columns
3. Product listing pages (PLPs) — Caps, Beanies, Bucket Hats, Visors, Performance, Accessories — with filters and product grid
4. Product detail page (PDP) template — full spec table, decoration guidance, images, stock indicator, Where to Buy CTA
5. Cap Studio — Shape guide, Fabric guide, Colour library, Glossary (unique differentiator)
6. Decoration pages — one per technique (Embroidery, Patches, Transfer, Screen Print, DTG, Sublimation, Deboss)
7. Purpose pages — Outdoors, Sports, Promotion, Fashion, Kids, Workwear, Gifting
8. Collections pages — Originals, Morf, Snowstar, Suprafleece, EarthAware, Vintage, Urbanwear
9. Decorator Academy — Designed for Decoration, Techniques, Decoration Protection, Videos, Join Community
10. Campaign pages — Seasonal hub (SS26) + micro-edit template
11. Resources — Blog, FAQs
12. Where to Buy — How to Buy, Find a Distributor, Inventory Finder
13. About — Our Values, Sustainability

**Phase 3a: Corporate Site** (`sites/beechfield-brands/`)
- Homepage, Our Brands (5 pages), Sustainability Hub (7 pages), Distributor Hub (7 pages), About Us (8 pages), Contact

**Phase 3b-d: Remaining Brand Sites** (using Beechfield as template)
- **BagBase** (`sites/bagbase/`) — adapt mega menu for bag categories + quick-compare feature on PLPs
- **Quadra** (`sites/quadra/`) — adapt for purpose-led navigation + Technique/Material Guides section
- **Westford Mill** (`sites/westford-mill/`) — adapt for fabric-led navigation + Sustainability Hub + Tote Selector

**Phase 4: Campaign & Content Templates**
- Seasonal hub HTML template
- Micro-edit HTML template
- Evergreen edit HTML template

**Phase 5: Advanced Interactive Features** (JS-driven)
- Multi-product Project Builder
- Stock visibility display
- Approved Decorators Directory
- Community gated area

---

## 14. Verification & Testing

1. **Open in browser**: Open each `index.html` directly in a browser to verify rendering
2. **Navigation testing**: Click through all mega menu links to verify correct destinations
3. **Responsive design**: Test at 320px, 768px, 1024px, and 1440px breakpoints
4. **URL structure**: Verify all file paths match the proposed URL structures from the spreadsheets
5. **Cross-brand navigation**: Test brand switcher links correctly across all site directories
6. **Filter functionality**: Test PLP JavaScript filters work with colour, type, purpose, and decoration
7. **Search**: Test predictive search returns results for SKU codes and product names
8. **Accessibility**: Run through WAVE or axe-core for WCAG 2.1 AA compliance
9. **Performance**: Check all pages load under 3s with no external dependencies blocking render
10. **Content completeness**: Verify all page types have proper content structure matching the discovery documents

# Beechfield Original Headwear — Revised Site Plan

**Version:** 2.0
**Date:** 2026-02-17
**Status:** Revised plan — based on extensive research and content audit

---

## Table of Contents

1. [Overview](#overview)
2. [Existing Pages](#existing-pages)
3. [Navigation Structure](#navigation-structure)
4. [Full Page Inventory](#full-page-inventory)
5. [Implementation Phases](#implementation-phases)
6. [Counts Summary](#counts-summary)
7. [Navigation Changes Summary](#navigation-changes-summary)

---

## Overview

This document is the comprehensive site plan for the Beechfield Original Headwear website. It captures the complete page inventory, identifies what exists versus what needs building, defines the revised navigation structure, and lays out the phased implementation approach.

---

## Existing Pages

12 pages currently exist in the codebase.

| # | Page | Path | Notes |
|---|------|------|-------|
| 1 | Homepage | `index.html` | Complete |
| 2 | Caps PLP | `products/caps/index.html` | Complete |
| 3 | Beanies PLP | `products/beanies/index.html` | Complete |
| 4 | B688 Heritage Cord Cap PDP | `products/b688.html` | Complete |
| 5 | Cap Studio landing | `cap-studio/index.html` | Complete |
| 6 | Shapes Guide | `cap-studio/shapes.html` | Complete |
| 7 | Collections hub | `collections/index.html` | Complete |
| 8 | Decorator Academy landing | `decorator-academy/index.html` | Complete |
| 9 | Our Values | `about/our-values.html` | Complete; needs rename to `about-beechfield` |
| 10 | Where to Buy | `where-to-buy/index.html` | Complete |
| 11 | FAQs | `resources/faqs.html` | Complete |
| 12 | SS26 Campaign | `campaign/ss26/index.html` | Complete; needs redesign as lookbook |

---

## Navigation Structure

The revised navigation replaces the current structure entirely.

### Top Bar

| Position | Content |
|----------|---------|
| **Left** | Our Brands: Beechfield Brands, **Beechfield** (active), BagBase, Quadra, Westford Mill |
| **Right** | Find a Distributor, Marketing Centre |

### Primary Navigation (7 items)

#### 1. Product Ranges (mega menu, 5 columns)

| Featured | By Type | By Purpose | By Decoration | By Colour |
|----------|---------|------------|---------------|-----------|
| New In | Caps | Outdoors | Embroidery | Black |
| Hero Products | Beanies | Sports | Patches | Navy |
| Best Sellers | Bucket Hats | Promotion | Transfer | Grey |
| Trending | Visors | Fashion | Screen Print | White |
| Eco-Styles | Performance | Kids | DTG | Red |
| All Products | Accessories | Workwear | Sublimation | Green |
| | | Gifting | Deboss/Foil/Laser | Blue |

#### 2. Collections (mega menu, 3 columns)

| Collections | Lookbooks | Seasonal |
|-------------|-----------|----------|
| Originals | SS26 Lookbook | Spring/Summer 2026 |
| Morf | AW25/26 Lookbook | |
| Snowstar | | |
| Suprafleece | | |
| EarthAware | | |
| Vintage | | |
| Urbanwear | | |

#### 3. Cap Studio (mega menu, 3 columns)

| Cap Studio | Guides | Resources |
|------------|--------|-----------|
| Cap Studio (landing) | Find Your Perfect Cap (tool) | Colour Library |
| | Guides Hub | Glossary |
| | Anatomy of a Cap | |
| | Shapes Guide | |
| | Branding & Decoration Guide | |
| | Materials & Responsible Choices | |

#### 4. Decorator Academy (mega menu, 3 columns)

| Learn | Tools & Media | Community |
|-------|---------------|-----------|
| Designed for Decoration | How-to Videos | Join the Community |
| Techniques Hub | Decorator Studio | |
| Embroidery | In the Wild | |
| Patches | Glossary | |
| Transfer | Colours | |

#### 5. About (mega menu, 3 columns)

Replaces the old "Where to Buy" + "About" combination and the standalone "Resources" nav item.

| About | More | |
|-------|------|-|
| About Beechfield | Events | |
| Materials & Fabrics | Press | |
| Quality & Compliance | Blog/Journal | |
| Responsible Choices | FAQs | |
| Stock & Service Promise | Contact | |

> **Note:** There is no separate "Resources" top-level nav item. Blog and FAQs move into About > More.

#### 6. Where to Buy (mega menu, 2 columns)

| Buy | Marketing Centre |
|-----|-----------------|
| How to Buy | Overview |
| Find a Distributor | Sign Up |
| Inventory Finder | Login |

#### 7. Marketing Centre (top-bar utility button)

Appears in the top bar as a utility link (see Top Bar section above).

### Footer

| Brand | Products | Support | Legal |
|-------|----------|---------|-------|
| Beechfield | Caps | About Us | Terms & Conditions |
| Tagline | Beanies | FAQs | Modern Slavery Statement |
| Social links | Bucket Hats | My Account | Privacy Statement |
| | Visors | Inventory Finder | |
| | Performance | Find a Distributor | |
| | Accessories | Join the Community | |
| | | Become a Distributor | |
| | | Contact Us | |

---

## Full Page Inventory

### Products — Hero Product Pages

Editorial storytelling pages for hero products.

| Page | Path | Status | Priority |
|------|------|--------|----------|
| B45 Original Cuffed Beanie | `products/b45.html` | NEW | P1 |
| B655 Dad Cap | `products/b655.html` | NEW | P1 |
| B640 Snapback Trucker | `products/b640.html` | NEW | P1 |
| B15 Baseball Cap | `products/b15.html` | NEW | P1 |
| B10 Baseball Cap | `products/b10.html` | NEW | P1 |
| B688 Heritage Cord Cap | `products/b688.html` | EXISTS | - |

### Products — PLPs (Product Listing Pages)

| Page | Path | Status |
|------|------|--------|
| Caps | `products/caps/index.html` | EXISTS |
| Beanies | `products/beanies/index.html` | EXISTS |

### Cap Studio

| Page | Path | Status | Description |
|------|------|--------|-------------|
| Cap Studio landing | `cap-studio/index.html` | EXISTS (update nav) | Intro to Beechfield cap expertise |
| Find Your Perfect Cap | `cap-studio/find-your-cap.html` | NEW P2 | Interactive selector tool |
| Guides Hub | `cap-studio/guides/index.html` | NEW P2 | Index of guides |
| Anatomy of a Cap | `cap-studio/guides/anatomy.html` | NEW P2 | Glossary explainer |
| Shapes Guide | `cap-studio/shapes.html` | EXISTS (update nav) | Shape families guide |
| Branding & Decoration Guide | `cap-studio/guides/branding-decoration.html` | NEW P2 | Decorator-first guide |
| Materials & Responsible Choices | `cap-studio/guides/materials.html` | NEW P3 | Materials explanation |

### Collections

| Page | Path | Status |
|------|------|--------|
| Collections hub | `collections/index.html` | EXISTS (update nav) |
| Originals | `collections/originals.html` | NEW P2 |
| Morf | `collections/morf.html` | NEW P2 |
| Snowstar | `collections/snowstar.html` | NEW P2 |
| Suprafleece | `collections/suprafleece.html` | NEW P2 |
| EarthAware | `collections/earthaware.html` | NEW P2 |
| Vintage | `collections/vintage.html` | NEW P2 |
| Urbanwear | `collections/urbanwear.html` | NEW P2 |

### Decorator Academy

| Page | Path | Status |
|------|------|--------|
| Landing | `decorator-academy/index.html` | EXISTS (update nav + content) |
| Designed for Decoration | `decorator-academy/designed-for-decoration.html` | NEW P2 |
| Techniques Hub | `decorator-academy/techniques/index.html` | NEW P2 |
| Embroidery | `decorator-academy/techniques/embroidery.html` | NEW P2 |
| Patches | `decorator-academy/techniques/patches.html` | NEW P2 |
| Transfer | `decorator-academy/techniques/transfer.html` | NEW P2 |
| How-to Videos | `decorator-academy/videos.html` | NEW P3 |
| Decorator Studio | `decorator-academy/decorator-studio.html` | NEW P3 |
| In the Wild | `decorator-academy/in-the-wild.html` | NEW P3 |
| Glossary | `decorator-academy/glossary.html` | NEW P3 |
| Colours | `decorator-academy/colours.html` | NEW P3 |

### About

| Page | Path | Status |
|------|------|--------|
| About landing | `about/index.html` | NEW P1 |
| About Beechfield | `about/about-beechfield.html` | NEW P1 (replaces `our-values.html`) |
| Materials & Fabrics | `about/materials-and-fabrics.html` | NEW P2 |
| Quality & Compliance | `about/quality-and-compliance.html` | NEW P2 |
| Responsible Choices | `about/responsible-choices.html` | NEW P2 |
| Stock & Service Promise | `about/stock-and-service-promise.html` | NEW P2 |
| Events | `about/events.html` | NEW P3 |
| Press | `about/press.html` | NEW P3 |
| Contact | `about/contact.html` | NEW P2 |

### Journal / Blog

| Page | Path | Status |
|------|------|--------|
| Blog/Journal | `journal/index.html` | NEW P3 |
| Join the Community | `journal/join-the-community.html` | NEW P3 |

### Where to Buy

| Page | Path | Status |
|------|------|--------|
| Where to Buy landing | `where-to-buy/index.html` | EXISTS (update nav) |
| How to Buy | `where-to-buy/how-to-buy.html` | NEW P2 |
| Find a Distributor | `where-to-buy/find-a-distributor.html` | NEW P2 |
| Inventory Finder | `where-to-buy/inventory-finder.html` | NEW P3 |

### Marketing Centre

| Page | Path | Status |
|------|------|--------|
| Editorial landing (public) | `marketing-centre/index.html` | NEW P2 |
| Sign Up (public) | `marketing-centre/sign-up.html` | NEW P3 |
| Login (public) | `marketing-centre/login.html` | NEW P3 |
| Library home (logged in) | `marketing-centre/library/index.html` | NEW P3 |
| Product photography & video | `marketing-centre/product-photography-video.html` | NEW P3 |
| Product documents | `marketing-centre/product-documents.html` | NEW P3 |
| Campaign toolkits | `marketing-centre/campaign-toolkits.html` | NEW P3 |
| Templates & guidelines | `marketing-centre/templates-guidelines.html` | NEW P3 |
| Lookbooks | `marketing-centre/lookbooks.html` | NEW P3 |
| Marketing Centre FAQs | `marketing-centre/faqs.html` | NEW P3 |
| Marketing Centre Contact | `marketing-centre/contact.html` | NEW P3 |

### Campaign / Seasonal

| Page | Path | Status |
|------|------|--------|
| SS26 Campaign/Lookbook | `campaign/ss26/index.html` | EXISTS (redesign as visual lookbook) |

---

## Implementation Phases

### Phase 1 — Foundation (Priority)

**Scope:** 8 new pages + navigation updates across all 12 existing pages

| # | Task | Details |
|---|------|---------|
| 1 | Update navigation | Apply revised nav structure to all 12 existing pages |
| 2 | Hero Product Pages (5) | `products/b45.html`, `products/b655.html`, `products/b640.html`, `products/b15.html`, `products/b10.html` |
| 3 | About landing | `about/index.html` |
| 4 | About Beechfield | `about/about-beechfield.html` (replaces `about/our-values.html`) |
| 5 | SS26 Campaign redesign | Redesign `campaign/ss26/index.html` as a visual lookbook |

### Phase 2 — Core Content

**Scope:** ~20 new pages

| # | Task | Pages |
|---|------|-------|
| 1 | Cap Studio guides | Find Your Perfect Cap, Guides Hub, Anatomy of a Cap, Branding & Decoration Guide (4 pages) |
| 2 | Collection child pages | Originals, Morf, Snowstar, Suprafleece, EarthAware, Vintage, Urbanwear (7 pages) |
| 3 | Decorator Academy core | Designed for Decoration, Techniques Hub, Embroidery, Patches, Transfer (5 pages) |
| 4 | About section | Materials & Fabrics, Quality & Compliance, Responsible Choices, Stock & Service Promise, Contact (5 pages) |
| 5 | Where to Buy children | How to Buy, Find a Distributor (2 pages) |
| 6 | Marketing Centre landing | `marketing-centre/index.html` (1 page) |

### Phase 3 — Extended Content

**Scope:** ~15 new pages

| # | Task | Pages |
|---|------|-------|
| 1 | Decorator Academy extended | How-to Videos, Decorator Studio, In the Wild, Glossary, Colours (5 pages) |
| 2 | About extended | Events, Press (2 pages) |
| 3 | Journal/Blog | Blog/Journal index, Join the Community (2 pages) |
| 4 | Marketing Centre logged-in | Library, Photography & Video, Product Documents, Campaign Toolkits, Templates & Guidelines, Lookbooks (6 pages) |
| 5 | Marketing Centre support | FAQs, Contact, Sign Up, Login (4 pages) |
| 6 | Where to Buy extended | Inventory Finder (1 page) |
| 7 | Cap Studio extended | Materials & Responsible Choices (1 page) |

---

## Counts Summary

| Category | Count |
|----------|-------|
| Existing pages | 12 |
| Phase 1 new pages | 8 |
| Phase 2 new pages | ~20 |
| Phase 3 new pages | ~15 |
| **Total site pages** | **~55** |

---

## Navigation Changes Summary

The main structural changes from the current navigation to the revised navigation are:

1. **About section expanded** — Was 2 links (Our Values, Sustainability) tucked under Where to Buy. Now a full top-level nav item with 10+ children across 2 columns (About, More).

2. **Resources removed as top-level nav** — Blog moves to About > More. FAQs move to About > More. The assets section becomes the standalone Marketing Centre.

3. **Decorator Academy expanded** — Was 4 links (Learn) + 1 (Community). Now 3 columns (Learn, Tools & Media, Community) with 11 children total.

4. **Cap Studio expanded** — Gains a Guides Hub and sub-guides. The interactive Find Your Perfect Cap tool is added.

5. **Marketing Centre added** — Appears both as a utility link in the top bar and as a section nested under the Where to Buy mega menu.

6. **Footer updated** — My Account added, Contact Us added, references to blog/journal routes updated.

---

*This document should be kept up to date as pages are built and the site structure evolves.*

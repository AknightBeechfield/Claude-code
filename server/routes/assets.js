const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const IMAGES_PATH = path.join(__dirname, '..', 'data', 'product-images.json');
let imagesCache = null;

function getImages() {
  if (!imagesCache) {
    imagesCache = JSON.parse(fs.readFileSync(IMAGES_PATH, 'utf8'));
  }
  return imagesCache;
}

// GET /api/products/:sku/assets — all mediahub image URLs for a product
router.get('/:sku/assets', (req, res) => {
  const sku = req.params.sku.toUpperCase();
  const images = getImages();
  const data = images[sku];

  if (!data) {
    return res.status(404).json({ error: 'No images found for this product' });
  }

  // Collect all unique URLs for download
  const allUrls = new Set();
  if (data.hero) allUrls.add(data.hero);
  (data.lifestyle || []).forEach(u => allUrls.add(u));
  (data.rear || []).forEach(u => allUrls.add(u));
  (data.detail || []).forEach(u => allUrls.add(u));
  (data.stillLife || []).forEach(u => allUrls.add(u));
  (data.group || []).forEach(u => allUrls.add(u));
  Object.values(data.colours || {}).forEach(u => allUrls.add(u));

  res.json({
    sku,
    hero: data.hero,
    lifestyle: data.lifestyle || [],
    rear: data.rear || [],
    detail: data.detail || [],
    stillLife: data.stillLife || [],
    group: data.group || [],
    colours: data.colours || {},
    totalImages: data.totalImages || allUrls.size,
    allUrls: [...allUrls],
  });
});

module.exports = router;

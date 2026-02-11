/* ==========================================================================
   PLP Filters — Filter & sort product grids
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  initSort();
  initChips();
});

/* ── Filter system ── */
function initFilters() {
  const filterToggles = document.querySelectorAll('[data-filter-group]');

  filterToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const group = toggle.dataset.filterGroup;
      const panel = document.querySelector(`[data-filter-panel="${group}"]`);

      if (panel) {
        panel.classList.toggle('filter-panel--open');
        toggle.classList.toggle('filter-toggle--open');
      }
    });
  });

  // Filter checkboxes
  const checkboxes = document.querySelectorAll('.filter-checkbox');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', applyFilters);
  });
}

function applyFilters() {
  const activeFilters = {};
  const checkboxes = document.querySelectorAll('.filter-checkbox:checked');

  checkboxes.forEach(cb => {
    const group = cb.dataset.group;
    if (!activeFilters[group]) activeFilters[group] = [];
    activeFilters[group].push(cb.value.toLowerCase());
  });

  const products = document.querySelectorAll('.product-card[data-filters]');

  products.forEach(product => {
    const productFilters = JSON.parse(product.dataset.filters || '{}');
    let visible = true;

    for (const [group, values] of Object.entries(activeFilters)) {
      const productValue = (productFilters[group] || '').toLowerCase();
      if (!values.some(v => productValue.includes(v))) {
        visible = false;
        break;
      }
    }

    product.style.display = visible ? '' : 'none';
  });

  updateActiveChips(activeFilters);
  updateResultCount();
}

/* ── Sort ── */
function initSort() {
  const sortSelect = document.querySelector('.sort-select');
  if (!sortSelect) return;

  sortSelect.addEventListener('change', () => {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;

    const items = Array.from(grid.querySelectorAll('.product-card'));
    const sortBy = sortSelect.value;

    items.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return (a.dataset.name || '').localeCompare(b.dataset.name || '');
        case 'name-desc':
          return (b.dataset.name || '').localeCompare(a.dataset.name || '');
        case 'sku-asc':
          return (a.dataset.sku || '').localeCompare(b.dataset.sku || '');
        case 'newest':
          return (b.dataset.date || '').localeCompare(a.dataset.date || '');
        default:
          return 0;
      }
    });

    items.forEach(item => grid.appendChild(item));
  });
}

/* ── Active filter chips ── */
function initChips() {
  document.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.chip__remove');
    if (!removeBtn) return;

    const chip = removeBtn.closest('.chip');
    if (!chip) return;

    const group = chip.dataset.chipGroup;
    const value = chip.dataset.chipValue;

    const checkbox = document.querySelector(
      `.filter-checkbox[data-group="${group}"][value="${value}"]`
    );

    if (checkbox) {
      checkbox.checked = false;
      applyFilters();
    }
  });
}

function updateActiveChips(activeFilters) {
  const container = document.querySelector('.active-filters');
  if (!container) return;

  container.innerHTML = '';

  for (const [group, values] of Object.entries(activeFilters)) {
    values.forEach(value => {
      const chip = document.createElement('span');
      chip.className = 'chip chip--active';
      chip.dataset.chipGroup = group;
      chip.dataset.chipValue = value;
      chip.innerHTML = `${value} <button class="chip__remove" aria-label="Remove filter">&times;</button>`;
      container.appendChild(chip);
    });
  }

  if (Object.keys(activeFilters).length > 0) {
    const clearAll = document.createElement('button');
    clearAll.className = 'btn btn-sm btn-secondary';
    clearAll.textContent = 'Clear all';
    clearAll.addEventListener('click', clearAllFilters);
    container.appendChild(clearAll);
  }
}

function clearAllFilters() {
  document.querySelectorAll('.filter-checkbox:checked').forEach(cb => {
    cb.checked = false;
  });
  applyFilters();
}

function updateResultCount() {
  const counter = document.querySelector('.result-count');
  if (!counter) return;

  const visible = document.querySelectorAll('.product-card:not([style*="display: none"])').length;
  const total = document.querySelectorAll('.product-card').length;
  counter.textContent = `Showing ${visible} of ${total} products`;
}

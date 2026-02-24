/* ==========================================================================
   PLP Filters — Filter, sort & count for product listing grids
   Works with the .pc / .plp-filter / .plp-sidebar / .plp-col-tab markup
   ========================================================================== */

(function () {
  'use strict';

  /* ── State ── */
  var activeFilters = {};          // { type: 'caps', collection: 'earthaware', purpose: 'sports' }
  var currentSort   = 'bestselling';

  /* ── DOM refs (cached on init) ── */
  var grid, products, promoBlock, headerCount, loadMoreBtn;
  var toolbarBtns, collectionTabs, sidebarLinks, sortSelect;
  var activeFiltersBar;

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function () {
    grid           = document.querySelector('.plp-grid');
    promoBlock     = grid ? grid.querySelector('.plp-promo') : null;
    headerCount    = document.querySelector('.plp-header__count');
    loadMoreBtn    = document.querySelector('.plp-loadmore');
    toolbarBtns    = document.querySelectorAll('.plp-filter[data-filter-group]');
    collectionTabs = document.querySelectorAll('.plp-col-tab[data-filter-value]');
    sidebarLinks   = document.querySelectorAll('.plp-sidebar__link[data-filter-group]');
    sortSelect     = document.querySelector('.plp-sort__select');
    activeFiltersBar = document.querySelector('.plp-active-filters');

    if (!grid) return;

    cacheProducts();
    bindToolbar();
    bindCollectionTabs();
    bindSidebar();
    bindSort();
    updateCounts();
  });

  function cacheProducts() {
    products = Array.prototype.slice.call(
      grid.querySelectorAll('.pc[data-type]')
    );
  }

  /* ── Toolbar type buttons ── */
  function bindToolbar() {
    toolbarBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var group = btn.getAttribute('data-filter-group');
        var value = btn.getAttribute('data-filter-value');

        if (value === 'all') {
          delete activeFilters[group];
        } else if (activeFilters[group] === value) {
          delete activeFilters[group];
        } else {
          activeFilters[group] = value;
        }

        applyFilters();
        updateToolbarActive();
        updateSidebarActive();
        updateCollectionTabActive();
        updateFilterPills();
      });
    });
  }

  /* ── Collection tabs ── */
  function bindCollectionTabs() {
    collectionTabs.forEach(function (tab) {
      tab.addEventListener('click', function (e) {
        e.preventDefault();
        var value = tab.getAttribute('data-filter-value');

        if (value === 'all') {
          delete activeFilters.collection;
        } else if (activeFilters.collection === value) {
          delete activeFilters.collection;
        } else {
          activeFilters.collection = value;
        }

        applyFilters();
        updateToolbarActive();
        updateSidebarActive();
        updateCollectionTabActive();
        updateFilterPills();
      });
    });
  }

  /* ── Sidebar links ── */
  function bindSidebar() {
    sidebarLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var group = link.getAttribute('data-filter-group');
        var value = link.getAttribute('data-filter-value');

        if (value === 'all') {
          delete activeFilters[group];
        } else if (activeFilters[group] === value) {
          delete activeFilters[group];
        } else {
          activeFilters[group] = value;
        }

        applyFilters();
        updateToolbarActive();
        updateSidebarActive();
        updateCollectionTabActive();
        updateFilterPills();
      });
    });
  }

  /* ── Sort ── */
  function bindSort() {
    if (!sortSelect) return;
    sortSelect.addEventListener('change', function () {
      currentSort = sortSelect.value;
      applySorting();
    });
  }

  /* ── Apply filters ── */
  function applyFilters() {
    var visibleCount = 0;

    products.forEach(function (card) {
      var visible = true;

      for (var group in activeFilters) {
        if (!activeFilters.hasOwnProperty(group)) continue;
        var filterVal = activeFilters[group];
        var cardVal   = (card.getAttribute('data-' + group) || '').toLowerCase();

        // Support space-separated multi-values (e.g. data-purpose="promotion sports")
        var cardValues = cardVal.split(/\s+/);
        if (cardValues.indexOf(filterVal) === -1) {
          visible = false;
          break;
        }
      }

      card.style.display = visible ? '' : 'none';
      if (visible) visibleCount++;
    });

    // Keep promo block visible unless a specific type/collection filter hides it contextually
    if (promoBlock) {
      promoBlock.style.display = '';
    }

    // Hide "Load More" when filters are active
    if (loadMoreBtn) {
      loadMoreBtn.style.display = Object.keys(activeFilters).length > 0 ? 'none' : '';
    }

    // Update header count
    if (headerCount) {
      var total = products.length;
      if (Object.keys(activeFilters).length === 0) {
        headerCount.textContent = 'Showing ' + total + ' styles';
      } else {
        headerCount.textContent = 'Showing ' + visibleCount + ' of ' + total + ' styles';
      }
    }
  }

  /* ── Sorting ── */
  function applySorting() {
    var sorted = products.slice();

    sorted.sort(function (a, b) {
      switch (currentSort) {
        case 'name-asc':
          return (a.getAttribute('data-name') || '').localeCompare(b.getAttribute('data-name') || '');
        case 'name-desc':
          return (b.getAttribute('data-name') || '').localeCompare(a.getAttribute('data-name') || '');
        case 'newest':
          return (b.getAttribute('data-date') || '').localeCompare(a.getAttribute('data-date') || '');
        case 'sku-asc':
          return compareSku(a.getAttribute('data-sku') || '', b.getAttribute('data-sku') || '');
        default: // bestselling — use original DOM order
          return 0;
      }
    });

    // Re-append in sorted order (promo block stays in place via CSS grid)
    sorted.forEach(function (card) {
      grid.appendChild(card);
    });

    // Re-append promo block after 4th product for visual consistency
    if (promoBlock && sorted.length >= 4) {
      var fourthCard = sorted[3];
      if (fourthCard && fourthCard.nextSibling) {
        grid.insertBefore(promoBlock, fourthCard.nextSibling);
      }
    }
  }

  /* Natural SKU sort: B10 < B15 < B105 < B640 */
  function compareSku(a, b) {
    var reA = /(\D+)(\d+)/;
    var matchA = a.match(reA);
    var matchB = b.match(reA);
    if (matchA && matchB) {
      var cmp = matchA[1].localeCompare(matchB[1]);
      if (cmp !== 0) return cmp;
      return parseInt(matchA[2], 10) - parseInt(matchB[2], 10);
    }
    return a.localeCompare(b);
  }

  /* ── UI state updates ── */

  function updateToolbarActive() {
    toolbarBtns.forEach(function (btn) {
      var group = btn.getAttribute('data-filter-group');
      var value = btn.getAttribute('data-filter-value');
      var isActive = (value === 'all' && !activeFilters[group]) ||
                     (activeFilters[group] === value);
      btn.classList.toggle('plp-filter--active', isActive);
    });
  }

  function updateCollectionTabActive() {
    collectionTabs.forEach(function (tab) {
      var value = tab.getAttribute('data-filter-value');
      var isActive = (value === 'all' && !activeFilters.collection) ||
                     (activeFilters.collection === value);
      tab.classList.toggle('plp-col-tab--active', isActive);
    });
  }

  function updateSidebarActive() {
    sidebarLinks.forEach(function (link) {
      var group = link.getAttribute('data-filter-group');
      var value = link.getAttribute('data-filter-value');
      var isActive = (value === 'all' && !activeFilters[group]) ||
                     (activeFilters[group] === value);
      link.classList.toggle('plp-sidebar__link--active', isActive);
    });
  }

  /* ── Active filter pills ── */
  function updateFilterPills() {
    if (!activeFiltersBar) return;
    activeFiltersBar.innerHTML = '';

    var keys = Object.keys(activeFilters);
    if (keys.length === 0) return;

    var label = document.createElement('span');
    label.className = 'plp-active-filters__label';
    label.textContent = 'Active filters:';
    activeFiltersBar.appendChild(label);

    keys.forEach(function (group) {
      var pill = document.createElement('a');
      pill.href = '#';
      pill.className = 'plp-pill';
      pill.setAttribute('data-clear-group', group);
      pill.innerHTML = activeFilters[group] + ' <span class="plp-pill__remove">&times;</span>';
      pill.addEventListener('click', function (e) {
        e.preventDefault();
        delete activeFilters[group];
        applyFilters();
        updateToolbarActive();
        updateSidebarActive();
        updateCollectionTabActive();
        updateFilterPills();
      });
      activeFiltersBar.appendChild(pill);
    });

    if (keys.length > 1) {
      var clearAll = document.createElement('a');
      clearAll.href = '#';
      clearAll.className = 'plp-pill';
      clearAll.style.background = '#888';
      clearAll.textContent = 'Clear all';
      clearAll.addEventListener('click', function (e) {
        e.preventDefault();
        activeFilters = {};
        applyFilters();
        updateToolbarActive();
        updateSidebarActive();
        updateCollectionTabActive();
        updateFilterPills();
      });
      activeFiltersBar.appendChild(clearAll);
    }
  }

  /* ── Dynamic counts ── */
  function updateCounts() {
    // Count products per type
    var typeCounts = { caps: 0, beanies: 0, hats: 0, neckwear: 0, accessories: 0 };
    var collectionCounts = {};
    var total = products.length;

    products.forEach(function (card) {
      var type = (card.getAttribute('data-type') || '').toLowerCase();
      if (typeCounts.hasOwnProperty(type)) {
        typeCounts[type]++;
      }

      var col = (card.getAttribute('data-collection') || '').toLowerCase();
      if (col) {
        collectionCounts[col] = (collectionCounts[col] || 0) + 1;
      }
    });

    // Update toolbar buttons
    toolbarBtns.forEach(function (btn) {
      var value = btn.getAttribute('data-filter-value');
      var countEl = btn.querySelector('.plp-filter__count');
      if (!countEl) return;
      if (value === 'all') {
        countEl.textContent = total;
      } else if (typeCounts.hasOwnProperty(value)) {
        countEl.textContent = typeCounts[value];
      }
    });

    // Update sidebar type badges
    sidebarLinks.forEach(function (link) {
      var group = link.getAttribute('data-filter-group');
      var value = link.getAttribute('data-filter-value');
      var badge = link.querySelector('.plp-sidebar__badge');
      if (!badge) return;

      if (group === 'type') {
        if (value === 'all') {
          badge.textContent = total;
        } else if (typeCounts.hasOwnProperty(value)) {
          badge.textContent = typeCounts[value];
        }
      }
    });

    // Update header count
    if (headerCount) {
      headerCount.textContent = 'Showing ' + total + ' styles';
    }
  }

})();

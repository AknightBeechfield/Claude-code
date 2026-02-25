/* ==========================================================================
   PLP Filters — Filter, sort & count for product listing grids
   Works with the .pc / .plp-filter / .plp-sidebar / .plp-col-tab markup
   ========================================================================== */

(function () {
  'use strict';

  /* ── State ── */
  var activeFilters = {};          // { type: 'caps', collection: 'earthaware', colour: 'blue' }
  var currentSort   = 'bestselling';
  var activeSearch  = null;        // 'studio' | 'blue' | null

  /* ── DOM refs (cached on init) ── */
  var grid, products, promoBlock, headerCount, loadMoreBtn;
  var toolbarBtns, collectionTabs, sidebarLinks, sortSelect;
  var activeFiltersBar;

  /* ── Cross-brand section refs ── */
  var cbSections = {};

  /* ── Blue image swap lookup ──
     Products that show a non-blue default image get swapped to a blue
     variant when the blue colour filter is active. Products already
     showing blue/navy as their default image are NOT listed here. */
  var blueImageSwaps = {
    'B45':   'https://mediahub.beechfieldbrands.com/asset/04729327-8f12-4c09-8ad0-3a30991c99af/Product-medium/B45-Original-Cuffed-Beanie-Dusty-Blue-Front-on-shot-01.jpg',
    'B155R': 'https://mediahub.beechfieldbrands.com/asset/8417567f-45fe-4bd3-85a6-df2ab83fb4c8/Product-medium/B155R-Accelerate-Cap-Navy-White-Product-Shot-01.jpg',
    'B165':  'https://mediahub.beechfieldbrands.com/asset/704fce81-e655-4c78-b5ce-e0770785be5b/Product-medium/B165-Club-Cap-Royal-Navy-Product.jpg',
    'B645':  'https://mediahub.beechfieldbrands.com/asset/089bd71e-4418-43d4-b0f0-82754f7f0abb/Product-medium/B645-Vintage-Snapback-Trucker-French-Navy-French-Navy-Front-on-shot.jpg',
    'B640':  'https://mediahub.beechfieldbrands.com/m/7d1480204a8fb8fb/webimage-B645-Vintage-Snapback-Trucker-French-Navy-French-Navy-Front-on-shot.png'
  };

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

    // Cache cross-brand sections
    cbSections.studio     = document.getElementById('cb-quadra-studio');
    cbSections.earthaware = document.getElementById('cb-wm-earthaware');
    cbSections.recycled   = document.getElementById('cb-recycled-grs');
    cbSections.colour     = document.getElementById('cb-colour-blue');

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

        clearSearchState();
        runFilterUpdate();
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

        clearSearchState();
        runFilterUpdate();
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

        clearSearchState();
        runFilterUpdate();
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

  /* ── Central filter update (called from all filter change paths) ── */
  function runFilterUpdate() {
    applyFilters();
    updateToolbarActive();
    updateSidebarActive();
    updateCollectionTabActive();
    updateFilterPills();
    updateCrossBrandSections();
    handleBlueImageSwaps();
  }

  /* ── Apply filters (with animation) ── */
  function applyFilters() {
    var visibleCount = 0;
    var enterIndex = 0;
    var hasActiveFilter = Object.keys(activeFilters).length > 0 || activeSearch;

    products.forEach(function (card) {
      var visible = true;

      // Text-based search filter (e.g. "studio" matches data-name)
      if (activeSearch === 'studio') {
        var name = (card.getAttribute('data-name') || '').toLowerCase();
        if (name.indexOf('studio') === -1) {
          visible = false;
        }
      }

      if (visible) {
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
      }

      var wasVisible = card.style.display !== 'none';

      if (visible) {
        card.style.display = '';
        // Animate entering cards (was hidden, now visible) with stagger
        if (!wasVisible && hasActiveFilter) {
          card.classList.remove('pc--filter-out');
          card.style.setProperty('--fi', Math.min(enterIndex, 8));
          card.classList.add('pc--filter-in');
          enterIndex++;
        } else {
          card.classList.remove('pc--filter-out', 'pc--filter-in');
          card.style.removeProperty('--fi');
        }
        visibleCount++;
      } else {
        // Animate out then hide
        card.classList.remove('pc--filter-in');
        card.style.removeProperty('--fi');
        if (wasVisible && hasActiveFilter) {
          card.classList.add('pc--filter-out');
          // Remove from layout after animation completes
          (function(c) {
            setTimeout(function() {
              if (c.classList.contains('pc--filter-out')) {
                c.style.display = 'none';
                c.classList.remove('pc--filter-out');
              }
            }, 250);
          })(card);
        } else {
          card.style.display = 'none';
        }
      }
    });

    // Clean up filter-in class after animation
    if (hasActiveFilter) {
      setTimeout(function() {
        products.forEach(function(card) {
          card.classList.remove('pc--filter-in');
          card.style.removeProperty('--fi');
        });
      }, 600);
    }

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
      if (Object.keys(activeFilters).length === 0 && !activeSearch) {
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
    if (keys.length === 0 && !activeSearch) return;

    var label = document.createElement('span');
    label.className = 'plp-active-filters__label';
    label.textContent = 'Active filters:';
    activeFiltersBar.appendChild(label);

    // Show search pill if active
    if (activeSearch) {
      var searchPill = document.createElement('a');
      searchPill.href = '#';
      searchPill.className = 'plp-pill';
      searchPill.innerHTML = activeSearch + ' <span class="plp-pill__remove">&times;</span>';
      searchPill.addEventListener('click', function (e) {
        e.preventDefault();
        clearSearchState();
        activeFilters = {};
        runFilterUpdate();
      });
      activeFiltersBar.appendChild(searchPill);
    }

    keys.forEach(function (group) {
      var pill = document.createElement('a');
      pill.href = '#';
      pill.className = 'plp-pill';
      pill.setAttribute('data-clear-group', group);
      pill.innerHTML = activeFilters[group] + ' <span class="plp-pill__remove">&times;</span>';
      pill.addEventListener('click', function (e) {
        e.preventDefault();
        delete activeFilters[group];
        clearSearchState();
        runFilterUpdate();
      });
      activeFiltersBar.appendChild(pill);
    });

    var totalPills = keys.length + (activeSearch ? 1 : 0);
    if (totalPills > 1) {
      var clearAll = document.createElement('a');
      clearAll.href = '#';
      clearAll.className = 'plp-pill';
      clearAll.style.background = '#888';
      clearAll.textContent = 'Clear all';
      clearAll.addEventListener('click', function (e) {
        e.preventDefault();
        activeFilters = {};
        clearSearchState();
        runFilterUpdate();
      });
      activeFiltersBar.appendChild(clearAll);
    }
  }

  /* ── Cross-brand section visibility ── */
  function updateCrossBrandSections() {
    // Hide ALL sections first and remove reveal/tint classes
    for (var key in cbSections) {
      if (cbSections[key]) {
        cbSections[key].style.display = 'none';
        cbSections[key].classList.remove('cb--reveal', 'cb-blue-active');
      }
    }

    // Show ONLY the one matching the current scenario (with reveal animation)
    if (activeSearch === 'studio') {
      revealSection(cbSections.studio);
      return;
    }

    if (activeSearch === 'blue' || activeFilters.colour === 'blue') {
      revealSection(cbSections.colour);
      if (cbSections.colour) cbSections.colour.classList.add('cb-blue-active');
      return;
    }

    if (activeFilters.feature === 'recycled') {
      revealSection(cbSections.recycled);
      return;
    }

    if (activeFilters.collection === 'earthaware' || activeFilters.feature === 'organic') {
      revealSection(cbSections.earthaware);
      return;
    }
  }

  function revealSection(el) {
    if (!el) return;
    el.style.display = '';
    // Force reflow so animation restarts
    void el.offsetHeight;
    el.classList.add('cb--reveal');
  }

  /* ── Blue image swaps ── */
  function handleBlueImageSwaps() {
    if (activeFilters.colour === 'blue' || activeSearch === 'blue') {
      applyBlueImageSwaps();
    } else {
      revertBlueImageSwaps();
    }
  }

  function applyBlueImageSwaps() {
    products.forEach(function (card) {
      var sku = card.getAttribute('data-sku');
      if (blueImageSwaps[sku]) {
        var img = card.querySelector('.pc__img img');
        if (img && !img.getAttribute('data-original-src')) {
          img.setAttribute('data-original-src', img.src);
          img.src = blueImageSwaps[sku];
        }
      }
    });
  }

  function revertBlueImageSwaps() {
    var swapped = grid.querySelectorAll('.pc__img img[data-original-src]');
    for (var i = 0; i < swapped.length; i++) {
      swapped[i].src = swapped[i].getAttribute('data-original-src');
      swapped[i].removeAttribute('data-original-src');
    }
  }

  /* ── Search state management ── */
  function clearSearchState() {
    if (activeSearch === 'studio') {
      // Remove studio highlight
      var highlighted = grid.querySelector('.pc--studio-highlight');
      if (highlighted) highlighted.classList.remove('pc--studio-highlight');
    }
    activeSearch = null;
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

  /* ── Bridge: search overlay → filter IIFE ── */
  window.__plpSetSearch = function (scenario) {
    // Clear any existing search/filter state
    activeSearch = null;
    revertBlueImageSwaps();
    var highlighted = grid ? grid.querySelector('.pc--studio-highlight') : null;
    if (highlighted) highlighted.classList.remove('pc--studio-highlight');

    if (scenario === 'studio') {
      activeSearch = 'studio';
      activeFilters = {};

      // Highlight B26N
      var studioCard = grid.querySelector('.pc[data-sku="B26N"]');
      if (studioCard) {
        studioCard.classList.add('pc--studio-highlight');
        setTimeout(function () {
          studioCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }

      applyFilters();
      updateToolbarActive();
      updateSidebarActive();
      updateCollectionTabActive();
      updateFilterPills();
      updateCrossBrandSections();

    } else if (scenario === 'blue') {
      activeSearch = 'blue';
      activeFilters = { colour: 'blue' };

      runFilterUpdate();

      // Scroll to grid
      if (grid) {
        setTimeout(function () {
          grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  };

  window.__plpClearSearch = function () {
    clearSearchState();
    activeFilters = {};
    revertBlueImageSwaps();
    runFilterUpdate();
  };

})();

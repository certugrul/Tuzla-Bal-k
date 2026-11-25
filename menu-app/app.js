/**
 * Tuzla Balık Soyak - Gastronomi Menü Uygulaması
 * Özellikler:
 * - Sade, hızlı, hafif kod yapısı (Gereksiz sepet ve adet kodları tamamen temizlendi)
 * - Masaüstü ve Mobilde Birebir Aynı Şık Kayan / Odaklı Kart Popup Modalı
 * - Telegram-Style Dynamic Island Kayan Başlık Kapsülü
 * - Linear Tab Bar & Segmented Spring Geçişleri
 * - Safari İçin Optimize Edilmiş Kademeli Yükleme (Zero GPU Lag)
 */

(function () {
  'use strict';

  // Application State
  const state = {
    selectedCategory: 'all',
    searchQuery: '',
    selectedFilter: 'all', // 'all', 'signature'
    viewMode: window.innerWidth < 768 ? 'list' : 'grid',
    items: window.MENU_ITEMS || [],
    categories: window.MENU_CATEGORIES || {},
    activeModalDish: null,
    visibleCount: 24,
    batchSize: 24
  };

  // DOM Elements
  const categoryScroll = document.getElementById('categoryScroll');
  const dishesGrid = document.getElementById('dishesGrid');
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const chapterTitle = document.getElementById('chapterTitle');
  const chapterCount = document.getElementById('chapterCount');
  const filterTriggerBtn = document.getElementById('filterTriggerBtn');
  const viewModeToggle = document.getElementById('viewModeToggle');
  const btnViewList = document.getElementById('btnViewList');
  const btnViewGrid = document.getElementById('btnViewGrid');

  // Modal Elements
  const dishModalBackdrop = document.getElementById('dishModalBackdrop');
  const dishModalSheet = document.getElementById('dishModalSheet');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalHeroVisual = document.getElementById('modalHeroVisual');
  const modalHeroImg = document.getElementById('modalHeroImg');
  const modalCatTag = document.getElementById('modalCatTag');
  const modalPrice = document.getElementById('modalPrice');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalSommelierCard = document.getElementById('modalSommelierCard');
  const modalSommelierText = document.getElementById('modalSommelierText');

  // Haptic Feedback Helper
  function triggerHaptic(duration = 10) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(duration); } catch (_) {}
    }
  }

  // Initialize
  function init() {
    updateViewModeUI();
    renderCategoryPills();
    renderDishes();
    setupEventListeners();
    setupModalGestures();
    setupScrollHeader();
  }

  // 1. View Mode Switching
  function setViewMode(mode) {
    state.viewMode = mode;
    updateViewModeUI();
    renderDishes();
    triggerHaptic(12);
  }

  function updateViewModeUI() {
    if (dishesGrid) {
      dishesGrid.classList.remove('view-list', 'view-grid');
      dishesGrid.classList.add(`view-${state.viewMode}`);
    }
    if (btnViewList && btnViewGrid) {
      btnViewList.classList.toggle('active', state.viewMode === 'list');
      btnViewGrid.classList.toggle('active', state.viewMode === 'grid');

      const segmentedPill = document.getElementById('segmentedSpringPill');
      if (segmentedPill) {
        if (state.viewMode === 'list') {
          segmentedPill.style.transform = 'translateX(0)';
        } else {
          segmentedPill.style.transform = 'translateX(100%)';
        }
      }
    }
  }

  // 2. Render Category Nav Pills with Linear Sliding Spring Indicator
  function renderCategoryPills() {
    if (!categoryScroll) return;

    let html = `
      <div class="cat-spring-indicator" id="catSpringIndicator"></div>
      <button class="cat-nav-pill ${state.selectedCategory === 'all' ? 'active' : ''}" data-category="all">
        <i class="fa-solid fa-utensils"></i>
        <span>Tüm Seçki</span>
        <span class="cat-count">${state.items.length}</span>
      </button>
      <button class="cat-nav-pill ${state.selectedCategory === 'signature' ? 'active' : ''}" data-category="signature">
        <i class="fa-solid fa-crown" style="color:var(--accent-gold);"></i>
        <span>Şefin İmzaları</span>
        <span class="cat-count">${state.items.filter(i => i.isSignature).length}</span>
      </button>
    `;

    for (const [key, cat] of Object.entries(state.categories)) {
      let count = 0;
      if (key === 'saraplar') {
        count = state.items.filter(i => i.category === 'saraplar' || i.category === 'biralar' || i.category === 'ithal-ickiler').length;
      } else {
        count = state.items.filter(i => i.category === key).length;
      }
      if (count === 0) continue;
      html += `
        <button class="cat-nav-pill ${state.selectedCategory === key ? 'active' : ''}" data-category="${key}">
          <i class="${cat.icon || 'fa-solid fa-fish'}"></i>
          <span>${cat.shortName || cat.name}</span>
          <span class="cat-count">${count}</span>
        </button>
      `;
    }

    categoryScroll.innerHTML = html;
    requestAnimationFrame(() => updateCategorySpringIndicator());
  }

  function updateCategorySpringIndicator(targetBtn = null) {
    const indicator = document.getElementById('catSpringIndicator');
    if (!indicator || !categoryScroll) return;

    const activeBtn = targetBtn || categoryScroll.querySelector('.cat-nav-pill.active');
    if (!activeBtn) {
      indicator.style.opacity = '0';
      return;
    }

    const left = activeBtn.offsetLeft;
    const width = activeBtn.offsetWidth;
    const top = activeBtn.offsetTop;
    const height = activeBtn.offsetHeight;

    indicator.style.opacity = '1';
    indicator.style.transform = `translateX(${left}px)`;
    indicator.style.width = `${width}px`;
    indicator.style.top = `${top}px`;
    indicator.style.height = `${height}px`;
  }

  // 3. Genuine Dynamic Island Hardware Detection & Scroll Header Mechanics
  function detectDynamicIsland() {
    try {
      const isIOS = /iPhone|iPod/.test(navigator.userAgent) || 
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 && !window.MSStream);
      
      const testDiv = document.createElement('div');
      testDiv.style.cssText = 'position:fixed;top:0;left:0;height:0;padding-top:env(safe-area-inset-top);visibility:hidden;pointer-events:none;z-index:-1;';
      document.body.appendChild(testDiv);
      const insetTop = parseFloat(window.getComputedStyle(testDiv).paddingTop) || 0;
      document.body.removeChild(testDiv);

      const hasIsland = isIOS && insetTop >= 54;
      if (hasIsland) {
        document.body.classList.add('has-dynamic-island');
      }
      return hasIsland;
    } catch (_) {
      return false;
    }
  }

  function setupScrollHeader() {
    const appHeader = document.getElementById('appHeader');
    if (!appHeader) return;

    detectDynamicIsland();

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.pageYOffset || document.documentElement.scrollTop;
          if (scrollY > 40) {
            appHeader.classList.add('header-scrolled');
          } else {
            appHeader.classList.remove('header-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // 4. Filter & Render Dishes
  function getFilteredItems() {
    const filtered = state.items.filter(item => {
      if (state.selectedCategory === 'signature') {
        if (!item.isSignature) return false;
      } else if (state.selectedCategory === 'saraplar') {
        if (item.category !== 'saraplar' && item.category !== 'biralar' && item.category !== 'ithal-ickiler') return false;
      } else if (state.selectedCategory !== 'all') {
        if (item.category !== state.selectedCategory) return false;
      }

      if (state.selectedFilter === 'signature' && !item.isSignature) return false;

      if (state.searchQuery.trim()) {
        const q = state.searchQuery.toLowerCase().trim();
        const inName = (item.name || '').toLowerCase().includes(q);
        const inDesc = (item.description || '').toLowerCase().includes(q);
        const inCat = (item.rawCategory || '').toLowerCase().includes(q);
        if (!inName && !inDesc && !inCat) return false;
      }

      return true;
    });

    // Sort A to Z using Turkish locale
    if (state.selectedCategory !== 'all' || state.searchQuery.trim()) {
      return filtered.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'tr', { sensitivity: 'base' }));
    }

    return filtered;
  }

  let infiniteScrollObserver = null;

  function renderDishes(resetPagination = true) {
    if (!dishesGrid) return;

    if (resetPagination) {
      state.visibleCount = state.batchSize;
    }

    const filtered = getFilteredItems();

    if (chapterTitle) {
      if (state.selectedCategory === 'all') {
        chapterTitle.innerHTML = `<i class="fa-solid fa-utensils"></i> Tüm Seçki`;
      } else if (state.selectedCategory === 'signature') {
        chapterTitle.innerHTML = `<i class="fa-solid fa-crown" style="color:var(--accent-gold);"></i> Şefin İmzaları`;
      } else if (state.categories[state.selectedCategory]) {
        const cat = state.categories[state.selectedCategory];
        chapterTitle.innerHTML = `<i class="${cat.icon || 'fa-solid fa-fish'}"></i> ${cat.name}`;
      }
    }

    if (chapterCount) {
      chapterCount.textContent = `${filtered.length} Lezzet Listeleniyor`;
    }

    if (filtered.length === 0) {
      dishesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding: 4rem 1rem; color:var(--text-muted); animation: appleCardReveal 0.3s var(--apple-ease) forwards;">
          <i class="fa-solid fa-magnifying-glass" style="font-size:2.5rem; color:var(--accent-gold); margin-bottom:1rem; opacity:0.6;"></i>
          <h3 style="font-family:var(--font-serif); font-size:1.4rem; color:var(--text-main); margin-bottom:0.5rem;">Aradığınız lezzet bulunamadı</h3>
          <p style="font-size:0.9rem;">Lütfen farklı bir lezzet veya kategori arayın.</p>
        </div>
      `;
      return;
    }

    let html = '';
    const isList = state.viewMode === 'list';
    const toRender = filtered.slice(0, state.visibleCount);

    toRender.forEach((dish, idx) => {
      const isSig = dish.isSignature;
      const isLocal = dish.isLocalImage;
      const animDelay = idx < 8 ? Math.min(idx * 24, 200) : 0;

      if (isList) {
        // Ultra-Compact Native Food Feed (6 Rows Fit on Screen)
        html += `
          <article 
            class="dish-card" 
            data-dish-id="${dish.id}" 
            ${animDelay > 0 ? `style="animation-delay: ${animDelay}ms;"` : ''}
            onclick="window.TuzlaMenuApp.openDishModal('${dish.id}')"
          >
            <div class="dish-card-body">
              <div class="dish-card-header">
                <h3 class="dish-card-title">${dish.name} ${isSig ? '<i class="fa-solid fa-crown list-crown-icon" title="Şefin İmzası"></i>' : ''}</h3>
                <div class="dish-card-price">${dish.price ? dish.price + ' ₺' : 'Mevsim Fiyatı'}</div>
              </div>
              <p class="dish-card-desc">${dish.description || ''}</p>
            </div>

            <div class="dish-card-visual">
              <img 
                src="${dish.image}" 
                alt="${dish.name}" 
                class="dish-card-img" 
                loading="lazy"
                onerror="this.onerror=null; this.src='images/mezeler/mezeler.webp';"
              >
            </div>
          </article>
        `;
      } else {
        // Grid View (Visual Cards)
        html += `
          <article 
            class="dish-card" 
            data-dish-id="${dish.id}" 
            ${animDelay > 0 ? `style="animation-delay: ${animDelay}ms;"` : ''}
            onclick="window.TuzlaMenuApp.openDishModal('${dish.id}')"
          >
            <div class="dish-card-visual">
              <img 
                src="${dish.image}" 
                alt="${dish.name}" 
                class="dish-card-img" 
                loading="lazy"
                onerror="this.onerror=null; this.src='images/mezeler/mezeler.webp';"
              >
              <div class="dish-img-overlay"></div>
              <div class="dish-badge-group">
                ${isSig ? `<span class="badge-pill badge-signature"><i class="fa-solid fa-crown"></i> Şefin İmzası</span>` : ''}
                ${isLocal ? `<span class="badge-pill badge-local-photo"><i class="fa-solid fa-camera"></i> Özgün Fotoğraf</span>` : ''}
                ${dish.badge && !isSig ? `<span class="badge-pill badge-cuisine">${dish.badge}</span>` : ''}
              </div>
            </div>
            <div class="dish-card-body">
              <div class="dish-card-header">
                <h3 class="dish-card-title">${dish.name}</h3>
                <div class="dish-card-price">${dish.price ? dish.price + ' ₺' : 'Mevsim Fiyatı'}</div>
              </div>
              <p class="dish-card-desc">${dish.description}</p>
              ${dish.pairing ? `
                <div class="dish-card-pairing">
                  <i class="fa-solid fa-wine-glass"></i>
                  <span><strong>Eşlikçi:</strong> ${dish.pairing}</span>
                </div>
              ` : ''}
            </div>
          </article>
        `;
      }
    });

    if (toRender.length < filtered.length) {
      html += `
        <div class="load-more-section" id="loadMoreSection">
          <button class="btn-load-more" id="btnLoadMore" onclick="window.TuzlaMenuApp.loadMoreDishes()">
            <i class="fa-solid fa-utensils"></i>
            <span>Daha Fazla Lezzet Göster (${toRender.length} / ${filtered.length})</span>
          </button>
        </div>
      `;
    }

    dishesGrid.innerHTML = html;
    setupInfiniteScroll();
  }

  function setupInfiniteScroll() {
    if (infiniteScrollObserver) {
      infiniteScrollObserver.disconnect();
      infiniteScrollObserver = null;
    }

    const sentinel = document.getElementById('loadMoreSection');
    if (!sentinel) return;

    if ('IntersectionObserver' in window) {
      infiniteScrollObserver = new IntersectionObserver(entries => {
        if (entries[0] && entries[0].isIntersecting) {
          loadMoreDishes();
        }
      }, { rootMargin: '350px' });
      infiniteScrollObserver.observe(sentinel);
    }
  }

  function loadMoreDishes() {
    const filtered = getFilteredItems();
    if (state.visibleCount >= filtered.length) return;
    state.visibleCount = Math.min(state.visibleCount + state.batchSize, filtered.length);
    renderDishes(false);
  }

  // 5. Dish Detail Modal Card (Centered on Desktop & Mobile, No Cart Buttons)
  function openDishModal(dishId) {
    const dish = state.items.find(d => d.id === dishId);
    if (!dish) return;

    state.activeModalDish = dish;

    modalHeroImg.src = dish.image;
    modalHeroImg.onerror = function () {
      this.src = 'images/mezeler/mezeler.webp';
    };

    let catDisplayName = '';
    if (dish.category === 'saraplar' || dish.category === 'biralar' || dish.category === 'ithal-ickiler') {
      catDisplayName = 'Şarap & Bira';
    } else if (dish.category === 'tatlilar') {
      catDisplayName = 'Tatlı Kapanışlar';
    } else if (state.categories[dish.category]) {
      catDisplayName = state.categories[dish.category].name;
    } else {
      catDisplayName = dish.rawCategory || dish.category;
    }
    modalCatTag.textContent = catDisplayName;
    modalPrice.textContent = dish.price ? `${dish.price} ₺` : 'Mevsim Fiyatı';
    modalTitle.textContent = dish.name;
    modalDescription.textContent = dish.description;

    if (dish.pairing) {
      modalSommelierCard.style.display = 'block';
      modalSommelierText.textContent = `Bu seçkin lezzetimiz ${dish.pairing} ile damakta benzersiz bir Ege armonisi yaratır.`;
    } else {
      modalSommelierCard.style.display = 'block';
      modalSommelierText.textContent = 'Usta şefimiz bu lezzeti taze çilingir mezeleri ve soğuk meze seçkileriyle tavsiye eder.';
    }

    document.body.classList.add('modal-open');
    dishModalBackdrop.classList.add('active');
    dishModalSheet.classList.add('active');

    // Tactile multi-pulse haptic feedback (screen bloom sensation)
    triggerHaptic([14, 30, 8]);
  }

  function closeDishModal() {
    dishModalBackdrop.classList.remove('active');
    dishModalSheet.classList.remove('active');
    document.body.classList.remove('modal-open');
    state.activeModalDish = null;
    dishModalSheet.style.transform = '';
    triggerHaptic(8);
  }

  // 6. Native Touch Gesture Tracking (Swipe down to dismiss)
  function setupModalGestures() {
    if (!dishModalSheet) return;

    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    dishModalSheet.addEventListener('touchstart', e => {
      if (dishModalSheet.scrollTop <= 5 || e.target.closest('.sheet-drag-handle-bar')) {
        startY = e.touches[0].clientY;
        currentY = startY;
        isDragging = true;
        dishModalSheet.style.transition = 'none';
      }
    }, { passive: true });

    dishModalSheet.addEventListener('touchmove', e => {
      if (!isDragging) return;
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      if (deltaY > 0) {
        dishModalSheet.style.transform = `translate(-50%, calc(-50% + ${deltaY}px))`;
      }
    }, { passive: true });

    dishModalSheet.addEventListener('touchend', e => {
      if (!isDragging) return;
      isDragging = false;
      dishModalSheet.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease';

      const deltaY = currentY - startY;
      if (deltaY > 60) {
        closeDishModal();
      } else {
        dishModalSheet.style.transform = 'translate(-50%, -50%)';
      }
      startY = 0;
      currentY = 0;
    }, { passive: true });
  }

  // 7. Setup Event Listeners
  function setupEventListeners() {
    // View Switcher (List vs Grid)
    if (btnViewList) {
      btnViewList.addEventListener('click', () => setViewMode('list'));
    }
    if (btnViewGrid) {
      btnViewGrid.addEventListener('click', () => setViewMode('grid'));
    }

    // Category click
    if (categoryScroll) {
      categoryScroll.addEventListener('click', e => {
        const btn = e.target.closest('.cat-nav-pill');
        if (!btn) return;
        triggerHaptic(12);
        const cat = btn.getAttribute('data-category');
        state.selectedCategory = cat;

        categoryScroll.querySelectorAll('.cat-nav-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        updateCategorySpringIndicator(btn);

        // Smoothly center active pill horizontally in the wrapper without vertical page scroll
        const wrapper = categoryScroll.closest('.category-nav-wrapper') || categoryScroll;
        const targetScrollLeft = btn.offsetLeft - (wrapper.clientWidth - btn.offsetWidth) / 2;
        wrapper.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: 'smooth' });

        renderDishes();
      });
    }

    // Window resize & orientation change to realign spring indicators
    window.addEventListener('resize', () => {
      updateCategorySpringIndicator();
      updateViewModeUI();
    }, { passive: true });

    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        updateCategorySpringIndicator();
        updateViewModeUI();
      }, 200);
    }, { passive: true });

    // Live Search with Instant Debounce
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        state.searchQuery = e.target.value;
        if (searchClearBtn) {
          searchClearBtn.classList.toggle('visible', state.searchQuery.length > 0);
        }
        renderDishes();
      });
    }

    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        triggerHaptic(8);
        searchInput.value = '';
        state.searchQuery = '';
        searchClearBtn.classList.remove('visible');
        renderDishes();
      });
    }

    // Filter Trigger (toggle signatures)
    if (filterTriggerBtn) {
      filterTriggerBtn.addEventListener('click', () => {
        // Tactile multi-pulse haptic feedback (screen bloom sensation)
    triggerHaptic([14, 30, 8]);
        if (state.selectedFilter === 'signature') {
          state.selectedFilter = 'all';
          filterTriggerBtn.classList.remove('active');
        } else {
          state.selectedFilter = 'signature';
          filterTriggerBtn.classList.add('active');
        }
        renderDishes();
      });
    }

    // Modal close handlers
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeDishModal);
    if (dishModalBackdrop) dishModalBackdrop.addEventListener('click', closeDishModal);

    // Keyboard ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeDishModal();
      }
    });
  }

  // Expose global methods
  window.TuzlaMenuApp = {
    state,
    openDishModal,
    closeDishModal,
    loadMoreDishes,
    setViewMode
  };

  // Start app on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

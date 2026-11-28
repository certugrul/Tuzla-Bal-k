/**
 * Tuzla Balık Soyak - Gel-Al Özel Gastronomi Menü Uygulaması
 * Özellikler:
 * - Alkollü içecekler (Rakı, Şarap, Bira, İthal İçkiler) Gel-Al menüsünde yer almaz.
 * - Tüm lezzetlerde geçerli %20 indirimli fiyatlar (üzeri çizili orijinal fiyat + Gel Al'a Özel etiket).
 * - Görseli olmayan ürünlerde görsel koyulmaz (temiz, zarif fine-dining görünümü).
 * - WhatsApp ve telefon ile 1-tık Gel-Al teslimat siparişi.
 */

(function () {
  'use strict';

  const GELAL_DISCOUNT_RATE = 0.20; // %20 Gel-Al İndirimi
  const EXCLUDED_CATEGORIES = ['rakilar', 'saraplar', 'biralar', 'ithal-ickiler'];

  // Gel-Al için veri: Her zaman güncel kütüphane window.MENU_ITEMS
  // Kullanıcı tarayıcısında eski ve şişkin localStorage varsa temizle
  if (typeof localStorage !== 'undefined') {
    const cached = localStorage.getItem('tuzla_custom_menu');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 390) {
          localStorage.removeItem('tuzla_custom_menu');
        }
      } catch (_) {}
    }
  }

  const rawItems = (typeof window !== 'undefined' && Array.isArray(window.MENU_ITEMS))
    ? window.MENU_ITEMS
    : [];

  const rawCategories = (typeof window !== 'undefined' && window.MENU_CATEGORIES) ? window.MENU_CATEGORIES : {};

  // Alkol kategorilerini tamamen çıkar
  const filteredCategories = {};
  for (const [key, val] of Object.entries(rawCategories)) {
    if (!EXCLUDED_CATEGORIES.includes(key)) {
      filteredCategories[key] = val;
    }
  }

  // Alkol kelimelerini temizleme filtresi (Pairing alanındaki rakı/şarap önerilerini kaldır)
  function getSanitizedGelAlPairing(text) {
    if (!text) return '';
    const lower = text.toLowerCase();
    const alcoholKeywords = ['rakı', 'şarap', 'bira', 'viski', 'votka', 'efe', 'tekirdağ', 'beylerbeyi', 'kulüp', 'yeni seri', 'altınbaş', 'tuborg', 'efes', 'bomonti'];
    if (alcoholKeywords.some(k => lower.includes(k))) {
      return ''; // Alkol tavsiyelerini Gel-Al menüsünde gösterme
    }
    return text;
  }

  // Ürünlere %20 Gel-Al indirimi ekle, alkolleri filtrele ve signature bayrağını normalize et
  const gelalItems = rawItems
    .filter(item => !EXCLUDED_CATEGORIES.includes(item.category))
    .map(item => {
      const orig = item.price;
      const discounted = (orig !== null && orig !== undefined) ? Math.round(orig * (1 - GELAL_DISCOUNT_RATE)) : null;
      const isSig = Boolean(item.isSignature || item.is_signature);
      return {
        ...item,
        originalPrice: orig,
        gelalPrice: discounted,
        isSignature: isSig,
        is_signature: isSig,
        cleanPairing: getSanitizedGelAlPairing(item.pairing)
      };
    });

  // Application State
  const state = {
    selectedCategory: null, // null = Landing view (büyük kategoriler gösterilir)
    searchQuery: '',
    selectedFilter: 'all',
    viewMode: window.innerWidth < 768 ? 'list' : 'grid',
    items: gelalItems,
    categories: filteredCategories,
    activeModalDish: null,
    visibleCount: 36,
    batchSize: 36
  };

  // DOM Elements
  const categoryScroll = document.getElementById('categoryScroll');
  const topCategoriesGrid = document.getElementById('topCategoriesGrid');
  const topCategoriesSection = document.getElementById('topCategoriesSection');
  const categoryNavWrapper = document.getElementById('categoryNavWrapper');
  const appHeaderWrapper = document.getElementById('appHeaderWrapper');
  const appMain = document.querySelector('.app-main');
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
  const modalPriceWrap = document.getElementById('modalPriceWrap');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalSommelierCard = document.getElementById('modalSommelierCard');
  const modalSommelierText = document.getElementById('modalSommelierText');
  const modalBtnOrderWa = document.getElementById('modalBtnOrderWa');

  // Helper: Resmin gerçekten var olup olmadığını kontrol eder
  function hasDishImage(dish) {
    if (!dish) return false;
    if (!dish.image || typeof dish.image !== 'string' || !dish.image.trim()) return false;
    if (dish.isLocalImage === false) return false;
    if (dish.image.includes('_default.') || dish.image.includes('/default.') || dish.image.includes('placeholder')) return false;
    return true;
  }

  // Haptic Feedback Helper
  function triggerHaptic(duration = 10) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(duration); } catch (_) {}
    }
  }

  // Menu Visibility Manager: Kategori tıklandıktan sonra büyük kategorileri gizle, menüyü ve kategori çubuğunu aç
  function updateMenuVisibility() {
    const isMenuOpen = !!(state.selectedCategory || state.searchQuery.trim());
    if (categoryNavWrapper) {
      categoryNavWrapper.classList.toggle('is-visible', isMenuOpen);
    }
    if (appMain) {
      appMain.classList.toggle('is-visible', isMenuOpen);
    }
    if (topCategoriesSection) {
      topCategoriesSection.classList.toggle('hidden-when-menu-open', isMenuOpen);
    }
    document.body.classList.toggle('has-menu-opened', isMenuOpen);
  }

  // Reset back to Landing View (Büyük Kategoriler Vitrini)
  function resetToLandingView() {
    state.selectedCategory = null;
    state.searchQuery = '';
    state.selectedFilter = 'all';
    if (searchInput) searchInput.value = '';
    if (searchClearBtn) searchClearBtn.classList.remove('visible');
    if (filterTriggerBtn) filterTriggerBtn.classList.remove('active');
    updateMenuVisibility();
    renderTopCategories();
    renderCategoryPills();
    if (dishesGrid) dishesGrid.innerHTML = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerHaptic(8);
  }

  // Initialize
  function init() {
    updateViewModeUI();
    renderTopCategories();
    renderCategoryPills();
    updateMenuVisibility();
    if (state.selectedCategory || state.searchQuery.trim()) {
      renderDishes();
    }
    setupEventListeners();
    setupModalGestures();
    setupScrollHeader();
  }

  // View Mode Switching
  function setViewMode(mode) {
    if (state.viewMode === mode) return;
    state.viewMode = mode;
    updateViewModeUI();
    renderDishes(false);
    triggerHaptic(12);
  }

  function updateViewModeUI() {
    const isList = state.viewMode === 'list';
    if (btnViewList) btnViewList.classList.toggle('active', isList);
    if (btnViewGrid) btnViewGrid.classList.toggle('active', !isList);
    if (dishesGrid) {
      dishesGrid.classList.toggle('view-list', isList);
      dishesGrid.classList.toggle('view-grid', !isList);
    }
    const springPill = document.getElementById('segmentedSpringPill');
    if (springPill) {
      springPill.style.transform = isList ? 'translateX(0)' : 'translateX(100%)';
    }
  }

  // Top Categories Metadata (Alkol hariç ana gastronomi kategorileri)
  const TOP_CATEGORY_META = [
    { id: 'mezeler', name: 'Soğuk Mezeler', image: '../menu-app/images/mezeler/mezeler.webp', icon: 'fa-solid fa-seedling' },
    { id: 'ara-sicaklar', name: 'Ara Sıcaklar', image: '../menu-app/images/arasicaklar/kalamartava.webp', icon: 'fa-solid fa-fire-burner' },
    { id: 'baliklar', name: 'Mevsim Balıkları', image: '../menu-app/images/balik_default.webp', icon: 'fa-solid fa-fish-fins' },
    { id: 'etler', name: 'Kırmızı Et & Izgara', image: '../menu-app/images/etler_default.webp', icon: 'fa-solid fa-drumstick-bite' },
    { id: 'salatalar', name: 'Taze Salatalar', image: '../menu-app/images/salata/roka.webp', icon: 'fa-solid fa-bowl-rice' },
    { id: 'tatlilar', name: 'Tatlı Kapanışlar', image: '../menu-app/images/tatli_default.webp', icon: 'fa-solid fa-cake-candles' },
    { id: 'signature', name: 'Şefin İmzaları', image: '../menu-app/images/arasicaklar/balikbeyti.webp', icon: 'fa-solid fa-crown', isSig: true }
  ];

  function renderTopCategories() {
    if (!topCategoriesGrid) return;
    topCategoriesGrid.innerHTML = TOP_CATEGORY_META.map(cat => {
      const count = cat.isSig
        ? state.items.filter(i => i.isSignature).length
        : state.items.filter(i => i.category === cat.id).length;

      const isActive = state.selectedCategory === cat.id;

      return `
        <div class="top-cat-card ${isActive ? 'active' : ''}" data-category="${cat.id}">
          <div class="top-cat-visual">
            <img src="${cat.image}" alt="${cat.name}" class="top-cat-img" loading="eager" onerror="this.onerror=null; this.src='../menu-app/images/mezeler/mezeler.webp';">
            <div class="top-cat-overlay"></div>
            <span class="top-cat-count-badge">${count} Lezzet (%20 İndirimli)</span>
            ${cat.isSig ? '<span class="top-cat-sig-badge"><i class="fa-solid fa-crown"></i> Şefin İmzası</span>' : ''}
          </div>
          <div class="top-cat-info">
            <div class="top-cat-icon"><i class="${cat.icon}"></i></div>
            <span class="top-cat-name">${cat.name}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Category Selection
  function selectCategory(catId) {
    state.selectedCategory = catId || 'all';
    triggerHaptic(12);

    // Kategori seçildikten sonra büyük kategorileri gizle, menüyü göster
    updateMenuVisibility();

    if (categoryScroll) {
      categoryScroll.querySelectorAll('.cat-nav-pill, .cat-pill').forEach(pill => {
        pill.classList.toggle('active', pill.getAttribute('data-category') === state.selectedCategory);
      });
      const activePill = categoryScroll.querySelector(`.cat-nav-pill[data-category="${state.selectedCategory}"], .cat-pill[data-category="${state.selectedCategory}"]`);
      if (activePill) {
        updateCategorySpringIndicator(activePill);
        const wrapper = categoryScroll.closest('.category-nav-wrapper') || categoryScroll;
        const targetScrollLeft = activePill.offsetLeft - (wrapper.clientWidth - activePill.offsetWidth) / 2;
        wrapper.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: 'smooth' });
      }
    }

    if (topCategoriesGrid) {
      topCategoriesGrid.querySelectorAll('.top-cat-card').forEach(card => {
        card.classList.toggle('active', card.getAttribute('data-category') === state.selectedCategory);
      });
    }

    state.visibleCount = state.batchSize;
    renderDishes();

    // Sayfayı menü başlangıcına yumuşakça kaydır
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateCategorySpringIndicator(targetBtn = null) {
    if (!categoryScroll) return;
    const indicator = document.getElementById('catSpringIndicator') || categoryScroll.querySelector('.cat-spring-indicator, .category-gold-indicator');
    if (!indicator) return;

    const activeBtn = targetBtn || categoryScroll.querySelector('.cat-nav-pill.active, .cat-pill.active');
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

  // Category Nav Pills with Gold Spring Indicator
  function renderCategoryPills() {
    if (!categoryScroll) return;

    let html = `
      <div class="cat-spring-indicator" id="catSpringIndicator"></div>
      <button class="cat-nav-pill cat-pill ${state.selectedCategory === 'all' ? 'active' : ''}" data-category="all">
        <i class="fa-solid fa-utensils"></i>
        <span>Tüm Seçki</span>
        <span class="cat-count">${state.items.length}</span>
      </button>
      <button class="cat-nav-pill cat-pill ${state.selectedCategory === 'signature' ? 'active' : ''}" data-category="signature">
        <i class="fa-solid fa-crown" style="color:var(--accent-gold);"></i>
        <span>Şefin İmzaları</span>
        <span class="cat-count">${state.items.filter(i => i.isSignature).length}</span>
      </button>
    `;

    for (const [id, cat] of Object.entries(state.categories)) {
      const count = state.items.filter(i => i.category === id).length;
      if (count === 0) continue;
      const isActive = state.selectedCategory === id;
      html += `
        <button class="cat-nav-pill cat-pill ${isActive ? 'active' : ''}" data-category="${id}">
          <i class="${cat.icon || 'fa-solid fa-fish'}"></i>
          <span>${cat.name || cat.tr || id}</span>
          <span class="cat-count">${count}</span>
        </button>
      `;
    }

    categoryScroll.innerHTML = html;

    requestAnimationFrame(() => {
      updateCategorySpringIndicator();
    });
  }

  // Filter items
  function getFilteredItems() {
    let filtered = [...state.items];

    if (state.selectedCategory === 'signature') {
      filtered = filtered.filter(item => item.isSignature || item.is_signature);
    } else if (state.selectedCategory && state.selectedCategory !== '' && state.selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === state.selectedCategory);
    }

    if (state.selectedFilter === 'signature') {
      filtered = filtered.filter(item => item.isSignature || item.is_signature);
    }

    if (state.searchQuery.trim()) {
      const q = state.searchQuery.trim().toLowerCase();
      filtered = filtered.filter(item => {
        const inName = (item.name || '').toLowerCase().includes(q);
        const inDesc = (item.description || '').toLowerCase().includes(q);
        const inCat = (item.category || item.rawCategory || '').toLowerCase().includes(q);
        return inName || inDesc || inCat;
      });
    }

    const categoryOrder = [
      'mezeler',
      'ara-sicaklar',
      'baliklar',
      'etler',
      'salatalar',
      'rakilar',
      'saraplar',
      'biralar',
      'ithal-ickiler',
      'tatlilar',
      'cerezler',
      'mesrubatlar'
    ];

    if (state.selectedCategory === 'all' && !state.searchQuery.trim()) {
      filtered.sort((a, b) => {
        const orderA = categoryOrder.indexOf(a.category);
        const orderB = categoryOrder.indexOf(b.category);
        const rankA = orderA === -1 ? 999 : orderA;
        const rankB = orderB === -1 ? 999 : orderB;
        if (rankA !== rankB) return rankA - rankB;
        return (a.name || '').localeCompare(b.name || '', 'tr', { sensitivity: 'base' });
      });
    }

    // Bütün kategorilerde A'dan Z'ye sıralama
    return filtered.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'tr', { sensitivity: 'base' }));
  }

  let infiniteScrollObserver = null;

  // Render Dishes
  function renderDishes(resetPagination = true) {
    if (!dishesGrid) return;

    if (resetPagination) {
      state.visibleCount = state.batchSize;
    }

    const filtered = getFilteredItems();

    if (chapterTitle) {
      if (!state.selectedCategory || state.selectedCategory === '' || state.selectedCategory === 'all') {
        chapterTitle.innerHTML = `<i class="fa-solid fa-utensils"></i> Tüm Gel-Al Seçkisi`;
      } else if (state.selectedCategory === 'signature') {
        chapterTitle.innerHTML = `<i class="fa-solid fa-crown" style="color:var(--accent-gold);"></i> Şefin İmzaları`;
      } else if (state.categories[state.selectedCategory]) {
        const cat = state.categories[state.selectedCategory];
        chapterTitle.innerHTML = `<i class="${cat.icon || 'fa-solid fa-fish'}"></i> ${cat.name || cat.tr || state.selectedCategory}`;
      } else if (state.searchQuery.trim()) {
        chapterTitle.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> Arama Sonuçları`;
      }
    }

    if (chapterCount) {
      chapterCount.textContent = `${filtered.length} Lezzet (%20 İndirimli)`;
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
      const isSig = dish.isSignature || dish.is_signature;
      const animDelay = idx < 8 ? Math.min(idx * 20, 160) : 0;
      const hasImg = hasDishImage(dish);

      // Fiyat Alanı: Üzeri çizili normal fiyat + %20 İndirimli Gel-Al Fiyatı + Gel Al'a Özel rozeti
      const priceHtml = (dish.originalPrice !== null && dish.originalPrice !== undefined) ? `
        <div class="gelal-price-box">
          <div class="gelal-price-numbers">
            <span class="original-price-strike"><s>${dish.originalPrice} ₺</s></span>
            <span class="gelal-discounted-price">${dish.gelalPrice} ₺</span>
          </div>
          <span class="badge-gelal-tag"><i class="fa-solid fa-tag"></i> Gel Al'a Özel</span>
        </div>
      ` : `
        <div class="gelal-price-box">
          <span class="gelal-discounted-price">Günlük / Kg</span>
          <span class="badge-gelal-tag"><i class="fa-solid fa-tag"></i> Gel Al'a Özel</span>
        </div>
      `;

      if (isList) {
        // Liste Görünümü (App-Style)
        html += `
          <article 
            class="dish-card ${hasImg ? 'has-image' : 'no-image'}" 
            data-dish-id="${dish.id}" 
            ${animDelay > 0 ? `style="animation-delay: ${animDelay}ms;"` : ''}
            onclick="window.TuzlaGelAlApp.openDishModal('${dish.id}')"
          >
            <div class="dish-card-body">
              <div class="dish-card-header">
                <h3 class="dish-card-title">
                  ${dish.name} 
                  ${isSig ? '<i class="fa-solid fa-crown list-crown-icon" title="Şefin İmzası"></i>' : ''}
                </h3>
                <div class="dish-card-price-col">
                  ${priceHtml}
                </div>
              </div>
              <p class="dish-card-desc">${dish.description || ''}</p>
              ${dish.badge && !hasImg ? `<div class="dish-badge-row"><span class="badge-pill badge-cuisine">${dish.badge}</span></div>` : ''}
            </div>

            ${hasImg ? `
              <div class="dish-card-visual">
                <img 
                  src="${dish.image}" 
                  alt="${dish.name}" 
                  class="dish-card-img" 
                  loading="lazy"
                  onerror="this.onerror=null; const v=this.closest('.dish-card-visual'); if(v) v.style.display='none'; this.closest('.dish-card')?.classList.remove('has-image'); this.closest('.dish-card')?.classList.add('no-image');"
                >
              </div>
            ` : ''}
          </article>
        `;
      } else {
        // Kart Görünümü (Grid)
        html += `
          <article 
            class="dish-card ${hasImg ? 'has-image' : 'no-image'}" 
            data-dish-id="${dish.id}" 
            ${animDelay > 0 ? `style="animation-delay: ${animDelay}ms;"` : ''}
            onclick="window.TuzlaGelAlApp.openDishModal('${dish.id}')"
          >
            ${hasImg ? `
              <div class="dish-card-visual">
                <img 
                  src="${dish.image}" 
                  alt="${dish.name}" 
                  class="dish-card-img" 
                  loading="lazy"
                  onerror="this.onerror=null; const v=this.closest('.dish-card-visual'); if(v) v.style.display='none'; this.closest('.dish-card')?.classList.remove('has-image'); this.closest('.dish-card')?.classList.add('no-image');"
                >
                <div class="dish-img-overlay"></div>
                <div class="dish-badge-group">
                  <span class="badge-pill badge-gelal-live"><i class="fa-solid fa-tag"></i> %20 Gel Al</span>
                  ${isSig ? `<span class="badge-pill badge-signature"><i class="fa-solid fa-crown"></i> Şefin İmzası</span>` : ''}
                  ${dish.badge && !isSig ? `<span class="badge-pill badge-cuisine">${dish.badge}</span>` : ''}
                </div>
              </div>
            ` : ''}
            <div class="dish-card-body">
              <div class="dish-card-header">
                <h3 class="dish-card-title">
                  ${dish.name}
                  ${isSig && !hasImg ? '<i class="fa-solid fa-crown list-crown-icon" title="Şefin İmzası"></i>' : ''}
                </h3>
                ${priceHtml}
              </div>
              <p class="dish-card-desc">${dish.description || ''}</p>
              ${dish.cleanPairing ? `
                <div class="dish-card-pairing">
                  <i class="fa-solid fa-bag-shopping"></i>
                  <span>${dish.cleanPairing}</span>
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
          <button class="btn-load-more" id="btnLoadMore" onclick="window.TuzlaGelAlApp.loadMoreDishes()">
            <i class="fa-solid fa-utensils"></i>
            <span>Daha Fazla Gel-Al Lezzeti Göster (${toRender.length} / ${filtered.length})</span>
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

  // Dish Detail Modal
  function openDishModal(dishId) {
    const dish = state.items.find(d => d.id === dishId);
    if (!dish) return;

    state.activeModalDish = dish;

    const hasImg = hasDishImage(dish);
    if (hasImg) {
      if (modalHeroVisual) modalHeroVisual.style.display = '';
      if (modalHeroImg) {
        modalHeroImg.src = dish.image;
        modalHeroImg.alt = dish.name;
        modalHeroImg.onerror = function () {
          if (modalHeroVisual) modalHeroVisual.style.display = 'none';
          if (dishModalSheet) dishModalSheet.classList.add('no-hero-image');
        };
      }
      if (dishModalSheet) dishModalSheet.classList.remove('no-hero-image');
    } else {
      if (modalHeroVisual) modalHeroVisual.style.display = 'none';
      if (modalHeroImg) {
        modalHeroImg.src = '';
        modalHeroImg.alt = '';
        modalHeroImg.onerror = null;
      }
      if (dishModalSheet) dishModalSheet.classList.add('no-hero-image');
    }

    let catDisplayName = state.categories[dish.category] ? (state.categories[dish.category].name || state.categories[dish.category].tr) : (dish.rawCategory || dish.category);
    if (modalCatTag) modalCatTag.textContent = catDisplayName;

    if (modalPriceWrap) {
      modalPriceWrap.innerHTML = (dish.originalPrice !== null && dish.originalPrice !== undefined) ? `
        <div class="modal-gelal-pricing">
          <span class="modal-original-price"><s>${dish.originalPrice} ₺</s></span>
          <span class="modal-gelal-price">${dish.gelalPrice} ₺</span>
          <span class="modal-gelal-badge">Gel Al'a Özel %20 İndirimli</span>
        </div>
      ` : `
        <div class="modal-gelal-pricing">
          <span class="modal-gelal-price">Mevsim Fiyatı</span>
          <span class="modal-gelal-badge">Gel Al'a Özel</span>
        </div>
      `;
    }

    if (modalTitle) modalTitle.textContent = dish.name;
    if (modalDescription) modalDescription.textContent = dish.description || 'Tuzla Balık Soyak usta mutfağından taze günlük hazırlık.';

    if (modalSommelierText) {
      modalSommelierText.textContent = 'Gel-al siparişleriniz hijyenik, ısıyı ve tazeliği muhafaza eden özel paketlerimizde usta mutfağımız tarafından özenle hazırlanır.';
    }

    // WhatsApp Sipariş Linki Hazırla
    if (modalBtnOrderWa) {
      const priceText = dish.gelalPrice ? `${dish.gelalPrice} TL (%20 İndirimli)` : 'Mevsim Fiyatı';
      const orderMsg = `Merhaba Tuzla Balık Soyak! 🐟🛍️\nGel-Al Menünüzden şu lezzeti sipariş etmek istiyorum:\n\n*Ürün:* ${dish.name}\n*Gel-Al Fiyatı:* ${priceText}\n\nNe kadar sürede hazır olur? Bilgi alabilir miyim?`;
      modalBtnOrderWa.href = `https://wa.me/905306063517?text=${encodeURIComponent(orderMsg)}`;
    }

    document.body.classList.add('modal-open');
    if (dishModalBackdrop) dishModalBackdrop.classList.add('active');
    if (dishModalSheet) dishModalSheet.classList.add('active');
    triggerHaptic(14);
  }

  function closeDishModal() {
    if (dishModalSheet) dishModalSheet.classList.remove('active');
    if (dishModalBackdrop) dishModalBackdrop.classList.remove('active');
    document.body.classList.remove('modal-open');
    state.activeModalDish = null;
    triggerHaptic(8);
  }

  function setupModalGestures() {
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeDishModal);
    if (dishModalBackdrop) dishModalBackdrop.addEventListener('click', closeDishModal);
  }

  function setupEventListeners() {
    // Top Categories
    if (topCategoriesGrid) {
      topCategoriesGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.top-cat-card');
        if (!card) return;
        const cat = card.getAttribute('data-category');
        if (cat) selectCategory(cat);
      });
    }

    // Category Pills
    if (categoryScroll) {
      categoryScroll.addEventListener('click', (e) => {
        const btn = e.target.closest('.cat-nav-pill, .cat-pill');
        if (!btn) return;
        const cat = btn.getAttribute('data-category');
        selectCategory(cat || '');
      });
    }

    // Search
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        if (searchClearBtn) searchClearBtn.classList.toggle('visible', !!state.searchQuery.trim());
        updateMenuVisibility();
        renderDishes();
      });
    }

    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        state.searchQuery = '';
        searchClearBtn.classList.remove('visible');
        if (!state.selectedCategory) {
          resetToLandingView();
        } else {
          updateMenuVisibility();
          renderDishes();
        }
        searchInput.focus();
      });
    }

    // Filter Trigger (Şefin İmzaları)
    if (filterTriggerBtn) {
      filterTriggerBtn.addEventListener('click', () => {
        triggerHaptic([14, 30, 8]);
        selectCategory('signature');
      });
    }

    // Logo Click -> Büyük kategorileri tekrar göstererek ana sayfaya dön
    const brandLogoLink = document.querySelector('.brand-section');
    if (brandLogoLink) {
      brandLogoLink.addEventListener('click', (e) => {
        e.preventDefault();
        resetToLandingView();
      });
    }

    // View Mode Buttons
    if (btnViewList) btnViewList.addEventListener('click', () => setViewMode('list'));
    if (btnViewGrid) btnViewGrid.addEventListener('click', () => setViewMode('grid'));

    // ESC to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDishModal();
    });
  }

  function setupScrollHeader() {
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const currY = window.pageYOffset || document.documentElement.scrollTop;
      if (currY > 60) {
        if (appHeaderWrapper) appHeaderWrapper.classList.add('is-scrolled');
      } else {
        if (appHeaderWrapper) appHeaderWrapper.classList.remove('is-scrolled');
      }
      lastY = currY;
    }, { passive: true });
  }

  // Public Interface
  window.TuzlaGelAlApp = {
    openDishModal,
    closeDishModal,
    loadMoreDishes,
    setViewMode,
    selectCategory,
    resetToLandingView
  };

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

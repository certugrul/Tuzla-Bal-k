/**
 * Tuzla Balık Soyak - Fine Dining Deneyimi & Menü Scripti
 * Gece / Gündüz Modu & Sadeleştirilmiş Gastronomi Menüsü
 */

document.addEventListener('DOMContentLoaded', () => {
  // Theme Management (Gece / Gündüz)
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlEl = document.documentElement;
  
  // Load saved theme or default to dark (gece)
  const savedTheme = localStorage.getItem('tuzla_theme') || 'dark';
  setTheme(savedTheme);

  function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('tuzla_theme', theme);
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#2b324c' : '#f8f6f0');
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  }

  // Application State
  const state = {
    selectedCategory: 'all',
    searchQuery: '',
    visibleCount: 20,
    itemsPerBatch: 20,
    tray: JSON.parse(localStorage.getItem('tuzla_tray') || '[]'),
    peopleCount: 4
  };

  // Active Menu Items (from custom localStorage or menu-data.js)
  let activeMenuItems = (typeof MENU_ITEMS !== 'undefined') ? [...MENU_ITEMS] : [];
  const savedCustomMenu = localStorage.getItem('tuzla_custom_menu');
  if (savedCustomMenu) {
    try {
      activeMenuItems = JSON.parse(savedCustomMenu);
    } catch (e) {
      console.warn('Custom menu parse error:', e);
    }
  }

  // Simplified Fine Dining Menu Sections
  const FINE_SECTIONS = [
    { id: 'all', label: 'Tüm Seçki' },
    { id: 'mezeler', label: 'Soğuk Mezeler' },
    { id: 'ara-sicaklar', label: 'Ara Sıcaklar' },
    { id: 'baliklar', label: 'Mevsim Balıkları' },
    { id: 'etler', label: 'Kırmızı Et & Izgara' },
    { id: 'salatalar', label: 'Taze Salatalar' },
    { id: 'rakilar', label: 'Rakı Kavı' },
    { id: 'saraplar', label: 'Şarap & Bira' },
    { id: 'tatlilar', label: 'Tatlı Kapanışlar' },
    { id: 'mesrubatlar', label: 'Meşrubatlar' }
  ];

  // DOM Elements
  const fineMenuGrid = document.getElementById('fineMenuGrid');
  const fineSearchInput = document.getElementById('fineSearchInput');
  const fineSearchClear = document.getElementById('fineSearchClear');
  const fineTabsWrapper = document.getElementById('fineTabsWrapper');
  const fineMenuCount = document.getElementById('fineMenuCount');
  const fineLoadMoreBtn = document.getElementById('fineLoadMoreBtn');
  const fineLoadMoreWrap = document.getElementById('fineLoadMoreWrap');

  // Tray Drawer Elements
  const trayDrawer = document.getElementById('tableTrayDrawer');
  const trayBackdrop = document.getElementById('trayBackdrop');
  const trayOpenBtns = document.querySelectorAll('.js-open-tray');
  const trayCloseBtn = document.getElementById('trayCloseBtn');
  const trayScrollBody = document.getElementById('trayScrollBody');
  const trayTotalAmount = document.getElementById('trayTotalAmount');
  const trayBadges = document.querySelectorAll('.js-tray-badge');
  const peopleCountEl = document.getElementById('peopleCount');
  const perPersonAmountEl = document.getElementById('perPersonAmount');
  const peopleMinusBtn = document.getElementById('peopleMinus');
  const peoplePlusBtn = document.getElementById('peoplePlus');
  const btnSendWhatsappTray = document.getElementById('btnSendWhatsappTray');

  // Header & Mobile
  const siteNavHeader = document.querySelector('.site-nav-header');
  const navHamburgerBtn = document.getElementById('navHamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const bookingForm = document.getElementById('bookingForm');

  // 1. Render Clean Menu Category Tabs
  function renderCleanTabs() {
    if (!fineTabsWrapper) return;

    fineTabsWrapper.innerHTML = FINE_SECTIONS.map(sec => {
      const activeClass = state.selectedCategory === sec.id ? 'active' : '';
      let count = 0;
      if (sec.id === 'all') {
        count = activeMenuItems.length;
      } else if (sec.id === 'saraplar') {
        count = activeMenuItems.filter(i => i.category === 'saraplar' || i.category === 'biralar' || i.category === 'ithal-ickiler').length;
      } else {
        count = activeMenuItems.filter(i => i.category === sec.id).length;
      }

      return `
        <button class="menu-tab-btn ${activeClass}" data-cat="${sec.id}">
          <span>${sec.label}</span>
          <span class="tab-item-count">${count}</span>
        </button>
      `;
    }).join('');

    fineTabsWrapper.querySelectorAll('.menu-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        fineTabsWrapper.querySelectorAll('.menu-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedCategory = btn.getAttribute('data-cat');
        state.visibleCount = state.itemsPerBatch;
        renderFineDishes();
      });
    });
  }

  // 2. Filter Dishes
  function getFilteredDishes() {
    return activeMenuItems.filter(item => {
      // Category Match
      if (state.selectedCategory !== 'all') {
        if (item.category !== state.selectedCategory) {
          return false;
        }
      }

      // Search Query
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        const inName = item.name.toLowerCase().includes(q);
        const inDesc = item.description ? item.description.toLowerCase().includes(q) : false;
        if (!inName && !inDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (state.selectedCategory === 'all' && !state.searchQuery) {
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
        const orderA = categoryOrder.indexOf(a.category);
        const orderB = categoryOrder.indexOf(b.category);
        const rankA = orderA === -1 ? 999 : orderA;
        const rankB = orderB === -1 ? 999 : orderB;
        if (rankA !== rankB) return rankA - rankB;
        return (a.name || '').localeCompare(b.name || '', 'tr', { sensitivity: 'base' });
      }
      // Bütün kategorilerde ve aramalarda A'dan Z'ye sıralama
      return (a.name || '').localeCompare(b.name || '', 'tr', { sensitivity: 'base' });
    });
  }

  // 3. Render Fine Dining Menu (Two-column list)
  function renderFineDishes() {
    if (!fineMenuGrid) return;

    const filtered = getFilteredDishes();
    const count = filtered.length;

    if (fineMenuCount) {
      fineMenuCount.textContent = `${count} Seçkin Lezzet`;
    }

    if (count === 0) {
      fineMenuGrid.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:4rem 1rem; color:var(--text-muted);">
          <i class="fa-solid fa-magnifying-glass" style="font-size:2rem; color:var(--accent-gold); margin-bottom:1rem; display:block;"></i>
          <h3 style="font-size:1.3rem; margin-bottom:0.4rem;">Aradığınız Lezzet Bulunamadı</h3>
          <p style="font-size:0.9rem;">Farklı bir arama terimi deneyebilir veya kategorileri seçebilirsiniz.</p>
        </div>
      `;
      if (fineLoadMoreWrap) fineLoadMoreWrap.style.display = 'none';
      return;
    }

    const visibleItems = filtered.slice(0, state.visibleCount);

    fineMenuGrid.innerHTML = visibleItems.map(item => {
      const isInTray = state.tray.some(t => t.id === item.id);
      const priceText = item.price !== null
        ? `${item.price.toLocaleString('tr-TR')} ₺`
        : `<span class="dish-price-kg">Günlük / Kg</span>`;

      return `
        <div class="dish-row-item" data-id="${item.id}">
          <div class="dish-header-line">
            <div class="dish-name-wrapper">
              <span class="dish-name">${escapeHtml(item.name)}</span>
              ${item.is_signature ? '<i class="fa-solid fa-star signature-star" title="Şefin İmzası"></i>' : ''}
            </div>
            <div class="dish-dots-leader"></div>
            <div class="dish-price-box">
              <span class="dish-price">${priceText}</span>
            </div>
          </div>
          
          <p class="dish-description">${escapeHtml(item.description || 'Tuzla Balık mutfağından taze günlük hazırlık.')}</p>

          <div class="dish-meta-bottom">
            <span class="dish-badge-text">${escapeHtml(item.badge || '')}</span>
            <button class="btn-dish-add ${isInTray ? 'added' : ''}" data-id="${item.id}">
              <i class="fa-solid ${isInTray ? 'fa-check' : 'fa-plus'}"></i>
              <span>${isInTray ? 'Masada' : 'Masaya Ekle'}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach button click events
    fineMenuGrid.querySelectorAll('.btn-dish-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        toggleTrayDish(id);
      });
    });

    // Pagination
    if (fineLoadMoreWrap) {
      if (state.visibleCount < count) {
        fineLoadMoreWrap.style.display = 'block';
        fineLoadMoreBtn.innerHTML = `<span>Daha Fazla Lezzet Göster (${count - state.visibleCount})</span> <i class="fa-solid fa-chevron-down"></i>`;
      } else {
        fineLoadMoreWrap.style.display = 'none';
      }
    }
  }

  // 4. Tray (Masam / Sipariş Listesi) Management
  function toggleTrayDish(id) {
    const item = activeMenuItems.find(i => i.id === id);
    if (!item) return;

    const existingIndex = state.tray.findIndex(t => t.id === id);
    if (existingIndex > -1) {
      state.tray.splice(existingIndex, 1);
    } else {
      state.tray.push({
        id: item.id,
        name: item.name,
        price: item.price || 0,
        qty: 1
      });
    }

    localStorage.setItem('tuzla_tray', JSON.stringify(state.tray));
    updateTrayState();
    renderFineDishes();
  }

  function adjustTrayQty(id, delta) {
    const item = state.tray.find(t => t.id === id);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      state.tray = state.tray.filter(t => t.id !== id);
    }
    localStorage.setItem('tuzla_tray', JSON.stringify(state.tray));
    updateTrayState();
    renderFineDishes();
  }

  function updateTrayState() {
    const totalCount = state.tray.reduce((acc, it) => acc + it.qty, 0);
    const totalPrice = state.tray.reduce((acc, it) => acc + (it.price * it.qty), 0);

    trayBadges.forEach(b => {
      b.textContent = totalCount;
      b.style.display = totalCount > 0 ? 'flex' : 'none';
    });

    if (trayScrollBody) {
      if (state.tray.length === 0) {
        trayScrollBody.innerHTML = `
          <div style="text-align:center; padding:4rem 1rem; color:var(--text-muted);">
            <i class="fa-solid fa-utensils" style="font-size:2rem; color:var(--accent-gold); margin-bottom:1rem; display:block;"></i>
            <h4 style="font-family:var(--font-serif); font-size:1.2rem; color:var(--text-main); margin-bottom:0.4rem;">Masanız Boş</h4>
            <p style="font-size:0.85rem;">Menüdeki lezzetlerin yanındaki "+ Masaya Ekle" butonuna dokunarak dilediğiniz mezeleri ve içecekleri ekleyebilirsiniz.</p>
          </div>
        `;
      } else {
        trayScrollBody.innerHTML = state.tray.map(item => `
          <div class="tray-dish-row">
            <div>
              <div class="tray-dish-name">${escapeHtml(item.name)}</div>
              <div class="tray-dish-price">${item.price ? (item.price * item.qty).toLocaleString('tr-TR') + ' ₺' : 'Fiyat Belirtilmedi'}</div>
            </div>
            <div class="tray-dish-controls">
              <button class="tray-btn-adjust" onclick="window.trayAdjust('${item.id}', -1)"><i class="fa-solid fa-minus"></i></button>
              <span class="tray-dish-qty">${item.qty}</span>
              <button class="tray-btn-adjust" onclick="window.trayAdjust('${item.id}', 1)"><i class="fa-solid fa-plus"></i></button>
            </div>
          </div>
        `).join('');
      }
    }

    if (trayTotalAmount) {
      trayTotalAmount.textContent = `${totalPrice.toLocaleString('tr-TR')} ₺`;
    }

    if (peopleCountEl) {
      peopleCountEl.textContent = state.peopleCount;
    }

    if (perPersonAmountEl) {
      const per = state.peopleCount > 0 ? Math.round(totalPrice / state.peopleCount) : totalPrice;
      perPersonAmountEl.textContent = `${per.toLocaleString('tr-TR')} ₺`;
    }
  }

  window.trayAdjust = (id, delta) => {
    adjustTrayQty(id, delta);
  };

  // Tray Drawer Open / Close
  function openTray() {
    trayDrawer?.classList.add('active');
    trayBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeTray() {
    trayDrawer?.classList.remove('active');
    trayBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  trayOpenBtns.forEach(btn => btn.addEventListener('click', openTray));
  trayCloseBtn?.addEventListener('click', closeTray);
  trayBackdrop?.addEventListener('click', closeTray);

  peopleMinusBtn?.addEventListener('click', () => {
    if (state.peopleCount > 1) {
      state.peopleCount--;
      updateTrayState();
    }
  });

  peoplePlusBtn?.addEventListener('click', () => {
    if (state.peopleCount < 30) {
      state.peopleCount++;
      updateTrayState();
    }
  });

  // WhatsApp Pre-fill with order
  btnSendWhatsappTray?.addEventListener('click', () => {
    if (state.tray.length === 0) {
      alert('Lütfen önce menüden lezzet veya içecek seçiniz.');
      return;
    }
    const total = state.tray.reduce((acc, it) => acc + (it.price * it.qty), 0);
    const perPerson = Math.round(total / state.peopleCount);
    const lines = state.tray.map(i => `• ${i.qty}x ${i.name} (${i.price ? i.price * i.qty + ' TL' : 'Kg'})`).join('\n');

    const msg = `Merhaba Tuzla Balık Soyak! 🐟\nWeb sitenizden masa menüsü planladım ve rezervasyon yapmak istiyorum:\n\n*Masa Sipariş Planı:*\n${lines}\n\n*Kişi Sayısı:* ${state.peopleCount} Kişi\n*Tahmini Toplam:* ${total.toLocaleString('tr-TR')} TL (Kişi Başı: ~${perPerson.toLocaleString('tr-TR')} TL)\n\n_(Not: Ürünlerimiz günlük taze hazırlandığından dolaptaki güncel çeşitler ve masa müsaitliği hakkında bilgi alabilir miyim?)_`;

    window.open(`https://wa.me/905306063517?text=${encodeURIComponent(msg)}`, '_blank');
  });

  // 5. Search Controls
  if (fineSearchInput) {
    fineSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      if (fineSearchClear) fineSearchClear.style.display = state.searchQuery ? 'block' : 'none';
      state.visibleCount = state.itemsPerBatch;
      renderFineDishes();
    });
  }

  if (fineSearchClear) {
    fineSearchClear.addEventListener('click', () => {
      fineSearchInput.value = '';
      state.searchQuery = '';
      fineSearchClear.style.display = 'none';
      state.visibleCount = state.itemsPerBatch;
      renderFineDishes();
    });
  }

  if (fineLoadMoreBtn) {
    fineLoadMoreBtn.addEventListener('click', () => {
      state.visibleCount += state.itemsPerBatch;
      renderFineDishes();
    });
  }

  // 6. Luxury Smooth Scroll & Fine-Dining Navigation Engine
  // -------------------------------------------------------------------------
  
  // Easing: Quartic ease-in-out for a poised, serene fine-dining glide
  function easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  }

  let activeScrollAnimId = null;
  let isProgrammaticScrolling = false;

  function cancelProgrammaticScroll() {
    if (activeScrollAnimId !== null) {
      cancelAnimationFrame(activeScrollAnimId);
      activeScrollAnimId = null;
    }
    isProgrammaticScrolling = false;
  }

  // Allow natural user interruption - NEVER lock user control
  const userInterruptEvents = ['wheel', 'touchstart', 'keydown', 'mousedown'];
  userInterruptEvents.forEach(evtName => {
    window.addEventListener(evtName, (e) => {
      if (isProgrammaticScrolling) {
        if (evtName === 'keydown') {
          const scrollKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '];
          if (!scrollKeys.includes(e.key)) return;
        }
        cancelProgrammaticScroll();
      }
    }, { passive: true });
  });

  // Calculate dynamic header height + aesthetic breathing room
  function getHeaderOffset() {
    if (!siteNavHeader) return 80;
    const height = siteNavHeader.offsetHeight || Math.round(siteNavHeader.getBoundingClientRect().height) || 80;
    const isMobile = window.innerWidth <= 768;
    return height + (isMobile ? 12 : 20);
  }

  // Calculate exact destination coordinate within valid page bounds
  function calculateTargetY(targetEl) {
    if (!targetEl || targetEl.id === 'hero') return 0;
    const headerOffset = getHeaderOffset();
    const elementTop = targetEl.getBoundingClientRect().top + window.scrollY;
    const maxScroll = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    ) - window.innerHeight;
    return Math.min(Math.max(0, Math.round(elementTop - headerOffset)), maxScroll);
  }

  // Distance-adaptive duration: 800ms - 1200ms
  function calculateGlideDuration(distance) {
    const absDist = Math.abs(distance);
    return Math.min(1200, Math.max(800, Math.round(720 + Math.sqrt(absDist) * 8)));
  }

  // Core smooth scroll executor
  function smoothGlideTo(targetY, onComplete) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      window.scrollTo(0, targetY);
      if (onComplete) onComplete();
      return;
    }

    const startY = window.scrollY;
    const distance = targetY - startY;

    if (Math.abs(distance) < 2) {
      window.scrollTo(0, targetY);
      if (onComplete) onComplete();
      return;
    }

    cancelProgrammaticScroll();
    isProgrammaticScrolling = true;

    const duration = calculateGlideDuration(distance);
    let startTime = null;

    function animationLoop(timestamp) {
      if (!isProgrammaticScrolling) return;

      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutQuart(progress);

      const nextScrollY = Math.round(startY + (distance * easedProgress));
      window.scrollTo(0, nextScrollY);

      if (progress < 1) {
        activeScrollAnimId = requestAnimationFrame(animationLoop);
      } else {
        window.scrollTo(0, targetY);
        activeScrollAnimId = null;
        isProgrammaticScrolling = false;
        if (onComplete) onComplete();
      }
    }

    activeScrollAnimId = requestAnimationFrame(animationLoop);
  }

  // Active Navigation Spy & Sliding Active Underline
  const navSlidingIndicator = document.getElementById('navSlidingIndicator');
  const trackedSectionElements = [
    { id: 'hero', el: document.getElementById('hero') },
    { id: 'story', el: document.getElementById('story') },
    { id: 'menu', el: document.getElementById('menu') },
    { id: 'cellar', el: document.getElementById('cellar') },
    { id: 'gallery', el: document.getElementById('gallery') },
    { id: 'reservation', el: document.getElementById('reservation') }
  ].filter(item => item.el !== null);

  const mainNavLinks = document.querySelectorAll('.nav-menu .nav-link');
  let currentActiveId = null;

  // Measure and physically slide the single active underline
  function updateSlidingIndicator(activeLinkEl, animate = true) {
    if (!navSlidingIndicator || !navMenu) return;

    if (!activeLinkEl) {
      navSlidingIndicator.classList.remove('is-visible');
      return;
    }

    const menuRect = navMenu.getBoundingClientRect();
    const linkRect = activeLinkEl.getBoundingClientRect();

    if (linkRect.width === 0 || linkRect.height === 0 || menuRect.width === 0) {
      return;
    }

    // Relative coordinates within the positioned .nav-menu parent
    const relLeft = Math.round(linkRect.left - menuRect.left + navMenu.scrollLeft);
    const relTop = Math.round(linkRect.bottom - menuRect.top + navMenu.scrollTop - 2);
    const targetWidth = Math.round(linkRect.width);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!animate || prefersReduced) {
      navSlidingIndicator.style.transition = 'none';
    }

    navSlidingIndicator.style.width = `${targetWidth}px`;
    navSlidingIndicator.style.transform = `translate3d(${relLeft}px, ${relTop}px, 0)`;
    navSlidingIndicator.classList.add('is-visible');

    if (!animate && !prefersReduced) {
      void navSlidingIndicator.offsetHeight;
      requestAnimationFrame(() => {
        navSlidingIndicator.style.transition = '';
      });
    }
  }

  // Update active navigation state & trigger underline glide
  function updateActiveNavLink(targetId, animate = true) {
    if (!targetId) return;
    const normalizedId = targetId.startsWith('#') ? targetId.slice(1) : targetId;

    const validSections = ['hero', 'story', 'menu', 'cellar', 'gallery', 'reservation'];
    if (!validSections.includes(normalizedId)) return;

    if (normalizedId === currentActiveId && navSlidingIndicator?.classList.contains('is-visible')) {
      return;
    }
    currentActiveId = normalizedId;

    let targetLink = null;
    mainNavLinks.forEach(link => {
      const linkHref = link.getAttribute('href') || '';
      const linkId = linkHref.startsWith('#') ? linkHref.slice(1) : linkHref;
      if (linkId === normalizedId) {
        link.classList.add('active');
        targetLink = link;
      } else {
        link.classList.remove('active');
      }
    });

    if (targetLink) {
      updateSlidingIndicator(targetLink, animate);
    }
  }

  // Recalculate without animation (used for resize, font load, orientation change)
  function repositionIndicator() {
    const currentActiveLink = navMenu?.querySelector('.nav-link.active');
    if (currentActiveLink) {
      updateSlidingIndicator(currentActiveLink, false);
    }
  }

  // Robust Scroll Spy with focal-line hysteresis
  function getActiveSectionFromScroll() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );

    // Top Boundary -> Ana Sayfa (#hero)
    if (scrollY < 80) {
      return 'hero';
    }

    // Bottom Boundary -> Rezervasyon (#reservation)
    if (scrollY + viewportHeight >= docHeight - 80) {
      return 'reservation';
    }

    // Focal Line: Header height + 28% of viewport where user's eye naturally rests
    const headerOffset = getHeaderOffset();
    const focalY = scrollY + headerOffset + Math.min(220, viewportHeight * 0.28);

    for (let i = 0; i < trackedSectionElements.length; i++) {
      const item = trackedSectionElements[i];
      const rect = item.el.getBoundingClientRect();
      const top = rect.top + scrollY;
      const bottom = top + rect.height;

      if (top <= focalY && bottom > focalY) {
        return item.id;
      }
    }

    if (trackedSectionElements.length > 0) {
      const firstTop = trackedSectionElements[0].el.getBoundingClientRect().top + scrollY;
      if (focalY < firstTop) return trackedSectionElements[0].id;
      return trackedSectionElements[trackedSectionElements.length - 1].id;
    }

    return 'hero';
  }

  // Intercept anchor clicks
  function onAnchorClick(e, anchor) {
    const href = anchor.getAttribute('href');
    if (!href || !href.startsWith('#') || href === '#' || href === '#!') return;

    const targetEl = href === '#hero' 
      ? document.getElementById('hero') || document.body 
      : document.querySelector(href);

    if (!targetEl && href !== '#hero') return;

    e.preventDefault();

    // Close mobile menu if open
    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
    }

    // Ensure header is visible when starting programmatic navigation
    scrollUpAccumulator = 0;
    scrollDownAccumulator = 0;
    lastDownScrollTime = 0;
    siteNavHeader?.classList.remove('nav-hidden');

    const targetY = calculateTargetY(targetEl);

    // Update URL hash without instant jumping
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', href);
    }

    // Immediately start gliding active indicator towards destination
    updateActiveNavLink(href, true);

    smoothGlideTo(targetY, () => {
      // Re-affirm destination when glide finishes
      siteNavHeader?.classList.remove('nav-hidden');
      updateActiveNavLink(href, false);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => onAnchorClick(e, anchor));
  });

  // Handle browser Back / Forward history
  window.addEventListener('popstate', () => {
    siteNavHeader?.classList.remove('nav-hidden');
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const targetEl = document.querySelector(hash);
      if (targetEl) {
        const targetY = calculateTargetY(targetEl);
        updateActiveNavLink(hash, true);
        smoothGlideTo(targetY, () => updateActiveNavLink(hash, false));
      }
    } else {
      updateActiveNavLink('hero', true);
      smoothGlideTo(0, () => updateActiveNavLink('hero', false));
    }
  });

  // Mobile Hamburger Toggle
  navHamburgerBtn?.addEventListener('click', () => {
    siteNavHeader?.classList.remove('nav-hidden');
    const isOpen = navMenu?.classList.toggle('open');
    if (isOpen) {
      requestAnimationFrame(() => {
        repositionIndicator();
      });
    }
  });

  // Scroll listener: Header dynamic autohide, shadow & Throttled Scroll Spy
  let lastScrollY = window.scrollY;
  let scrollUpAccumulator = 0;
  let scrollDownAccumulator = 0;
  let lastDownScrollTime = 0;
  let isScrollThrottled = false;

  // Calibrated thresholds (in pixels):
  // SCROLL_UP_THRESHOLD = 90px ensures user must scroll up deliberately (~90px)
  // before the header smoothly reveals itself.
  const SCROLL_UP_THRESHOLD = 90;
  const SCROLL_DOWN_THRESHOLD = 20;

  // Mobile / Touch brake cooldown:
  // When scrolling down fast and braking/stopping abruptly with an upward gesture,
  // ignore upward motion for 350ms so the header doesn't erroneously reappear.
  // The header only appears when scrolling up from a stationary/settled page ("duran sayfa").
  const BRAKE_COOLDOWN_MS = 350;

  window.addEventListener('touchstart', () => {
    if (performance.now() - lastDownScrollTime < BRAKE_COOLDOWN_MS) {
      scrollUpAccumulator = 0;
    }
  }, { passive: true });

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;
    const now = performance.now();

    // Header scrolled visual effect (shadow & hairline border)
    if (currentScrollY > 40) {
      siteNavHeader?.classList.add('scrolled');
    } else {
      siteNavHeader?.classList.remove('scrolled');
    }

    // Dynamic Header Autohide Logic with calibrated upward threshold & brake filter
    if (!isProgrammaticScrolling) {
      const isMobileMenuOpen = navMenu && navMenu.classList.contains('open');

      if (!isMobileMenuOpen) {
        if (currentScrollY <= 70) {
          // Near the very top: always show header
          siteNavHeader?.classList.remove('nav-hidden');
          scrollUpAccumulator = 0;
          scrollDownAccumulator = 0;
        } else if (delta > 0) {
          // Scrolling DOWN
          lastDownScrollTime = now;
          scrollUpAccumulator = 0;
          scrollDownAccumulator += delta;

          if (scrollDownAccumulator >= SCROLL_DOWN_THRESHOLD && currentScrollY > 120) {
            siteNavHeader?.classList.add('nav-hidden');
          }
        } else if (delta < 0) {
          // Scrolling UP
          scrollDownAccumulator = 0;

          const timeSinceDownScroll = now - lastDownScrollTime;
          // If the page was actively moving downward just moments ago (< 350ms),
          // this upward motion is braking / stopping downward momentum. Ignore it!
          if (timeSinceDownScroll < BRAKE_COOLDOWN_MS) {
            scrollUpAccumulator = 0;
          } else {
            // Page is stationary / settled: accumulate upward scroll
            scrollUpAccumulator += Math.abs(delta);

            if (scrollUpAccumulator >= SCROLL_UP_THRESHOLD) {
              siteNavHeader?.classList.remove('nav-hidden');
            }
          }
        }
      }
    }

    lastScrollY = currentScrollY;

    if (isScrollThrottled) return;
    isScrollThrottled = true;

    requestAnimationFrame(() => {
      isScrollThrottled = false;
      if (isProgrammaticScrolling) return;

      const activeSection = getActiveSectionFromScroll();
      updateActiveNavLink(activeSection, true);
    });
  }, { passive: true });

  // Responsive & dynamic metrics observers
  window.addEventListener('resize', repositionIndicator, { passive: true });
  window.addEventListener('orientationchange', repositionIndicator, { passive: true });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(repositionIndicator);
  }

  if (typeof ResizeObserver !== 'undefined' && navMenu) {
    const ro = new ResizeObserver(() => {
      repositionIndicator();
    });
    ro.observe(navMenu);
  }

  // Initial layout calculation on DOM ready
  requestAnimationFrame(() => {
    const initialSection = getActiveSectionFromScroll();
    updateActiveNavLink(initialSection, false);
  });

  // Editorial Content Reveal System (IntersectionObserver)
  const revealTargets = document.querySelectorAll(
    '.fine-story-section .story-photo-wrapper, ' +
    '.fine-story-section .story-text-wrapper, ' +
    '.fine-story-section .pillar-item, ' +
    '.fine-menu-section .menu-chapter-header, ' +
    '.fine-raki-section .menu-chapter-header, ' +
    '.fine-raki-section .cellar-card, ' +
    '.fine-gallery-section .menu-chapter-header, ' +
    '.fine-gallery-section .gallery-card, ' +
    '.fine-booking-section .booking-card-wrapper'
  );

  revealTargets.forEach(el => el.classList.add('editorial-reveal'));

  if ('IntersectionObserver' in window) {
    const editorialObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -6% 0px',
      threshold: 0.08
    });

    revealTargets.forEach(el => editorialObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-revealed'));
  }

  // Smooth glide to initial hash if loaded directly with #section
  if (window.location.hash && window.location.hash.length > 1) {
    setTimeout(() => {
      const initialEl = document.querySelector(window.location.hash);
      if (initialEl) {
        const initialY = calculateTargetY(initialEl);
        updateActiveNavLink(window.location.hash, true);
        smoothGlideTo(initialY, () => updateActiveNavLink(window.location.hash, false));
      }
    }, 120);
  }

  // Telefon Numarası Doğrulama ve Formatlama (05XXXXXXXXX)
  function validateAndFormatPhone(raw) {
    if (!raw) return { valid: false, message: 'Lütfen iletişim numaranızı yazınız.' };
    let digits = String(raw).replace(/\D/g, '');
    if (digits.startsWith('90') && digits.length === 12) digits = digits.slice(2);
    if (digits.startsWith('0') && digits.length === 11) digits = digits.slice(1);

    if (digits.length < 10) {
      return { valid: false, message: 'Telefon numarası eksik! Lütfen 10 haneli cep telefonu numaranızı giriniz (Örn: 05XX XXX XX XX).' };
    }
    if (digits.length > 10) {
      return { valid: false, message: 'Telefon numarası fazla hane içeriyor! Lütfen 10 haneli cep telefonu numaranızı giriniz.' };
    }
    if (!digits.startsWith('5')) {
      return { valid: false, message: 'Geçersiz cep telefonu numarası! Numaranız 5 ile başlamalıdır (Örn: 05XX XXX XX XX).' };
    }

    return { valid: true, formatted: '0' + digits };
  }

  const bookPhoneInput = document.getElementById('bookPhone');
  if (bookPhoneInput) {
    bookPhoneInput.addEventListener('blur', () => {
      const val = bookPhoneInput.value.trim();
      if (!val) return;
      const check = validateAndFormatPhone(val);
      if (check.valid) {
        bookPhoneInput.value = check.formatted;
        bookPhoneInput.style.borderColor = '#10b981';
      }
    });
  }

  // 7. Booking Form
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('bookName').value.trim();
      const phoneInput = document.getElementById('bookPhone');
      const phoneCheck = validateAndFormatPhone(phoneInput.value.trim());

      if (!phoneCheck.valid) {
        alert('⚠️ ' + phoneCheck.message);
        phoneInput.focus();
        phoneInput.style.borderColor = '#ef4444';
        return;
      }
      phoneInput.style.borderColor = '';
      const phone = phoneCheck.formatted; // 05XXXXXXXXX garantili

      const guests = document.getElementById('bookGuests').value;
      const date = document.getElementById('bookDate').value;
      const time = document.getElementById('bookTime').value;
      const area = document.getElementById('bookArea').value;
      const notes = document.getElementById('bookNotes').value.trim();

      // Arka planda sessiz rezervasyon kaydı (1 gün sonra 12:00 anket otomasyonu için)
      try {
        fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, guests, date, time, area, notes })
        }).catch(() => {});
      } catch (_) {}

      const msg = `Merhaba Tuzla Balık Soyak! 🐟\nWeb sitenizden Masa Rezervasyonu talebi:\n\n*İsim:* ${name}\n*Telefon:* ${phone}\n*Kişi Sayısı:* ${guests} Kişi\n*Tarih:* ${date}\n*Saat:* ${time}\n*Masa Tercihi:* ${area}${notes ? '\n*Özel Not:* ' + notes : ''}`;

      window.open(`https://wa.me/905306063517?text=${encodeURIComponent(msg)}`, '_blank');
      bookingForm.reset();
    });
  }

  // 8. Intelligent Apple vs Google Maps Routing
  function isAppleDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
    const platform = navigator.platform || '';

    // Check iPhone, iPad, iPod
    if (/iPhone|iPad|iPod/i.test(userAgent)) return true;

    // Check macOS (Safari / Chrome / Firefox on Mac)
    if (/Macintosh|MacIntel|MacPPC|Mac68K/i.test(platform)) return true;
    if (/Mac OS X/i.test(userAgent)) return true;

    // Modern iPad running iPadOS (reports as MacIntel, but has multi-touch)
    if (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(platform)) {
      return true;
    }

    return false;
  }

  function resolveMapsUrl(settings = null) {
    const isApple = isAppleDevice();
    const defaultGoogleMaps = "https://maps.google.com/?q=Tuzla+Bal%C4%B1k+Soyak+%C4%B0n%C3%B6n%C3%BC+Mah.+6718.+Sk.+No:66+Kar%C5%9F%C4%B1yaka+%C4%B0zmir";
    const defaultAppleMaps = "https://maps.apple.com/?q=Tuzla+Bal%C4%B1k+Soyak&address=%C4%B0n%C3%B6n%C3%BC+Mahallesi,+6718.+Sokak+No:66,+Kar%C5%9F%C4%B1yaka,+%C4%B0zmir";

    if (isApple) {
      return (settings && settings.appleMapsUrl) ? settings.appleMapsUrl : defaultAppleMaps;
    } else {
      return (settings && settings.mapsUrl) ? settings.mapsUrl : defaultGoogleMaps;
    }
  }

  function setupSmartMapsRouting(settings = null) {
    const isApple = isAppleDevice();
    const targetUrl = resolveMapsUrl(settings);
    const serviceName = isApple ? 'Apple Haritalar' : 'Google Haritalar';

    document.querySelectorAll('.js-setting-maps-link').forEach(el => {
      el.href = targetUrl;
      el.title = `${serviceName}'da Aç & Yol Tarifi Al`;

      // Fail-safe click handler to guarantee dynamic platform redirection
      el.onclick = () => {
        el.href = resolveMapsUrl(settings);
      };
    });
  }

  // 9. Dynamic Site Settings Sync (from localStorage or defaults)
  function applySiteSettings() {
    let settings = null;
    const saved = localStorage.getItem('tuzla_site_settings');
    if (saved) {
      try { settings = JSON.parse(saved); } catch (e) {}
    }

    // Always configure smart maps routing regardless of custom settings
    setupSmartMapsRouting(settings);

    if (!settings) return;

    if (settings.phone) {
      document.querySelectorAll('.js-setting-phone').forEach(el => el.textContent = settings.phone);
    }
    if (settings.phoneRaw) {
      document.querySelectorAll('.js-setting-phone-link').forEach(el => el.href = `tel:${settings.phoneRaw}`);
    }
    if (settings.whatsapp) {
      document.querySelectorAll('.js-setting-wa-link').forEach(el => el.href = `https://wa.me/${settings.whatsapp}`);
    }
    if (settings.address) {
      document.querySelectorAll('.js-setting-address').forEach(el => el.textContent = settings.address);
      document.querySelectorAll('.js-setting-address-short').forEach(el => {
        el.textContent = settings.addressShort || 'İnönü Mah., Karşıyaka';
      });
    }
    
    // Smart Maps Routing (Apple Maps on iOS/macOS, Google Maps on others)
    setupSmartMapsRouting(settings);

    if (settings.instagram) {
      document.querySelectorAll('.js-setting-insta-handle').forEach(el => el.textContent = `@${settings.instagram}`);
    }
    if (settings.instagramUrl) {
      document.querySelectorAll('.js-setting-insta-link').forEach(el => el.href = settings.instagramUrl);
    }
    if (settings.heroBadge) {
      const b = document.querySelector('.hero-curation-badge');
      if (b) b.textContent = settings.heroBadge;
    }
    if (settings.heroTitleLine1 && settings.heroTitleLine2) {
      const t = document.querySelector('.hero-main-title');
      if (t) t.innerHTML = `${escapeHtml(settings.heroTitleLine1)} <br><span class="gold-gradient-text serif-italic">${escapeHtml(settings.heroTitleLine2)}</span>`;
    }
    if (settings.heroSubtitle) {
      const s = document.querySelector('.hero-sub-text');
      if (s) s.textContent = settings.heroSubtitle;
    }
    if (settings.statMeze) {
      const m = document.querySelector('.metric-box:nth-child(1) strong');
      if (m) m.textContent = settings.statMeze;
    }
    if (settings.statBalik) {
      const m = document.querySelector('.metric-box:nth-child(2) strong');
      if (m) m.textContent = settings.statBalik;
    }
    if (settings.statRaki) {
      const m = document.querySelector('.metric-box:nth-child(3) strong');
      if (m) m.textContent = settings.statRaki;
    }
    if (settings.statYag) {
      const m = document.querySelector('.metric-box:nth-child(4) strong');
      if (m) m.textContent = settings.statYag;
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
  }

  // Set default date in booking
  const bookDate = document.getElementById('bookDate');
  if (bookDate) {
    const today = new Date().toISOString().split('T')[0];
    bookDate.value = today;
    bookDate.min = today;
  }

  // Initialize
  applySiteSettings();
  renderCleanTabs();
  renderFineDishes();
  updateTrayState();
});

/**
 * Tuzla Balık Soyak - Backoffice (Admin Panel) Mantığı
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  let menuItems = [];
  let menuCategories = {};
  let siteSettings = {};

  let activeMenuMode = 'restaurant'; // 'restaurant' | 'gelal'
  const GELAL_EXCLUDED_CATEGORIES = ['rakilar', 'saraplar', 'biralar', 'ithal-ickiler'];
  const GELAL_DISCOUNT_RATE = 0.20;

  let currentCategory = 'all';
  let searchQuery = '';
  let currentPage = 1;
  const pageSize = 20;
  let editingItemId = null;

  // Gallery Picker State
  let galleryImages = [];
  let galleryLoaded = false;
  let gallerySearch = '';
  let galleryCategory = 'all';

  // DOM Elements
  const navTabs = document.querySelectorAll('.js-nav-tab');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const pageTitle = document.getElementById('pageTitle');
  const serverStatusBadge = document.getElementById('serverStatusBadge');

  // Stats Elements
  const statTotalItems = document.getElementById('statTotalItems');
  const statTotalCategories = document.getElementById('statTotalCategories');
  const statSignatureItems = document.getElementById('statSignatureItems');
  const statAvgPrice = document.getElementById('statAvgPrice');

  // Menu Switcher & Banner Elements
  const btnModeRestaurant = document.getElementById('btnModeRestaurant');
  const btnModeGelAl = document.getElementById('btnModeGelAl');
  const modeCountRestaurant = document.getElementById('modeCountRestaurant');
  const modeCountGelAl = document.getElementById('modeCountGelAl');
  const gelalModeBanner = document.getElementById('gelalModeBanner');
  const colPriceHeader = document.getElementById('colPriceHeader');
  const colGelAlPriceHeader = document.getElementById('colGelAlPriceHeader');

  // Table Elements
  const menuTableBody = document.getElementById('menuTableBody');
  const menuMobileCards = document.getElementById('menuMobileCards');
  const adminSearchInput = document.getElementById('adminSearchInput');
  const adminCategorySelect = document.getElementById('adminCategorySelect');
  const pageInfo = document.getElementById('pageInfo');
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');

  // Modal Elements
  const itemModal = document.getElementById('itemModal');
  const itemModalTitle = document.getElementById('itemModalTitle');
  const itemForm = document.getElementById('itemForm');
  const modalCloseBtns = document.querySelectorAll('.js-close-modal');
  const btnOpenAddModal = document.getElementById('btnOpenAddModal');

  // Image Manager Elements
  const dishImagePreviewWrap = document.getElementById('dishImagePreviewWrap');
  const dishImagePreview = document.getElementById('dishImagePreview');
  const dishImagePlaceholder = document.getElementById('dishImagePlaceholder');
  const imgStatusBadge = document.getElementById('imgStatusBadge');
  const itemImage = document.getElementById('itemImage');
  const itemImageFileInput = document.getElementById('itemImageFileInput');
  const btnTriggerUpload = document.getElementById('btnTriggerUpload');
  const btnOpenGalleryModal = document.getElementById('btnOpenGalleryModal');
  const btnRemoveImage = document.getElementById('btnRemoveImage');

  // Gallery Picker Modal Elements
  const galleryPickerModal = document.getElementById('galleryPickerModal');
  const galleryGridBody = document.getElementById('galleryGridBody');
  const gallerySearchInput = document.getElementById('gallerySearchInput');
  const galleryCategoryFilter = document.getElementById('galleryCategoryFilter');
  const galleryCountLabel = document.getElementById('galleryCountLabel');
  const closeGalleryBtns = document.querySelectorAll('.js-close-gallery-modal');

  // Settings Form
  const siteSettingsForm = document.getElementById('siteSettingsForm');

  // Backup & Sync
  const btnSaveToDisk = document.getElementById('btnSaveToDisk');
  const btnDownloadBackup = document.getElementById('btnDownloadBackup');
  const backupFileInput = document.getElementById('backupFileInput');
  const btnResetDefaults = document.getElementById('btnResetDefaults');

  // Toast
  const adminToast = document.getElementById('adminToast');
  const toastText = document.getElementById('toastText');

  // Auth & Login Elements
  const adminLoginOverlay = document.getElementById('adminLoginOverlay');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const loginUsername = document.getElementById('loginUsername');
  const loginPassword = document.getElementById('loginPassword');
  const loginErrorMsg = document.getElementById('loginErrorMsg');
  const btnLoginSubmit = document.getElementById('btnLoginSubmit');
  const btnAdminLogout = document.getElementById('btnAdminLogout');
  const headerUserInfo = document.getElementById('headerUserInfo');
  const headerUserName = document.getElementById('headerUserName');

  // 1. Initialize Data
  function initData() {
    // Load Settings
    const savedSettings = localStorage.getItem('tuzla_site_settings');
    if (savedSettings) {
      try {
        siteSettings = JSON.parse(savedSettings);
      } catch (e) {
        siteSettings = getDefaultSettings();
      }
    } else {
      siteSettings = getDefaultSettings();
    }

    // Load Menu
    const savedMenu = localStorage.getItem('tuzla_custom_menu');
    if (typeof window !== 'undefined' && window.MENU_ITEMS && window.MENU_ITEMS.length > 0) {
      if (savedMenu) {
        try {
          const parsed = JSON.parse(savedMenu);
          // Orijinal dosyadaki gerçek fotoğraf eşleştirmelerini koru
          const imgMap = {};
          window.MENU_ITEMS.forEach(it => {
            if (it.image && it.isLocalImage !== false) {
              imgMap[it.id] = { image: it.image, isLocalImage: it.isLocalImage };
            }
          });
          menuItems = parsed.map(it => {
            if ((!it.image || it.isLocalImage === false) && imgMap[it.id]) {
              return { ...it, image: imgMap[it.id].image, isLocalImage: imgMap[it.id].isLocalImage };
            }
            return it;
          });
        } catch (e) {
          menuItems = [...window.MENU_ITEMS];
        }
      } else {
        menuItems = [...window.MENU_ITEMS];
      }
    } else if (savedMenu) {
      try {
        menuItems = JSON.parse(savedMenu);
      } catch (e) {
        menuItems = [];
      }
    }

    menuCategories = (typeof MENU_CATEGORIES !== 'undefined') ? MENU_CATEGORIES : {};

    // Check if local Node.js server is online
    checkServerConnection();

    // Populate Category Dropdowns
    populateCategoryDropdowns();

    // Update Counts & Render Everything
    updateMenuModeCounts();
    renderStats();
    renderTable();
    populateSettingsForm();
    loadAndRenderReservations();
  }

  // Update counts on switcher pills
  function updateMenuModeCounts() {
    const totalRestaurant = menuItems.length;
    const totalGelAl = menuItems.filter(item => !GELAL_EXCLUDED_CATEGORIES.includes(item.category)).length;
    if (modeCountRestaurant) modeCountRestaurant.textContent = totalRestaurant;
    if (modeCountGelAl) modeCountGelAl.textContent = totalGelAl;
  }

  function getDefaultSettings() {
    return {
      restaurantName: "TUZLA BALIK",
      subTitle: "SOYAK • İZMİR",
      phone: "0530 606 35 17",
      phoneRaw: "05306063517",
      whatsapp: "905306063517",
      instagram: "tuzlabaliksoyaktr",
      instagramUrl: "https://www.instagram.com/tuzlabaliksoyaktr/",
      address: "İnönü Mahallesi, 6718. Sokak, No:66, Karşıyaka / İzmir (Soyak Siesta mevkii)",
      mapsUrl: "https://maps.google.com/?q=Tuzla+Bal%C4%B1k+Soyak+%C4%B0n%C3%B6n%C3%BC+Mah.+6718.+Sk.+No:66+Kar%C5%9F%C4%B1yaka+%C4%B0zmir",
      appleMapsUrl: "https://maps.apple.com/?q=Tuzla+Bal%C4%B1k+Soyak&address=%C4%B0n%C3%B6n%C3%BC+Mahallesi,+6718.+Sokak+No:66,+Kar%C5%9F%C4%B1yaka,+%C4%B0zmir",
      hoursWeekday: "12:00 - 01:00",
      hoursWeekend: "12:00 - 01:30",
      topBarNotice: "İnönü Mah., 6718. Sk. No:66, Karşıyaka / İzmir • Her Gün: 12:00 - 01:00",
      heroBadge: "Ege'nin En Taze Lezzetleri • Karşıyaka",
      heroTitleLine1: "Ege'nin Tuzunda,",
      heroTitleLine2: "Muhabbetin Tadında.",
      heroSubtitle: "Kömür ateşinde nar gibi pişen günlük mezat balıkları, usta ellerden çıkan 150 çeşit Ege mezesi ve zengin rakı kavımızla İzmir Karşıyaka'da çilingir sofrası geleneğini yaşatıyoruz.",
      statMeze: "150+",
      statBalik: "45+",
      statRaki: "120+",
      statYag: "%100"
    };
  }

  // Check Local Server Connection
  async function checkServerConnection() {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        let dbLabel = 'Sunucuya Bağlı (Canlı Senkron)';
        try {
          const dbRes = await fetch('/api/db-status');
          if (dbRes.ok) {
            const dbInfo = await dbRes.json();
            if (dbInfo.is_db_ready) {
              dbLabel = `MySQL Veritabanı Aktif (${dbInfo.db_name})`;
            } else {
              dbLabel = 'Sunucu Aktif (JSON Dosya Modu)';
            }
          }
        } catch (_) {}

        serverStatusBadge.innerHTML = `<i class="fa-solid fa-database" style="color:#10b981;"></i> <span>${dbLabel}</span>`;
        serverStatusBadge.style.color = '#34d399';
        serverStatusBadge.style.borderColor = 'rgba(16, 185, 129, 0.4)';

        // Sunucudaki taze ayarları çek ve senkronize et
        const serverSettings = await res.json();
        if (serverSettings && serverSettings.restaurantName) {
          siteSettings = { ...siteSettings, ...serverSettings };
          localStorage.setItem('tuzla_site_settings', JSON.stringify(siteSettings));
          populateSettingsForm();
          if (typeof populateScheduleSettings === 'function') {
            populateScheduleSettings();
          }
        }
      }
    } catch (e) {
      serverStatusBadge.innerHTML = '<i class="fa-solid fa-hard-drive" style="color:var(--gold-primary);"></i> <span>Çevrimdışı Mod (LocalStorage Aktif)</span>';
      serverStatusBadge.style.color = 'var(--gold-light)';
      serverStatusBadge.style.borderColor = 'rgba(212, 175, 55, 0.3)';
    }
  }

  const defaultCategoryNames = {
    'mezeler': 'Soğuk Mezeler',
    'ara-sicaklar': 'Ara Sıcaklar',
    'baliklar': 'Mevsim Balıkları',
    'etler': 'Kırmızı Et & Izgara',
    'salatalar': 'Taze Salatalar',
    'rakilar': 'Rakı Kavı',
    'saraplar': 'Şaraplar',
    'biralar': 'Biralar',
    'ithal-ickiler': 'İthal & Sert İçkiler',
    'tatlilar': 'Tatlı Kapanışlar',
    'mesrubatlar': 'Alkolsüz İçecekler',
    'cerezler': 'Çerez & Meyve'
  };

  function getCategoryName(catKey) {
    if (!catKey) return 'Genel';
    const cat = menuCategories[catKey];
    if (cat) {
      return cat.name || cat.tr || cat.shortName || defaultCategoryNames[catKey] || catKey;
    }
    return defaultCategoryNames[catKey] || catKey;
  }

  // Populate Dropdowns
  function populateCategoryDropdowns() {
    const selects = [adminCategorySelect, document.getElementById('itemCategory')];
    const catKeys = new Set([
      ...Object.keys(menuCategories),
      ...Object.keys(defaultCategoryNames),
      ...menuItems.map(i => i.category).filter(Boolean)
    ]);

    selects.forEach(select => {
      if (!select) return;
      const isFilter = select === adminCategorySelect;
      let html = isFilter ? '<option value="all">Tüm Kategoriler</option>' : '';
      for (const key of catKeys) {
        if (isFilter && activeMenuMode === 'gelal' && GELAL_EXCLUDED_CATEGORIES.includes(key)) {
          continue; // Gel-Al modunda alkol kategorilerini filtre kutusunda gizle
        }
        const label = getCategoryName(key);
        html += `<option value="${key}">${label}</option>`;
      }
      select.innerHTML = html;
    });
  }

  // 2. Navigation Tab Switcher & Mobile Drawer
  const adminSidebar = document.querySelector('.admin-sidebar');
  const btnToggleSidebar = document.getElementById('btnToggleSidebar');
  const btnCloseSidebar = document.getElementById('btnCloseSidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const bottomNavAddBtn = document.getElementById('bottomNavAddBtn');

  function openMobileSidebar() {
    if (adminSidebar) adminSidebar.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileSidebar() {
    if (adminSidebar) adminSidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (btnToggleSidebar) {
    btnToggleSidebar.addEventListener('click', (e) => {
      e.stopPropagation();
      if (adminSidebar && adminSidebar.classList.contains('open')) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    });
  }

  if (btnCloseSidebar) {
    btnCloseSidebar.addEventListener('click', closeMobileSidebar);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeMobileSidebar);
  }

  function switchTab(targetId) {
    // Sync active classes on both sidebar items and bottom nav items
    document.querySelectorAll('.js-nav-tab, .js-bottom-tab').forEach(t => {
      if (t.getAttribute('data-tab') === targetId) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    tabPanels.forEach(p => p.classList.remove('active'));
    const activePanel = document.getElementById(targetId);
    if (activePanel) activePanel.classList.add('active');

    // Update page title
    const titleMap = {
      'dashboardTab': 'Genel Bakış',
      'menuTab': 'Menü Yönetimi',
      'reservationsTab': 'Rezervasyon & Anket',
      'settingsTab': 'Site Ayarları',
      'backupTab': 'Yedekleme & Dışa Aktar'
    };
    if (pageTitle) pageTitle.textContent = titleMap[targetId] || 'Yönetim Paneli';

    // Close mobile drawer if open
    closeMobileSidebar();

    // Re-render table if switching to menu
    if (targetId === 'menuTab') {
      renderTable();
    } else if (targetId === 'reservationsTab') {
      loadAndRenderReservations();
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Attach click listener for all tabs (sidebar, dashboard cards, bottom navigation)
  document.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('.js-nav-tab, .js-bottom-tab');
    if (tabBtn) {
      e.preventDefault();
      const targetId = tabBtn.getAttribute('data-tab');
      if (targetId) switchTab(targetId);
    }
  });

  if (bottomNavAddBtn) {
    bottomNavAddBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAddModal();
    });
  }

  // 3. Render Dashboard Stats
  function renderStats() {
    if (statTotalItems) statTotalItems.textContent = menuItems.length;
    if (statTotalCategories) statTotalCategories.textContent = Object.keys(menuCategories).length;

    const signatureCount = menuItems.filter(i => i.is_signature).length;
    if (statSignatureItems) statSignatureItems.textContent = signatureCount;

    const itemsWithPrice = menuItems.filter(i => i.price && i.price > 0);
    const avg = itemsWithPrice.length > 0 
      ? Math.round(itemsWithPrice.reduce((a, b) => a + b.price, 0) / itemsWithPrice.length)
      : 0;
    if (statAvgPrice) statAvgPrice.textContent = `${avg} ₺`;
  }

  // 4. Menu Table Filter & Render
  function getFilteredItems() {
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

    return menuItems.filter(item => {
      // Gel-Al modunda alkollü içecek kategorileri otomatik elenir
      if (activeMenuMode === 'gelal') {
        if (GELAL_EXCLUDED_CATEGORIES.includes(item.category)) return false;
      }

      if (currentCategory !== 'all' && item.category !== currentCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const inName = item.name.toLowerCase().includes(q);
        const inId = item.id.toLowerCase().includes(q);
        const inDesc = item.description ? item.description.toLowerCase().includes(q) : false;
        if (!inName && !inId && !inDesc) return false;
      }
      return true;
    }).sort((a, b) => {
      if (currentCategory === 'all' && !searchQuery) {
        const orderA = categoryOrder.indexOf(a.category);
        const orderB = categoryOrder.indexOf(b.category);
        const rankA = orderA === -1 ? 999 : orderA;
        const rankB = orderB === -1 ? 999 : orderB;
        if (rankA !== rankB) return rankA - rankB;
        return (a.name || '').localeCompare(b.name || '', 'tr', { sensitivity: 'base' });
      }
      return (a.name || '').localeCompare(b.name || '', 'tr', { sensitivity: 'base' });
    });
  }

  function renderTable() {
    if (!menuTableBody) return;

    // Table Header durumunu moda göre ayarla
    if (colGelAlPriceHeader) {
      colGelAlPriceHeader.style.display = (activeMenuMode === 'gelal') ? '' : 'none';
    }
    if (colPriceHeader) {
      colPriceHeader.textContent = (activeMenuMode === 'gelal') ? 'Restoran Fiyatı' : 'Fiyat';
    }

    const filtered = getFilteredItems();
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIdx = (currentPage - 1) * pageSize;
    const pageItems = filtered.slice(startIdx, startIdx + pageSize);
    const colSpanTotal = (activeMenuMode === 'gelal') ? 9 : 8;

    if (pageItems.length === 0) {
      menuTableBody.innerHTML = `
        <tr>
          <td colspan="${colSpanTotal}" style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
            <i class="fa-solid fa-box-open" style="font-size:2rem; color:var(--gold-primary); margin-bottom:0.5rem; display:block;"></i>
            Kayıt bulunamadı. Farklı bir arama veya kategori seçebilirsiniz.
          </td>
        </tr>
      `;
      if (menuMobileCards) {
        menuMobileCards.innerHTML = `
          <div class="mobile-empty-state">
            <i class="fa-solid fa-box-open"></i>
            <h4>Kayıt Bulunamadı</h4>
            <p>Farklı bir arama terimi deneyebilir veya kategoriyi değiştirebilirsiniz.</p>
          </div>
        `;
      }
    } else {
      // 1. Desktop Table Rows
      menuTableBody.innerHTML = pageItems.map(item => {
        const catLabel = getCategoryName(item.category);
        const priceText = item.price ? `${item.price.toLocaleString('tr-TR')} ₺` : 'Günlük / Kg';
        const hasImg = Boolean(item.image && item.isLocalImage !== false && item.image.trim() !== '');

        // 1. Görsel Sütunu Thumbnail
        const thumbHtml = hasImg
          ? `<div class="td-thumb-wrap" onclick="window.editMenuItem('${item.id}')" title="Görseli Değiştir / Düzenle">
              <img src="menu-app/${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="table-dish-thumb" onerror="this.parentElement.className='td-thumb-wrap no-img'; this.parentElement.innerHTML='<i class=\\'fa-solid fa-camera\\'></i><span class=\\'thumb-add-label\\'>Ekle</span>';">
              <div class="thumb-edit-overlay"><i class="fa-solid fa-pen"></i></div>
            </div>`
          : `<div class="td-thumb-wrap no-img" onclick="window.editMenuItem('${item.id}')" title="Görsel Ekle / Düzenle">
              <i class="fa-solid fa-camera"></i>
              <span class="thumb-add-label">Ekle</span>
            </div>`;

        // 2. Fiyat Sütunları
        let priceColHtml = '';
        if (activeMenuMode === 'gelal') {
          const gelalPrice = item.price ? Math.round(item.price * (1 - GELAL_DISCOUNT_RATE)) : null;
          const gelalPriceText = gelalPrice ? `${gelalPrice.toLocaleString('tr-TR')} ₺` : 'Günlük / Kg';
          priceColHtml = `
            <td><s style="color:var(--text-muted); font-size:0.88rem;">${priceText}</s></td>
            <td><span class="price-tag gelal-accent"><i class="fa-solid fa-arrow-down" style="font-size:0.75rem;"></i> ${gelalPriceText}</span></td>
          `;
        } else {
          priceColHtml = `<td><span class="price-tag">${priceText}</span></td>`;
        }

        // 3. Rozet Sütunu
        let badgeHtml = '';
        if (activeMenuMode === 'gelal') {
          badgeHtml = `<span class="tag-badge" style="background:rgba(16,185,129,0.15); color:#34d399; border:1px solid rgba(16,185,129,0.3); font-weight:600;"><i class="fa-solid fa-tag"></i> Gel Al'a Özel</span>`;
        } else {
          badgeHtml = item.badge ? `<span class="tag-badge">${escapeHtml(item.badge)}</span>` : '<span style="color:var(--text-dim);">-</span>';
        }

        return `
          <tr data-id="${item.id}">
            <td style="text-align:center;">${thumbHtml}</td>
            <td><span class="item-code-badge">${item.id}</span></td>
            <td class="item-title-col">
              <strong>${escapeHtml(item.name)}</strong>
              <small>${escapeHtml(item.description || '')}</small>
            </td>
            <td><span class="cat-badge">${escapeHtml(catLabel)}</span></td>
            ${priceColHtml}
            <td>${badgeHtml}</td>
            <td>
              ${item.is_signature ? '<i class="fa-solid fa-star" style="color:#f59e0b;" title="Şefin İmzası"></i>' : '<span style="color:var(--text-dim);">-</span>'}
            </td>
            <td>
              <div class="table-actions">
                <button class="btn-icon-action edit" onclick="window.editMenuItem('${item.id}')" title="Düzenle / Görsel Değiştir">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn-icon-action delete" onclick="window.deleteMenuItem('${item.id}')" title="Sil">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      // 2. Mobile Native Cards View (Spacious and Touch-Friendly)
      if (menuMobileCards) {
        menuMobileCards.innerHTML = pageItems.map(item => {
          const catLabel = getCategoryName(item.category);
          const priceText = item.price ? `${item.price.toLocaleString('tr-TR')} ₺` : 'Günlük / Kg';
          const hasImg = Boolean(item.image && item.isLocalImage !== false && item.image.trim() !== '');

          let gelalDiscountHtml = '';
          if (activeMenuMode === 'gelal') {
            const gelalPrice = item.price ? Math.round(item.price * (1 - GELAL_DISCOUNT_RATE)) : null;
            const gelalPriceText = gelalPrice ? `${gelalPrice.toLocaleString('tr-TR')} ₺` : 'Günlük / Kg';
            gelalDiscountHtml = `
              <div class="mobile-price-gelal">
                <s class="mobile-old-price">${priceText}</s>
                <span class="mobile-cur-price"><i class="fa-solid fa-tag"></i> ${gelalPriceText}</span>
              </div>
            `;
          }

          return `
            <div class="mobile-dish-card" data-id="${item.id}">
              <div class="mobile-card-main">
                <div class="mobile-card-thumb-box" onclick="window.editMenuItem('${item.id}')">
                  ${hasImg 
                    ? `<img src="menu-app/${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="mobile-dish-img" onerror="this.parentElement.innerHTML='<div class=\\'mobile-card-no-img\\'><i class=\\'fa-solid fa-camera\\'></i></div>';">`
                    : `<div class="mobile-card-no-img"><i class="fa-solid fa-camera"></i></div>`
                  }
                  <div class="mobile-thumb-edit-pill"><i class="fa-solid fa-pen"></i></div>
                </div>

                <div class="mobile-card-content">
                  <div class="mobile-card-header-line">
                    <h4 class="mobile-card-dish-name" onclick="window.editMenuItem('${item.id}')">${escapeHtml(item.name)}</h4>
                    ${item.is_signature ? '<span class="mobile-crown-tag"><i class="fa-solid fa-crown"></i> Şefin İmzası</span>' : ''}
                  </div>
                  
                  <div class="mobile-card-meta-line">
                    <span class="mobile-cat-badge">${escapeHtml(catLabel)}</span>
                    <span class="mobile-code-badge">${item.id}</span>
                    ${item.badge ? `<span class="mobile-custom-badge">${escapeHtml(item.badge)}</span>` : ''}
                  </div>

                  ${item.description ? `<p class="mobile-card-dish-desc">${escapeHtml(item.description)}</p>` : ''}
                </div>
              </div>

              <div class="mobile-card-footer">
                <div class="mobile-card-price-area">
                  ${activeMenuMode === 'gelal' ? gelalDiscountHtml : `<span class="mobile-main-price">${priceText}</span>`}
                </div>

                <div class="mobile-card-actions">
                  <button type="button" class="btn-mobile-edit" onclick="window.editMenuItem('${item.id}')">
                    <i class="fa-solid fa-pen-to-square"></i>
                    <span>Düzenle</span>
                  </button>
                  <button type="button" class="btn-mobile-delete" onclick="window.deleteMenuItem('${item.id}')" title="Ürünü Sil">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    if (pageInfo) {
      const modeLabel = (activeMenuMode === 'gelal') ? '🛍️ Gel-Al Menüsü (%20 İndirimli)' : '🍽️ Restoran Menüsü';
      pageInfo.textContent = `Toplam ${totalCount} üründen ${startIdx + 1} - ${Math.min(startIdx + pageSize, totalCount)} arası gösteriliyor (${modeLabel} • Sayfa ${currentPage} / ${totalPages})`;
    }

    if (prevPageBtn) prevPageBtn.disabled = currentPage <= 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage >= totalPages;

    updateMenuModeCounts();
  }

  // Table Search & Category Filter
  if (adminSearchInput) {
    adminSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      currentPage = 1;
      renderTable();
    });
  }

  if (adminCategorySelect) {
    adminCategorySelect.addEventListener('change', (e) => {
      currentCategory = e.target.value;
      currentPage = 1;
      renderTable();
    });
  }

  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      currentPage++;
      renderTable();
    });
  }

  // ==========================================
  // MENÜ MODU GEÇİŞİ (RESTORAN vs GEL-AL)
  // ==========================================
  if (btnModeRestaurant) {
    btnModeRestaurant.addEventListener('click', () => {
      if (activeMenuMode === 'restaurant') return;
      activeMenuMode = 'restaurant';
      btnModeRestaurant.classList.add('active');
      btnModeGelAl?.classList.remove('active');
      if (gelalModeBanner) gelalModeBanner.style.display = 'none';
      populateCategoryDropdowns();
      currentPage = 1;
      renderTable();
      showToast('🍽️ Restoran Menüsü Yönetimi seçildi.');
    });
  }

  if (btnModeGelAl) {
    btnModeGelAl.addEventListener('click', () => {
      if (activeMenuMode === 'gelal') return;
      activeMenuMode = 'gelal';
      btnModeGelAl.classList.add('active');
      btnModeRestaurant?.classList.remove('active');
      if (gelalModeBanner) gelalModeBanner.style.display = 'flex';
      if (GELAL_EXCLUDED_CATEGORIES.includes(currentCategory)) {
        currentCategory = 'all';
      }
      populateCategoryDropdowns();
      currentPage = 1;
      renderTable();
      showToast('🛍️ Gel-Al Menüsü (%20 indirimli, alkolsüz) seçildi.');
    });
  }

  // ==========================================
  // ÜRÜN GÖRSELİ ÖNİZLEME VE GÜNCELLEME
  // ==========================================
  function updateImagePreviewUI(imagePath) {
    const rawPath = (imagePath || '').trim();
    if (itemImage) itemImage.value = rawPath;

    if (rawPath) {
      const srcUrl = rawPath.startsWith('http://') || rawPath.startsWith('https://') || rawPath.startsWith('/')
        ? rawPath
        : `menu-app/${rawPath}`;

      if (dishImagePreview) {
        dishImagePreview.src = srcUrl;
        dishImagePreview.style.display = 'block';
        dishImagePreview.onerror = function () {
          dishImagePreview.style.display = 'none';
          if (dishImagePlaceholder) dishImagePlaceholder.style.display = 'flex';
        };
      }
      if (dishImagePlaceholder) dishImagePlaceholder.style.display = 'none';
      if (imgStatusBadge) {
        imgStatusBadge.textContent = 'Fotoğraf Var';
        imgStatusBadge.className = 'img-status-badge has-img';
      }
    } else {
      if (dishImagePreview) {
        dishImagePreview.src = '';
        dishImagePreview.style.display = 'none';
      }
      if (dishImagePlaceholder) dishImagePlaceholder.style.display = 'flex';
      if (imgStatusBadge) {
        imgStatusBadge.textContent = 'Görsel Yok';
        imgStatusBadge.className = 'img-status-badge';
      }
    }
  }

  // Bilgisayardan Fotoğraf Yükleme
  if (btnTriggerUpload && itemImageFileInput) {
    btnTriggerUpload.addEventListener('click', () => {
      itemImageFileInput.value = '';
      itemImageFileInput.click();
    });

    itemImageFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Lütfen geçerli bir resim dosyası seçin (PNG, JPG, WEBP).');
        return;
      }

      if (file.size > 8 * 1024 * 1024) {
        alert('Resim boyutu 8MB\'tan küçük olmalıdır.');
        return;
      }

      const origText = btnTriggerUpload.innerHTML;
      btnTriggerUpload.disabled = true;
      btnTriggerUpload.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Fotoğraf Yükleniyor...</span>';

      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const res = await fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: file.name,
              dataUrl: evt.target.result
            })
          });

          const result = await res.json();
          if (res.ok && result.success && result.imagePath) {
            updateImagePreviewUI(result.imagePath);
            showToast('Fotoğraf başarıyla yüklendi!');
          } else {
            alert('Görsel yüklenemedi: ' + (result.error || 'Bilinmeyen hata'));
          }
        } catch (err) {
          alert('Sunucuya bağlanılamadı: ' + err.message);
        } finally {
          btnTriggerUpload.disabled = false;
          btnTriggerUpload.innerHTML = origText;
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Görseli Kaldır (Görselsiz Yap)
  if (btnRemoveImage) {
    btnRemoveImage.addEventListener('click', () => {
      updateImagePreviewUI('');
      showToast('Görsel kaldırıldı. Menüde şık metin kartı olarak görünecek.');
    });
  }

  // ==========================================
  // FOTOĞRAF GALERİSİ MODAL MANTIĞI
  // ==========================================
  async function loadGalleryImages() {
    if (galleryLoaded && galleryImages.length > 0) {
      renderGalleryGrid();
      return;
    }

    if (galleryGridBody) {
      galleryGridBody.innerHTML = `
        <div style="text-align:center; padding:3rem; color:var(--text-muted); grid-column:1/-1;">
          <i class="fa-solid fa-spinner fa-spin" style="font-size:2rem; color:var(--gold-primary); margin-bottom:0.8rem; display:block;"></i>
          Fotoğraf galerisi taranıyor (200+ görsel)...
        </div>
      `;
    }

    try {
      const res = await fetch('/api/images/gallery');
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.images)) {
        galleryImages = data.images;
        galleryLoaded = true;
        populateGalleryCategoryFilter();
        renderGalleryGrid();
      } else {
        throw new Error(data.error || 'Galeri yüklenemedi');
      }
    } catch (err) {
      if (galleryGridBody) {
        galleryGridBody.innerHTML = `
          <div style="text-align:center; padding:3rem; color:#f87171; grid-column:1/-1;">
            <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem; margin-bottom:0.8rem; display:block;"></i>
            Galeri yüklenirken hata oluştu: ${escapeHtml(err.message)}
          </div>
        `;
      }
    }
  }

  function populateGalleryCategoryFilter() {
    if (!galleryCategoryFilter) return;
    const cats = new Set();
    galleryImages.forEach(img => {
      if (img.category) cats.add(img.category);
    });
    let html = `<option value="all">Tüm Kategoriler (${galleryImages.length} Fotoğraf)</option>`;
    Array.from(cats).sort().forEach(cat => {
      const label = menuCategories[cat] ? menuCategories[cat].tr : cat;
      const count = galleryImages.filter(i => i.category === cat).length;
      html += `<option value="${escapeHtml(cat)}">${escapeHtml(label)} (${count})</option>`;
    });
    galleryCategoryFilter.innerHTML = html;
  }

  function renderGalleryGrid() {
    if (!galleryGridBody) return;

    const q = gallerySearch.toLowerCase().trim();
    const filtered = galleryImages.filter(img => {
      if (galleryCategory !== 'all' && img.category !== galleryCategory) return false;
      if (q) {
        const inFilename = img.filename.toLowerCase().includes(q);
        const inPath = img.path.toLowerCase().includes(q);
        const inCat = img.category.toLowerCase().includes(q);
        if (!inFilename && !inPath && !inCat) return false;
      }
      return true;
    });

    if (galleryCountLabel) {
      galleryCountLabel.textContent = `${filtered.length} fotoğraf listeleniyor (Toplam: ${galleryImages.length})`;
    }

    if (filtered.length === 0) {
      galleryGridBody.innerHTML = `
        <div style="text-align:center; padding:3rem; color:var(--text-muted); grid-column:1/-1;">
          <i class="fa-solid fa-magnifying-glass" style="font-size:2rem; color:var(--gold-primary); margin-bottom:0.8rem; display:block;"></i>
          Aramanıza uygun fotoğraf bulunamadı.
        </div>
      `;
      return;
    }

    const currentSelectedPath = (itemImage ? itemImage.value : '').trim();

    galleryGridBody.innerHTML = filtered.map(img => {
      const isSelected = currentSelectedPath === img.path;
      const displayName = img.filename
        .replace(/^dish_\d+_/, '')
        .replace(/\.[^/.]+$/, '')
        .replace(/[_-]/g, ' ');

      return `
        <div class="gallery-item-tile ${isSelected ? 'selected' : ''}" onclick="window.selectGalleryImage('${escapeHtml(img.path)}')" title="${escapeHtml(displayName)}">
          <img src="menu-app/${escapeHtml(img.path)}" alt="${escapeHtml(displayName)}" class="gallery-tile-img" loading="lazy">
          <div class="gallery-tile-info">${escapeHtml(displayName)}</div>
        </div>
      `;
    }).join('');
  }

  window.selectGalleryImage = (imagePath) => {
    updateImagePreviewUI(imagePath);
    closeGalleryModal();
    showToast('Fotoğraf galeriden seçildi!');
  };

  function openGalleryModal() {
    galleryPickerModal?.classList.add('active');
    loadGalleryImages();
  }

  function closeGalleryModal() {
    galleryPickerModal?.classList.remove('active');
  }

  if (btnOpenGalleryModal) {
    btnOpenGalleryModal.addEventListener('click', openGalleryModal);
  }

  closeGalleryBtns.forEach(btn => btn.addEventListener('click', closeGalleryModal));
  galleryPickerModal?.addEventListener('click', (e) => {
    if (e.target === galleryPickerModal) closeGalleryModal();
  });

  if (gallerySearchInput) {
    gallerySearchInput.addEventListener('input', (e) => {
      gallerySearch = e.target.value;
      renderGalleryGrid();
    });
  }

  if (galleryCategoryFilter) {
    galleryCategoryFilter.addEventListener('change', (e) => {
      galleryCategory = e.target.value;
      renderGalleryGrid();
    });
  }

  // 5. Add / Edit Modal Logic
  window.editMenuItem = (id) => {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;

    editingItemId = id;
    if (itemModalTitle) itemModalTitle.textContent = `Ürünü Düzenle: ${item.name}`;

    document.getElementById('itemId').value = item.id;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemPrice').value = item.price || '';
    document.getElementById('itemBadge').value = item.badge || '';
    document.getElementById('itemDesc').value = item.description || '';
    document.getElementById('itemSignature').checked = !!item.is_signature;

    const hasImg = (item.image && item.isLocalImage !== false) ? item.image : '';
    updateImagePreviewUI(hasImg);

    openModal();
  };

  window.deleteMenuItem = (id) => {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;

    if (confirm(`"${item.name}" ürününü menüden kaldırmak istediğinize emin misiniz?`)) {
      menuItems = menuItems.filter(i => i.id !== id);
      saveMenuState();
      renderStats();
      renderTable();
      updateMenuModeCounts();
      showToast(`"${item.name}" başarıyla silindi.`);
    }
  };

  if (btnOpenAddModal) {
    btnOpenAddModal.addEventListener('click', () => {
      editingItemId = null;
      if (itemModalTitle) itemModalTitle.textContent = 'Yeni Menü Ürünü Ekle';
      if (itemForm) itemForm.reset();
      
      // Auto-generate random ST ID
      const nextId = 'ST' + Math.floor(10000 + Math.random() * 90000);
      document.getElementById('itemId').value = nextId;
      updateImagePreviewUI('');
      openModal();
    });
  }

  function openModal() {
    itemModal?.classList.add('active');
  }

  function closeModal() {
    itemModal?.classList.remove('active');
    editingItemId = null;
  }

  modalCloseBtns.forEach(btn => btn.addEventListener('click', closeModal));
  itemModal?.addEventListener('click', (e) => {
    if (e.target === itemModal) closeModal();
  });

  if (itemForm) {
    itemForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('itemId').value.trim();
      const name = document.getElementById('itemName').value.trim();
      const category = document.getElementById('itemCategory').value;
      const priceVal = document.getElementById('itemPrice').value.trim();
      const badge = document.getElementById('itemBadge').value.trim();
      const description = document.getElementById('itemDesc').value.trim();
      const is_signature = document.getElementById('itemSignature').checked;
      const imagePath = (document.getElementById('itemImage')?.value || '').trim();
      const hasImage = Boolean(imagePath);

      const price = priceVal ? parseInt(priceVal, 10) : null;

      if (!name) {
        alert('Lütfen ürün adını giriniz.');
        return;
      }

      if (editingItemId) {
        // Update
        const idx = menuItems.findIndex(i => i.id === editingItemId);
        if (idx > -1) {
          menuItems[idx] = {
            ...menuItems[idx],
            name,
            category,
            price,
            badge,
            description,
            is_signature,
            image: imagePath,
            isLocalImage: hasImage
          };
          showToast(`"${name}" başarıyla güncellendi!`);
        }
      } else {
        // Add
        menuItems.unshift({
          id: id || ('ST' + Date.now().toString().slice(-5)),
          raw_name: name,
          name,
          category,
          price,
          badge: badge || 'Yeni',
          description,
          is_signature,
          image: imagePath,
          isLocalImage: hasImage
        });
        showToast(`"${name}" menüye eklendi!`);
      }

      saveMenuState();
      closeModal();
      renderStats();
      renderTable();
      updateMenuModeCounts();
    });
  }

  // 6. Site Settings Management
  function populateSettingsForm() {
    if (!siteSettingsForm) return;

    for (const [key, val] of Object.entries(siteSettings)) {
      const field = document.getElementById(`setting_${key}`);
      if (field) {
        field.value = val;
      }
    }
    populateScheduleSettings();
  }

  if (siteSettingsForm) {
    siteSettingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const newSettings = { ...siteSettings };
      const inputs = siteSettingsForm.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        const key = input.id.replace('setting_', '');
        newSettings[key] = input.type === 'number' ? Number(input.value) : input.value.trim();
      });

      siteSettings = newSettings;
      localStorage.setItem('tuzla_site_settings', JSON.stringify(siteSettings));
      populateScheduleSettings();

      // Attempt to save to server if running
      try {
        const res = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(siteSettings)
        });
        if (res.ok) {
          showToast('Site ayarları hem tarayıcıya hem de diske kaydedildi!');
          return;
        }
      } catch (err) {
        // fallback
      }

      showToast('Site ayarları başarıyla kaydedildi!');
    });
  }

  // 7. Save / Export / Reset Functions
  function saveMenuState() {
    localStorage.setItem('tuzla_custom_menu', JSON.stringify(menuItems));

    // Try background sync with server
    syncMenuWithServer();
  }

  async function syncMenuWithServer() {
    try {
      await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: menuItems, categories: menuCategories })
      });
    } catch (e) {
      // Offline mode
    }
  }

  if (btnSaveToDisk) {
    btnSaveToDisk.addEventListener('click', async () => {
      try {
        const res = await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: menuItems, categories: menuCategories })
        });
        if (res.ok) {
          const resSettings = await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(siteSettings)
          });
          showToast('Tüm menü ve ayarlar doğrudan dosyalara (diske) kaydedildi!');
        } else {
          showToast('Sunucu hatası. Değişiklikler tarayıcıda güvende.');
        }
      } catch (err) {
        showToast('Yerel Node.js sunucusu kapalı. Değişiklikler tarayıcınızda (localStorage) anında geçerlidir.');
      }
    });
  }

  if (btnDownloadBackup) {
    btnDownloadBackup.addEventListener('click', () => {
      const backupData = {
        exportedAt: new Date().toISOString(),
        siteSettings: siteSettings,
        categories: menuCategories,
        menuItems: menuItems,
        reservations: (typeof reservationsList !== 'undefined' ? reservationsList : [])
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tuzla_balik_tam_yedek_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Menü, ayarlar ve rezervasyonlar içeren tam yedek indirildi!');
    });
  }

  if (backupFileInput) {
    backupFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.menuItems && Array.isArray(parsed.menuItems)) {
            menuItems = parsed.menuItems;
            if (parsed.siteSettings) siteSettings = parsed.siteSettings;
            if (parsed.categories) menuCategories = parsed.categories;

            saveMenuState();
            localStorage.setItem('tuzla_site_settings', JSON.stringify(siteSettings));

            // Eğer yedek içinde rezervasyonlar da varsa sunucuya geri yükle
            if (parsed.reservations && Array.isArray(parsed.reservations)) {
              fetch('/api/reservations/restore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsed.reservations)
              }).then(() => {
                if (typeof loadAndRenderReservations === 'function') loadAndRenderReservations();
              }).catch(() => {});
            }

            renderStats();
            renderTable();
            populateSettingsForm();
            showToast('Yedek başarıyla yüklendi ve menü/ayarlar güncellendi!');
          } else {
            alert('Geçersiz yedek dosyası formatı.');
          }
        } catch (err) {
          alert('Dosya okunurken hata oluştu: ' + err.message);
        }
      };
      reader.readAsText(file);
    });
  }

  if (btnResetDefaults) {
    btnResetDefaults.addEventListener('click', () => {
      if (confirm('Tüm menüyü ve ayarları ilk orijinal haline sıfırlamak istediğinize emin misiniz? Yapılan tüm özel değişiklikler silinecektir.')) {
        localStorage.removeItem('tuzla_custom_menu');
        localStorage.removeItem('tuzla_site_settings');
        localStorage.removeItem('tuzla_tray');
        showToast('Tüm veriler fabrika ayarlarına sıfırlandı!');
        setTimeout(() => location.reload(), 1000);
      }
    });
  }

  // ==========================================
  // REZERVASYON & ANKET YÖNETİMİ MANTIĞI
  // ==========================================
  let reservationsList = [];
  let resFilter = 'all';
  let resSearch = '';

  const resTableBody = document.getElementById('resTableBody');
  const resTableCount = document.getElementById('resTableCount');
  const resSearchInput = document.getElementById('resSearchInput');
  const resStatusFilter = document.getElementById('resStatusFilter');
  const pendingSurveyBadge = document.getElementById('pendingSurveyBadge');
  const countDueBtn = document.getElementById('countDueBtn');
  const btnSendAllDue = document.getElementById('btnSendAllDue');

  // Stats
  const statResTotal = document.getElementById('statResTotal');
  const statResDue = document.getElementById('statResDue');
  const statResSent = document.getElementById('statResSent');
  const statResCompleted = document.getElementById('statResCompleted');

  // Modals
  const resModal = document.getElementById('resModal');
  const btnOpenAddResModal = document.getElementById('btnOpenAddResModal');
  const resForm = document.getElementById('resForm');
  const surveyDetailModal = document.getElementById('surveyDetailModal');

  async function fetchReservations() {
    try {
      const res = await fetch('/api/reservations');
      if (res.ok) {
        reservationsList = await res.json();
      }
    } catch (err) {
      console.warn('Rezervasyonlar API üzerinden alınamadı:', err);
    }
    updateReservationBadges();
  }

  function updateReservationBadges() {
    const now = new Date();
    const dueCount = reservationsList.filter(r => r.survey_status === 'pending' && new Date(r.survey_scheduled_at) <= now).length;
    if (pendingSurveyBadge) {
      if (dueCount > 0) {
        pendingSurveyBadge.textContent = dueCount;
        pendingSurveyBadge.style.display = 'inline-block';
      } else {
        pendingSurveyBadge.style.display = 'none';
      }
    }
    const bottomNavResBadge = document.getElementById('bottomNavResBadge');
    if (bottomNavResBadge) {
      bottomNavResBadge.style.display = dueCount > 0 ? 'block' : 'none';
    }
    if (countDueBtn) countDueBtn.textContent = dueCount;
  }

  async function loadAndRenderReservations() {
    await fetchReservations();
    renderReservationStats();
    renderReservationTable();
  }

  function renderReservationStats() {
    const now = new Date();
    const total = reservationsList.length;
    const due = reservationsList.filter(r => r.survey_status === 'pending' && new Date(r.survey_scheduled_at) <= now).length;
    const sent = reservationsList.filter(r => r.survey_status === 'sent').length;
    const completedList = reservationsList.filter(r => r.survey_status === 'completed' && r.survey_data);
    const completed = completedList.length;

    let avgScore = 0;
    if (completed > 0) {
      const sum = completedList.reduce((acc, r) => acc + (r.survey_data.score_overall || 5), 0);
      avgScore = (sum / completed).toFixed(1);
    }

    if (statResTotal) statResTotal.textContent = total;
    if (statResDue) statResDue.textContent = due;
    if (statResSent) statResSent.textContent = sent;
    if (statResCompleted) {
      statResCompleted.innerHTML = completed > 0 
        ? `${completed} <span style="font-size:0.95rem; font-weight:600; color:#ffb703;">(★ ${avgScore})</span>` 
        : '0';
    }
  }

  function formatWaPhone(phone) {
    if (!phone) return '';
    let digits = String(phone).replace(/\D/g, '');
    if (digits.startsWith('0')) digits = '90' + digits.slice(1);
    else if (digits.length === 10) digits = '90' + digits;
    return digits;
  }

  function renderReservationTable() {
    if (!resTableBody) return;
    try {
      const resMobileCards = document.getElementById('resMobileCards');
      const now = new Date();

    let filtered = reservationsList.filter(r => {
      // Status filter
      const isDue = r.survey_status === 'pending' && new Date(r.survey_scheduled_at) <= now;
      if (resFilter === 'due' && !isDue) return false;
      if (resFilter === 'pending' && (r.survey_status !== 'pending' || isDue)) return false;
      if (resFilter === 'sent' && r.survey_status !== 'sent') return false;
      if (resFilter === 'completed' && r.survey_status !== 'completed') return false;

      // Search filter
      if (resSearch) {
        const query = resSearch.toLowerCase();
        const matchesName = (r.name || '').toLowerCase().includes(query);
        const matchesPhone = (r.phone || '').includes(query);
        const matchesNotes = (r.notes || '').toLowerCase().includes(query);
        if (!matchesName && !matchesPhone && !matchesNotes) return false;
      }
      return true;
    });

    if (resTableCount) resTableCount.textContent = `${filtered.length} kayıt listeleniyor`;

    if (filtered.length === 0) {
      resTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:2.5rem; color:var(--text-muted);">
            <i class="fa-solid fa-calendar-xmark" style="font-size:2rem; margin-bottom:0.5rem; display:block; opacity:0.4;"></i>
            Kayıt bulunamadı.
          </td>
        </tr>
      `;
      if (resMobileCards) {
        resMobileCards.innerHTML = `
          <div class="mobile-empty-state">
            <i class="fa-solid fa-calendar-xmark"></i>
            <h4>Rezervasyon Bulunamadı</h4>
            <p>Seçilen filtrede kayıtlı rezervasyon bulunmuyor.</p>
          </div>
        `;
      }
      return;
    }

    // 1. Desktop Table Rows
    resTableBody.innerHTML = filtered.map(item => {
      const isDue = item.survey_status === 'pending' && new Date(item.survey_scheduled_at) <= now;
      
      let statusHtml = '';
      if (item.survey_status === 'completed') {
        const score = item.survey_data?.score_overall || 5;
        statusHtml = `<span class="status-pill status-completed"><i class="fa-solid fa-star"></i> Dolduruldu (★ ${score}.0)</span>`;
      } else if (item.survey_status === 'sent') {
        statusHtml = `<span class="status-pill status-sent"><i class="fa-solid fa-paper-plane"></i> Gönderildi</span>`;
      } else if (isDue) {
        statusHtml = `<span class="status-pill status-due"><i class="fa-solid fa-bell"></i> Zamanı Geldi</span>`;
      } else {
        statusHtml = `<span class="status-pill status-pending"><i class="fa-solid fa-clock"></i> Zamanı Bekliyor</span>`;
      }

      const scheduledDate = new Date(item.survey_scheduled_at);
      const scheduledFormatted = !isNaN(scheduledDate)
        ? scheduledDate.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
        : '-';

      return `
        <tr>
          <td>
            <div style="font-weight:600; color:#fff;">${escapeHtml(item.name)}</div>
            ${item.notes ? `<div style="font-size:0.78rem; color:var(--gold-primary); margin-top:0.2rem;"><i class="fa-solid fa-note-sticky"></i> ${escapeHtml(item.notes)}</div>` : ''}
          </td>
          <td>
            <a href="tel:${escapeHtml(item.phone)}" style="color:var(--text-muted); text-decoration:none;">
              <i class="fa-solid fa-phone" style="font-size:0.75rem;"></i> ${escapeHtml(item.phone)}
            </a>
          </td>
          <td>
            <div style="color:#e2e8f0; font-weight:500;">${escapeHtml(item.date)} - ${escapeHtml(item.time)}</div>
            <div style="font-size:0.78rem; color:var(--text-muted);">${escapeHtml(item.guests)} Kişi &bull; ${escapeHtml(item.area || 'Fark etmez')}</div>
          </td>
          <td>
            <div style="color:${isDue ? '#facc15' : 'var(--text-muted)'}; font-weight:${isDue ? '600' : '400'}; display:flex; align-items:center; gap:0.4rem;">
              <i class="fa-regular fa-clock" style="font-size:0.8rem;"></i>
              <span>${scheduledFormatted}</span>
              ${item.survey_status === 'pending' ? `
                <button type="button" class="js-edit-single-schedule" data-id="${item.id}" title="Bu misafirin anket gönderim zamanını düzenle" style="background:rgba(212,175,55,0.12); border:1px solid rgba(212,175,55,0.3); color:var(--gold-primary); cursor:pointer; padding:2px 6px; font-size:0.72rem; border-radius:4px;">
                  <i class="fa-solid fa-pen"></i>
                </button>
              ` : ''}
            </div>
          </td>
          <td>${statusHtml}</td>
          <td style="text-align:right;">
            <div class="table-actions" style="justify-content:flex-end;">
              ${item.survey_status === 'completed' ? `
                <button class="btn-survey-view js-view-survey" data-id="${item.id}" title="Anket Yanıtını Görüntüle">
                  <i class="fa-solid fa-eye"></i> <span>Anketi Gör</span>
                </button>
              ` : `
                <a href="${item.wa_direct_url || '#'}" target="_blank" rel="noopener" class="btn-wa-send js-send-wa" data-id="${item.id}" title="WhatsApp ile Anket Linki Gönder">
                  <i class="fa-brands fa-whatsapp"></i> <span>WhatsApp ile Gönder</span>
                </a>
              `}
              <button class="btn-action-icon delete js-delete-res" data-id="${item.id}" title="Sil">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // 2. Mobile Native Booking Cards
    if (resMobileCards) {
      resMobileCards.innerHTML = filtered.map(item => {
        const isDue = item.survey_status === 'pending' && new Date(item.survey_scheduled_at) <= now;
        
        let statusHtml = '';
        if (item.survey_status === 'completed') {
          const score = item.survey_data?.score_overall || 5;
          statusHtml = `<span class="status-pill status-completed"><i class="fa-solid fa-star"></i> Dolduruldu (★ ${score}.0)</span>`;
        } else if (item.survey_status === 'sent') {
          statusHtml = `<span class="status-pill status-sent"><i class="fa-solid fa-paper-plane"></i> Gönderildi</span>`;
        } else if (isDue) {
          statusHtml = `<span class="status-pill status-due"><i class="fa-solid fa-bell"></i> Zamanı Geldi</span>`;
        } else {
          statusHtml = `<span class="status-pill status-pending"><i class="fa-solid fa-clock"></i> Zamanı Bekliyor</span>`;
        }

        const scheduledDate = new Date(item.survey_scheduled_at);
        const scheduledFormatted = !isNaN(scheduledDate)
          ? scheduledDate.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
          : '-';

        return `
          <div class="mobile-res-card" data-id="${item.id}">
            <div class="mobile-res-header">
              <div class="mobile-res-guest">
                <h4 class="mobile-res-name">${escapeHtml(item.name)}</h4>
                <span class="mobile-res-party"><i class="fa-solid fa-users"></i> ${escapeHtml(item.guests)} Kişi &bull; ${escapeHtml(item.area || 'Fark etmez')}</span>
              </div>
              <div class="mobile-res-status-box">
                ${statusHtml}
              </div>
            </div>

            <div class="mobile-res-body">
              <div class="mobile-res-row">
                <div class="mobile-res-datetime">
                  <i class="fa-regular fa-calendar-days"></i>
                  <strong>${escapeHtml(item.date)}</strong> &bull; <span>${escapeHtml(item.time)}</span>
                </div>
                <div class="mobile-res-contact">
                  <a href="tel:${escapeHtml(item.phone)}" class="mobile-btn-phone">
                    <i class="fa-solid fa-phone"></i>
                    <span>${escapeHtml(item.phone)}</span>
                  </a>
                  <a href="https://wa.me/${formatWaPhone(item.phone)}" target="_blank" class="mobile-btn-wa" title="WhatsApp ile Mesaj At">
                    <i class="fa-brands fa-whatsapp"></i>
                  </a>
                </div>
              </div>

              ${item.notes ? `
                <div class="mobile-res-notes">
                  <i class="fa-solid fa-note-sticky"></i>
                  <span>${escapeHtml(item.notes)}</span>
                </div>
              ` : ''}

              <div class="mobile-res-clock-row">
                <i class="fa-regular fa-clock"></i>
                <span>Otomatik Anket: <strong>${scheduledFormatted}</strong></span>
                ${item.survey_status === 'pending' ? `
                  <button type="button" class="btn-mobile-clock-edit js-edit-single-schedule" data-id="${item.id}" title="Anket saatini değiştir">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                ` : ''}
              </div>
            </div>

            <div class="mobile-res-footer">
              ${item.survey_status === 'completed' ? `
                <button type="button" class="btn-survey-view js-view-survey" data-id="${item.id}" style="flex:1; height:44px; border-radius:10px; justify-content:center;">
                  <i class="fa-solid fa-eye"></i> <span>Anketi Gör</span>
                </button>
              ` : `
                <a href="${item.wa_direct_url || '#'}" target="_blank" rel="noopener" class="btn-wa-send js-send-wa ${isDue ? 'is-due' : ''}" data-id="${item.id}" style="flex:1; height:44px; border-radius:10px; justify-content:center;">
                  <i class="fa-brands fa-whatsapp"></i> <span>${isDue ? 'Şimdi Gönder' : 'WhatsApp Gönder'}</span>
                </a>
              `}
              <button type="button" class="btn-action-icon delete js-delete-res" data-id="${item.id}" title="Sil" style="width:44px; height:44px; border-radius:10px; display:inline-flex; align-items:center; justify-content:center;">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    // Attach row events for both table and mobile cards
    const resContainers = [resTableBody, resMobileCards].filter(Boolean);
    resContainers.forEach(container => {
      container.querySelectorAll('.js-send-wa').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.getAttribute('data-id');
          try {
            await fetch('/api/reservations/status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id, survey_status: 'sent', survey_sent_via: 'manual_whatsapp' })
            });
            const target = reservationsList.find(r => r.id === id);
            if (target) {
              target.survey_status = 'sent';
              target.survey_sent_at = new Date().toISOString();
            }
            showToast('WhatsApp açıldı ve durum "Gönderildi" olarak güncellendi!');
            renderReservationStats();
            renderReservationTable();
          } catch (_) {}
        });
      });

      container.querySelectorAll('.js-view-survey').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const target = reservationsList.find(r => r.id === id);
          if (target && target.survey_data) {
            openSurveyDetailModal(target);
          }
        });
      });

      container.querySelectorAll('.js-delete-res').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.getAttribute('data-id');
          if (confirm('Bu rezervasyonu silmek istediğinize emin misiniz?')) {
            try {
              await fetch('/api/reservations/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
              });
              reservationsList = reservationsList.filter(r => r.id !== id);
              showToast('Rezervasyon başarıyla silindi');
              renderReservationStats();
              renderReservationTable();
            } catch (_) {
              alert('Silme işlemi başarısız oldu.');
            }
          }
        });
      });

      // Tekil anket zamanı düzenleme
      container.querySelectorAll('.js-edit-single-schedule').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.getAttribute('data-id');
          const target = reservationsList.find(r => r.id === id);
          if (!target) return;

          let defaultVal = '';
          if (target.survey_scheduled_at) {
            const d = new Date(target.survey_scheduled_at);
            const trParts = new Intl.DateTimeFormat('en-US', {
              timeZone: 'Europe/Istanbul',
              year: 'numeric', month: '2-digit', day: '2-digit',
              hour: '2-digit', minute: '2-digit', hour12: false
            }).formatToParts(d);
            const getPart = type => trParts.find(p => p.type === type)?.value || '';
            defaultVal = `${getPart('year')}-${getPart('month')}-${getPart('day')} ${getPart('hour')}:${getPart('minute')}`;
          }

          const newDateTime = prompt(
            `"${target.name}" için yeni anket zamanı girin:\n(Örnek: 2026-11-28 15:30 veya 2026-11-29 12:00)`,
            defaultVal
          );
          if (!newDateTime) return;

          const clean = newDateTime.trim().replace(' ', 'T');
          try {
            const res = await fetch('/api/reservations/reschedule', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id, scheduled_at: clean })
            });
            if (res.ok) {
              showToast('Anket zamanı başarıyla güncellendi!');
              loadAndRenderReservations();
            } else {
              alert('Zaman güncellenemedi.');
            }
          } catch (err) {
            alert('Hata: ' + err.message);
          }
        });
      });
    });
    } catch (err) {
      console.error('renderReservationTable hatası:', err);
    }
  }

  function openSurveyDetailModal(resItem) {
    if (!surveyDetailModal) return;
    const data = resItem.survey_data || {};

    document.getElementById('surveyGuestName').textContent = resItem.name + ' - ' + (resItem.phone || '');
    document.getElementById('surveyGuestDate').textContent = `Rezervasyon: ${resItem.date} (${resItem.time}) • Kişi: ${resItem.guests}`;

    document.getElementById('modalScoreOverall').innerHTML = `⭐ ${data.score_overall || 5}.0`;
    document.getElementById('modalScoreFood').innerHTML = `⭐ ${data.score_food || 5}.0`;
    document.getElementById('modalScoreService').innerHTML = `⭐ ${data.score_service || 5}.0`;
    document.getElementById('modalScoreAmbience').innerHTML = `⭐ ${data.score_ambience || 5}.0`;

    document.getElementById('modalCommentBox').textContent = data.comment ? `"${data.comment}"` : '(Misafir ek bir yorum yazmadı)';

    const googleBadge = document.getElementById('modalGoogleReviewBadge');
    if (googleBadge) {
      if (data.google_review_clicked) {
        googleBadge.style.display = 'flex';
        googleBadge.innerHTML = `<i class="fa-brands fa-google"></i> <span>Misafir Google Haritalar'da yorum yapma butonuna tıkladı! 🌟</span>`;
      } else {
        googleBadge.style.display = 'none';
      }
    }

    surveyDetailModal.classList.add('open');
  }

  // Filter & Search Event Listeners
  if (resSearchInput) {
    resSearchInput.addEventListener('input', () => {
      resSearch = resSearchInput.value.trim();
      renderReservationTable();
    });
  }

  if (resStatusFilter) {
    resStatusFilter.addEventListener('change', () => {
      resFilter = resStatusFilter.value;
      renderReservationTable();
    });
  }

  // Toplu Gönderim Butonu
  if (btnSendAllDue) {
    btnSendAllDue.addEventListener('click', async () => {
      const now = new Date();
      const dueList = reservationsList.filter(r => r.survey_status === 'pending' && new Date(r.survey_scheduled_at) <= now);
      if (dueList.length === 0) {
        showToast('Şu an gönderilmeyi bekleyen anket bulunmuyor.');
        return;
      }
      
      // WhatsApp Bot bağlı mı kontrol et
      try {
        const botRes = await fetch('/api/bot/status');
        const botData = await botRes.json();
        if (botData.isConnected) {
          showToast(`🤖 WhatsApp Bot ${dueList.length} adet anket mesajını otomatik gönderiyor...`);
          const sendRes = await fetch('/api/bot/send-due', { method: 'POST' });
          const sendData = await sendRes.json();
          if (sendData.success) {
            showToast(`✅ ${sendData.processed} adet anket WhatsApp üzerinden başarıyla gönderildi!`);
            await loadAndRenderReservations();
            return;
          }
        }
      } catch (_) {}

      // Fallback: Doğrudan WhatsApp bağlantısı
      const first = dueList[0];
      if (first.wa_direct_url) {
        window.open(first.wa_direct_url, '_blank');
      }
      showToast(`${dueList.length} adet zamanı gelmiş anketten 1.'si açıldı.`);
    });
  }

  // Rezervasyon Yedekleme & Dışa Aktarma Butonları
  function triggerReservationExport(format) {
    showToast(`📥 Rezervasyon listesi ${format.toUpperCase()} formatında indiriliyor...`);
    window.location.href = `/api/reservations/export?format=${format}`;
  }

  const btnExportResExcel = document.getElementById('btnExportResExcel');
  const btnExportResJson = document.getElementById('btnExportResJson');
  const btnBackupTabExportExcel = document.getElementById('btnBackupTabExportExcel');
  const btnBackupTabExportJson = document.getElementById('btnBackupTabExportJson');

  if (btnExportResExcel) btnExportResExcel.addEventListener('click', () => triggerReservationExport('csv'));
  if (btnExportResJson) btnExportResJson.addEventListener('click', () => triggerReservationExport('json'));
  if (btnBackupTabExportExcel) btnBackupTabExportExcel.addEventListener('click', () => triggerReservationExport('csv'));
  if (btnBackupTabExportJson) btnBackupTabExportJson.addEventListener('click', () => triggerReservationExport('json'));

  // Modal Closers
  document.querySelectorAll('.js-close-res-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      if (resModal) resModal.classList.remove('open');
    });
  });

  document.querySelectorAll('.js-close-survey-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      if (surveyDetailModal) surveyDetailModal.classList.remove('open');
    });
  });

  if (btnOpenAddResModal) {
    btnOpenAddResModal.addEventListener('click', () => {
      if (resModal) {
        document.getElementById('newResDate').value = new Date().toISOString().slice(0, 10);
        resModal.classList.add('open');
      }
    });
  }

  // Telefon Numarası Doğrulama ve Formatlama (05XXXXXXXXX)
  function validateAndFormatPhone(raw) {
    if (!raw) return { valid: false, message: 'Telefon numarası boş bırakılamaz.' };
    let digits = String(raw).replace(/\D/g, '');
    if (digits.startsWith('90') && digits.length === 12) digits = digits.slice(2);
    if (digits.startsWith('0') && digits.length === 11) digits = digits.slice(1);

    if (digits.length < 10) {
      return { valid: false, message: 'Telefon numarası eksik! Lütfen 10 haneli cep telefonu numaranızı girin (Örn: 05XX XXX XX XX).' };
    }
    if (digits.length > 10) {
      return { valid: false, message: 'Telefon numarası fazla hane içeriyor! Lütfen 10 haneli cep telefonu numaranızı girin.' };
    }
    if (!digits.startsWith('5')) {
      return { valid: false, message: 'Geçersiz cep telefonu numarası! Numara 5 ile başlamalıdır (Örn: 05XX XXX XX XX).' };
    }

    return { valid: true, formatted: '0' + digits };
  }

  const newResPhone = document.getElementById('newResPhone');
  if (newResPhone) {
    newResPhone.addEventListener('blur', () => {
      const val = newResPhone.value.trim();
      if (!val) return;
      const check = validateAndFormatPhone(val);
      if (check.valid) {
        newResPhone.value = check.formatted;
        newResPhone.style.borderColor = '#10b981';
      }
    });
  }

  if (resForm) {
    resForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('newResName').value.trim();
      const phoneInput = document.getElementById('newResPhone');
      const phoneCheck = validateAndFormatPhone(phoneInput.value.trim());

      if (!phoneCheck.valid) {
        alert('⚠️ ' + phoneCheck.message);
        phoneInput.focus();
        phoneInput.style.borderColor = '#ef4444';
        return;
      }
      phoneInput.style.borderColor = '';
      const phone = phoneCheck.formatted; // 05XX XXX XX XX garantili

      const date = document.getElementById('newResDate').value;
      const time = document.getElementById('newResTime').value;
      const guests = document.getElementById('newResGuests').value;
      const area = document.getElementById('newResArea').value;
      const notes = document.getElementById('newResNotes').value.trim();

      try {
        const response = await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, date, time, guests, area, notes })
        });
        if (response.ok) {
          showToast(`Yeni rezervasyon eklendi (${phone})! Anket zamanlayıcısına alındı.`);
          resModal.classList.remove('open');
          resForm.reset();
          loadAndRenderReservations();
        } else {
          const errData = await response.json().catch(() => ({}));
          alert('Rezervasyon eklenemedi: ' + (errData.error || 'Bilinmeyen hata'));
        }
      } catch (err) {
        alert('Hata: ' + err.message);
      }
    });
  }

  // ==========================================
  // ZAMANLAYICI AYARLARI MANTIĞI
  // ==========================================
  const scheduleModal = document.getElementById('scheduleModal');
  const btnOpenScheduleModal = document.getElementById('btnOpenScheduleModal');
  const scheduleForm = document.getElementById('scheduleForm');

  function populateScheduleSettings() {
    const delay = siteSettings.surveyDelayDays !== undefined ? siteSettings.surveyDelayDays : 1;
    const time = siteSettings.surveySendTime || '12:00';
    const auto = siteSettings.surveyAutoSend !== false;
    const tpl = siteSettings.surveyMessageTemplate || `Merhaba Sayın *{name}*,\n\nTuzla Balık Soyak'ta ağırlamaktan büyük mutluluk duyduk. 🐟✨\n\nSizlere daima en taze ve özenli lezzetleri sunabilmemiz için 30 saniyelik kısa değerlendirme anketimize katılırsanız çok mutlu oluruz:\n👉 {survey_url}\n\nAfiyetle ve sevgiyle kalın, tekrar bekleriz! 🥂`;

    // Banner labels
    const delayMap = { 0: 'Aynı gün', 1: '1 gün sonra', 2: '2 gün sonra', 3: '3 gün sonra' };
    const bannerSendTime = document.getElementById('bannerSendTime');
    const lblTimingDelay = document.getElementById('lblTimingDelay');
    const lblTimingHour = document.getElementById('lblTimingHour');
    if (bannerSendTime) bannerSendTime.textContent = time;
    if (lblTimingDelay) lblTimingDelay.textContent = delayMap[delay] || `${delay} gün sonra`;
    if (lblTimingHour) lblTimingHour.textContent = time;

    // Modal fields
    const cfgDelay = document.getElementById('cfgSurveyDelayDays');
    const cfgTime = document.getElementById('cfgSurveySendTime');
    const cfgAuto = document.getElementById('cfgSurveyAutoSend');
    const cfgTpl = document.getElementById('cfgSurveyMessageTemplate');
    if (cfgDelay) cfgDelay.value = String(delay);
    if (cfgTime) cfgTime.value = time;
    if (cfgAuto) cfgAuto.checked = auto;
    if (cfgTpl) cfgTpl.value = tpl;

    // Site settings tab fields
    const setDelay = document.getElementById('setting_surveyDelayDays');
    const setTime = document.getElementById('setting_surveySendTime');
    const setTpl = document.getElementById('setting_surveyMessageTemplate');
    if (setDelay) setDelay.value = String(delay);
    if (setTime) setTime.value = time;
    if (setTpl) setTpl.value = tpl;
  }

  if (btnOpenScheduleModal) {
    btnOpenScheduleModal.addEventListener('click', () => {
      populateScheduleSettings();
      if (scheduleModal) {
        scheduleModal.classList.add('active');
        scheduleModal.classList.add('open');
      }
    });
  }

  document.querySelectorAll('.js-close-schedule-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      if (scheduleModal) {
        scheduleModal.classList.remove('active');
        scheduleModal.classList.remove('open');
      }
    });
  });

  if (scheduleForm) {
    scheduleForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const delayDays = parseInt(document.getElementById('cfgSurveyDelayDays').value, 10);
      const sendTime = document.getElementById('cfgSurveySendTime').value || '12:00';
      const autoSend = document.getElementById('cfgSurveyAutoSend').checked;
      const tpl = document.getElementById('cfgSurveyMessageTemplate').value.trim();

      siteSettings.surveyDelayDays = delayDays;
      siteSettings.surveySendTime = sendTime;
      siteSettings.surveyAutoSend = autoSend;
      if (tpl) siteSettings.surveyMessageTemplate = tpl;

      localStorage.setItem('tuzla_site_settings', JSON.stringify(siteSettings));

      try {
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(siteSettings)
        });
      } catch (_) {}

      populateScheduleSettings();
      if (scheduleModal) {
        scheduleModal.classList.remove('active');
        scheduleModal.classList.remove('open');
      }
      showToast(`Zamanlayıcı güncellendi: ${delayDays} gün sonra saat ${sendTime} olarak ayarlandı!`);
      
      // Refresh table and stats with updated schedule
      loadAndRenderReservations();
    });
  }

  // ==========================================
  // WHATSAPP BOT YÖNETİMİ MANTIĞI
  // ==========================================
  const whatsappModal = document.getElementById('whatsappModal');
  const btnOpenBotModal = document.getElementById('btnOpenBotModal');
  const headerBotStatusPill = document.getElementById('headerBotStatusPill');
  const headerBotStatusText = document.getElementById('headerBotStatusText');
  const bannerBotBtnText = document.getElementById('bannerBotBtnText');

  const botSectionQR = document.getElementById('botSectionQR');
  const botSectionConnected = document.getElementById('botSectionConnected');
  const qrLoadingSpinner = document.getElementById('qrLoadingSpinner');
  const qrContainer = document.getElementById('qrContainer');
  const botQrImg = document.getElementById('botQrImg');
  const lblConnectedPhone = document.getElementById('lblConnectedPhone');
  const testMsgPhone = document.getElementById('testMsgPhone');
  const btnSendTestMsg = document.getElementById('btnSendTestMsg');
  const btnLogoutBot = document.getElementById('btnLogoutBot');

  let botPollInterval = null;

  async function checkBotStatus() {
    try {
      const res = await fetch('/api/bot/status');
      if (res.ok) {
        const data = await res.json();
        updateBotUI(data);
        return data;
      }
    } catch (_) {}
    return null;
  }

  function updateBotUI(data) {
    if (!data) return;

    if (data.isConnected) {
      if (headerBotStatusText) headerBotStatusText.textContent = `🟢 WhatsApp: Bağlı (${data.connectedPhone || ''})`;
      if (headerBotStatusPill) {
        headerBotStatusPill.style.background = 'rgba(37, 211, 102, 0.15)';
        headerBotStatusPill.style.borderColor = 'rgba(37, 211, 102, 0.4)';
        headerBotStatusPill.style.color = '#25d366';
      }
      if (bannerBotBtnText) bannerBotBtnText.textContent = '🟢 WhatsApp Bağlı';

      if (botSectionConnected) botSectionConnected.style.display = 'block';
      if (botSectionQR) botSectionQR.style.display = 'none';
      if (lblConnectedPhone) lblConnectedPhone.textContent = data.connectedPhone || 'Aktif';
    } else {
      if (data.status === 'qr_ready' && data.qrDataUrl) {
        if (headerBotStatusText) headerBotStatusText.textContent = '🟡 WhatsApp: QR Bekleniyor';
        if (headerBotStatusPill) {
          headerBotStatusPill.style.background = 'rgba(234, 179, 8, 0.15)';
          headerBotStatusPill.style.borderColor = 'rgba(234, 179, 8, 0.4)';
          headerBotStatusPill.style.color = '#facc15';
        }
        if (bannerBotBtnText) bannerBotBtnText.textContent = '🟡 WhatsApp QR Okut';

        if (botSectionConnected) botSectionConnected.style.display = 'none';
        if (botSectionQR) botSectionQR.style.display = 'block';
        if (qrLoadingSpinner) qrLoadingSpinner.style.display = 'none';
        if (qrContainer) qrContainer.style.display = 'block';
        if (botQrImg) botQrImg.src = data.qrDataUrl;
      } else {
        if (headerBotStatusText) headerBotStatusText.textContent = '⚪ WhatsApp: Bağlantı Yok';
        if (headerBotStatusPill) {
          headerBotStatusPill.style.background = 'rgba(148, 163, 184, 0.15)';
          headerBotStatusPill.style.borderColor = 'rgba(148, 163, 184, 0.3)';
          headerBotStatusPill.style.color = '#cbd5e1';
        }
        if (bannerBotBtnText) bannerBotBtnText.textContent = 'WhatsApp\'ı Bağla (QR)';

        if (botSectionConnected) botSectionConnected.style.display = 'none';
        if (botSectionQR) botSectionQR.style.display = 'block';
        if (qrLoadingSpinner) qrLoadingSpinner.style.display = 'block';
        if (qrContainer) qrContainer.style.display = 'none';
      }
    }
  }

  // Tab Switching between Code and QR
  const tabConnectCode = document.getElementById('tabConnectCode');
  const tabConnectQR = document.getElementById('tabConnectQR');
  const panelConnectCode = document.getElementById('panelConnectCode');
  const panelConnectQR = document.getElementById('panelConnectQR');

  const botPairingPhoneInput = document.getElementById('botPairingPhoneInput');
  const btnGetPairingCode = document.getElementById('btnGetPairingCode');
  const pairingCodeDisplay = document.getElementById('pairingCodeDisplay');
  const lblPairingCode = document.getElementById('lblPairingCode');
  const btnCopyPairingCode = document.getElementById('btnCopyPairingCode');

  if (tabConnectCode && tabConnectQR) {
    tabConnectCode.addEventListener('click', () => {
      tabConnectCode.style.background = '#25d366';
      tabConnectCode.style.color = '#0b2210';
      tabConnectQR.style.background = 'transparent';
      tabConnectQR.style.color = 'var(--text-muted)';
      if (panelConnectCode) panelConnectCode.style.display = 'block';
      if (panelConnectQR) panelConnectQR.style.display = 'none';
    });

    tabConnectQR.addEventListener('click', () => {
      tabConnectQR.style.background = '#25d366';
      tabConnectQR.style.color = '#0b2210';
      tabConnectCode.style.background = 'transparent';
      tabConnectCode.style.color = 'var(--text-muted)';
      if (panelConnectQR) panelConnectQR.style.display = 'block';
      if (panelConnectCode) panelConnectCode.style.display = 'none';
    });
  }

  // Eşleşme Kodu Al
  let activePairingCode = '';
  if (btnGetPairingCode) {
    btnGetPairingCode.addEventListener('click', async () => {
      const phone = (botPairingPhoneInput?.value || '').trim();
      if (!phone) {
        alert('Lütfen telefon numaranızı girin.');
        return;
      }

      btnGetPairingCode.disabled = true;
      btnGetPairingCode.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Kod Alınıyor...';

      try {
        const res = await fetch('/api/bot/pairing-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone })
        });
        const result = await res.json();
        if (res.ok && result.code) {
          activePairingCode = result.code;
          if (pairingCodeDisplay) pairingCodeDisplay.style.display = 'block';
          if (lblPairingCode) lblPairingCode.textContent = result.code;
          showToast('WhatsApp eşleşme kodu oluşturuldu! Şimdi telefonunuza girin.');
        } else {
          alert('Kod alınamadı: ' + (result.error || 'Bilinmeyen hata'));
        }
      } catch (err) {
        alert('İstek hatası: ' + err.message);
      } finally {
        btnGetPairingCode.disabled = false;
        btnGetPairingCode.innerHTML = '<i class="fa-solid fa-key"></i> Kod Al';
      }
    });
  }

  // Kodu Kopyala
  if (btnCopyPairingCode) {
    btnCopyPairingCode.addEventListener('click', () => {
      if (activePairingCode) {
        navigator.clipboard.writeText(activePairingCode.replace(/[^a-zA-Z0-9]/g, ''));
        showToast('Eşleşme kodu panoya kopyalandı!');
      }
    });
  }

  function openBotModal() {
    if (!whatsappModal) return;
    whatsappModal.classList.add('active');
    whatsappModal.classList.add('open');

    // Bot başlatma isteği gönder
    fetch('/api/bot/start', { method: 'POST' }).catch(() => {});
    checkBotStatus();

    // Modal açıkken her 2.5 saniyede bir durumu kontrol et
    if (botPollInterval) clearInterval(botPollInterval);
    botPollInterval = setInterval(checkBotStatus, 2500);
  }

  function closeBotModal() {
    if (whatsappModal) {
      whatsappModal.classList.remove('active');
      whatsappModal.classList.remove('open');
    }
    if (botPollInterval) {
      clearInterval(botPollInterval);
      botPollInterval = null;
    }
  }

  if (btnOpenBotModal) btnOpenBotModal.addEventListener('click', openBotModal);
  if (headerBotStatusPill) headerBotStatusPill.addEventListener('click', openBotModal);

  document.querySelectorAll('.js-close-bot-modal').forEach(btn => {
    btn.addEventListener('click', closeBotModal);
  });

  // Test Mesajı Gönder
  if (btnSendTestMsg) {
    btnSendTestMsg.addEventListener('click', async () => {
      const phone = (testMsgPhone?.value || '').trim();
      if (!phone) {
        alert('Lütfen test mesajının gideceği telefon numarasını yazın.');
        return;
      }

      btnSendTestMsg.disabled = true;
      btnSendTestMsg.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Gönderiliyor...';

      try {
        const res = await fetch('/api/bot/test-send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone,
            message: 'Tuzla Balık Soyak Bot Test Mesajıdır! 🐟✨ Sistem başarıyla çalışıyor.'
          })
        });
        const result = await res.json();
        if (res.ok && result.success) {
          showToast(`Test mesajı +${phone} numarasına başarıyla iletildi!`);
        } else {
          alert('Gönderim hatası: ' + (result.error || 'Bilinmeyen hata'));
        }
      } catch (err) {
        alert('İstek hatası: ' + err.message);
      } finally {
        btnSendTestMsg.disabled = false;
        btnSendTestMsg.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Gönder';
      }
    });
  }

  // Mevcut Botu Arşivle ve Yeni Bot Bağla
  const btnArchiveAndNewBot = document.getElementById('btnArchiveAndNewBot');
  if (btnArchiveAndNewBot) {
    btnArchiveAndNewBot.addEventListener('click', async () => {
      if (!confirm('Mevcut WhatsApp bot oturumu güvenle arşivlenecek ve yeni bir bot numarası bağlayabilmeniz için panel sıfırlanacaktır. Onaylıyor musunuz?')) return;
      
      btnArchiveAndNewBot.disabled = true;
      btnArchiveAndNewBot.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Arşivleniyor...';

      try {
        const res = await fetch('/api/bot/archive-and-new', { method: 'POST' });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast(data.message || 'Önceki bot arşivlendi! Yeni botunuzu bağlayabilirsiniz.');
          checkBotStatus();
        } else {
          alert('Arşivleme işlemi başarısız: ' + (data.error || 'Bilinmeyen hata'));
        }
      } catch (err) {
        alert('Sunucu hatası: ' + err.message);
      } finally {
        btnArchiveAndNewBot.disabled = false;
        btnArchiveAndNewBot.innerHTML = '<i class="fa-solid fa-box-archive"></i> Mevcut Botu Arşivle & Yeni Bot Bağla';
      }
    });
  }

  // Oturumu Kapat
  if (btnLogoutBot) {
    btnLogoutBot.addEventListener('click', async () => {
      if (confirm('WhatsApp bot oturumunu kapatmak istediğinize emin misiniz?')) {
        try {
          await fetch('/api/bot/logout', { method: 'POST' });
          showToast('WhatsApp oturumu kapatıldı.');
          checkBotStatus();
        } catch (_) {}
      }
    });
  }

  // Oturumu Sıfırla & Yeni QR İste
  const btnResetBotSession = document.getElementById('btnResetBotSession');
  if (btnResetBotSession) {
    btnResetBotSession.addEventListener('click', async () => {
      btnResetBotSession.disabled = true;
      btnResetBotSession.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sıfırlanıyor...';
      try {
        await fetch('/api/bot/reset', { method: 'POST' });
        showToast('WhatsApp oturumu sıfırlandı, yeni bağlantı hazırlanıyor...');
        setTimeout(checkBotStatus, 1200);
      } catch (err) {
        alert('Hata: ' + err.message);
      } finally {
        btnResetBotSession.disabled = false;
        btnResetBotSession.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Oturumu Sıfırla & Yeni QR/Kod İste';
      }
    });
  }

  // Toast Notification
  function showToast(msg) {
    if (!adminToast || !toastText) return;
    toastText.textContent = msg;
    adminToast.classList.add('show');
    setTimeout(() => {
      adminToast.classList.remove('show');
    }, 3500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
  }

  // ==========================================
  // YÖNETİCİ GİRİŞ / ÇIKIŞ & YETKİLENDİRME (AUTH)
  // ==========================================
  async function checkAuth() {
    const token = localStorage.getItem('tuzla_admin_token');
    try {
      const res = await fetch('/api/auth/me', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          if (adminLoginOverlay) adminLoginOverlay.style.display = 'none';
          if (headerUserInfo) {
            headerUserInfo.style.display = 'inline-flex';
            if (headerUserName) headerUserName.textContent = data.user.username;
          }
          return true;
        }
      }
    } catch (_) {}

    // Oturum yok veya geçersiz
    if (adminLoginOverlay) adminLoginOverlay.style.display = 'flex';
    if (headerUserInfo) headerUserInfo.style.display = 'none';
    return false;
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = loginUsername ? loginUsername.value.trim() : '';
      const password = loginPassword ? loginPassword.value : '';
      if (!username || !password) return;

      if (btnLoginSubmit) {
        btnLoginSubmit.disabled = true;
        btnLoginSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Giriş Yapılıyor...';
      }
      if (loginErrorMsg) loginErrorMsg.style.display = 'none';

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          localStorage.setItem('tuzla_admin_token', data.token);
          if (adminLoginOverlay) adminLoginOverlay.style.display = 'none';
          if (headerUserInfo) {
            headerUserInfo.style.display = 'inline-flex';
            if (headerUserName) headerUserName.textContent = data.user.username;
          }
          showToast(`Hoş geldiniz Sayın ${data.user.username}!`);
          initData();
          checkBotStatus();
        } else {
          if (loginErrorMsg) {
            loginErrorMsg.textContent = data.error || 'Giriş başarısız. Kullanıcı adı veya şifre hatalı.';
            loginErrorMsg.style.display = 'block';
          }
        }
      } catch (err) {
        if (loginErrorMsg) {
          loginErrorMsg.textContent = 'Sunucuya bağlanırken bir hata oluştu: ' + err.message;
          loginErrorMsg.style.display = 'block';
        }
      } finally {
        if (btnLoginSubmit) {
          btnLoginSubmit.disabled = false;
          btnLoginSubmit.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Giriş Yap';
        }
      }
    });
  }

  if (btnAdminLogout) {
    btnAdminLogout.addEventListener('click', async () => {
      if (!confirm('Yönetici oturumundan çıkmak istediğinize emin misiniz?')) return;
      try {
        const token = localStorage.getItem('tuzla_admin_token');
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
      } catch (_) {}
      localStorage.removeItem('tuzla_admin_token');
      if (adminLoginOverlay) {
        adminLoginOverlay.style.display = 'flex';
        if (loginPassword) loginPassword.value = '';
      }
      if (headerUserInfo) headerUserInfo.style.display = 'none';
      showToast('Güvenli çıkış yapıldı.');
    });
  }

  // Run with Auth Check
  checkAuth().then(isAuth => {
    if (isAuth) {
      initData();
      checkBotStatus();
    }
  });

  setInterval(() => {
    const overlay = document.getElementById('adminLoginOverlay');
    if (overlay && overlay.style.display !== 'none') return;
    checkBotStatus();
  }, 15000); // 15 saniyede bir arka plan durum kontrolü

  // Zamanlayıcı saati geldiğinde veya sunucudan otomatik gönderildiğinde F5 OLMADAN canlı güncelle
  setInterval(async () => {
    const overlay = document.getElementById('adminLoginOverlay');
    if (overlay && overlay.style.display !== 'none') return; // Giriş yapılmamışsa canlı istek yapma
    await fetchReservations();
    renderReservationStats();
    const resTab = document.getElementById('reservationsTab');
    if (resTab && resTab.classList.contains('active')) {
      const activeEl = document.activeElement;
      const isTypingInTable = activeEl && resTableBody && resTableBody.contains(activeEl);
      if (!isTypingInTable) {
        renderReservationTable();
      }
    }
  }, 3000); // Her 3 saniyede bir F5 gerektirmeyen kesintisiz canlı senkronizasyon
});

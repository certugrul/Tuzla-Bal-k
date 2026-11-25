/**
 * Tuzla Balık Soyak - Backoffice (Admin Panel) Mantığı
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  let menuItems = [];
  let menuCategories = {};
  let siteSettings = {};

  let currentCategory = 'all';
  let searchQuery = '';
  let currentPage = 1;
  const pageSize = 20;
  let editingItemId = null;

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

  // Table Elements
  const menuTableBody = document.getElementById('menuTableBody');
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
    if (savedMenu) {
      try {
        menuItems = JSON.parse(savedMenu);
      } catch (e) {
        menuItems = (typeof MENU_ITEMS !== 'undefined') ? [...MENU_ITEMS] : [];
      }
    } else {
      menuItems = (typeof MENU_ITEMS !== 'undefined') ? [...MENU_ITEMS] : [];
    }

    menuCategories = (typeof MENU_CATEGORIES !== 'undefined') ? MENU_CATEGORIES : {};

    // Check if local Node.js server is online
    checkServerConnection();

    // Populate Category Dropdowns
    populateCategoryDropdowns();

    // Render Everything
    renderStats();
    renderTable();
    populateSettingsForm();
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
        serverStatusBadge.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#10b981;"></i> <span>Yerel Sunucuya Bağlı (Otomatik Kayıt Aktif)</span>';
        serverStatusBadge.style.color = '#34d399';
        serverStatusBadge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      }
    } catch (e) {
      serverStatusBadge.innerHTML = '<i class="fa-solid fa-hard-drive" style="color:var(--gold-primary);"></i> <span>Tarayıcı Modu (LocalStorage Aktif)</span>';
      serverStatusBadge.style.color = 'var(--gold-light)';
      serverStatusBadge.style.borderColor = 'rgba(212, 175, 55, 0.3)';
    }
  }

  // Populate Dropdowns
  function populateCategoryDropdowns() {
    const selects = [adminCategorySelect, document.getElementById('itemCategory')];
    selects.forEach(select => {
      if (!select) return;
      const isFilter = select === adminCategorySelect;
      let html = isFilter ? '<option value="all">Tüm Kategoriler</option>' : '';
      for (const [key, val] of Object.entries(menuCategories)) {
        html += `<option value="${key}">${val.tr}</option>`;
      }
      select.innerHTML = html;
    });
  }

  // 2. Navigation Tab Switcher
  navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = tab.getAttribute('data-tab');
      navTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      tabPanels.forEach(p => p.classList.remove('active'));
      const activePanel = document.getElementById(targetId);
      if (activePanel) activePanel.classList.add('active');

      // Update page title
      const titleMap = {
        'dashboardTab': 'Genel Bakış',
        'menuTab': 'Menü Yönetimi',
        'settingsTab': 'Site Ayarları',
        'backupTab': 'Yedekleme & Dışa Aktarma'
      };
      if (pageTitle) pageTitle.textContent = titleMap[targetId] || 'Yönetim Paneli';

      // Re-render table if switching to menu
      if (targetId === 'menuTab') {
        renderTable();
      }
    });
  });

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
    return menuItems.filter(item => {
      if (currentCategory !== 'all' && item.category !== currentCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const inName = item.name.toLowerCase().includes(q);
        const inId = item.id.toLowerCase().includes(q);
        const inDesc = item.description ? item.description.toLowerCase().includes(q) : false;
        if (!inName && !inId && !inDesc) return false;
      }
      return true;
    });
  }

  function renderTable() {
    if (!menuTableBody) return;

    const filtered = getFilteredItems();
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIdx = (currentPage - 1) * pageSize;
    const pageItems = filtered.slice(startIdx, startIdx + pageSize);

    if (pageItems.length === 0) {
      menuTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
            <i class="fa-solid fa-box-open" style="font-size:2rem; color:var(--gold-primary); margin-bottom:0.5rem; display:block;"></i>
            Kayıt bulunamadı. Farklı bir arama veya kategori seçebilirsiniz.
          </td>
        </tr>
      `;
    } else {
      menuTableBody.innerHTML = pageItems.map(item => {
        const catInfo = menuCategories[item.category] || { tr: item.category };
        const priceText = item.price ? `${item.price.toLocaleString('tr-TR')} ₺` : 'Günlük / Kg';
        const badgeHtml = item.badge ? `<span class="tag-badge">${escapeHtml(item.badge)}</span>` : '<span style="color:var(--text-dim);">-</span>';

        return `
          <tr data-id="${item.id}">
            <td><span class="item-code-badge">${item.id}</span></td>
            <td class="item-title-col">
              <strong>${escapeHtml(item.name)}</strong>
              <small>${escapeHtml(item.description || '')}</small>
            </td>
            <td><span class="cat-badge">${escapeHtml(catInfo.tr)}</span></td>
            <td><span class="price-tag">${priceText}</span></td>
            <td>${badgeHtml}</td>
            <td>
              ${item.is_signature ? '<i class="fa-solid fa-star" style="color:#f59e0b;" title="Şefin İmzası"></i>' : '<span style="color:var(--text-dim);">-</span>'}
            </td>
            <td>
              <div class="table-actions">
                <button class="btn-icon-action edit" onclick="window.editMenuItem('${item.id}')" title="Düzenle">
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
    }

    if (pageInfo) {
      pageInfo.textContent = `Toplam ${totalCount} üründen ${startIdx + 1} - ${Math.min(startIdx + pageSize, totalCount)} arası gösteriliyor (Sayfa ${currentPage} / ${totalPages})`;
    }

    if (prevPageBtn) prevPageBtn.disabled = currentPage <= 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage >= totalPages;
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
            is_signature
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
          is_signature
        });
        showToast(`"${name}" menüye eklendi!`);
      }

      saveMenuState();
      closeModal();
      renderStats();
      renderTable();
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
  }

  if (siteSettingsForm) {
    siteSettingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const newSettings = { ...siteSettings };
      const inputs = siteSettingsForm.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        const key = input.id.replace('setting_', '');
        newSettings[key] = input.value.trim();
      });

      siteSettings = newSettings;
      localStorage.setItem('tuzla_site_settings', JSON.stringify(siteSettings));

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
        menuItems: menuItems
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tuzla_balik_yedek_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Yedek dosyası bilgisayarınıza indirildi!');
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

            renderStats();
            renderTable();
            populateSettingsForm();
            showToast('Yedek başarıyla yüklendi ve menü güncellendi!');
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

  // Run
  initData();
});

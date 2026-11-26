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
    fetchReservations();
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
        'reservationsTab': 'Rezervasyon & Anket Yönetimi',
        'settingsTab': 'Site Ayarları',
        'backupTab': 'Yedekleme & Dışa Aktarma'
      };
      if (pageTitle) pageTitle.textContent = titleMap[targetId] || 'Yönetim Paneli';

      // Re-render table if switching to menu
      if (targetId === 'menuTab') {
        renderTable();
      } else if (targetId === 'reservationsTab') {
        loadAndRenderReservations();
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

  function renderReservationTable() {
    if (!resTableBody) return;
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
      return;
    }

    resTableBody.innerHTML = filtered.map(item => {
      const isDue = item.survey_status === 'pending' && new Date(item.survey_scheduled_at) <= now;
      
      let statusHtml = '';
      if (item.survey_status === 'completed') {
        const score = item.survey_data?.score_overall || 5;
        statusHtml = `<span class="status-pill status-completed"><i class="fa-solid fa-star"></i> Dolduruldu (★ ${score}.0)</span>`;
      } else if (item.survey_status === 'sent') {
        statusHtml = `<span class="status-pill status-sent"><i class="fa-solid fa-paper-plane"></i> Gönderildi</span>`;
      } else if (isDue) {
        statusHtml = `<span class="status-pill status-due"><i class="fa-solid fa-bell"></i> Zamanı Geldi (12:00)</span>`;
      } else {
        statusHtml = `<span class="status-pill status-pending"><i class="fa-solid fa-clock"></i> Zamanı Bekliyor</span>`;
      }

      const scheduledDate = new Date(item.survey_scheduled_at);
      const scheduledFormatted = !isNaN(scheduledDate)
        ? scheduledDate.toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
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
            <div style="color:${isDue ? '#facc15' : 'var(--text-muted)'}; font-weight:${isDue ? '600' : '400'};">
              <i class="fa-regular fa-clock" style="font-size:0.8rem;"></i> ${scheduledFormatted}
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

    // Attach row events
    resTableBody.querySelectorAll('.js-send-wa').forEach(btn => {
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

    resTableBody.querySelectorAll('.js-view-survey').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const target = reservationsList.find(r => r.id === id);
        if (target && target.survey_data) {
          openSurveyDetailModal(target);
        }
      });
    });

    resTableBody.querySelectorAll('.js-delete-res').forEach(btn => {
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
    btnSendAllDue.addEventListener('click', () => {
      const now = new Date();
      const dueList = reservationsList.filter(r => r.survey_status === 'pending' && new Date(r.survey_scheduled_at) <= now);
      if (dueList.length === 0) {
        showToast('Şu an gönderilmeyi bekleyen anket bulunmuyor.');
        return;
      }
      
      const first = dueList[0];
      if (first.wa_direct_url) {
        window.open(first.wa_direct_url, '_blank');
      }
      showToast(`${dueList.length} adet zamanı gelmiş anketten 1.'si açıldı.`);
    });
  }

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

  if (resForm) {
    resForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('newResName').value.trim();
      const phone = document.getElementById('newResPhone').value.trim();
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
          showToast('Yeni rezervasyon eklendi! Yarın 12:00 anket kuyruğuna alındı.');
          resModal.classList.remove('open');
          resForm.reset();
          loadAndRenderReservations();
        } else {
          alert('Rezervasyon eklenemedi.');
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
      
      // Refresh table to update status
      fetchReservations().then(renderReservationTable);
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
  checkBotStatus();
  setInterval(checkBotStatus, 15000); // 15 saniyede bir arka plan durum kontrolü
});

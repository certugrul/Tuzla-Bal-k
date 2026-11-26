const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128\\scratch\\chrome_profile_admin_diag';
const ARTIFACTS_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  if (fs.existsSync(USER_DATA_DIR)) {
    try { fs.rmSync(USER_DATA_DIR, { recursive: true, force: true }); } catch (_) {}
  }

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9224',
    `--user-data-dir=${USER_DATA_DIR}`,
    '--no-first-run',
    '--disable-gpu',
    '--window-size=1400,900',
    'http://localhost:3000/admin.html'
  ]);

  try {
    await sleep(2000);

    const res = await fetch('http://127.0.0.1:9224/json/list');
    const tabs = await res.json();
    const pageTab = tabs.find(t => t.type === 'page' && t.url.includes('admin.html'));
    if (!pageTab) {
      console.error('Admin tab not found! Tabs:', tabs);
      return;
    }

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    let id = 1;
    const cbs = new Map();
    function send(method, params = {}) {
      return new Promise(res => {
        const msgId = id++;
        cbs.set(msgId, res);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    const jsErrors = [];
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && cbs.has(msg.id)) {
        const cb = cbs.get(msg.id);
        cbs.delete(msg.id);
        cb(msg.result);
      } else if (msg.method === 'Runtime.exceptionThrown') {
        jsErrors.push(msg.params.exceptionDetails);
      }
    };

    await new Promise(r => { ws.onopen = r; });
    await send('Runtime.enable');
    await send('Page.enable');

    await sleep(1500);

    // 1. Initial State (Restaurant Mode)
    const restDiag = await send('Runtime.evaluate', {
      expression: `(() => {
        const rows = document.querySelectorAll('#menuTableBody tr');
        const activeTab = document.querySelector('.menu-mode-tab.active')?.textContent?.trim();
        const headerText = document.getElementById('tableHeaderTitle')?.textContent?.trim();
        return { activeTab, rowCount: rows.length, headerText };
      })()`,
      returnByValue: true
    });
    console.log('Restaurant Mode:', restDiag.result.value);

    // 2. Switch to Gel-Al Mode
    await send('Runtime.evaluate', {
      expression: `(() => {
        const gelalTab = document.getElementById('tabModeGelAl');
        if (gelalTab) gelalTab.click();
      })()`
    });
    await sleep(600);

    const gelalDiag = await send('Runtime.evaluate', {
      expression: `(() => {
        const rows = document.querySelectorAll('#menuTableBody tr');
        const activeTab = document.querySelector('.menu-mode-tab.active')?.textContent?.trim();
        const bannerVisible = document.getElementById('gelalModeBanner')?.style.display !== 'none';
        const firstRowPrice = rows[0]?.querySelector('td:nth-child(5)')?.textContent?.trim().replace(/\\s+/g, ' ');
        return { activeTab, rowCount: rows.length, bannerVisible, firstRowPrice };
      })()`,
      returnByValue: true
    });
    console.log('Gel-Al Mode:', gelalDiag.result.value);

    // Screenshot of Gel-Al mode in Admin
    const snapGelAl = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'admin-gelal-mode-verified.png'), Buffer.from(snapGelAl.data, 'base64'));

    // 3. Open Edit Modal for first item (Acılı Atom)
    await send('Runtime.evaluate', {
      expression: `(() => {
        const editBtn = document.querySelector('#menuTableBody tr .btn-action-edit');
        if (editBtn) editBtn.click();
      })()`
    });
    await sleep(600);

    const modalState = await send('Runtime.evaluate', {
      expression: `(() => {
        const modal = document.getElementById('itemModal');
        const isVisible = modal && modal.classList.contains('active');
        const itemName = document.getElementById('modalItemName')?.value;
        const itemCat = document.getElementById('modalItemCategory')?.value;
        const previewSrc = document.getElementById('dishImagePreview')?.src;
        return { isVisible, itemName, itemCat, previewSrc };
      })()`,
      returnByValue: true
    });
    console.log('Edit Modal State:', modalState.result.value);

    // 4. Open Gallery Picker Modal
    await send('Runtime.evaluate', {
      expression: `(() => {
        const galleryBtn = document.getElementById('btnOpenGalleryModal');
        if (galleryBtn) galleryBtn.click();
      })()`
    });
    await sleep(800);

    const galleryState = await send('Runtime.evaluate', {
      expression: `(() => {
        const galleryModal = document.getElementById('galleryPickerModal');
        const isVisible = galleryModal && galleryModal.classList.contains('active');
        const count = document.getElementById('galleryCountLabel')?.textContent?.trim();
        const items = document.querySelectorAll('.gallery-card');
        return { isVisible, count, renderedCards: items.length };
      })()`,
      returnByValue: true
    });
    console.log('Gallery Picker State:', galleryState.result.value);

    console.log('Admin JS Errors:', jsErrors);
    ws.close();
  } catch (err) {
    console.error('Admin test error:', err);
  } finally {
    chromeProc.kill();
  }
}

run();

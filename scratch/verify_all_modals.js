const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128\\scratch\\chrome_verify_modals';
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
    '--remote-debugging-port=9225',
    `--user-data-dir=${USER_DATA_DIR}`,
    '--no-first-run',
    '--disable-gpu',
    '--window-size=1280,850',
    'http://localhost:3000/menu-app/'
  ]);

  await sleep(1500);

  const res = await fetch('http://127.0.0.1:9225/json/list');
  const tabs = await res.json();
  const pageTab = tabs.find(t => t.type === 'page' && t.url.includes('menu-app'));
  if (!pageTab) {
    console.error('Page tab not found!');
    chromeProc.kill();
    return;
  }

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  let id = 1;
  const cbs = new Map();
  ws.onmessage = m => {
    const data = JSON.parse(m.data);
    if (cbs.has(data.id)) { cbs.get(data.id)(data.result); cbs.delete(data.id); }
  };
  function send(method, params = {}) {
    return new Promise(res => {
      const msgId = id++;
      cbs.set(msgId, res);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');
  await sleep(1000);

  // 1. Open Orkinos modal
  console.log('--- 1. Testing Orkinos Modal ---');
  await send('Runtime.evaluate', {
    expression: `window.TuzlaMenuApp.openDishModal('ST00886')`
  });
  await sleep(600);

  const orkinosModal = await send('Runtime.evaluate', {
    expression: `(() => {
      const modal = document.getElementById('dishModalSheet');
      const img = document.getElementById('modalHeroImg');
      const title = document.getElementById('modalTitle');
      const price = document.getElementById('modalPrice');
      const hasMasayaEkle = !!modal.querySelector('.btn-modal-add, .btn-modal-action, [class*="masaya"], [class*="add-to-cart"]');
      const hasQtySelector = !!modal.querySelector('.modal-qty-selector, .quantity-control, [class*="qty"]');
      return {
        isOpen: modal.classList.contains('active'),
        title: title ? title.textContent : null,
        price: price ? price.textContent : null,
        imageSrc: img ? img.src : null,
        hasMasayaEkle,
        hasQtySelector
      };
    })()`,
    returnByValue: true
  });
  console.log('Orkinos Modal Data:', JSON.stringify(orkinosModal.result.value, null, 2));

  const orkinosShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'orkinos-modal-clean.png'), Buffer.from(orkinosShot.data, 'base64'));
  console.log('Saved orkinos-modal-clean.png');

  // Close modal
  await send('Runtime.evaluate', {
    expression: `document.getElementById('modalCloseBtn').click()`
  });
  await sleep(400);

  // 2. Open Kalamar Tava modal
  console.log('\n--- 2. Testing Kalamar Tava Genuine Photo Modal ---');
  await send('Runtime.evaluate', {
    expression: `window.TuzlaMenuApp.openDishModal('ST00176')`
  });
  await sleep(600);

  const kalamarModal = await send('Runtime.evaluate', {
    expression: `(() => {
      const img = document.getElementById('modalHeroImg');
      const title = document.getElementById('modalTitle');
      return {
        title: title ? title.textContent : null,
        imageSrc: img ? img.src : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Kalamar Modal Data:', JSON.stringify(kalamarModal.result.value, null, 2));

  const kalamarShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'kalamar-modal-clean.png'), Buffer.from(kalamarShot.data, 'base64'));
  console.log('Saved kalamar-modal-clean.png');

  // Close modal
  await send('Runtime.evaluate', {
    expression: `document.getElementById('modalCloseBtn').click()`
  });
  await sleep(400);

  // 3. Mobile View: Efe Yeşil Rakı
  console.log('\n--- 3. Testing Mobile View: Efe Yeşil Rakı ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 393,
    height: 852,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(600);

  // Find Efe Yeşil Rakı ID from window.MENU_ITEMS
  const rakiIdRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const item = window.MENU_ITEMS.find(i => i.name.includes('Efe Yeşil'));
      return item ? item.id : null;
    })()`,
    returnByValue: true
  });
  const rakiId = rakiIdRes.result.value;
  console.log('Found Efe Yeşil Rakı ID:', rakiId);

  await send('Runtime.evaluate', {
    expression: `window.TuzlaMenuApp.openDishModal('${rakiId}')`
  });
  await sleep(600);

  const rakiModal = await send('Runtime.evaluate', {
    expression: `(() => {
      const img = document.getElementById('modalHeroImg');
      const title = document.getElementById('modalTitle');
      const cat = document.getElementById('modalCatTag');
      return {
        title: title ? title.textContent : null,
        category: cat ? cat.textContent : null,
        imageSrc: img ? img.src : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Rakı Modal Data (Mobile):', JSON.stringify(rakiModal.result.value, null, 2));

  const rakiShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'raki-modal-mobile-clean.png'), Buffer.from(rakiShot.data, 'base64'));
  console.log('Saved raki-modal-mobile-clean.png');

  chromeProc.kill();
  console.log('\nALL MODAL VERIFICATIONS FINISHED!');
  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});

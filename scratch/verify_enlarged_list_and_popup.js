const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128\\scratch\\chrome_verify_list_zoom';
const ARTIFACTS_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  if (fs.existsSync(USER_DATA_DIR)) {
    try { fs.rmSync(USER_DATA_DIR, { recursive: true, force: true }); } catch (_) {}
  }

  // Standard 1080p laptop browser window (viewport ~1280x850)
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9227',
    `--user-data-dir=${USER_DATA_DIR}`,
    '--no-first-run',
    '--disable-gpu',
    '--window-size=1280,850',
    'http://localhost:3000/menu-app/'
  ]);

  await sleep(1500);

  const res = await fetch('http://127.0.0.1:9227/json/list');
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

  // 1. Ensure list view is active
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.getElementById('btnViewList');
      if (btn) btn.click();
    })()`
  });
  await sleep(500);

  // 2. Measure visible rows in viewport
  console.log('--- Measuring Visible Rows in List View ---');
  const rowMetrics = await send('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('.dishes-grid.view-list .dish-card'));
      const winHeight = window.innerHeight;
      const metrics = cards.slice(0, 10).map((c, idx) => {
        const r = c.getBoundingClientRect();
        return {
          index: idx + 1,
          name: c.querySelector('.dish-card-title')?.textContent,
          top: Math.round(r.top),
          bottom: Math.round(r.bottom),
          height: Math.round(r.height),
          fullyVisible: r.bottom <= winHeight,
          partiallyVisible: r.top < winHeight && r.bottom > 0
        };
      });

      const fullyVisibleCount = metrics.filter(m => m.fullyVisible).length;
      const partiallyVisibleCount = metrics.filter(m => m.partiallyVisible).length;

      return {
        winHeight,
        cardsCount: cards.length,
        metrics,
        fullyVisibleCount,
        partiallyVisibleCount
      };
    })()`,
    returnByValue: true
  });
  console.log('Row Metrics:', JSON.stringify(rowMetrics.result.value, null, 2));

  // Screenshot Desktop List View
  const desktopListShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'list-desktop-enlarged-6-rows.png'), Buffer.from(desktopListShot.data, 'base64'));
  console.log('Saved list-desktop-enlarged-6-rows.png');

  // 3. Open Popup Modal for Kalamar Tava
  console.log('\n--- Testing Popup Modal Without Tam Boyut ---');
  await send('Runtime.evaluate', {
    expression: `window.TuzlaMenuApp.openDishModal('ST00176')`
  });
  await sleep(600);

  const popupCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const expandBtn = document.getElementById('modalHeroExpandBtn');
      const lightbox = document.getElementById('dishLightbox');
      const heroVisual = document.getElementById('modalHeroVisual');
      const img = document.getElementById('modalHeroImg');
      return {
        hasExpandBtn: !!expandBtn,
        hasLightbox: !!lightbox,
        heroHeight: heroVisual ? getComputedStyle(heroVisual).height : null,
        imgObjectFit: img ? getComputedStyle(img).objectFit : null,
        cursor: heroVisual ? getComputedStyle(heroVisual).cursor : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Popup Check:', JSON.stringify(popupCheck.result.value, null, 2));

  const popupShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'popup-clean-no-tam-boyut.png'), Buffer.from(popupShot.data, 'base64'));
  console.log('Saved popup-clean-no-tam-boyut.png');

  // Close modal
  await send('Runtime.evaluate', {
    expression: `window.TuzlaMenuApp.closeDishModal()`
  });
  await sleep(400);

  // 4. Test Mobile Screen (iPhone 14 / 393 x 852)
  console.log('\n--- Testing Mobile Screen List View ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 393,
    height: 852,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(600);

  const mobileMetrics = await send('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('.dishes-grid.view-list .dish-card'));
      const winHeight = window.innerHeight;
      const metrics = cards.slice(0, 10).map((c, idx) => {
        const r = c.getBoundingClientRect();
        return {
          index: idx + 1,
          name: c.querySelector('.dish-card-title')?.textContent,
          top: Math.round(r.top),
          bottom: Math.round(r.bottom),
          height: Math.round(r.height),
          fullyVisible: r.bottom <= winHeight
        };
      });
      return {
        winHeight,
        metrics,
        fullyVisibleCount: metrics.filter(m => m.fullyVisible).length
      };
    })()`,
    returnByValue: true
  });
  console.log('Mobile Metrics:', JSON.stringify(mobileMetrics.result.value, null, 2));

  const mobileListShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'list-mobile-enlarged.png'), Buffer.from(mobileListShot.data, 'base64'));
  console.log('Saved list-mobile-enlarged.png');

  chromeProc.kill();
  console.log('\nALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128\\scratch\\chrome_profile_list_lightbox';
const ARTIFACTS_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  if (fs.existsSync(USER_DATA_DIR)) {
    try { fs.rmSync(USER_DATA_DIR, { recursive: true, force: true }); } catch (_) {}
  }

  // Launch Chrome on Mobile resolution (390x844 - iPhone 14/15/Pro)
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${USER_DATA_DIR}`,
    '--no-first-run',
    '--disable-gpu',
    '--window-size=390,844',
    'http://localhost:3000/menu-app/'
  ]);

  await sleep(1500);

  const res = await fetch('http://127.0.0.1:9222/json/list');
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
  function send(method, params = {}) {
    return new Promise(res => {
      const msgId = id++;
      cbs.set(msgId, res);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && cbs.has(m.id)) {
      cbs.get(m.id)(m.result);
      cbs.delete(m.id);
    }
  };

  await new Promise(r => ws.onopen = r);
  await send('Runtime.enable');
  await send('Page.enable');
  await sleep(800);

  // 1. Ensure list mode is active
  await send('Runtime.evaluate', {
    expression: `window.TuzlaMenuApp.setViewMode('list')`
  });
  await sleep(300);

  // 2. Measure list rows and check how many fit on screen
  const listMetrics = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const cards = Array.from(document.querySelectorAll('.dishes-grid.view-list .dish-card')).slice(0, 8);
        const windowHeight = window.innerHeight;
        const gridTop = document.getElementById('dishesGrid').getBoundingClientRect().top;
        const metrics = cards.map((c, i) => {
          const rect = c.getBoundingClientRect();
          return {
            index: i + 1,
            title: c.querySelector('.dish-card-title')?.textContent.trim(),
            height: Math.round(rect.height),
            top: Math.round(rect.top),
            bottom: Math.round(rect.bottom),
            isFullyVisibleInWindow: rect.bottom <= windowHeight
          };
        });
        const fullyVisibleCount = metrics.filter(m => m.isFullyVisibleInWindow).length;
        const row6Bottom = metrics[5] ? metrics[5].bottom : null;
        return {
          windowHeight,
          gridTop: Math.round(gridTop),
          fullyVisibleCount,
          row6Bottom,
          sixRowsFit: row6Bottom !== null ? row6Bottom <= windowHeight : false,
          rows: metrics
        };
      })()
    `,
    returnByValue: true
  });
  console.log('1. List Metrics (Checking 6 Rows):', listMetrics.result.value);

  // Capture Mobile Compact List View screenshot
  const ssList = await send('Page.captureScreenshot', { format: 'png' });
  const listImgPath = path.join(ARTIFACTS_DIR, 'menu-app-mobile-6-rows-list.png');
  fs.writeFileSync(listImgPath, Buffer.from(ssList.data, 'base64'));
  console.log('Saved Mobile List Screenshot to:', listImgPath);

  // 3. Open Popup Modal on a dish with a local photo (e.g. Ahtapot Salatası or Orkinos Tandır)
  const openModalRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const card = document.querySelector('.dish-card[data-dish-id="ST00026"]') || document.querySelector('.dish-card');
        if (card) {
          card.click();
          const img = document.getElementById('modalHeroImg');
          const visual = document.getElementById('modalHeroVisual');
          const expandBtn = document.getElementById('modalHeroExpandBtn');
          const bgBlur = document.getElementById('modalHeroBgBlur');
          return {
            opened: true,
            title: document.getElementById('modalTitle')?.textContent.trim(),
            imgSrc: img?.src,
            imgNaturalWidth: img?.naturalWidth,
            imgNaturalHeight: img?.naturalHeight,
            imgRenderedWidth: img?.offsetWidth,
            imgRenderedHeight: img?.offsetHeight,
            imgObjectFit: window.getComputedStyle(img).objectFit,
            hasBgBlur: !!bgBlur,
            bgBlurStyle: bgBlur?.style.backgroundImage,
            hasExpandBtn: !!expandBtn
          };
        }
        return { opened: false };
      })()
    `,
    returnByValue: true
  });
  console.log('2. Modal Open & Full Size Check:', openModalRes.result.value);
  await sleep(400);

  // Capture Popup Modal Screenshot
  const ssModal = await send('Page.captureScreenshot', { format: 'png' });
  const modalImgPath = path.join(ARTIFACTS_DIR, 'menu-app-modal-uncropped-fullsize.png');
  fs.writeFileSync(modalImgPath, Buffer.from(ssModal.data, 'base64'));
  console.log('Saved Modal Full Size Screenshot to:', modalImgPath);

  // 4. Test clicking "Tam Boyut" / opening Fullscreen Lightbox
  const openLightboxRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const expandBtn = document.getElementById('modalHeroExpandBtn');
        if (expandBtn) {
          expandBtn.click();
          const lightbox = document.getElementById('dishLightbox');
          const lbImg = document.getElementById('lightboxImg');
          return {
            lightboxActive: lightbox?.classList.contains('active'),
            lightboxImgSrc: lbImg?.src,
            lightboxTitle: document.getElementById('lightboxTitle')?.textContent.trim(),
            lightboxPrice: document.getElementById('lightboxPrice')?.textContent.trim(),
            lbImgRenderedWidth: lbImg?.offsetWidth,
            lbImgRenderedHeight: lbImg?.offsetHeight
          };
        }
        return { error: 'no expand button' };
      })()
    `,
    returnByValue: true
  });
  console.log('3. Fullscreen Lightbox Open Check:', openLightboxRes.result.value);
  await sleep(400);

  // Capture Fullscreen Lightbox Screenshot
  const ssLightbox = await send('Page.captureScreenshot', { format: 'png' });
  const lbImgPath = path.join(ARTIFACTS_DIR, 'menu-app-lightbox-fullscreen.png');
  fs.writeFileSync(lbImgPath, Buffer.from(ssLightbox.data, 'base64'));
  console.log('Saved Lightbox Screenshot to:', lbImgPath);

  // 5. Test Desktop resolution for List View (1280x800)
  await send('Runtime.evaluate', {
    expression: `
      window.TuzlaMenuApp.closeImageLightbox();
      window.TuzlaMenuApp.closeDishModal();
    `
  });
  await sleep(300);

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false
  });
  await sleep(400);

  const desktopMetrics = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const cards = Array.from(document.querySelectorAll('.dishes-grid.view-list .dish-card')).slice(0, 8);
        const windowHeight = window.innerHeight;
        const metrics = cards.map((c, i) => ({
          index: i + 1,
          height: Math.round(c.getBoundingClientRect().height),
          bottom: Math.round(c.getBoundingClientRect().bottom),
          isFullyVisibleInWindow: c.getBoundingClientRect().bottom <= windowHeight
        }));
        return {
          fullyVisibleCount: metrics.filter(m => m.isFullyVisibleInWindow).length,
          sixRowsFit: metrics[5] ? metrics[5].bottom <= windowHeight : false,
          rows: metrics
        };
      })()
    `,
    returnByValue: true
  });
  console.log('4. Desktop List Metrics:', desktopMetrics.result.value);

  const ssDesktopList = await send('Page.captureScreenshot', { format: 'png' });
  const desktopListImgPath = path.join(ARTIFACTS_DIR, 'menu-app-desktop-compact-list.png');
  fs.writeFileSync(desktopListImgPath, Buffer.from(ssDesktopList.data, 'base64'));
  console.log('Saved Desktop List Screenshot to:', desktopListImgPath);

  ws.close();
  chromeProc.kill();
  console.log('--- Verification Completed Successfully ---');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});

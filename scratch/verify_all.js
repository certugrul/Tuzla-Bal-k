const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128\\scratch\\chrome_profile_verify';
const ARTIFACTS_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  if (fs.existsSync(USER_DATA_DIR)) {
    try { fs.rmSync(USER_DATA_DIR, { recursive: true, force: true }); } catch (_) {}
  }

  // Launch Chrome on Desktop resolution first
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${USER_DATA_DIR}`,
    '--no-first-run',
    '--disable-gpu',
    '--window-size=1280,800',
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

  // 1. Verify Header & Logo
  const headerCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const brandSec = document.querySelector('.brand-section');
        const logoImg = document.querySelector('.brand-logo-wide');
        const brandText = document.querySelector('.brand-text');
        const h1 = brandSec.querySelector('h1');
        return {
          logoFound: !!logoImg,
          logoSrc: logoImg ? logoImg.getAttribute('src') : null,
          logoNaturalWidth: logoImg ? logoImg.naturalWidth : null,
          logoNaturalHeight: logoImg ? logoImg.naturalHeight : null,
          logoRenderedWidth: logoImg ? logoImg.offsetWidth : null,
          logoRenderedHeight: logoImg ? logoImg.offsetHeight : null,
          hasBrandText: !!brandText,
          hasH1: !!h1
        };
      })()
    `,
    returnByValue: true
  });
  console.log('1. Header Check:', headerCheck.result.value);

  // 2. Verify Category Pills
  const pillsCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const pills = Array.from(document.querySelectorAll('.cat-nav-pill')).map(p => {
          const span = p.querySelector('span:not(.cat-count)');
          const count = p.querySelector('.cat-count');
          return {
            category: p.getAttribute('data-category'),
            label: span ? span.textContent.trim() : '',
            count: count ? count.textContent.trim() : ''
          };
        });
        return pills;
      })()
    `,
    returnByValue: true
  });
  console.log('2. Category Pills in Menu App:', pillsCheck.result.value);

  // Capture Desktop Screenshot
  const ss1 = await send('Page.captureScreenshot', { format: 'png' });
  const desktopImgPath = path.join(ARTIFACTS_DIR, 'menu-app-desktop-new-logo.png');
  fs.writeFileSync(desktopImgPath, Buffer.from(ss1.data, 'base64'));
  console.log('Saved Desktop Screenshot to:', desktopImgPath);

  // 3. Test clicking "Şarap & Bira"
  const clickDrinks = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('.cat-nav-pill[data-category="saraplar"]');
        if (btn) {
          btn.click();
          return {
            clicked: true,
            activeText: btn.textContent.trim(),
            chapterTitle: document.getElementById('chapterTitle').textContent.trim(),
            chapterCount: document.getElementById('chapterCount').textContent.trim(),
            firstDish: document.querySelector('.dish-card-title')?.textContent.trim()
          };
        }
        return { clicked: false };
      })()
    `,
    returnByValue: true
  });
  console.log('3. "Şarap & Bira" Click Result:', clickDrinks.result.value);
  await sleep(400);

  const ssDrinks = await send('Page.captureScreenshot', { format: 'png' });
  const drinksImgPath = path.join(ARTIFACTS_DIR, 'menu-app-sarap-bira.png');
  fs.writeFileSync(drinksImgPath, Buffer.from(ssDrinks.data, 'base64'));
  console.log('Saved Drinks Category Screenshot to:', drinksImgPath);

  // 4. Test clicking "Tatlı Kapanışlar" & opening a modal
  const clickDessert = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('.cat-nav-pill[data-category="tatlilar"]');
        if (btn) {
          btn.click();
          return {
            clicked: true,
            chapterTitle: document.getElementById('chapterTitle').textContent.trim(),
            chapterCount: document.getElementById('chapterCount').textContent.trim(),
            firstDish: document.querySelector('.dish-card-title')?.textContent.trim()
          };
        }
        return { clicked: false };
      })()
    `,
    returnByValue: true
  });
  console.log('4. "Tatlı Kapanışlar" Click Result:', clickDessert.result.value);
  await sleep(400);

  // Open first dessert modal
  const openModal = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const firstCard = document.querySelector('.dish-card');
        if (firstCard) {
          firstCard.click();
          const modalTag = document.getElementById('modalCatTag').textContent.trim();
          const modalTitle = document.getElementById('modalTitle').textContent.trim();
          const modalPrice = document.getElementById('modalPrice').textContent.trim();
          return {
            modalOpened: true,
            modalTag,
            modalTitle,
            modalPrice
          };
        }
        return { modalOpened: false };
      })()
    `,
    returnByValue: true
  });
  console.log('5. Dessert Modal Open Result:', openModal.result.value);
  await sleep(400);

  const ssModal = await send('Page.captureScreenshot', { format: 'png' });
  const modalImgPath = path.join(ARTIFACTS_DIR, 'menu-app-tatli-modal.png');
  fs.writeFileSync(modalImgPath, Buffer.from(ssModal.data, 'base64'));
  console.log('Saved Tatlı Modal Screenshot to:', modalImgPath);

  // 5. Test Mobile Viewport (iPhone 14 / Pro - 390x844)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  // Close modal
  await send('Runtime.evaluate', {
    expression: `window.TuzlaMenuApp.closeDishModal()`
  });
  await sleep(500);

  const mobileCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const logoImg = document.querySelector('.brand-logo-wide');
        return {
          logoRenderedWidth: logoImg ? logoImg.offsetWidth : null,
          logoRenderedHeight: logoImg ? logoImg.offsetHeight : null
        };
      })()
    `,
    returnByValue: true
  });
  console.log('6. Mobile Header Logo Dimensions:', mobileCheck.result.value);

  const ssMobile = await send('Page.captureScreenshot', { format: 'png' });
  const mobileImgPath = path.join(ARTIFACTS_DIR, 'menu-app-mobile-view.png');
  fs.writeFileSync(mobileImgPath, Buffer.from(ssMobile.data, 'base64'));
  console.log('Saved Mobile View Screenshot to:', mobileImgPath);

  ws.close();
  chromeProc.kill();
  console.log('--- Verification Completed Successfully ---');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});

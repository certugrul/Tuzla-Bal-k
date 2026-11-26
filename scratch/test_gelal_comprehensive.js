const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128\\scratch\\chrome_profile_gelal_diag';
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
    '--remote-debugging-port=9223',
    `--user-data-dir=${USER_DATA_DIR}`,
    '--no-first-run',
    '--disable-gpu',
    '--window-size=1280,900',
    'http://localhost:3000/gelal-menu-app/'
  ]);

  try {
    await sleep(2000);

    const res = await fetch('http://127.0.0.1:9223/json/list');
    const tabs = await res.json();
    const pageTab = tabs.find(t => t.type === 'page' && t.url.includes('gelal-menu-app'));
    if (!pageTab) {
      console.error('Page tab not found! Tabs:', tabs);
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

    const consoleLogs = [];
    const jsErrors = [];
    const failedRequests = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && cbs.has(msg.id)) {
        const cb = cbs.get(msg.id);
        cbs.delete(msg.id);
        cb(msg.result);
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        consoleLogs.push(msg.params.args.map(a => a.value || a.description).join(' '));
      } else if (msg.method === 'Runtime.exceptionThrown') {
        jsErrors.push(msg.params.exceptionDetails);
      } else if (msg.method === 'Network.responseReceived') {
        const resp = msg.params.response;
        if (resp.status >= 400) {
          failedRequests.push(`${resp.status} ${resp.url}`);
        }
      }
    };

    await new Promise(r => { ws.onopen = r; });
    await send('Runtime.enable');
    await send('Network.enable');
    await send('Page.enable');
    await send('DOM.enable');

    await sleep(1500);

    // Evaluate state of Gel-Al App
    const diagResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const grid = document.getElementById('dishesGrid');
        const cards = grid ? grid.querySelectorAll('.dish-card') : [];
        const pills = document.querySelectorAll('.cat-pill');
        const topCards = document.querySelectorAll('.top-cat-card');
        const chapterTitle = document.getElementById('chapterTitle')?.textContent?.trim();
        const chapterCount = document.getElementById('chapterCount')?.textContent?.trim();

        // Sample first card
        let firstCard = null;
        if (cards[0]) {
          firstCard = {
            title: cards[0].querySelector('.dish-card-title')?.textContent?.trim(),
            priceText: cards[0].querySelector('.gelal-price-box')?.textContent?.trim().replace(/\\s+/g, ' '),
            hasBadge: !!cards[0].querySelector('.badge-gelal-tag'),
            hasImage: cards[0].classList.contains('has-image'),
            imgSrc: cards[0].querySelector('.dish-card-img')?.src || null
          };
        }

        // Check if any alcohol remains in state.items
        const alcoholFound = window.TuzlaGelAlApp ? [] : 'no_app';
        if (window.MENU_ITEMS) {
          const alcoholCats = ['rakilar', 'saraplar', 'biralar', 'ithal-ickiler'];
          const badItems = window.MENU_ITEMS.filter(i => alcoholCats.includes(i.category));
        }

        return {
          totalCardsRendered: cards.length,
          totalPills: pills.length,
          totalTopCards: topCards.length,
          chapterTitle,
          chapterCount,
          firstCard,
          appLoaded: typeof window.TuzlaGelAlApp !== 'undefined'
        };
      })()`,
      returnByValue: true
    });

    console.log('=== Gel-Al Initial Load Diagnostic ===');
    console.log(JSON.stringify(diagResult.result.value, null, 2));

    // Capture Desktop Initial Screenshot
    const snap1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'gelal-desktop-verified.png'), Buffer.from(snap1.data, 'base64'));
    console.log('Saved gelal-desktop-verified.png');

    // Click on the first dish card to open modal
    await send('Runtime.evaluate', {
      expression: `(() => {
        const firstCard = document.querySelector('.dish-card');
        if (firstCard) firstCard.click();
      })()`
    });
    await sleep(800);

    const modalDiag = await send('Runtime.evaluate', {
      expression: `(() => {
        const sheet = document.getElementById('dishModalSheet');
        const isActive = sheet ? sheet.classList.contains('active') : false;
        const title = document.getElementById('modalTitle')?.textContent?.trim();
        const price = document.getElementById('modalPriceWrap')?.textContent?.trim().replace(/\\s+/g, ' ');
        const sommelier = document.getElementById('modalSommelierText')?.textContent?.trim();
        const waLink = document.getElementById('modalBtnOrderWa')?.href;
        return { isActive, title, price, sommelier, waLink };
      })()`,
      returnByValue: true
    });

    console.log('=== Modal Diagnostic ===');
    console.log(JSON.stringify(modalDiag.result.value, null, 2));

    const snapModal = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'gelal-modal-verified.png'), Buffer.from(snapModal.data, 'base64'));
    console.log('Saved gelal-modal-verified.png');

    // Close modal
    await send('Runtime.evaluate', {
      expression: `window.TuzlaGelAlApp.closeDishModal()`
    });
    await sleep(500);

    // Switch to Mobile Viewport (iPhone 14 / 390x844)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sleep(1000);

    const snapMobileList = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'gelal-mobile-list-verified.png'), Buffer.from(snapMobileList.data, 'base64'));
    console.log('Saved gelal-mobile-list-verified.png');

    // Toggle to Grid View on Mobile
    await send('Runtime.evaluate', {
      expression: `window.TuzlaGelAlApp.setViewMode('grid')`
    });
    await sleep(600);

    const snapMobileGrid = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'gelal-mobile-grid-verified.png'), Buffer.from(snapMobileGrid.data, 'base64'));
    console.log('Saved gelal-mobile-grid-verified.png');

    // Click Mezeler Top Category
    await send('Runtime.evaluate', {
      expression: `window.TuzlaGelAlApp.selectCategory('mezeler')`
    });
    await sleep(600);

    const mezelerDiag = await send('Runtime.evaluate', {
      expression: `(() => {
        const cards = document.querySelectorAll('.dish-card');
        const chapterTitle = document.getElementById('chapterTitle')?.textContent?.trim();
        const chapterCount = document.getElementById('chapterCount')?.textContent?.trim();
        return { count: cards.length, chapterTitle, chapterCount };
      })()`,
      returnByValue: true
    });
    console.log('=== Mezeler Category Diagnostic ===');
    console.log(JSON.stringify(mezelerDiag.result.value, null, 2));

    const snapMezeler = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'gelal-mobile-mezeler-verified.png'), Buffer.from(snapMezeler.data, 'base64'));
    console.log('Saved gelal-mobile-mezeler-verified.png');

    console.log('=== Summary of Warnings / Errors ===');
    console.log('JS Errors:', jsErrors);
    console.log('Failed HTTP requests (404s etc):', failedRequests.slice(0, 10));

    ws.close();
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    chromeProc.kill();
  }
}

run();

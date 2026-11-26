const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128\\scratch\\chrome_profile_hide_big_cats';
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
    '--remote-debugging-port=9227',
    `--user-data-dir=${USER_DATA_DIR}`,
    '--no-first-run',
    '--disable-gpu',
    '--window-size=1280,900',
    'http://localhost:3000/gelal-menu-app/'
  ]);

  try {
    await sleep(2000);

    const res = await fetch('http://127.0.0.1:9227/json/list');
    const tabs = await res.json();
    const pageTab = tabs.find(t => t.type === 'page' && t.url.includes('gelal-menu-app'));
    if (!pageTab) {
      console.error('Page tab not found! Tabs:', tabs);
      return;
    }

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    let id = 1;
    const send = (m, params = {}) => new Promise(r => {
      const msgId = id++;
      const handler = (evt) => {
        const d = JSON.parse(evt.data);
        if (d.id === msgId) {
          ws.removeEventListener('message', handler);
          r(d.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method: m, params }));
    });

    await new Promise(r => ws.onopen = r);
    await send('Runtime.enable');
    await send('Page.enable');
    await send('DOM.enable');

    await sleep(1500);

    // 1. Initial State (Landing View)
    const stateLanding = await send('Runtime.evaluate', {
      expression: `(() => {
        const topSection = document.getElementById('topCategoriesSection');
        const navWrapper = document.getElementById('categoryNavWrapper');
        const appMain = document.querySelector('.app-main');

        return {
          topSectionDisplay: window.getComputedStyle(topSection).display,
          navWrapperDisplay: window.getComputedStyle(navWrapper).display,
          appMainDisplay: window.getComputedStyle(appMain).display,
          bodyHasClass: document.body.classList.contains('has-menu-opened')
        };
      })()`,
      returnByValue: true
    });
    console.log('1. Landing State:', stateLanding.result.value);

    const snap1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'gelal-state-1-landing.png'), Buffer.from(snap1.data, 'base64'));

    // 2. Click on Big Category Card (Mezeler)
    await send('Runtime.evaluate', {
      expression: `(() => {
        const card = document.querySelector('.top-cat-card[data-category="mezeler"]');
        if (card) card.click();
      })()`
    });
    await sleep(600);

    const stateAfterCatClick = await send('Runtime.evaluate', {
      expression: `(() => {
        const topSection = document.getElementById('topCategoriesSection');
        const navWrapper = document.getElementById('categoryNavWrapper');
        const appMain = document.querySelector('.app-main');
        const cards = document.querySelectorAll('.dish-card');

        return {
          topSectionDisplay: window.getComputedStyle(topSection).display,
          navWrapperDisplay: window.getComputedStyle(navWrapper).display,
          appMainDisplay: window.getComputedStyle(appMain).display,
          bodyHasClass: document.body.classList.contains('has-menu-opened'),
          renderedDishes: cards.length
        };
      })()`,
      returnByValue: true
    });
    console.log('2. State After Category Click (Mezeler):', stateAfterCatClick.result.value);

    const snap2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'gelal-state-2-category-clicked.png'), Buffer.from(snap2.data, 'base64'));

    // 3. Click "Tüm Seçki" on the Category Bar
    await send('Runtime.evaluate', {
      expression: `(() => {
        const allBtn = document.querySelector('.cat-nav-pill[data-category="all"], .cat-pill[data-category="all"]');
        if (allBtn) allBtn.click();
      })()`
    });
    await sleep(600);

    const stateAllPill = await send('Runtime.evaluate', {
      expression: `(() => {
        const topSection = document.getElementById('topCategoriesSection');
        const navWrapper = document.getElementById('categoryNavWrapper');
        const appMain = document.querySelector('.app-main');
        const cards = document.querySelectorAll('.dish-card');

        return {
          topSectionDisplay: window.getComputedStyle(topSection).display,
          navWrapperDisplay: window.getComputedStyle(navWrapper).display,
          appMainDisplay: window.getComputedStyle(appMain).display,
          bodyHasClass: document.body.classList.contains('has-menu-opened'),
          renderedDishes: cards.length
        };
      })()`,
      returnByValue: true
    });
    console.log('3. State After "Tüm Seçki" Click:', stateAllPill.result.value);

    const snap3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'gelal-state-3-tum-secki.png'), Buffer.from(snap3.data, 'base64'));

    // 4. Click Brand Logo to Return to Landing View
    await send('Runtime.evaluate', {
      expression: `(() => {
        const brandLogo = document.querySelector('.brand-section');
        if (brandLogo) brandLogo.click();
      })()`
    });
    await sleep(600);

    const stateReset = await send('Runtime.evaluate', {
      expression: `(() => {
        const topSection = document.getElementById('topCategoriesSection');
        const navWrapper = document.getElementById('categoryNavWrapper');
        const appMain = document.querySelector('.app-main');

        return {
          topSectionDisplay: window.getComputedStyle(topSection).display,
          navWrapperDisplay: window.getComputedStyle(navWrapper).display,
          appMainDisplay: window.getComputedStyle(appMain).display,
          bodyHasClass: document.body.classList.contains('has-menu-opened')
        };
      })()`,
      returnByValue: true
    });
    console.log('4. State After Brand Logo Click (Reset):', stateReset.result.value);

    const snap4 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'gelal-state-4-reset-landing.png'), Buffer.from(snap4.data, 'base64'));

    ws.close();
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    chromeProc.kill();
  }
}

run();

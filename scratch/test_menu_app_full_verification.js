const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128\\scratch\\chrome_profile_menu_opt_verify';
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
    '--remote-debugging-port=9229',
    `--user-data-dir=${USER_DATA_DIR}`,
    '--no-first-run',
    '--disable-gpu',
    '--window-size=1280,900',
    'http://localhost:3000/menu-app/'
  ]);

  try {
    await sleep(2000);

    const res = await fetch('http://127.0.0.1:9229/json/list');
    const tabs = await res.json();
    const pageTab = tabs.find(t => t.type === 'page' && t.url.includes('menu-app'));
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

    // 1. Data Integrity & Landing View Check
    const landingDiag = await send('Runtime.evaluate', {
      expression: `(() => {
        const topSection = document.getElementById('topCategoriesSection');
        const navWrapper = document.getElementById('categoryNavWrapper');
        const appMain = document.querySelector('.app-main');
        const pills = document.querySelectorAll('.cat-nav-pill, .cat-pill');
        const totalItems = window.MENU_ITEMS ? window.MENU_ITEMS.length : 0;

        // Check categories distribution
        const catCounts = {};
        (window.MENU_ITEMS || []).forEach(i => {
          catCounts[i.category] = (catCounts[i.category] || 0) + 1;
        });

        return {
          totalMenuItems: totalItems,
          totalPills: pills.length,
          topSectionDisplay: topSection ? window.getComputedStyle(topSection).display : 'null',
          navWrapperDisplay: navWrapper ? window.getComputedStyle(navWrapper).display : 'null',
          appMainDisplay: appMain ? window.getComputedStyle(appMain).display : 'null',
          bodyHasClass: document.body.classList.contains('has-menu-opened'),
          categoryCounts: catCounts
        };
      })()`,
      returnByValue: true
    });
    console.log('=== Menu App Landing State & Integrity ===');
    console.log(JSON.stringify(landingDiag.result.value, null, 2));

    const snapLanding = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'menu-app-opt-landing.png'), Buffer.from(snapLanding.data, 'base64'));

    // 2. Click on Meze Card
    await send('Runtime.evaluate', {
      expression: `(() => {
        const mezeCard = document.querySelector('.top-cat-card[data-category="mezeler"]');
        if (mezeCard) mezeCard.click();
      })()`
    });
    await sleep(600);

    const mezeDiag = await send('Runtime.evaluate', {
      expression: `(() => {
        const topSection = document.getElementById('topCategoriesSection');
        const navWrapper = document.getElementById('categoryNavWrapper');
        const appMain = document.querySelector('.app-main');
        const cards = document.querySelectorAll('.dish-card');
        const chapterTitle = document.getElementById('chapterTitle')?.textContent?.trim();
        const chapterCount = document.getElementById('chapterCount')?.textContent?.trim();

        return {
          topSectionDisplay: window.getComputedStyle(topSection).display,
          navWrapperDisplay: window.getComputedStyle(navWrapper).display,
          appMainDisplay: window.getComputedStyle(appMain).display,
          bodyHasClass: document.body.classList.contains('has-menu-opened'),
          renderedDishes: cards.length,
          chapterTitle,
          chapterCount
        };
      })()`,
      returnByValue: true
    });
    console.log('=== Menu App After Mezeler Click ===');
    console.log(JSON.stringify(mezeDiag.result.value, null, 2));

    const snapMeze = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'menu-app-opt-meze.png'), Buffer.from(snapMeze.data, 'base64'));

    // 3. Click on "Rakı Kavı" in Category Pill Bar
    await send('Runtime.evaluate', {
      expression: `(() => {
        const rakiPill = document.querySelector('.cat-nav-pill[data-category="rakilar"], .cat-pill[data-category="rakilar"]');
        if (rakiPill) rakiPill.click();
      })()`
    });
    await sleep(600);

    const rakiDiag = await send('Runtime.evaluate', {
      expression: `(() => {
        const topSection = document.getElementById('topCategoriesSection');
        const navWrapper = document.getElementById('categoryNavWrapper');
        const appMain = document.querySelector('.app-main');
        const cards = document.querySelectorAll('.dish-card');
        const chapterTitle = document.getElementById('chapterTitle')?.textContent?.trim();
        const chapterCount = document.getElementById('chapterCount')?.textContent?.trim();

        return {
          topSectionDisplay: window.getComputedStyle(topSection).display,
          navWrapperDisplay: window.getComputedStyle(navWrapper).display,
          appMainDisplay: window.getComputedStyle(appMain).display,
          bodyHasClass: document.body.classList.contains('has-menu-opened'),
          renderedDishes: cards.length,
          chapterTitle,
          chapterCount
        };
      })()`,
      returnByValue: true
    });
    console.log('=== Menu App After Rakı Kavı Click ===');
    console.log(JSON.stringify(rakiDiag.result.value, null, 2));

    const snapRaki = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'menu-app-opt-raki.png'), Buffer.from(snapRaki.data, 'base64'));

    // 4. Click "Tüm Seçki" on Category Bar
    await send('Runtime.evaluate', {
      expression: `(() => {
        const allBtn = document.querySelector('.cat-nav-pill[data-category="all"], .cat-pill[data-category="all"]');
        if (allBtn) allBtn.click();
      })()`
    });
    await sleep(600);

    const allDiag = await send('Runtime.evaluate', {
      expression: `(() => {
        const topSection = document.getElementById('topCategoriesSection');
        const navWrapper = document.getElementById('categoryNavWrapper');
        const appMain = document.querySelector('.app-main');
        const cards = document.querySelectorAll('.dish-card');
        const chapterTitle = document.getElementById('chapterTitle')?.textContent?.trim();
        const chapterCount = document.getElementById('chapterCount')?.textContent?.trim();

        return {
          topSectionDisplay: window.getComputedStyle(topSection).display,
          navWrapperDisplay: window.getComputedStyle(navWrapper).display,
          appMainDisplay: window.getComputedStyle(appMain).display,
          bodyHasClass: document.body.classList.contains('has-menu-opened'),
          renderedDishes: cards.length,
          chapterTitle,
          chapterCount
        };
      })()`,
      returnByValue: true
    });
    console.log('=== Menu App After "Tüm Seçki" Click ===');
    console.log(JSON.stringify(allDiag.result.value, null, 2));

    const snapAll = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'menu-app-opt-all.png'), Buffer.from(snapAll.data, 'base64'));

    // 5. Click Brand Logo to Return to Landing
    await send('Runtime.evaluate', {
      expression: `(() => {
        const brandLogo = document.querySelector('.brand-section');
        if (brandLogo) brandLogo.click();
      })()`
    });
    await sleep(600);

    const resetDiag = await send('Runtime.evaluate', {
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
    console.log('=== Menu App After Brand Logo Click (Reset) ===');
    console.log(JSON.stringify(resetDiag.result.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chromeProc.kill();
  }
}

run();

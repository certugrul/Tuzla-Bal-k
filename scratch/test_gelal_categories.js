const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128\\scratch\\chrome_profile_cat_test';
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
    '--remote-debugging-port=9226',
    `--user-data-dir=${USER_DATA_DIR}`,
    '--no-first-run',
    '--disable-gpu',
    '--window-size=1280,900',
    'http://localhost:3000/gelal-menu-app/'
  ]);

  try {
    await sleep(2000);

    const res = await fetch('http://127.0.0.1:9226/json/list');
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

    // 1. Inspect Category Pills and Computed Styles
    const catDiag = await send('Runtime.evaluate', {
      expression: `(() => {
        const pills = Array.from(document.querySelectorAll('.cat-nav-pill, .cat-pill'));
        const pillData = pills.map(p => {
          const comp = window.getComputedStyle(p);
          return {
            text: p.innerText.replace(/\\s+/g, ' ').trim(),
            bg: comp.backgroundColor,
            color: comp.color,
            border: comp.border,
            borderRadius: comp.borderRadius,
            padding: comp.padding,
            fontSize: comp.fontSize,
            fontWeight: comp.fontWeight,
            isActive: p.classList.contains('active')
          };
        });

        const trackComp = window.getComputedStyle(document.querySelector('.category-nav-scroll'));
        const indicator = document.getElementById('catSpringIndicator') || document.querySelector('.cat-spring-indicator');
        const indicatorComp = indicator ? window.getComputedStyle(indicator) : null;

        return {
          totalPills: pills.length,
          pillData,
          track: {
            bg: trackComp.backgroundColor,
            borderRadius: trackComp.borderRadius,
            border: trackComp.border
          },
          indicator: indicatorComp ? {
            bg: indicatorComp.backgroundColor,
            borderRadius: indicatorComp.borderRadius,
            opacity: indicatorComp.opacity,
            transform: indicatorComp.transform,
            width: indicatorComp.width
          } : null
        };
      })()`,
      returnByValue: true
    });

    console.log('=== Category Styles Diagnostic ===');
    console.log(JSON.stringify(catDiag.result.value, null, 2));

    // Capture screenshot of category bar at top
    const snapCategory = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'gelal-category-bar-styled.png'), Buffer.from(snapCategory.data, 'base64'));
    console.log('Saved gelal-category-bar-styled.png');

    // Scroll down to test sticky bar
    await send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: 350, behavior: 'instant' })`
    });
    await sleep(500);

    const snapSticky = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'gelal-category-bar-sticky.png'), Buffer.from(snapSticky.data, 'base64'));
    console.log('Saved gelal-category-bar-sticky.png');

    // Click on "Soğuk Mezeler"
    await send('Runtime.evaluate', {
      expression: `(() => {
        const mezePill = document.querySelector('.cat-nav-pill[data-category="mezeler"], .cat-pill[data-category="mezeler"]');
        if (mezePill) mezePill.click();
      })()`
    });
    await sleep(600);

    const snapMezeClicked = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'gelal-category-meze-active.png'), Buffer.from(snapMezeClicked.data, 'base64'));
    console.log('Saved gelal-category-meze-active.png');

    ws.close();
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    chromeProc.kill();
  }
}

run();

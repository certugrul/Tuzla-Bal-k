const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128\\scratch\\chrome_profile_top_cat_titles';
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
    '--remote-debugging-port=9230',
    `--user-data-dir=${USER_DATA_DIR}`,
    '--no-first-run',
    '--disable-gpu',
    '--window-size=1280,900',
    'http://localhost:3000/gelal-menu-app/'
  ]);

  try {
    await sleep(2000);

    const res = await fetch('http://127.0.0.1:9230/json/list');
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

    // Inspect top category cards styles and markup
    const topCatDiag = await send('Runtime.evaluate', {
      expression: `(() => {
        const cards = Array.from(document.querySelectorAll('.top-cat-card'));
        return cards.map(c => {
          const info = c.querySelector('.top-cat-info');
          const icon = c.querySelector('.top-cat-icon');
          const name = c.querySelector('.top-cat-name');
          const infoStyle = info ? window.getComputedStyle(info) : null;
          const iconStyle = icon ? window.getComputedStyle(icon) : null;
          const nameStyle = name ? window.getComputedStyle(name) : null;

          return {
            title: name?.textContent?.trim(),
            hasInfo: !!info,
            infoBg: infoStyle?.backgroundColor,
            infoPadding: infoStyle?.padding,
            iconWidth: iconStyle?.width,
            iconBg: iconStyle?.backgroundColor,
            nameColor: nameStyle?.color,
            nameFontSize: nameStyle?.fontSize
          };
        });
      })()`,
      returnByValue: true
    });
    console.log('=== Top Category Cards Diagnostic ===');
    console.log(JSON.stringify(topCatDiag.result.value, null, 2));

    // Capture screenshot of landing categories
    const snapLanding = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'gelal-top-categories-fixed.png'), Buffer.from(snapLanding.data, 'base64'));
    console.log('Saved gelal-top-categories-fixed.png');

    // Also capture mobile viewport screenshot
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sleep(800);

    const snapMobile = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'gelal-top-categories-mobile-fixed.png'), Buffer.from(snapMobile.data, 'base64'));
    console.log('Saved gelal-top-categories-mobile-fixed.png');

    ws.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chromeProc.kill();
  }
}

run();

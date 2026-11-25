const { spawn } = require('child_process');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128\\scratch\\chrome_verify_restore';
const ARTIFACTS_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  if (fs.existsSync(USER_DATA_DIR)) {
    try { fs.rmSync(USER_DATA_DIR, { recursive: true, force: true }); } catch (_) {}
  }

  // Desktop run
  console.log('--- Starting Chrome for Desktop Check ---');
  let chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9229',
    `--user-data-dir=${USER_DATA_DIR}_desktop`,
    '--no-first-run',
    '--disable-gpu',
    '--window-size=1280,850',
    'http://localhost:3000/menu-app/'
  ]);

  await sleep(1500);

  let res = await fetch('http://127.0.0.1:9229/json/list');
  let tabs = await res.json();
  let pageTab = tabs.find(t => t.type === 'page' && t.url.includes('menu-app'));

  let ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  let id = 1;
  let cbs = new Map();
  ws.onmessage = m => {
    const data = JSON.parse(m.data);
    if (cbs.has(data.id)) { cbs.get(data.id)(data); cbs.delete(data.id); }
  };
  function send(method, params = {}) {
    return new Promise(resolve => {
      const msgId = id++;
      cbs.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');
  await sleep(800);

  // Switch to list view
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.getElementById('btnViewList');
      if (btn) btn.click();
    })()`
  });
  await sleep(800);

  // Inspect first 3 items in list view
  let inspectEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('.dishes-grid.view-list .dish-card'));
      return cards.slice(0, 4).map(c => {
        const v = c.querySelector('.dish-card-visual');
        const img = c.querySelector('.dish-card-img');
        const vStyle = window.getComputedStyle(v);
        const iStyle = window.getComputedStyle(img);
        return {
          title: c.querySelector('.dish-card-title')?.innerText,
          vWidth: vStyle.width,
          vHeight: vStyle.height,
          iWidth: iStyle.width,
          iHeight: iStyle.height,
          naturalWidth: img?.naturalWidth,
          naturalHeight: img?.naturalHeight,
          objectFit: iStyle.objectFit
        };
      });
    })()`,
    returnByValue: true
  });

  console.log('DESKTOP METRICS:', JSON.stringify(inspectEval?.result?.result?.value, null, 2));

  let ssDesktop = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${ARTIFACTS_DIR}/list-desktop-restored-original.png`, Buffer.from(ssDesktop.result.data, 'base64'));
  console.log('Saved list-desktop-restored-original.png');

  ws.close();
  chromeProc.kill();
  await sleep(1000);

  // Mobile run (iPhone 14 / viewport 390x844)
  console.log('--- Starting Chrome for Mobile Check ---');
  chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9230',
    `--user-data-dir=${USER_DATA_DIR}_mobile`,
    '--no-first-run',
    '--disable-gpu',
    '--window-size=390,844',
    'http://localhost:3000/menu-app/'
  ]);

  await sleep(1500);

  res = await fetch('http://127.0.0.1:9230/json/list');
  tabs = await res.json();
  pageTab = tabs.find(t => t.type === 'page' && t.url.includes('menu-app'));

  ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  id = 1;
  cbs = new Map();
  ws.onmessage = m => {
    const data = JSON.parse(m.data);
    if (cbs.has(data.id)) { cbs.get(data.id)(data); cbs.delete(data.id); }
  };

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(800);

  // Switch to list view
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.getElementById('btnViewList');
      if (btn) btn.click();
    })()`
  });
  await sleep(800);

  let mobileInspect = await send('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('.dishes-grid.view-list .dish-card'));
      return cards.slice(0, 4).map(c => {
        const v = c.querySelector('.dish-card-visual');
        const img = c.querySelector('.dish-card-img');
        const vStyle = window.getComputedStyle(v);
        const iStyle = window.getComputedStyle(img);
        return {
          title: c.querySelector('.dish-card-title')?.innerText,
          vWidth: vStyle.width,
          vHeight: vStyle.height,
          iWidth: iStyle.width,
          iHeight: iStyle.height,
          objectFit: iStyle.objectFit
        };
      });
    })()`,
    returnByValue: true
  });

  console.log('MOBILE METRICS:', JSON.stringify(mobileInspect?.result?.result?.value, null, 2));

  let ssMobile = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${ARTIFACTS_DIR}/list-mobile-restored-original.png`, Buffer.from(ssMobile.result.data, 'base64'));
  console.log('Saved list-mobile-restored-original.png');

  ws.close();
  chromeProc.kill();
}

run().catch(console.error);

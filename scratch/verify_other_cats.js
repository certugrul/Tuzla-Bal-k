const { spawn } = require('child_process');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128\\scratch\\chrome_verify_cats';
const ARTIFACTS_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9231',
    `--user-data-dir=${USER_DATA_DIR}`,
    '--no-first-run',
    '--disable-gpu',
    '--window-size=390,844',
    'http://localhost:3000/menu-app/'
  ]);

  await sleep(1500);

  const res = await fetch('http://127.0.0.1:9231/json/list');
  const tabs = await res.json();
  const pageTab = tabs.find(t => t.type === 'page' && t.url.includes('menu-app'));

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  let id = 1;
  const cbs = new Map();
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
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(600);

  // Switch to list view
  await send('Runtime.evaluate', {
    expression: `(() => {
      document.getElementById('btnViewList').click();
    })()`
  });
  await sleep(500);

  // Click Soğuk Mezeler
  await send('Runtime.evaluate', {
    expression: `(() => {
      const pill = Array.from(document.querySelectorAll('.cat-nav-pill')).find(p => p.textContent.includes('Soğuk Mezeler'));
      if (pill) pill.click();
    })()`
  });
  await sleep(600);

  let ssMezeler = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${ARTIFACTS_DIR}/list-mobile-mezeler.png`, Buffer.from(ssMezeler.result.data, 'base64'));

  // Click Ara Sıcaklar
  await send('Runtime.evaluate', {
    expression: `(() => {
      const pill = Array.from(document.querySelectorAll('.cat-nav-pill')).find(p => p.textContent.includes('Ara Sıcaklar'));
      if (pill) pill.click();
    })()`
  });
  await sleep(600);

  let ssArasicak = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${ARTIFACTS_DIR}/list-mobile-arasicaklar.png`, Buffer.from(ssArasicak.result.data, 'base64'));

  ws.close();
  chromeProc.kill();
  console.log('Saved mezeler and arasicaklar screenshots!');
}

run().catch(console.error);

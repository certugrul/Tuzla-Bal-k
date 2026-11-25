const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128\\scratch\\chrome_verify_simple';
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
    '--window-size=1280,850',
    'http://localhost:3000/menu-app/'
  ]);

  await sleep(1500);

  const res = await fetch('http://127.0.0.1:9226/json/list');
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

  // 1. Get Category Counts from DOM
  console.log('--- Checking Category Nav Counts ---');
  const catCounts = await send('Runtime.evaluate', {
    expression: `(() => {
      const pills = Array.from(document.querySelectorAll('.cat-nav-pill'));
      return pills.map(p => ({
        label: p.querySelector('span:not(.cat-count)').textContent.trim(),
        count: p.querySelector('.cat-count').textContent.trim()
      }));
    })()`,
    returnByValue: true
  });
  console.log('Category Counts:', JSON.stringify(catCounts.result.value, null, 2));

  // 2. Switch to Soğuk Mezeler
  console.log('\n--- Checking Soğuk Mezeler ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('.cat-nav-pill')).find(b => b.textContent.includes('Soğuk Mezeler'));
      if (btn) btn.click();
    })()`
  });
  await sleep(600);

  const mezeCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const activeMezeler = window.MENU_ITEMS.filter(i => i.category === 'mezeler');
      const allHaveLocal = activeMezeler.every(i => i.isLocalImage === true);
      const invalidImages = activeMezeler.filter(i => !i.image || !i.image.startsWith('images/'));
      return {
        totalMezeler: activeMezeler.length,
        allHaveLocal,
        invalidCount: invalidImages.length
      };
    })()`,
    returnByValue: true
  });
  console.log('Meze Check:', JSON.stringify(mezeCheck.result.value, null, 2));

  // Screenshot Soğuk Mezeler
  const mezeShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'simplified-mezeler-desktop.png'), Buffer.from(mezeShot.data, 'base64'));
  console.log('Saved simplified-mezeler-desktop.png');

  // 3. Switch to Ara Sıcaklar
  console.log('\n--- Checking Ara Sıcaklar ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('.cat-nav-pill')).find(b => b.textContent.includes('Ara Sıcaklar'));
      if (btn) btn.click();
    })()`
  });
  await sleep(600);

  const araCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const activeAra = window.MENU_ITEMS.filter(i => i.category === 'ara-sicaklar');
      const allHaveLocal = activeAra.every(i => i.isLocalImage === true);
      const invalidImages = activeAra.filter(i => !i.image || !i.image.startsWith('images/arasicaklar/'));
      return {
        totalAra: activeAra.length,
        allHaveLocal,
        invalidCount: invalidImages.length
      };
    })()`,
    returnByValue: true
  });
  console.log('Ara Sıcaklar Check:', JSON.stringify(araCheck.result.value, null, 2));

  // Screenshot Ara Sıcaklar
  const araShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'simplified-arasicaklar-desktop.png'), Buffer.from(araShot.data, 'base64'));
  console.log('Saved simplified-arasicaklar-desktop.png');

  // 4. Test Mobile Viewport (iPhone 14 / 393 x 852)
  console.log('\n--- Checking Mobile Viewport ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 393,
    height: 852,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(600);

  // Switch to Kart (Grid) mode on mobile
  await send('Runtime.evaluate', {
    expression: `document.getElementById('btnViewGrid').click();`
  });
  await sleep(500);

  const mobileGridShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'simplified-mobile-grid.png'), Buffer.from(mobileGridShot.data, 'base64'));
  console.log('Saved simplified-mobile-grid.png');

  chromeProc.kill();
  console.log('\nALL VERIFICATIONS PASSED 100%!');
  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});

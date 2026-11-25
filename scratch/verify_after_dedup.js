const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128\\scratch\\chrome_profile_after_dedup';
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

  // 1. Check pills and counts
  const checkData = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const totalItems = window.TuzlaMenuApp.state.items.length;
        const pills = Array.from(document.querySelectorAll('.cat-nav-pill')).map(p => ({
          category: p.getAttribute('data-category'),
          label: p.querySelector('span:not(.cat-count)')?.textContent.trim(),
          count: p.querySelector('.cat-count')?.textContent.trim()
        }));
        return { totalItems, pills };
      })()
    `,
    returnByValue: true
  });
  console.log('1. Cleaned App Data & Pills:', checkData.result.value);

  // Capture screenshot of list
  const ssList = await send('Page.captureScreenshot', { format: 'png' });
  const listImgPath = path.join(ARTIFACTS_DIR, 'menu-app-after-deduplication.png');
  fs.writeFileSync(listImgPath, Buffer.from(ssList.data, 'base64'));
  console.log('Saved Cleaned List Screenshot to:', listImgPath);

  ws.close();
  chromeProc.kill();
  console.log('--- Verification Completed Successfully ---');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});

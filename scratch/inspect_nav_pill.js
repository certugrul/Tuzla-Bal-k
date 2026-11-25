const { spawn } = require('child_process');
const fs = require('fs');

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--user-data-dir=C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128\\scratch\\chrome_inspect',
    '--no-first-run',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:3000/menu-app/'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  const res = await fetch('http://127.0.0.1:9223/json/list');
  const tabs = await res.json();
  const tab = tabs.find(t => t.url.includes('menu-app'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);

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
  await new Promise(r => setTimeout(r, 1000));

  // Click on "Şefin İmzaları" to make it active like in user's image 2
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('.cat-nav-pill')).find(b => b.textContent.includes('Şefin İmzaları'));
      if (btn) btn.click();
    })()`
  });

  await new Promise(r => setTimeout(r, 600));

  const result = await send('Runtime.evaluate', {
    expression: `(() => {
      const scroll = document.querySelector('.category-nav-scroll');
      const ind = document.getElementById('catSpringIndicator');
      const active = document.querySelector('.cat-nav-pill.active');
      return {
        scrollRect: scroll ? scroll.getBoundingClientRect() : null,
        indRect: ind ? ind.getBoundingClientRect() : null,
        activeRect: active ? active.getBoundingClientRect() : null,
        indComputed: ind ? {
          top: getComputedStyle(ind).top,
          height: getComputedStyle(ind).height,
          bottom: getComputedStyle(ind).bottom,
          borderRadius: getComputedStyle(ind).borderRadius,
          transform: getComputedStyle(ind).transform,
          boxShadow: getComputedStyle(ind).boxShadow
        } : null,
        activeComputed: active ? {
          offsetTop: active.offsetTop,
          offsetHeight: active.offsetHeight,
          offsetLeft: active.offsetLeft,
          offsetWidth: active.offsetWidth
        } : null,
        scrollComputed: scroll ? {
          height: getComputedStyle(scroll).height,
          padding: getComputedStyle(scroll).padding,
          overflow: getComputedStyle(scroll).overflow
        } : null
      };
    })()`,
    returnByValue: true
  });

  console.log('Result:', JSON.stringify(result.result.value, null, 2));

  // Also take screenshot of category nav
  const shot = await send('Page.captureScreenshot', { 
    format: 'png',
    clip: {
      x: 0,
      y: 0,
      width: 1280,
      height: 400,
      scale: 1
    }
  });
  fs.writeFileSync('scratch/nav_screenshot.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved scratch/nav_screenshot.png');

  chrome.kill();
  process.exit(0);
}
test().catch(e => { console.error(e); process.exit(1); });

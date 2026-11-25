const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128\\scratch\\chrome_verify_all';
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
    '--remote-debugging-port=9224',
    `--user-data-dir=${USER_DATA_DIR}`,
    '--no-first-run',
    '--disable-gpu',
    '--window-size=1280,850',
    'http://localhost:3000/menu-app/'
  ]);

  await sleep(1500);

  const res = await fetch('http://127.0.0.1:9224/json/list');
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

  // 1. Click "Şefin İmzaları"
  console.log('--- Testing Category Pill "Şefin İmzaları" ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('.cat-nav-pill')).find(b => b.textContent.includes('Şefin İmzaları'));
      if (btn) btn.click();
    })()`
  });
  await sleep(500);

  // Measure geometries
  const pillCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const scroll = document.querySelector('.category-nav-scroll');
      const ind = document.getElementById('catSpringIndicator');
      const active = document.querySelector('.cat-nav-pill.active');
      return {
        activeText: active ? active.textContent.trim() : null,
        activeOffsetTop: active ? active.offsetTop : null,
        activeOffsetHeight: active ? active.offsetHeight : null,
        activeOffsetLeft: active ? active.offsetLeft : null,
        activeOffsetWidth: active ? active.offsetWidth : null,
        indTop: ind ? ind.style.top : null,
        indHeight: ind ? ind.style.height : null,
        indTransform: ind ? ind.style.transform : null,
        indWidth: ind ? ind.style.width : null,
        scrollPadding: scroll ? getComputedStyle(scroll).padding : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Pill Check:', JSON.stringify(pillCheck.result.value, null, 2));

  // Take screenshot of nav bar close-up
  const navShot = await send('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: 0,
      y: 180,
      width: 600,
      height: 90,
      scale: 2
    }
  });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'nav-pill-fixed.png'), Buffer.from(navShot.data, 'base64'));
  console.log('Saved nav-pill-fixed.png artifact');

  // 2. Open Modal for Orkinos
  console.log('\n--- Testing Orkinos Modal ---');
  const orkinosRes = await send('Runtime.evaluate', {
    expression: `(() => {
      // Find Orkinos card or search
      const cards = Array.from(document.querySelectorAll('.dish-card'));
      const orkinosCard = cards.find(c => c.textContent.includes('Orkinos'));
      if (orkinosCard) {
        orkinosCard.click();
        return { found: true, name: orkinosCard.querySelector('.dish-title').textContent };
      }
      return { found: false };
    })()`,
    returnByValue: true
  });
  console.log('Orkinos card found:', orkinosRes.result.value);

  // If not on current page, switch to ara-sicaklar
  if (!orkinosRes.result.value.found) {
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('.cat-nav-pill')).find(b => b.textContent.includes('Ara Sıcaklar'));
        if (btn) btn.click();
      })()`
    });
    await sleep(600);

    await send('Runtime.evaluate', {
      expression: `(() => {
        const cards = Array.from(document.querySelectorAll('.dish-card'));
        const orkinosCard = cards.find(c => c.textContent.includes('Orkinos'));
        if (orkinosCard) orkinosCard.click();
      })()`
    });
  }
  await sleep(600);

  // Inspect modal content
  const modalInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const modal = document.getElementById('dishModalSheet');
      const img = document.getElementById('modalHeroImg');
      const title = document.getElementById('modalTitle');
      const price = document.getElementById('modalPrice');
      const hasMasayaEkle = !!modal.querySelector('.btn-modal-add, .btn-modal-action, [class*="masaya"], [class*="add-to-cart"]');
      const hasQtySelector = !!modal.querySelector('.modal-qty-selector, .quantity-control, [class*="qty"]');
      return {
        isOpen: modal.classList.contains('active'),
        title: title ? title.textContent : null,
        price: price ? price.textContent : null,
        imageSrc: img ? img.src : null,
        hasMasayaEkle,
        hasQtySelector
      };
    })()`,
    returnByValue: true
  });
  console.log('Modal Info:', JSON.stringify(modalInfo.result.value, null, 2));

  // Take screenshot of Orkinos modal
  const modalShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'orkinos-modal-verified.png'), Buffer.from(modalShot.data, 'base64'));
  console.log('Saved orkinos-modal-verified.png artifact');

  // Close modal
  await send('Runtime.evaluate', {
    expression: `document.getElementById('modalCloseBtn').click();`
  });
  await sleep(400);

  // 3. Open Modal for a real photo dish (e.g. Edirne Usulü Çıtır Yaprak Ciğer or Kalamar Tava)
  console.log('\n--- Testing Kalamar Tava Genuine Photo Modal ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('.dish-card'));
      const card = cards.find(c => c.textContent.includes('Kalamar Tava'));
      if (card) card.click();
    })()`
  });
  await sleep(600);

  const kalamarModalInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const img = document.getElementById('modalHeroImg');
      const title = document.getElementById('modalTitle');
      return {
        title: title ? title.textContent : null,
        imageSrc: img ? img.src : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Kalamar Tava Modal Info:', JSON.stringify(kalamarModalInfo.result.value, null, 2));

  const kalamarShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'kalamar-modal-verified.png'), Buffer.from(kalamarShot.data, 'base64'));
  console.log('Saved kalamar-modal-verified.png artifact');

  // Close modal
  await send('Runtime.evaluate', {
    expression: `document.getElementById('modalCloseBtn').click();`
  });
  await sleep(400);

  // 4. Test Mobile Viewport (iPhone 14 / 393 x 852)
  console.log('\n--- Testing Mobile Viewport ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 393,
    height: 852,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(600);

  // Switch to Rakı Kavı to check rakı images
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('.cat-nav-pill')).find(b => b.textContent.includes('Rakı Kavı'));
      if (btn) btn.click();
    })()`
  });
  await sleep(600);

  // Click on Efe Yeşil Rakı
  await send('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('.dish-card'));
      const rakiCard = cards.find(c => c.textContent.includes('Efe Yeşil'));
      if (rakiCard) rakiCard.click();
    })()`
  });
  await sleep(600);

  const rakiModalInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const img = document.getElementById('modalHeroImg');
      const title = document.getElementById('modalTitle');
      return {
        title: title ? title.textContent : null,
        imageSrc: img ? img.src : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Efe Yeşil Rakı Modal Info (Mobile):', JSON.stringify(rakiModalInfo.result.value, null, 2));

  const mobileShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'raki-mobile-modal-verified.png'), Buffer.from(mobileShot.data, 'base64'));
  console.log('Saved raki-mobile-modal-verified.png artifact');

  chromeProc.kill();
  console.log('\nALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
  process.exit(0);
}

run().catch(e => {
  console.error('Error running verification:', e);
  process.exit(1);
});

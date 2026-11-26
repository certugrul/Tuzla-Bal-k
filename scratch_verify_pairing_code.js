const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9349;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
    this.events = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    return new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = evt => {
        const msg = JSON.parse(evt.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(new Error(msg.error.message));
          else cb.resolve(msg.result);
        } else if (msg.method) {
          const cbs = this.events.get(msg.method) || [];
          cbs.forEach(cb => cb(msg.params));
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  console.log('1. Starting headless Chrome on port ' + PORT + '...');
  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + path.join(__dirname, '.temp_chrome_profile_pair')
  ]);

  await sleep(1500);

  try {
    const targets = await fetchJson(`http://127.0.0.1:${PORT}/json/list`);
    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('DOM.enable');
    await client.send('Runtime.enable');

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1400,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    console.log('Navigating to http://localhost:3000/admin.html ...');
    await client.send('Page.navigate', { url: 'http://localhost:3000/admin.html' });
    await sleep(2000);

    // Click on reservations tab
    await client.send('Runtime.evaluate', {
      expression: `document.querySelector('[data-tab="reservationsTab"]')?.click();`
    });
    await sleep(600);

    // Open WhatsApp Bot Modal
    console.log('Opening WhatsApp Bot Modal...');
    await client.send('Runtime.evaluate', {
      expression: `document.getElementById('btnOpenBotModal')?.click();`
    });
    await sleep(800);

    // Click "Kod Al" button
    console.log('Clicking "Kod Al" button...');
    await client.send('Runtime.evaluate', {
      expression: `document.getElementById('btnGetPairingCode')?.click();`
    });
    await sleep(3500);

    let res = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'admin-whatsapp-pairing-code-modal.png'), Buffer.from(res.data, 'base64'));
    console.log('Captured: admin-whatsapp-pairing-code-modal.png');

    client.close();
  } finally {
    chromeProcess.kill('SIGKILL');
  }
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128\\scratch\\chrome_profile_admin_export';
const ARTIFACTS_DIR = 'C:\\Users\\krale\\.gemini\\antigravity\\brain\\c5b043b9-bd0c-455e-9745-43e6f8cbf128';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

class CdpConnection {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.msgId = 0;
    this.callbacks = new Map();
  }

  async connect() {
    const WebSocket = require('ws');
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.on('open', resolve);
      this.ws.on('error', reject);
      this.ws.on('message', (msg) => {
        const data = JSON.parse(msg.toString());
        if (data.id && this.callbacks.has(data.id)) {
          const cb = this.callbacks.get(data.id);
          this.callbacks.delete(data.id);
          if (data.error) cb.reject(new Error(JSON.stringify(data.error)));
          else cb.resolve(data.result);
        }
      });
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.msgId;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    try { this.ws.close(); } catch (_) {}
  }
}

async function run() {
  if (fs.existsSync(USER_DATA_DIR)) {
    try { fs.rmSync(USER_DATA_DIR, { recursive: true, force: true }); } catch (_) {}
  }

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9232',
    `--user-data-dir=${USER_DATA_DIR}`,
    '--no-first-run',
    '--disable-gpu',
    '--window-size=1400,900',
    'http://localhost:3000/admin.html'
  ]);

  try {
    await sleep(2000);
    const versionData = await getJson('http://localhost:9232/json/list');
    const pageTarget = versionData.find(t => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    const cdp = new CdpConnection(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await sleep(1500);

    // Switch to reservations tab
    await cdp.send('Runtime.evaluate', {
      expression: `
        document.querySelector('button[data-tab="reservationsTab"]').click();
      `
    });
    await sleep(1000);

    // Check presence of export buttons
    const checkRes = await cdp.send('Runtime.evaluate', {
      expression: `
        ({
          hasExcelBtn: !!document.getElementById('btnExportResExcel'),
          excelBtnText: document.getElementById('btnExportResExcel')?.innerText?.trim(),
          hasJsonBtn: !!document.getElementById('btnExportResJson'),
          jsonBtnText: document.getElementById('btnExportResJson')?.innerText?.trim()
        })
      `,
      returnByValue: true
    });
    console.log('Rezervasyon Sekmesi Butonları:', checkRes.result.value);

    // Take screenshot of Reservations tab
    const snapRes = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'admin-reservations-export-ui.png'), Buffer.from(snapRes.data, 'base64'));

    // Switch to Backup tab
    await cdp.send('Runtime.evaluate', {
      expression: `
        document.querySelector('button[data-tab="backupTab"]').click();
      `
    });
    await sleep(800);

    const checkBackupTab = await cdp.send('Runtime.evaluate', {
      expression: `
        ({
          hasBackupExcel: !!document.getElementById('btnBackupTabExportExcel'),
          hasBackupJson: !!document.getElementById('btnBackupTabExportJson')
        })
      `,
      returnByValue: true
    });
    console.log('Yedekleme Sekmesi Rezervasyon Kartı:', checkBackupTab.result.value);

    const snapBackup = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'admin-backup-reservations-ui.png'), Buffer.from(snapBackup.data, 'base64'));

    cdp.close();
    console.log('Verification completed successfully!');
  } finally {
    try { chromeProc.kill(); } catch (_) {}
  }
}

run().catch(console.error);

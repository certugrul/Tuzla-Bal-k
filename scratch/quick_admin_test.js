const { spawn } = require('child_process');

async function test() {
  const p = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--no-first-run',
    '--disable-gpu',
    'http://localhost:3000/admin.html'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const res = await fetch('http://127.0.0.1:9225/json/list');
  const tabs = await res.json();
  const tab = tabs.find(t => t.url.includes('admin.html'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
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
  await new Promise(r => setTimeout(r, 1000));

  const r1 = await send('Runtime.evaluate', {
    expression: 'document.getElementById("btnModeGelAl") !== null'
  });
  const r2 = await send('Runtime.evaluate', {
    expression: `(() => {
      document.getElementById("btnModeGelAl").click();
      return {
        active: document.getElementById("btnModeGelAl").classList.contains("active"),
        bannerDisplay: document.getElementById("gelalModeBanner").style.display,
        pageInfo: document.getElementById("pageInfo").textContent
      };
    })()`,
    returnByValue: true
  });
  console.log('Exists:', r1.result.value, 'Clicked:', r2.result.value);

  // Also test editing first item (Acılı Atom - ST00024)
  const r3 = await send('Runtime.evaluate', {
    expression: `(() => {
      window.editMenuItem('ST00024');
      return {
        modalActive: document.getElementById('itemModal').classList.contains('active'),
        itemName: document.getElementById('itemName').value,
        itemCat: document.getElementById('itemCategory').value,
        itemPrice: document.getElementById('itemPrice').value,
        imgPreviewSrc: document.getElementById('dishImagePreview').src,
        imgPreviewDisplay: document.getElementById('dishImagePreview').style.display
      };
    })()`,
    returnByValue: true
  });
  console.log('Edit Modal Test:', r3.result.value);

  ws.close();
  p.kill();
}
test();

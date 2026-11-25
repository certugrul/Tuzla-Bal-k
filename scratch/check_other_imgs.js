const fs = require('fs');

['img.jpg', 'img3.jpg', 'img.png'].forEach(f => {
  const p = 'img/' + f;
  if (fs.existsSync(p)) {
    console.log(p, fs.statSync(p).size);
  }
});

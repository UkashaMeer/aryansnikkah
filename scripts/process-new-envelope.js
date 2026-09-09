const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const PUBLIC = path.join(__dirname, "..", "public");

function knockWhite(data) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max - min;
    const warmth = r - b;
    const avg = (r + g + b) / 3;

    if (avg >= 234 && sat <= 9 && warmth <= 9) {
      data[i + 3] = 0;
    } else if (avg >= 226 && sat <= 14 && warmth <= 12) {
      const t = Math.min(
        1,
        Math.max((avg - 226) / 16, (10 - sat) / 8, (12 - warmth) / 14),
      );
      data[i + 3] = Math.round(data[i + 3] * (1 - t * 0.9));
    }
  }
}

async function flapToWebp(srcName, destName) {
  const src = path.join(PUBLIC, srcName);
  const dest = path.join(PUBLIC, destName);
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  knockWhite(data);

  let trans = 0;
  let opaque = 0;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 12) trans++;
    else opaque++;
  }

  await sharp(Buffer.from(data), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .webp({ quality: 92, alphaQuality: 100, effort: 6 })
    .toFile(dest);

  const out = await sharp(dest).metadata();
  console.log(
    `${srcName} -> ${destName} ${out.width}x${out.height} alpha=${out.hasAlpha} trans=${trans} opaque=${opaque} ${fs.statSync(src).size} -> ${fs.statSync(dest).size}`,
  );
}

async function fillToWebp() {
  const src = path.join(PUBLIC, "fill-new.jpg");
  const dest = path.join(PUBLIC, "fill-new.webp");
  await sharp(src)
    .webp({ quality: 92, effort: 6, smartSubsample: true })
    .toFile(dest);
  console.log(
    `fill-new.jpg -> fill-new.webp ${fs.statSync(src).size} -> ${fs.statSync(dest).size}`,
  );
}

(async () => {
  await flapToWebp("envolpe-top-new.jpg", "envolpe-top-new.webp");
  await flapToWebp("envolope-bottom-new.jpg", "envolope-bottom-new.webp");
  await fillToWebp();
})();

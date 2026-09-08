const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const PUBLIC = path.join(__dirname, "..", "public");

function knockLightBg(data) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max - min;
    const avg = (r + g + b) / 3;
    const dr = r - 232;
    const dg = g - 233;
    const db = b - 237;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);

    if (dist < 30 && sat < 42) {
      data[i + 3] = 0;
    } else if (avg > 175 && sat < 58 && r < 205) {
      const t = Math.min(1, Math.max(0, (dist - 28) / 50));
      data[i + 3] = Math.round(data[i + 3] * t);
    }
  }
}

function contentBox(data, width, height) {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] >= 18) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  const pad = 8;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);

  return { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

async function makeDuaWebp() {
  const src = path.join(PUBLIC, "last scene dua.jpg");
  const dest = path.join(PUBLIC, "last-scene-dua.webp");
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  knockLightBg(data);
  const box = contentBox(data, info.width, info.height);

  await sharp(Buffer.from(data), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .extract({
      left: box.minX,
      top: box.minY,
      width: box.w,
      height: box.h,
    })
    .webp({ lossless: true, effort: 6 })
    .toFile(dest);

  const meta = await sharp(dest).metadata();
  const before = fs.statSync(src).size;
  const after = fs.statSync(dest).size;
  console.log(
    `dua ${info.width}x${info.height} -> ${meta.width}x${meta.height} alpha=${meta.hasAlpha} ${before} -> ${after}`,
  );
}

async function toWebp(srcName, destName) {
  const src = path.join(PUBLIC, srcName);
  const dest = path.join(PUBLIC, destName);
  const tmp = dest + ".tmp";
  await sharp(src)
    .webp({ quality: 92, alphaQuality: 100, effort: 6, smartSubsample: true })
    .toFile(tmp);

  const before = fs.statSync(src).size;
  const after = fs.statSync(tmp).size;
  if (after < before || destName !== srcName) {
    fs.renameSync(tmp, dest);
    console.log(`${srcName} -> ${destName} ${before} -> ${after}`);
  } else {
    fs.unlinkSync(tmp);
    console.log(`keep ${srcName} (${before} <= ${after})`);
  }
}

async function recompressWebp(filename) {
  const src = path.join(PUBLIC, filename);
  const tmp = src + ".tmp";
  const before = fs.statSync(src).size;
  await sharp(src)
    .webp({ quality: 92, alphaQuality: 100, effort: 6 })
    .toFile(tmp);
  const after = fs.statSync(tmp).size;
  if (after < before * 0.98) {
    fs.renameSync(tmp, src);
    console.log(`recompress ${filename} ${before} -> ${after}`);
  } else {
    fs.unlinkSync(tmp);
    console.log(`keep ${filename} ${before} (new ${after})`);
  }
}

(async () => {
  await makeDuaWebp();
  await toWebp("fifth-scene-bg.jpg", "fifth-scene-bg.webp");
  await toWebp("scene-three-bg.jpg", "scene-three-bg.webp");
  await toWebp("scene-two-bg.jpg", "scene-two-bg.webp");

  const jpgs = fs
    .readdirSync(PUBLIC)
    .filter((f) => /\.(jpe?g|png)$/i.test(f) && f !== "last scene dua.jpg");

  for (const file of jpgs) {
    const dest = file.replace(/\.(png|jpe?g)$/i, ".webp");
    if (["fifth-scene-bg.jpg", "scene-three-bg.jpg", "scene-two-bg.jpg"].includes(file)) {
      continue;
    }
    await toWebp(file, dest);
  }

  const usedWebp = [
    "Bismillah.webp",
    "fill.webp",
    "envolpe-top.webp",
    "envolpe-bottom.webp",
    "flowers-2.webp",
    "forth-top.webp",
    "forth-sides.webp",
    "forth-box-top.webp",
    "sidepillars.webp",
    "scene-two-bg.webp",
  ];

  for (const file of usedWebp) {
    if (fs.existsSync(path.join(PUBLIC, file))) {
      await recompressWebp(file);
    }
  }
})();

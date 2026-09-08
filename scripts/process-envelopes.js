const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const HARD = 16;
const SOFT = 40;
const PUBLIC = path.join(__dirname, "..", "public");

function knockBlack(data) {
  for (let i = 0; i < data.length; i += 4) {
    const max = Math.max(data[i], data[i + 1], data[i + 2]);
    if (max <= HARD) data[i + 3] = 0;
    else if (max < SOFT) {
      data[i + 3] = Math.round(data[i + 3] * ((max - HARD) / (SOFT - HARD)));
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
      if (data[(y * width + x) * 4 + 3] >= 12) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  return { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

async function loadTransparent(src) {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  knockBlack(data);
  const box = contentBox(data, info.width, info.height);

  return sharp(Buffer.from(data), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .extract({
      left: box.minX,
      top: box.minY,
      width: box.w,
      height: box.h,
    })
    .png()
    .toBuffer();
}

(async () => {
  const topSrc = path.join(PUBLIC, "envolpe-top.png");
  const bottomSrc = fs.existsSync(path.join(PUBLIC, "envolpe-bottom-new.jpg"))
    ? path.join(PUBLIC, "envolpe-bottom-new.jpg")
    : path.join(PUBLIC, "envolpe-bottom.png");

  const topBuf = await loadTransparent(topSrc);
  const bottomBuf = await loadTransparent(bottomSrc);
  const topMeta = await sharp(topBuf).metadata();

  await sharp(topBuf)
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, "envolpe-top.out.png"));
  await sharp(bottomBuf)
    .resize({ width: topMeta.width, kernel: "lanczos3" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, "envolpe-bottom.out.png"));

  fs.renameSync(
    path.join(PUBLIC, "envolpe-top.out.png"),
    path.join(PUBLIC, "envolpe-top.png"),
  );
  fs.renameSync(
    path.join(PUBLIC, "envolpe-bottom.out.png"),
    path.join(PUBLIC, "envolpe-bottom.png"),
  );

  const top = await sharp(path.join(PUBLIC, "envolpe-top.png")).metadata();
  const bottom = await sharp(path.join(PUBLIC, "envolpe-bottom.png")).metadata();
  console.log("top", top.width, top.height, "alpha", top.hasAlpha);
  console.log("bottom", bottom.width, bottom.height, "alpha", bottom.hasAlpha);
})();

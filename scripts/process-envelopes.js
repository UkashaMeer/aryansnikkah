const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const HARD = 16;
const SOFT = 40;
const PUBLIC = path.join(__dirname, "..", "public");

function knockBlack(data) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    let alpha = data[i + 3];

    if (max <= HARD) {
      alpha = 0;
    } else if (max < SOFT) {
      alpha = Math.round(alpha * ((max - HARD) / (SOFT - HARD)));
    }

    data[i + 3] = alpha;
  }
}

function contentBox(data, width, height, minAlpha = 12) {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = data[(y * width + x) * 4 + 3];
      if (a >= minAlpha) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  return { minX, minY, maxX, maxY };
}

function peakX(data, width, height, minY, maxY) {
  let bestY = height;
  let xs = [];

  for (let y = minY; y <= maxY; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] >= 20) row.push(x);
    }
    if (row.length) {
      bestY = y;
      xs = row;
      break;
    }
  }

  if (!xs.length) return width / 2;
  return (xs[0] + xs[xs.length - 1]) / 2;
}

async function processFile(filename, { recenterPeak = false } = {}) {
  const input = path.join(PUBLIC, filename);
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Buffer.from(data);
  knockBlack(pixels);

  const box = contentBox(pixels, info.width, info.height);
  const pad = 2;
  const left = Math.max(0, box.minX - pad);
  const top = Math.max(0, box.minY - pad);
  const right = Math.min(info.width - 1, box.maxX + pad);
  const bottom = Math.min(info.height - 1, box.maxY + pad);
  const cropW = right - left + 1;
  const cropH = bottom - top + 1;

  const cropped = Buffer.alloc(cropW * cropH * 4);
  for (let y = 0; y < cropH; y++) {
    const src = ((top + y) * info.width + left) * 4;
    pixels.copy(cropped, y * cropW * 4, src, src + cropW * 4);
  }

  let outData = cropped;
  let outW = cropW;
  let outH = cropH;

  if (recenterPeak) {
    const px = peakX(outData, outW, outH, 0, outH - 1);
    const delta = Math.round(2 * px - outW);
    if (delta !== 0) {
      const padLeft = Math.max(0, -delta);
      const padRight = Math.max(0, delta);
      const newW = outW + padLeft + padRight;
      const shifted = Buffer.alloc(newW * outH * 4);
      for (let y = 0; y < outH; y++) {
        outData.copy(
          shifted,
          (y * newW + padLeft) * 4,
          y * outW * 4,
          (y + 1) * outW * 4,
        );
      }
      outData = shifted;
      outW = newW;
      console.log(`  recentered peak x=${px.toFixed(1)} pad L${padLeft} R${padRight}`);
    }
  }

  await sharp(outData, {
    raw: { width: outW, height: outH, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(input);

  console.log(`${filename} -> ${outW}x${outH}`);
}

(async () => {
  await processFile("envolpe-top.png");
  await processFile("envolpe-bottom.png", { recenterPeak: true });
})();

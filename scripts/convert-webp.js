const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const PUBLIC = path.join(__dirname, "..", "public");
const HARD = 16;
const SOFT = 40;
const SKIP_KNOCK = new Set(["fill.jpg"]);

function knockBlack(data) {
  for (let i = 0; i < data.length; i += 4) {
    const max = Math.max(data[i], data[i + 1], data[i + 2]);
    if (max <= HARD) data[i + 3] = 0;
    else if (max < SOFT) {
      data[i + 3] = Math.round(data[i + 3] * ((max - HARD) / (SOFT - HARD)));
    }
  }
}

async function convertFile(filename) {
  const src = path.join(PUBLIC, filename);
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  if (!SKIP_KNOCK.has(filename.toLowerCase())) {
    knockBlack(data);
  }

  const dest = path.join(PUBLIC, filename.replace(/\.(png|jpe?g)$/i, ".webp"));
  await sharp(Buffer.from(data), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .webp({ quality: 90, alphaQuality: 100, effort: 5 })
    .toFile(dest);

  const out = await sharp(dest).metadata();
  console.log(`${filename} -> ${path.basename(dest)} ${out.width}x${out.height} alpha=${out.hasAlpha}`);
  return dest;
}

(async () => {
  const files = fs
    .readdirSync(PUBLIC)
    .filter((f) => /\.(png|jpe?g)$/i.test(f));

  for (const file of files) {
    await convertFile(file);
  }
})();

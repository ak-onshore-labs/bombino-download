import QRCode from "qrcode";
import Jimp from "jimp";
import fs from "fs";
import path from "path";

const url = process.argv[2];

if (!url) {
  console.error("❌  Provide your Vercel URL:");
  console.error("   node generate-qr.js https://your-vercel-url.vercel.app");
  process.exit(1);
}

const LOGO_PATH = path.join("logo.png");
const OUTPUT_SVG = path.join("public", "qr.svg");
const OUTPUT_PNG = path.join("public", "qr.png");
const QR_SIZE = 800;
const LOGO_RATIO = 0.22;

const QR_OPTIONS = {
  errorCorrectionLevel: "H",
  margin: 2,
  width: QR_SIZE,
  color: {
    dark: "#000000",
    light: "#ffffff",
  },
};

async function generate() {
  console.log(`\n🔗  Generating QR for: ${url}\n`);

  // SVG
  const svgString = await QRCode.toString(url, { ...QR_OPTIONS, type: "svg" });
  fs.writeFileSync(OUTPUT_SVG, svgString);
  console.log(`✅  SVG saved → ${OUTPUT_SVG}`);

  // PNG with center logo
  const qrBuffer = await QRCode.toBuffer(url, { ...QR_OPTIONS, type: "png" });
  const qrImage = await Jimp.read(qrBuffer);

  const logoSize = Math.floor(QR_SIZE * LOGO_RATIO);
  const logoImage = await Jimp.read(LOGO_PATH);
  logoImage.resize(logoSize, logoSize);

  const x = Math.floor((QR_SIZE - logoSize) / 2);
  const y = Math.floor((QR_SIZE - logoSize) / 2);

  qrImage.composite(logoImage, x, y);
  await qrImage.writeAsync(OUTPUT_PNG);
  console.log(`✅  PNG with logo saved → ${OUTPUT_PNG}`);

  console.log("\n📦  Commit both files and push.\n");
}

generate().catch(console.error);

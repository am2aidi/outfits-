const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const iconsDir = path.join(rootDir, 'public', 'icons');
fs.mkdirSync(iconsDir, { recursive: true });

// App background color
const APP_BG = '#09090b';

function createSvgForIcon({ size, logoScale = 0.82, withBg = true }) {
  // Original SVG viewBox is 0 0 24 24
  // Center is (12, 12), radius is ~9.81 (diameter ~19.62)
  // Scale factor:
  const scale = (size / 24) * logoScale;
  const tx = (size - 24 * scale) / 2;
  const ty = (size - 24 * scale) / 2;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">
  <defs>
    <linearGradient id="huranowGrad" x1="4" y1="20" x2="20" y2="4" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFB000"/>
      <stop offset="40%" stop-color="#FF5A1F"/>
      <stop offset="68%" stop-color="#F01AA6"/>
      <stop offset="100%" stop-color="#5C28E6"/>
    </linearGradient>
  </defs>
  ${withBg ? `<rect width="${size}" height="${size}" fill="${APP_BG}"/>` : ''}
  <g transform="translate(${tx}, ${ty}) scale(${scale})" fill="none">
    <circle cx="12" cy="12" r="9.05" fill="#FFFFFF"/>
    <circle cx="12" cy="12" r="9.2" stroke="url(#huranowGrad)" stroke-width="1.22" fill="none"/>
    <circle cx="10.1" cy="7.9" r="1.48" fill="#17171C"/>
    <circle cx="13.95" cy="7.72" r="1.42" fill="#17171C"/>
    <path d="M8.05 14.2C9.45 11 12.05 9.48 15.55 9.48H15.86" stroke="#17171C" stroke-width="2.28" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.18 10.55C9.08 11.92 8.58 13.72 8.58 16.02V17.28" stroke="#17171C" stroke-width="2.28" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M13.78 10.92V17.12" stroke="#17171C" stroke-width="2.34" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;
}

function renderAndSave(svgStr, size, outputPath) {
  const resvg = new Resvg(svgStr, {
    fitTo: { mode: 'width', value: size },
    shapeRendering: 2, // geometricPrecision
    textRendering: 2,
    imageRendering: 0,
  });
  const pngData = resvg.render();
  fs.writeFileSync(outputPath, pngData.asPng());
  console.log(`Saved: ${path.relative(rootDir, outputPath)} (${size}x${size})`);
}

// 1. Standard Icons (dark background matching app, 82% logo scale)
const standardSizes = [
  { size: 1024, name: 'icon-1024.png', scale: 0.82 },
  { size: 512, name: 'icon-512.png', scale: 0.82 },
  { size: 192, name: 'icon-192.png', scale: 0.82 },
  { size: 180, name: 'apple-touch-icon.png', scale: 0.82 },
  { size: 180, name: 'apple-touch-icon-180.png', scale: 0.82 },
  { size: 32, name: 'favicon-32x32.png', scale: 0.88 },
  { size: 16, name: 'favicon-16x16.png', scale: 0.88 },
];

standardSizes.forEach(({ size, name, scale }) => {
  const svg = createSvgForIcon({ size, logoScale: scale, withBg: true });
  renderAndSave(svg, size, path.join(iconsDir, name));
});

// Also save apple-touch-icon to public root for maximum compatibility
renderAndSave(
  createSvgForIcon({ size: 180, logoScale: 0.82, withBg: true }),
  180,
  path.join(rootDir, 'public', 'apple-touch-icon.png')
);

// 2. Maskable Icons (safe padding: 64% logo scale so it falls strictly inside the 80% safe zone circle)
const maskableSizes = [
  { size: 512, name: 'icon-512-maskable.png', scale: 0.64 },
  { size: 192, name: 'icon-192-maskable.png', scale: 0.64 },
];

maskableSizes.forEach(({ size, name, scale }) => {
  const svg = createSvgForIcon({ size, logoScale: scale, withBg: true });
  renderAndSave(svg, size, path.join(iconsDir, name));
});

console.log('All PWA and desktop icons generated successfully!');

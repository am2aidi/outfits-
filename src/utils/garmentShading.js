// Utility for dynamic fabric shading, highlights, and shadow calculation
export function shadeColor(hex, percent) {
  if (!hex || typeof hex !== 'string' || hex[0] !== '#') return hex || '#18181b';
  let num = parseInt(hex.slice(1), 16);
  if (hex.length === 4) {
    const r = (num >> 8) & 0xf;
    const g = (num >> 4) & 0xf;
    const b = num & 0xf;
    num = (r << 20) | (r << 16) | (g << 12) | (g << 8) | (b << 4) | b;
  }
  let r = num >> 16;
  let g = (num >> 8) & 255;
  let b = num & 255;
  const f = v => Math.max(0, Math.min(255, Math.round(percent < 0 ? v * (1 + percent) : v + (255 - v) * percent)));
  return '#' + [f(r), f(g), f(b)].map(v => v.toString(16).padStart(2, '0')).join('');
}

// Convert SVG to PNG data URL for AI Studio Mode
export function svgToPngDataUrl(svgString, width = 400, height = 750) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0c0c0e';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
  });
}

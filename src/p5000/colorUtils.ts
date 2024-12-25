function hexToRGB(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  if (hex.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(hex)) {
    throw new Error('Invalid hex color code');
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return [r, g, b];
}

function stringToRGB(input: string): [number, number, number] {
  let hash = 0;

  // Generate a hash code from the input string
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Ensure the hash is positive
  hash = Math.abs(hash);

  // Extract RGB components from the hash
  const r = (hash >> 16) & 0xFF;
  const g = (hash >> 8) & 0xFF;
  const b = hash & 0xFF;

  return [r, g, b];
}

function lightenColor(rgb: [number, number, number], percentage: number = 50): [number, number, number] {
  let [r, g, b] = rgb;

  // Convert RGB to HSL
  const [h, s, l] = rgbToHsl(r, g, b);

  // Increase the lightness by the given percentage
  const newL = Math.min(1, l + (percentage / 100));

  // Convert back to RGB
  const [newR, newG, newB] = hslToRgb(h, s, newL);

  // Return the new RGB values, rounded to the nearest integer
  return [Math.round(newR), Math.round(newG), Math.round(newB)];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  // Convert RGB values to the range 0–1
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h: number = 0, s: number = 0, l: number = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0));
        break;
      case g:
        h = ((b - r) / delta + 2);
        break;
      case b:
        h = ((r - g) / delta + 4);
        break;
    }
    h /= 6;
  }

  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number;

  if (s === 0) {
    // Achromatic color (gray scale)
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  // Convert RGB values back to the range 0–255
  return [r * 255, g * 255, b * 255];
}

export { hexToRGB, stringToRGB, lightenColor, rgbToHsl, hslToRgb };

// parseDistance already defined by you:
export function parseDistance(str) {
    if (str.includes("M KM")) {
      const match = str.match(/([\d.]+)\s*M\s*KM/i);
      return match ? parseFloat(match[1]) * 1_000_000 : null;
    } else if (str.includes("AU")) {
      const match = str.match(/([\d.]+)\s*AU/i);
      return match ? parseFloat(match[1]) * 149_597_870.7 : null; // 1 AU in km
    }
    return null;
  }
  
  // normalize to a scene size
  export function normalizeDistance(km, maxKm, sceneMax = 250) {
    return (km / maxKm) * sceneMax;
  }
  
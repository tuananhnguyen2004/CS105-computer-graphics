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

  export function calculateOrbitSpeedInRadianPerDay(solarOrbitPeriod) {
    if (!solarOrbitPeriod) return 0;
    
    const lower = solarOrbitPeriod.toLowerCase();
    
    if (lower.includes("years")) {
      const num = parseFloat(lower);
      const days = num * 365; // 1 năm ~ 365 ngày
      return (2 * Math.PI) / days;
    } else if (lower.includes("days")) {
      const num = parseFloat(lower);
      return (2 * Math.PI) / num;
    } else {
      console.warn("Unknown solar orbit period format:", solarOrbitPeriod);
      return 0;
    }
  }

  export function parseRotationSpeed(rotationPeriodStr) {
    if (!rotationPeriodStr) return 0;
  
    const lower = rotationPeriodStr.toLowerCase().trim();
  
    // Nếu dạng "DAYS" -> ví dụ "1.03 DAYS" hoặc "243 DAYS"
    if (lower.includes('day')) {
      const dayMatch = lower.match(/([\d.]+)\s*day/);
      if (dayMatch) {
        const days = parseFloat(dayMatch[1]);
        // 1 vòng = 2π radian → 2π / days radian/ngày
        return (2 * Math.PI) / days;
      }
    }

    const hourMatch = lower.match(/(\d+)\s*h/);
    const minMatch = lower.match(/(\d+)\s*m/);
  
    const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
    const minutes = minMatch ? parseInt(minMatch[1]) : 0;
  
    const totalHours = hours + minutes / 60;
  
    if (totalHours > 0) {
      // 1 ngày = 24 giờ
      const days = totalHours / 24;
      return (2 * Math.PI) / days; // radian/ngày
    }
  
    // Nếu không parse được, trả về 0
    return 0;
  }
   
  
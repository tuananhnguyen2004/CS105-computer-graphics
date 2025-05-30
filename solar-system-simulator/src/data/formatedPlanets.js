import { ConstantColorFactor } from "three";
import {
  calculateOrbitSpeedInRadianPerDay,
  parseDistance,
  parseRotationSpeed,
} from "../utils/parser";
import rawPlanets from "./planets.json";

const planetSizeMap = {
  Mercury: 0.3,
  Venus: 0.6,
  Earth: 0.62,
  Mars: 0.4,
  Jupiter: 2,
  Saturn: 1.9,
  Uranus: 1.1,
  Neptune: 1,
};

// const parseDiameter = (str) => {
//   const cleaned = str.replace(/[^\d.]/g, ""); // remove KM, spaces
//   return parseFloat(cleaned);
// };

const maxDistanceKm = parseDistance("30.1 AU"); // Neptune
const normalize = (value, max, scale) => (value / max) * scale;

const formatPlanets = (raw) => {
  // const diameters = raw.map(p => parseDiameter(p.equatorial_diameter));
  // const maxDiameter = Math.max(...diameters); // Jupiter

  return raw.map((planet) => {
    const distanceKm = parseDistance(planet.mean_distance_from_sun);
    // const diameterKm = parseDiameter(planet.equatorial_diameter);
    // let tmp=normalize(diameterKm, maxDiameter, 7)
    return {
      ...planet,
      distance: normalize(distanceKm, maxDistanceKm, 300),
      size: planetSizeMap[planet.name] ?? 1,
      speed: calculateOrbitSpeedInRadianPerDay(planet.solar_orbit_period),
      rotationSpeed:parseRotationSpeed(planet.rotation_period)
        // planet.name === "Venus" || planet.name === "Uranus"
        //   ? -parseRotationSpeed(planet.rotation_period)
        //   : parseRotationSpeed(planet.rotation_period),
    };
  });
};

const planets = formatPlanets(rawPlanets);
export default planets;

import { parseDistance } from "../utils/parser";
import rawPlanets from "./planets.json";

const parseDiameter = (str) => {
  const cleaned = str.replace(/[^\d.]/g, ""); // remove KM, spaces
  return parseFloat(cleaned);
};

const maxDistanceKm = parseDistance("30.1 AU"); // Neptune
const normalize = (value, max, scale = 1) => (value / max) * scale;

const formatPlanets = (raw) => {
  const diameters = raw.map(p => parseDiameter(p.equatorial_diameter));
  const maxDiameter = Math.max(...diameters); // Jupiter

  return raw.map((planet) => {
    const distanceKm = parseDistance(planet.mean_distance_from_sun);
    const diameterKm = parseDiameter(planet.equatorial_diameter);

    return {
      ...planet,
      distance: normalize(distanceKm, maxDistanceKm, 500), // normalized for positioning
      size: normalize(diameterKm, maxDiameter, 2), // normalized radius (max 2 units)
    };
  });
};

const planets = formatPlanets(rawPlanets);
export default planets;

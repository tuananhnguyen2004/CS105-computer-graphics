
import { useMemo } from "react";
import { Line } from "@react-three/drei";
import { EllipseCurve, Vector3 } from "three";

export default function OrbitLine({ radius = 10, segments = 64, color = 'white' }) {
  const points = useMemo(() => {
    const curve = new EllipseCurve(
      0, 0,          // ax, aY (center)
      radius, radius, // xRadius, yRadius
      0, 2 * Math.PI, // startAngle, endAngle
      false,          // clockwise
      0               // rotation
    );
    const pts = curve.getPoints(segments);
    return pts.map(p => new Vector3(p.x, 0, p.y)); // Keep in XZ plane
  }, [radius, segments]);

  return (
    <Line points={points} color={color} lineWidth={1} transparent opacity={0.2} />
  );
}

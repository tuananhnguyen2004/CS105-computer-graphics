import { useMemo } from "react";
import { Line } from "@react-three/drei";
import { EllipseCurve, Vector3 } from "three";

export default function OrbitLine({
  radius = 10,
  segments = 128,
  color = "white",
  tilt = 0,
}) {
  const points = useMemo(() => {
    const curve = new EllipseCurve(
      0,
      0,
      radius,
      radius,
      0,
      2 * Math.PI,
      false,
      0
    );
    const pts = curve.getPoints(segments);
    const tiltRad = (tilt * Math.PI) / 180; // convert degrees to radians

    return pts.map((p) => {
      const x = p.x;
      const y = Math.sin(-tiltRad) * p.y; // apply tilt to y
      const z = Math.cos(tiltRad) * p.y; // apply tilt to z
      return new Vector3(x, y, z);
    });
  }, [radius, segments, tilt]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={0.5}
      transparent
      opacity={0.2}
    />
  );
}

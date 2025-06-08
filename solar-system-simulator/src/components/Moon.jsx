import { useFrame, useLoader } from "@react-three/fiber";
import { useContext, useEffect, useRef } from "react";
import { Euler, SphereGeometry, TextureLoader, Vector3 } from "three";
import Outlined from "./Outline";
import { SelectContext } from "../App";
import {
  calculateOrbitSpeedInRadianPerDay,
  KM_PER_SCENE_UNIT,
  parseDistance,
  parseRotationSpeed,
} from "../utils/parser";
import OrbitLine from "./OrbitLine";

export default function Moon({
  parentSize = 1,
  name,
  mean_distance_from_planet,
  rotation_period,
  solar_orbit_period,
  ratio_to_parent,

  inclination,
  texture,
}) {
  const { selectPlanet, systemSpeed } = useContext(SelectContext);
  const moonTexture = useLoader(TextureLoader, texture);
  const meshRef = useRef();

  const orbitRef = useRef();
  const realDistance = parseDistance(mean_distance_from_planet);
  const distance = Math.min(realDistance / KM_PER_SCENE_UNIT, 2);

  const rotationSpeed = parseRotationSpeed(rotation_period);
  const orbitSpeed = calculateOrbitSpeedInRadianPerDay(solar_orbit_period);

  useFrame((state, delta) => {
    if (!meshRef.current || !orbitRef.current) return;

    // Orbit rotation applied to the parent group (orbitRef)
    orbitRef.current.rotation.y += orbitSpeed * systemSpeed * delta;

    // Self rotation applied to the moon mesh (meshRef)
    meshRef.current.rotation.y += rotationSpeed * systemSpeed * delta;
  });

  return (
    <Outlined>
      <group ref={orbitRef} rotation={[inclination * (Math.PI / 180), 0, 0]}>
        <mesh
          name={name}
          ref={meshRef}
          position={[distance, 0, 0]}
          onDoubleClick={() => selectPlanet("Moon")}
          castShadow
          receiveShadow
        >
          <sphereGeometry
            args={[parentSize * Math.max(0.1, ratio_to_parent), 32, 32]}
          />

          <meshStandardMaterial map={moonTexture} />
        </mesh>
        <OrbitLine radius={distance} />
      </group>
    </Outlined>
  );
}

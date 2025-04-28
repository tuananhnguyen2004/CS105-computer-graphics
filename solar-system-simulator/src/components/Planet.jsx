import { useCallback, useEffect, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Clock, TextureLoader, Vector3 } from "three";
import { Select } from "@react-three/postprocessing";
import Outlined from "./Outline";
import { PlanetMaterial } from "../shaders/PlanetMaterial";
import SaturnRing from "./SaturnRing";
import { parseDistance } from "../utils/parser";
import Moon from "./Moon";
import OrbitLine from "./OrbitLine";

export default function Planet({
  id,
  name,
  texture,
  nightTexture = null,
  rotationSpeed = 0.01,
  systemSpeed = 1,
  speed = 0.01,
  distance,
  size,
  handleClick,
  outerRef,
  tilt,
}) {
  const dayMap = useLoader(TextureLoader, texture);
  const nightMap = useLoader(
    TextureLoader,
    nightTexture ? nightTexture : texture
  );
  const meshRef = useRef();
  const rotationRef = useRef();
  const materialRef = useRef();
  const angleRef = useRef(Math.random() * Math.PI * 2);
  const useSameMap = !nightTexture || nightTexture === texture;

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    rotationRef.current.rotation.y += rotationSpeed * systemSpeed;

    angleRef.current += speed * delta * systemSpeed;
    // angleRef.current += speed;
    const x = Math.cos(angleRef.current) * distance;
    const z = Math.sin(angleRef.current) * distance;
    meshRef.current.position.set(x, 0, z);

    // Calculate light direction from sun at [0, 0, 0]
    const planetPos = new Vector3();
    meshRef.current.getWorldPosition(planetPos);

    const direction = new Vector3()
      .subVectors(new Vector3(0, 0, 0), planetPos)
      .normalize();

    materialRef.current.uniforms.lightDirection.value = direction;
  });
  
  useEffect(() => {
    meshRef.current.planet_id = id;
    console.log(meshRef.current.planet_id);
    if (outerRef) outerRef.current = meshRef.current;
    if (rotationRef.current) {
      rotationRef.current.rotation.x = tilt * (Math.PI / 180);
    }
  }, [outerRef]);
  return (
    <Outlined>
      <mesh
        ref={meshRef}
        position={[distance, 0, 0]}
      >
        <mesh ref={rotationRef}>
          <sphereGeometry args={[size, 64, 64]} />
          <planetMaterial
            ref={materialRef}
            dayMap={dayMap}
            nightMap={nightMap}
            lightDirection={new Vector3(1, 0, 0)}
            useSameMap={useSameMap}
          />
        {name === "Saturn" && <SaturnRing planetSize={size} />}
        </mesh>

        {name === "Earth" && <OrbitLine radius={size * 3} tilt={-5.145} />}
      </mesh>
      {name === "Earth" && (
        <group>
          <Moon
            parentRef={meshRef}
            parentSize={size} // <<< use dynamic size here!
            handleClick={handleClick}
            systemSpeed={systemSpeed}
            distanceMultiplier={3} // (or whatever you want)
            speed={speed * 30} // optional: pass same orbital speed
            orbitTilt={5.145}
          />
        </group>
      )}
    </Outlined>
  );
}

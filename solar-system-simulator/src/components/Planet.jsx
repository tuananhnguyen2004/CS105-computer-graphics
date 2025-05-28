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
import Atmosphere from "./Asmosphere";

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
  tilt, // Axial tilt
  inclination = 0,
}) {
  console.log(size,distance)
  const dayMap = useLoader(TextureLoader, texture);
  const nightMap = useLoader(
    TextureLoader,
    nightTexture ? nightTexture : texture
  );
  const meshRef = useRef();
  const rotationRef = useRef(); // For axial rotation and tilt
  const materialRef = useRef();
  const angleRef = useRef(Math.random() * Math.PI * 2); // Orbital angle
  const useSameMap = !nightTexture || nightTexture === texture;

  // Convert inclination from degrees to radians once
  const inclinationRad = inclination * (Math.PI / 180);

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current || !rotationRef.current)
      return;

    rotationRef.current.rotation.y += rotationSpeed * systemSpeed * delta;

    angleRef.current += speed * delta * systemSpeed;
    const angle = angleRef.current;

    const x_flat = Math.cos(angle) * distance;
    const z_flat = Math.sin(angle) * distance;

    const x = x_flat;
    const y = -z_flat * Math.sin(inclinationRad);
    const z = z_flat * Math.cos(inclinationRad);

    meshRef.current.position.set(x, y, z);

    const planetPos = new Vector3();
    meshRef.current.getWorldPosition(planetPos);

    const direction = new Vector3()
      .subVectors(new Vector3(0, 0, 0), planetPos)
      .normalize();

    // Update shader uniform
    if (materialRef.current.uniforms.lightDirection) {
      materialRef.current.uniforms.lightDirection.value = direction;
    }
  });

  useEffect(() => {
    meshRef.current.planet_id = id;
    
    if (outerRef) outerRef.current = meshRef.current;
    if (rotationRef.current) {
      rotationRef.current.rotation.x = tilt * (Math.PI / 180);
    }
  }, [outerRef, tilt]);


  
  return (
    <Outlined>
      <mesh ref={meshRef} position={[distance, 0, 0]} castShadow receiveShadow>
        <mesh ref={rotationRef} castShadow receiveShadow>
          <sphereGeometry args={[size, 64, 64]} />
          {/* <meshStandardMaterial  map={dayMap} /> */}
          <planetMaterial
            ref={materialRef}
            key={PlanetMaterial.key} // Add key for potential shader updates
            dayMap={dayMap}
            nightMap={nightMap}
            lightDirection={new Vector3(1, 0, 0)} // Initial light direction
            useSameMap={useSameMap}
          />
          {name === "Saturn" && <SaturnRing planetSize={size} />}
          <Atmosphere name={name} parentSize={size}/>
        </mesh>
        {name === "Earth" && (
          <OrbitLine radius={size * 1.5} tilt={-5.145} parent={meshRef} />
        )}
      </mesh>
      {name === "Earth" && (
        <group>
          <Moon
            parentRef={meshRef} // Moon orbits the planet mesh
            parentSize={size}
            handleClick={handleClick}
            systemSpeed={systemSpeed}
            distanceMultiplier={1.5} // Distance relative to parent size
            speed={speed} // Moon orbits faster than Earth orbits the sun (approx)
            orbitTilt={5.145} // Moon's orbital tilt relative to Earth's orbit
          />
        </group>
      )}
    </Outlined>
  );
}

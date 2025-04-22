import { useCallback, useEffect, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, Vector3 } from "three";
import { Select } from "@react-three/postprocessing";
import Outlined from "./Outline";
import {PlanetMaterial} from "../shaders/PlanetMaterial";
import SaturnRing from "./SaturnRing";

export default function Planet({
  position,
  size,
  name,
  textureUrl,
  nightTextureUrl,
  rotationSpeed = 0.01,
  speed = 0.01,
  distance

}) {
  const dayMap = useLoader(TextureLoader, textureUrl);
  const nightMap = useLoader(TextureLoader, nightTextureUrl);
  const meshRef = useRef();
  const materialRef = useRef();
  const angleRef = useRef(Math.random() * Math.PI * 2);
  const useSameMap = !nightTextureUrl || textureUrl === nightTextureUrl;


  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return;

    meshRef.current.rotation.y += rotationSpeed;

    angleRef.current += speed;
    const x = Math.cos(angleRef.current) * distance;
    const z = Math.sin(angleRef.current) * distance;
    meshRef.current.position.set(x, 0, z);


    // Calculate light direction from sun at [0, 0, 0]
    const planetPos = new Vector3();
    meshRef.current.getWorldPosition(planetPos);

    const direction = new Vector3().subVectors(
      new Vector3(0, 0, 0),
      planetPos
    ).normalize();

    materialRef.current.uniforms.lightDirection.value = direction;
  });

  return (
    <Outlined>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 64, 64]} />
        <planetMaterial
          ref={materialRef}
          dayMap={dayMap}
          nightMap={nightMap}
          lightDirection={new Vector3(1, 0, 0)} 
          useSameMap={useSameMap}
        />
        {name==="Saturn" &&<SaturnRing planetSize={size} />}
      </mesh>
    </Outlined>
  );
}

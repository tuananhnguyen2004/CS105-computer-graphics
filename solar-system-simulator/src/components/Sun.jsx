import { useCallback, useEffect, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { AdditiveBlending, Color, TextureLoader } from "three";
import { Select } from "@react-three/postprocessing";
import Outlined from "./Outline";

export default function Sun({ rotationSpeed = 0.01 ,systemSpeed=1, handleClick }) {
  const texture = useLoader(TextureLoader, "textures/sun.jpg");
  const meshRef = useRef();

  useFrame((state, delta) => {
    meshRef.current.rotation.y += rotationSpeed *systemSpeed;
  });

  const handleClick1 = () => {
    handleClick(meshRef);
  }

  return (
    <Outlined>
      <mesh ref={meshRef} position={[0, 0, 0]} onDoubleClick={handleClick1} >
        <sphereGeometry args={[3, 64, 64]} />
        <meshBasicMaterial map={texture} />
        <pointLight
          position={[0, 0, 0]}
          intensity={50}
          distance={1000}
          decay={1}
        />
      </mesh>
    </Outlined>
  );
}

import { useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import { TextureLoader } from "three";
import Outlined from "./Outline";

export default function Sun({ rotationSpeed = 0.256 ,systemSpeed=1, handleClick }) {
  const texture = useLoader(TextureLoader, "textures/sun.jpg");
  const meshRef = useRef();

  useFrame((state, delta) => {
    meshRef.current.rotation.y += rotationSpeed * systemSpeed * delta;
  });

  const handleClick1 = () => {
    handleClick(meshRef);
  }

  return (
    <Outlined>
      <mesh ref={meshRef} position={[0, 0, 0]} onDoubleClick={handleClick1} >
        <sphereGeometry args={[2, 64, 64]} />
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

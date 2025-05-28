import { useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import { Euler, SphereGeometry, TextureLoader, Vector3 } from "three";
import Outlined from "./Outline";

export default function Moon({
  parentRef,
  parentSize = 1,
  systemSpeed = 1,
  handleClick,
  speed = 1,
  sizeRatio = 0.27,
  distanceMultiplier ,
  orbitTilt = 5.145, 
}) {
  const texture = useLoader(TextureLoader, "textures/moon.jpg"); // placeholder texture
  const meshRef = useRef();
  const angleRef = useRef(Math.random() * Math.PI * 2);
  const tiltEuler = new Euler(
    ((orbitTilt) * Math.PI) / 180, 
    0,
    0,
  );

  useFrame((state, delta) => {
    if (!meshRef.current || !parentRef?.current) return;

    const parentPos = new Vector3();
    parentRef.current.getWorldPosition(parentPos);

    // Dynamically get parent's current size
    const parentRadius =
      parentRef.current.geometry?.parameters?.radius || parentSize;

    const moonDistance = parentRadius * distanceMultiplier;
    const moonSize = parentRadius * sizeRatio;

    // Update orbit
    angleRef.current += speed * delta * systemSpeed;

    const orbitPos = new Vector3(
      Math.cos(angleRef.current) * moonDistance,
      0,
      -Math.sin(angleRef.current) * moonDistance
    );

    orbitPos.applyEuler(tiltEuler); 

    meshRef.current.position.copy(parentPos.clone().add(orbitPos));

    // Self-rotation
    meshRef.current.rotation.y += 0.23 * systemSpeed * delta;

    // Update Moon size dynamically
    if (meshRef.current.geometry.parameters.radius !== moonSize) {
      meshRef.current.geometry.dispose();
      meshRef.current.geometry = new SphereGeometry(moonSize, 32, 32);
    }
  });

  const handleClick1 = () => {
    handleClick(meshRef);
  };

  return (
    <Outlined>
      <mesh ref={meshRef} onDoubleClick={handleClick1}>
        <sphereGeometry args={[parentSize * sizeRatio, 32, 32]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </Outlined>
  );
}

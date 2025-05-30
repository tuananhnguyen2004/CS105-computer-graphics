import { useFrame, useLoader } from "@react-three/fiber";
import { useContext, useRef } from "react";
import {
  BackSide,
  TextureLoader
} from "three";
import { SelectContext } from "../App";
import Outlined from "./Outline";

export default function Sun({ rotationSpeed = 0.256 }) {
  const { selectPlanet, systemSpeed } = useContext(SelectContext);
  const texture = useLoader(TextureLoader, "textures/sun.jpg");
  const meshRef = useRef();

  useFrame((state, delta) => {
    meshRef.current.rotation.y += rotationSpeed * systemSpeed * delta;
  });

  return (
    <group>
      <Outlined>
        <mesh
          name="Sun"
          ref={meshRef}
          position={[0, 0, 0]}
          onDoubleClick={() => {
            selectPlanet("Sun");
          }}
        >
          <sphereGeometry args={[2, 64, 64]} />
          <meshBasicMaterial map={texture} />
          <pointLight
            name="sunlight"
            position={[0, 0, 0]}
            intensity={50}
            distance={1000}
            decay={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
            shadow-camera-near={1}
            shadow-camera-far={50}
          />
        </mesh>
      </Outlined>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.02, 64, 64]} />
        <meshStandardMaterial
          color={"orangered"}
          transparent
          opacity={1}
          blending={2}
          side={BackSide} // DoubleSide
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

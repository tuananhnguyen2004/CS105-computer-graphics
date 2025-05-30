import { useLoader } from "@react-three/fiber";
import {
  BackSide,
  DoubleSide,
  FrontSide,
  RingGeometry,
  TextureLoader,
} from "three";

export default function SaturnRing({ planetSize = 1 }) {
  const ringTexture = useLoader(
    TextureLoader,
    "/textures/saturn_ring_alpha.png"
  );

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
      <ringGeometry args={[planetSize * 1.2, planetSize * 2, 64]} />
      <meshStandardMaterial
        map={ringTexture}
        side={2}
        alphaTest={0.1} // Discard fully transparent pixels
        depthWrite={false}
        transparent
      />
    </mesh>
  );
}

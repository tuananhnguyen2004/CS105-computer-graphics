import { useLoader } from "@react-three/fiber";
import { DoubleSide, RingGeometry, TextureLoader } from "three";

export default function SaturnRing({ planetSize = 1 }) {
  const ringTexture = useLoader(TextureLoader, "/textures/saturn_ring_alpha.png");

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[planetSize * 1.2, planetSize * 2, 64]} />
      <meshBasicMaterial
        map={ringTexture}
        side={DoubleSide}
        transparent
      />
    </mesh>
  );
}

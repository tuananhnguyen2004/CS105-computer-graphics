import { useLoader } from "@react-three/fiber";
import React from "react";
import { AdditiveBlending, MultiplyBlending, NormalBlending, SubtractiveBlending, TextureLoader } from "three";

const Atmosphere = ({ name, parentSize }) => {
  if (!["Earth", "Venus"].includes(name)) return null;

  const atmosphereMap = useLoader(
    TextureLoader,
    name === "Earth"
      ? "textures/earth_clouds.jpg"
    //   ? "textures/Earth-clouds.png"
      : "textures/venus_atmosphere.jpg"
  );
  return (
    <mesh>
      <sphereGeometry args={[parentSize * 1.01, 64, 64]} />
      <meshStandardMaterial
        map={atmosphereMap}
        transparent={true}
        opacity={0.8}
        depthWrite={false}
        // blending={AdditiveBlending}
      />
    </mesh>
  );
};

export default Atmosphere;

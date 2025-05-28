import React, { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

const AsteroidBelt = ({ count = 500, radius = 10 }) => {
  const texture = useLoader(TextureLoader, "textures/asteroid_texture.jpg");

  const asteroids = useMemo(() => {
    return new Array(count).fill().map(() => {
      const angle = Math.random() * Math.PI * 2;
      const distance = radius + (Math.random() - 0.5) * 2; // +/- 1 unit for spread
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const y = (Math.random() - 0.5) * 2; // belt thickness +/- 1
      const scale = 0.05 + Math.random() * 0.1;
      const rotation = [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ];
      return { position: [x, y, z], scale, rotation };
    });
  }, [count, radius]);

  return (
    <>
      {asteroids.map((asteroid, i) => (
        <mesh
          key={i}
          position={asteroid.position}
          rotation={asteroid.rotation}
          scale={asteroid.scale}
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial map={texture} />
        </mesh>
      ))}
    </>
  );
};

export default AsteroidBelt;

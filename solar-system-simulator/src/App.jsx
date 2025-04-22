import { Canvas, useFrame } from "@react-three/fiber";
import {
  FirstPersonControls,
  OrbitControls,
  Outlines,
} from "@react-three/drei";
import {
  EffectComposer,
  Outline,
  Selection,
  Select,
  Bloom,
} from "@react-three/postprocessing";
import Planet from "./components/planet";
import Background from "./components/Background";
import { useRef, useState } from "react";
import Sun from "./components/Sun";
import AxisHelper from "./components/AxisHelper";
import GridHelper from "./components/GridHelper";
import OrbitLine from "./components/OrbitLine";

const planets = [
  {
    name: "Mercury",
    size: 0.4,
    textureUrl: "/textures/mercury.jpg",
    nightTextureUrl: "/textures/mercury.jpg",
    distance: 10,
    speed: 0.02,
  },
  {
    name: "Venus",
    size: 0.95,
    textureUrl: "/textures/venus_surface.jpg",
    nightTextureUrl: "/textures/venus_surface.jpg",
    distance: 18.46,
    speed: 0.015,
  },
  {
    name: "Earth",
    size: 1,
    textureUrl: "/textures/earth_daymap.jpg",
    nightTextureUrl: "/textures/earth_nightmap.jpg",
    distance: 25.64,
    speed: 0.01,
  },
  {
    name: "Mars",
    size: 0.6,
    textureUrl: "/textures/mars.jpg",
    nightTextureUrl: "/textures/mars.jpg",
    distance: 38.97,
    speed: 0.008,
  },
  {
    name: "Jupiter",
    size: 2,
    textureUrl: "/textures/jupiter.jpg",
    nightTextureUrl: "/textures/jupiter.jpg",
    distance: 133.33,
    speed: 0.005,
  },
  {
    name: "Saturn",
    size: 1.7,
    textureUrl: "/textures/saturn.jpg",
    nightTextureUrl: "/textures/saturn.jpg",
    distance: 200.64,
    speed: 0.003,
  },
  {
    name: "Uranus",
    size: 1.2,
    textureUrl: "/textures/uranus.jpg",
    nightTextureUrl: "/textures/uranus.jpg",
    distance: 250.82,
    speed: 0.002,
  },
  {
    name: "Neptune",
    size: 1.1,
    textureUrl: "/textures/neptune.jpg",
    nightTextureUrl: "/textures/neptune.jpg",
    distance: 300.51,
    speed: 0.001,
  },
];


export default function App() {
  const [hovered, setHovered] = useState(null);
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 75 }}
      style={{ width: "100vw", height: "100vh" }}
    >
  
      {/* <GridHelper size={500} divisions={10}/> */}
      <Background />
      <ambientLight intensity={0.1} />

      <OrbitControls />

      <Selection>
        <EffectComposer multisampling={8} autoClear={false}>
          <Outline
            blur
            visibleEdgeColor="white"
            hiddenEdgeColor="gray"
            edgeStrength={100}
            width={2000}
          />

          <Bloom
            luminanceThreshold={0}
            luminanceSmoothing={0.9}
            intensity={1.5}
          />
        </EffectComposer>

        <Sun />

        {planets.map((planet, i) => (
          <group key={i}>
            
          <Planet  {...planet} position={[planet.distance, 0, 0]} />
          <OrbitLine radius={planet.distance}/>
          </group>
        ))}
      </Selection>
    </Canvas>
  );
}

import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
import Planet from "./components/Planet";
import Background from "./components/Background";
import { useEffect, useRef, useState } from "react";
import Sun from "./components/Sun";
import AxisHelper from "./components/AxisHelper";
import GridHelper from "./components/GridHelper";
import OrbitLine from "./components/OrbitLine";
import { Object3D, Quaternion, Vector3, MathUtils } from "three";

const planets = [
  {
    name: "Mercury",
    size: 0.4,
    textureUrl: "/textures/mercury.jpg",
    nightTextureUrl: "/textures/mercury.jpg",
    distance: 10,
    speed: 2.0,
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
    speed: 0.075,
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
  const [target, setTarget] = useState(null);
  const [offset, setOffset] = useState(new Vector3(10, 10, 10));
  const [camPos, setCamPos] = useState(new Vector3(0, 0, 10));
  const [isAutoZoom, setIsAutoZoom] = useState(false);
  const [isOffsetCloneSet, setIsOffsetCloneSet] = useState(false);
  const [offsetClone, setOffsetClone] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(1);

  const setTargetPlanet = (targetPlanet) => {
    setTarget(targetPlanet);
    setOffset(camPos.clone().sub(targetPlanet.current.position));
    setElapsedTime(1);
    setIsAutoZoom(true);
    setIsOffsetCloneSet(false);
  }

  function CameraController() {
    const {camera} = useThree();
    const camRef = useRef();
    const [isRotating, setIsRotating] = useState(false);
    const maxDistance = 20;
    const minDistance = 5;

    const autoZoom = async () => {
      setOffset(offsetClone.clone().multiply(new Vector3(elapsedTime, elapsedTime, elapsedTime)));
    }

    useFrame((_, delta) => {
      setCamPos(camera.position);
      if (target) {
        const targetPosition = target.current.position;
        if (!isRotating) {
          camera.position.copy(targetPosition).add(offset);
          // camera.position.lerp(targetPosition.add(offset, 0.1));
        }
        else {
        }

        if (isAutoZoom) {
          if (!isOffsetCloneSet) {
            setOffsetClone(offset);
            setIsOffsetCloneSet(true);
          }
          setElapsedTime(MathUtils.damp(elapsedTime, 0, 0.9, 0.01));
          
          if (offset.length() > minDistance) {
            setOffset(offsetClone.clone().multiply(new Vector3(elapsedTime, elapsedTime, elapsedTime)));
          } else {
            setIsAutoZoom(false);
          }
        }

        camRef.current.target.copy(targetPosition);
        camRef.current.update();
      }
    })

    return <OrbitControls makeDefault = {true}
    ref={camRef}
    onStart={() => {
      setIsRotating(true);
      
      const handleScroll = (e) => { 
        if (e.deltaY < 0 && offset.length() > minDistance) {
          // console.log("up");
          setOffset(offset.clone().multiply(new Vector3(0.88, 0.88, 0.88)));
        } else if (e.deltaY > 0 && offset.length() < maxDistance) {
          // console.log("down")
          setOffset(offset.clone().multiply(new Vector3(1.2, 1.2, 1.2)));
        } else {
          setOffset(offset);
        }
      }
      window.addEventListener('wheel', handleScroll)
      return () => {
        window.removeEventListener('wheel', handleScroll)
      }
      // console.log("start");
    }}
    onChange={() => {
      
    }}
    onEnd={() => {
      setIsRotating(false);
      // offset.copy(camera.position.clone().sub(camRef.current.target));
      // offset = ;
      setOffset(camera.position.clone().sub(camRef.current.target));
    }}
    camera={camera}
    maxZoom={6}
    minZoom={2}
    />
  };

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 75 }}
      style={{ width: "100vw", height: "100vh" }}
    >
  
      <GridHelper size={500} divisions={10}/>
      <Background />
      <ambientLight intensity={0.1} />

      <CameraController/>
      {/* <OrbitControls/> */}

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
            
          <Planet  {...planet} position={[planet.distance, 0, 0]} handleClick={setTargetPlanet} />
          <OrbitLine radius={planet.distance}/>
          </group>
        ))}
      </Selection>
    </Canvas>
  );
}

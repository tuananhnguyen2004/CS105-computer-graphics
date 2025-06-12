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
import Background from "./components/Background";
import { createContext, useEffect, useRef, useState } from "react";
import Sun from "./components/Sun";
import AxisHelper from "./components/AxisHelper";
import Grid from "./components/Grid";
import OrbitLine from "./components/OrbitLine";
import { Object3D, Quaternion, Vector3, MathUtils, PCFShadowMap } from "three";
import CameraController from "./components/CameraController";
import SelectBar from "./components/SelectBar";
import ControlBar from "./components/ControlBar";
import PlanetInfoPanel from "./components/PlanetInfo";

import planets from "./data/formatedPlanets";
import rawPlanets from "./data/planets.json";
import AsteroidBelt from "./components/AsteroidBelt";
import Planet from "./components/planet";
import sun from "./data/sun.json";
import moons from "./data/moon.json";
import SceneController from "./components/SceneController";
import BackgroundMusic from "./components/BackgroundMusic";

export const SelectContext = createContext("SelectContext");

export default function App() {
  const [sceneRef, setSceneRef] = useState(null);
  const [speed, setSpeed] = useState(parseFloat(1 / 24));
  const [orbit, setOrbit] = useState(true);
  const [grid, setGrid] = useState(true);

  const [target, setTarget] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const selectPlanet = (name) => {
    if (!sceneRef) return;
    const ref = sceneRef.getObjectByName(name);

    if (ref) {
      setTarget(ref);

      setSelectedPlanet(
        [...rawPlanets, ...moons, sun].find((p) => p.name === name)
      );
    }
  };

  useEffect(() => {
    setSpeed(target ? 0 : 1);
  }, [target]);

  return (
    <SelectContext.Provider value={{ selectPlanet, systemSpeed: speed, orbit }}>
      <div>
        <SelectBar />
      </div>
      <ControlBar
        onChange={setSpeed}
        value={speed}
        grid={grid}
        orbit={orbit}
        toggleGrid={setGrid}
        toggleOrbit={setOrbit}
      />
      {target && (
        <button
          className="panel"
          onClick={() => {
            setTarget(null);
            setSelectedPlanet(null);
          }}
          style={{
            position: "fixed",
            zIndex: 50,
          }}
        >
          Back
        </button>
      )}

      <PlanetInfoPanel
        planetData={selectedPlanet}
      />
      <BackgroundMusic/>

      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ width: "100vw", height: "100vh" }}
        shadows
        gl={{ antialias: true }}
        onCreated={({ gl, camera }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = PCFShadowMap;
        }}
      >
        <SceneController onSceneReady={setSceneRef} />
        {grid && <Grid size={700} divisions={200} opacity={0.05} />}
        <Background />
        <ambientLight intensity={0.3} />

        <CameraController
          key={target ? target.uuid : "reset"}
          cameraTarget={target}
        />
        <Selection>
          <EffectComposer multisampling={8} autoClear={false}>
            {/* <Outline
              blur
              visibleEdgeColor="white"
              hiddenEdgeColor="gray"
              edgeStrength={100}
              width={2000}
            /> */}

            <Bloom
              intensity={5}
              kernelSize={1}
              radius={0.1}
              strength={0.1}
              luminanceThreshold={0.9}
              luminanceSmoothing={0.9}
            />

            <Sun systemSpeed={speed} handleClick={selectPlanet} />
          </EffectComposer>
        </Selection>
        {planets.map((planet, i) => {
          return (
            <group key={i}>
              <Planet {...planet} size={planet.size} systemSpeed={speed} />
            </group>
          );
        })}
        <AsteroidBelt count={1000} radius={20} systemSpeed={speed} />
      </Canvas>
    </SelectContext.Provider>
  );
}

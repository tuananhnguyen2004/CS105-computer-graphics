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
import CameraController from "./components/CameraController";
import SelectBar from "./components/SelectBar";
import ControlBar from "./components/ControlBar";

import planets from "./data/formatedPlanets";

export default function App() {
  const [target, setTarget] = useState(null);
  const [speed, setSpeed] = useState(1);
  const [orbit,setOrbit] = useState(true)
  const [grid,setGrid] = useState(true)
  const planetRefs = useRef({});


  const selectPlanet = (name) => {
    const ref = planetRefs.current[name];
    if (ref?.current) {
      setTarget(ref);
    }
  };

  useEffect(() => {
    if (target) {
      setSpeed(0);
    } else {
      setSpeed(1);
    }
  }, [target]);

  return (
    <>
      <SelectBar onSelect={selectPlanet} />
      <ControlBar onChange={setSpeed} value={speed} grid={grid} orbit={orbit} toggleGrid={setGrid} toggleOrbit={setOrbit} />
      {target && ( 
        <button
          className="panel"
          onClick={() => setTarget(null)}
          style={{
            position: "fixed",
            zIndex: 50,
          }}
        >
          Back
        </button>
      )}
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ width: "100vw", height: "100vh" }}
      >
        {grid && <GridHelper size={700} divisions={10} />}
        <Background />
        <ambientLight intensity={0.2} />

        <CameraController key={target ? target.uuid : "reset"} cameraTarget={target} />

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
              luminanceThreshold={0}
              luminanceSmoothing={0.9}
              intensity={1.5}
            />
          </EffectComposer>

          <Sun systemSpeed={speed} handleClick={setTarget} />

          {planets.map((planet, i) => {
            const planetRef = useRef();
            planetRefs.current[planet.name] = planetRef;
            console.log(planet.speed, planet.rotationSpeed, planet.name);
            return (
              <group key={i}>
                <Planet
                  {...planet}
                  size={ planet.size }
                  systemSpeed={speed}
                  outerRef={planetRef}
                  handleClick={setTarget}
                />
                {orbit && <OrbitLine radius={planet.distance}  tilt={-planet.inclination}/>}
              </group>
            );
          })}
        </Selection>
      </Canvas>
    </>
  );
}

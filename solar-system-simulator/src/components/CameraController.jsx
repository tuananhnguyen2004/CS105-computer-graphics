import { Html, OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Vector3, MathUtils } from "three";

export default function CameraController({ cameraTarget }) {
  const [target, setTarget] = useState(null);
  const [offset, setOffset] = useState(new Vector3(10, 10, 10));
  const [camPos, setCamPos] = useState(new Vector3(0, 0, 10));
  const [isAutoZoom, setIsAutoZoom] = useState(false);
  const [isOffsetCloneSet, setIsOffsetCloneSet] = useState(false);
  const [offsetClone, setOffsetClone] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(1);
  const { camera } = useThree();
  const camRef = useRef();
  const [isRotating, setIsRotating] = useState(false);
  const maxDistance = 20;
  const minDistance = 5;

  useEffect(() => {
    if (cameraTarget) {
      setTargetPlanet(cameraTarget);
    } 
  }, [cameraTarget]);

  const setTargetPlanet = (targetPlanet) => {
    setTarget(targetPlanet);
    setOffset(camPos.clone().sub(targetPlanet.current.position));
    setElapsedTime(1);
    setIsAutoZoom(true);
    setIsOffsetCloneSet(false);
  };

  useFrame((_, delta) => {
    setCamPos(camera.position);
    if (target) {
      const targetPosition = target.current.position;
      if (!isRotating) {
        camera.position.copy(targetPosition).add(offset);
        // camera.position.lerp(targetPosition.add(offset, 0.1));
      } else {
      }

      if (isAutoZoom) {
        if (!isOffsetCloneSet) {
          setOffsetClone(offset);
          setIsOffsetCloneSet(true);
        }
        setElapsedTime(MathUtils.damp(elapsedTime, 0, 0.9, 0.01));

        if (offset.length() > minDistance && offsetClone) {
          setOffset(
            offsetClone
              .clone()
              .multiply(new Vector3(elapsedTime, elapsedTime, elapsedTime))
          );
        } else {
          setIsAutoZoom(false);
          if (camRef.current) {
            camRef.current.enabled = true; // re-enable controls
          }
        }
      }

      camRef.current.target.copy(targetPosition);
      camRef.current.update();
    }
  });

  return (
    <>
      <OrbitControls
        makeDefault={true}
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
          };
          window.addEventListener("wheel", handleScroll);
          return () => {
            window.removeEventListener("wheel", handleScroll);
          };
          // console.log("start");
        }}
        onChange={() => {}}
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
    </>
  );
}

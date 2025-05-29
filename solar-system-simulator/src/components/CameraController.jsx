import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3, MathUtils, Box3 } from "three";

export default function CameraController({ cameraTarget }) {
  const { camera } = useThree();
  const camRef = useRef();

  const targetRef = useRef(null);
  const offsetRef = useRef(new Vector3(10, 10, 10));
  const offsetCloneRef = useRef(null);
  const elapsedTimeRef = useRef(1);
  const isAutoZoomRef = useRef(false);
  const isOffsetCloneSetRef = useRef(false);
  const isRotatingRef = useRef(false);
  const camPosRef = useRef(camera.position.clone());

  const maxDistance = 20;
  const minDistanceRef = useRef(5);

  // Set target when changed
  useEffect(() => {
    if (cameraTarget) {
      setTargetPlanet(cameraTarget);
    }
  }, [cameraTarget]);

  const setTargetPlanet = (targetPlanet) => {
    targetRef.current = targetPlanet;

    const worldTargetPos = new Vector3();
    targetPlanet.getWorldPosition(worldTargetPos);
    const newOffset = camPosRef.current.clone().sub(worldTargetPos);
    offsetRef.current.copy(newOffset);

    elapsedTimeRef.current = 1;
    isAutoZoomRef.current = true;
    isOffsetCloneSetRef.current = false;

    const box = new Box3().setFromObject(targetPlanet);
    const size = new Vector3();
    box.getSize(size);
    const largestDimension = Math.max(size.x, size.y, size.z);
    minDistanceRef.current = largestDimension * 1.5;

    if (camRef.current) {
      camRef.current.enabled = false;
    }
  };

  useFrame(() => {
    camPosRef.current.copy(camera.position);

    if (targetRef.current) {
      const worldTargetPos = new Vector3();
      targetRef.current.getWorldPosition(worldTargetPos);

      if (!isRotatingRef.current) {
        const desiredPos = worldTargetPos.clone().add(offsetRef.current);
        camera.position.lerp(desiredPos, 0.2);
      }

      // Auto-zoom logic
      if (isAutoZoomRef.current) {
        if (!isOffsetCloneSetRef.current) {
          offsetCloneRef.current = offsetRef.current.clone();
          isOffsetCloneSetRef.current = true;
        }

        elapsedTimeRef.current = MathUtils.damp(
          elapsedTimeRef.current,
          0,
          0.9,
          0.01
        );

        if (
          offsetRef.current.length() > minDistanceRef.current &&
          offsetCloneRef.current
        ) {
          offsetRef.current.copy(
            offsetCloneRef.current.clone().multiplyScalar(elapsedTimeRef.current)
          );
        } else {
          isAutoZoomRef.current = false;
          if (camRef.current) camRef.current.enabled = true;
        }
      }

      camRef.current.target.copy(worldTargetPos);
      camRef.current.update();
    }
  });

  useEffect(() => {
    const handleScroll = (e) => {
      if (!targetRef.current) return;

      const direction = e.deltaY < 0 ? 0.88 : 1.2;
      const newOffset = offsetRef.current.clone().multiplyScalar(direction);
      const length = newOffset.length();

      if (
        (e.deltaY < 0 && length > minDistanceRef.current) ||
        (e.deltaY > 0 && length < maxDistance)
      ) {
        offsetRef.current.copy(newOffset);
      }
    };

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, []);

  return (
    <OrbitControls
      makeDefault
      ref={camRef}
      camera={camera}
      onStart={() => {
        isRotatingRef.current = true;
      }}
      onEnd={() => {
        isRotatingRef.current = false;
        const target = camRef.current.target.clone();
        offsetRef.current.copy(camera.position.clone().sub(target));
      }}
      maxZoom={6}
      minZoom={minDistanceRef.current}
    />
  );
}

import { useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { AxesHelper } from "three";

export default function AxisHelper({ size = 5 }) {
  const { scene } = useThree();
  const helperRef = useRef();

  useEffect(() => {
    const axesHelper = new AxesHelper(size);
    scene.add(axesHelper);
    helperRef.current = axesHelper;

    return () => {
      scene.remove(axesHelper);
    };
  }, [scene, size]);

  return null;
}

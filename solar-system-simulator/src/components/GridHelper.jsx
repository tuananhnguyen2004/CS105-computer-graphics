import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { GridHelper } from "three";

export default function GridHelper({ size = 100, divisions = 100 }) {
  const { scene } = useThree();
  const gridRef = useRef();

  useEffect(() => {
    const gridHelper = new GridHelper(size, divisions);
    scene.add(gridHelper);
    gridRef.current = gridHelper;

    return () => {
      scene.remove(gridHelper);
    };
  }, [scene, size, divisions]);

  return null;
}

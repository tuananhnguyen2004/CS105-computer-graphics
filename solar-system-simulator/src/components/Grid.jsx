import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Color, GridHelper } from "three";

export default function Grid({ size = 100, divisions = 100, opacity = 0.2 }) {
  const { scene } = useThree();
  const gridRef = useRef();

  useEffect(() => {
    const gridHelper = new GridHelper(
      size,
      divisions,
      new Color(0xffffff),
      new Color(0x888888)
    );
    const materials = Array.isArray(gridHelper.material)
      ? gridHelper.material
      : [gridHelper.material];

    materials.forEach((mat) => {
      mat.transparent = true;
      mat.opacity = opacity;
      mat.depthWrite = false; // Optional
    });

    scene.add(gridHelper);
    gridRef.current = gridHelper;

    return () => {
      scene.remove(gridHelper);
    };
  }, [scene, size, divisions]);

  return null;
}

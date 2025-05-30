import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export default function SceneController({ onSceneReady }) {
  const { scene } = useThree();

  useEffect(() => {
    onSceneReady(scene);
  }, [scene, onSceneReady]);

  return null;
}

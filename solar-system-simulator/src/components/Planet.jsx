import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import {
  BackSide,
  Clock,
  MeshStandardMaterial,
  TextureLoader,
  Vector3,
} from "three";
import Outlined from "./Outline";
import SaturnRing from "./SaturnRing";
import Moon from "./Moon";
import OrbitLine from "./OrbitLine";
import Atmosphere from "./Atmosphere";
import { SelectContext } from "../App";

export default function Planet({
  id,
  name,
  texture,
  nightTexture = null,
  rotationSpeed = 0.01,
  speed = 0.01,
  distance,
  size,
  tilt, // Axial tilt
  inclination = 0,
  moonObject = [],
}) {
  const { selectPlanet, systemSpeed } = useContext(SelectContext);
  const dayMap = useLoader(TextureLoader, texture);
  const nightMap = useLoader(
    TextureLoader,
    nightTexture ? nightTexture : texture
  );
  const meshRef = useRef();
  const shaderRef = useRef(null);
  const rotationRef = useRef(); // For axial rotation and tilt
  const materialRef = useRef();

  const useSameMap = !nightTexture || nightTexture === texture; // Use same map for day and night if no night texture provided

  // Convert inclination from degrees to radians once
  const inclinationRad = inclination * (Math.PI / 180);

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current || !rotationRef.current)
      return;

    rotationRef.current.rotation.y += rotationSpeed * systemSpeed * delta;

    meshRef.current.rotation.y += speed * systemSpeed * delta; // Apply orbital rotation

    // // Update shader uniform
    // if (materialRef.current.uniforms.lightDirection) {
    //   materialRef.current.uniforms.lightDirection.value = direction;
    // }
  });

  const material = useMemo(() => {
    const mat = new MeshStandardMaterial({ map: dayMap });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.nightMap = { value: nightMap };
      shader.uniforms.lightDirection = { value: new Vector3(1, 0, 0) };
      shader.uniforms.useSameMap = { value: useSameMap };

      // Declare varyings at the top of vertex shader
      shader.vertexShader = shader.vertexShader.replace(
        "void main() {",
        `
    varying vec3 vNormalW;
    varying vec2 vUv;
    void main() {
      vNormalW = normalize(normalMatrix * normal);
      vUv = uv;
    `
      );

      // Declare uniforms and varyings at the top of fragment shader
      shader.fragmentShader = shader.fragmentShader.replace(
        "void main() {",
        `
    uniform sampler2D nightMap;
    uniform vec3 lightDirection;
    uniform bool useSameMap;
    varying vec3 vNormalW;
    varying vec2 vUv;
    void main() {
    `
      );

      // Replace map_fragment logic
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <map_fragment>",
        `
    #ifdef USE_MAP
      vec4 dayColor = texture2D(map, vUv);
      vec4 nightColor = texture2D(nightMap, vUv);

     

      float light = dot(normalize(vNormalW), normalize(lightDirection));
light = smoothstep(0.1, 0.3, light); // Adjust edges of the transition
vec4 color = mix(nightColor, dayColor, light);
      diffuseColor = color;
    #endif
    `
      );

      shaderRef.current = shader;
    };

    return mat;
  }, [dayMap, nightMap, useSameMap]);

  useFrame(({ camera }) => {
    if (shaderRef.current) {
      const planetPos = new Vector3();
      meshRef.current.getWorldPosition(planetPos);

      // Light direction in world space
      const sunPosition = new Vector3(0, 0, 0); // or wherever your sun is
      const lightDirWorld = new Vector3()
        .subVectors(sunPosition, planetPos)
        .normalize();

      // Transform light direction into view space
      const lightDirView = lightDirWorld
        .clone()
        .transformDirection(camera.matrixWorldInverse);

      // Update shader uniform
      shaderRef.current.uniforms.lightDirection.value.copy(lightDirView);
    }
  });

  return (
    <Outlined>
      <group
        ref={meshRef}
        castShadow
        receiveShadow
        rotation={[inclination * (Math.PI / 180), 0, 0]}
        onDoubleClick={() => {
          selectPlanet(name);
        }}
      >
        <group position={[distance, 0, 0]}>
          <mesh
            name={name}
            ref={rotationRef}
            rotation={[tilt * (Math.PI / 180), 0, 0]}
            castShadow
            receiveShadow
          >
            <sphereGeometry args={[size, 64, 64]} />
            {/* <meshStandardMaterial  map={dayMap} /> */}
            <primitive object={material} ref={materialRef} />
            <mesh>
              <sphereGeometry args={[size * 1.01, 64, 64]} />
              <meshStandardMaterial
                receiveShadow
                color={"#00ffff"} // Glow color
                side={BackSide} // Render backside for halo effect
                transparent={true}
                opacity={0.5}
                toneMapped={false} // Keep glow brightness consistent
                depthWrite={false}
              />
            </mesh>
            {name === "Saturn" && <SaturnRing planetSize={size} />}
            <Atmosphere name={name} parentSize={size} />
          </mesh>
          {moonObject.map((moon, index) => (
            <Moon key={index} parentSize={size} {...moon} />
          ))}
        </group>
      </group>
    </Outlined>
  );
}

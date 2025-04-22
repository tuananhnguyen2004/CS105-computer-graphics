import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { Vector3 } from "three";

const PlanetMaterial = shaderMaterial(
  {
    dayMap: null,
    nightMap: null,
    lightDirection: new Vector3(1, 0, 0),
    useSameMap: false,
  },
  // vertex shader
  `
    varying vec3 vWorldNormal;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vWorldNormal = normalize(mat3(modelMatrix) * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  `
    uniform sampler2D dayMap;
    uniform sampler2D nightMap;
    uniform vec3 lightDirection;
    uniform bool useSameMap;

    varying vec3 vWorldNormal;
    varying vec2 vUv;

    void main() {
      vec3 normal = normalize(vWorldNormal);
      float light = dot(normal, normalize(lightDirection));

      vec4 dayColor = texture2D(dayMap, vUv);
      vec4 nightColor = texture2D(nightMap, vUv);

      if (useSameMap) {
        nightColor.rgb *= 0.05;
      }

      vec4 color = mix(nightColor, dayColor, clamp(light, 0.0, 1.0));
      gl_FragColor = color;
    }
  `
);


extend({ PlanetMaterial });

export { PlanetMaterial };

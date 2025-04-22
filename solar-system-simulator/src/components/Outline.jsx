// components/Outlined.js
import { useRef, useState } from "react";
import { Select } from "@react-three/postprocessing";

export default function Outlined({ children }) {
  const [hovered, setHovered] = useState(false);

  const handleChange = (value) => {
    if (hovered !== value) {
        setHovered(value);
    }
  };
  return (
    <Select>
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          handleChange(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          handleChange(false);
        }}
      >
        {children}
      </group>
    </Select>
  );
}

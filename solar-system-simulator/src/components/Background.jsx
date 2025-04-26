import { Canvas, useThree } from '@react-three/fiber'
import { useLoader } from '@react-three/fiber'
import { BackSide, TextureLoader } from 'three'
import React, { useEffect } from 'react'

export default function Background() {
  const texture = useLoader(TextureLoader, '/textures/stars_milky_way.jpg')

  return (
    <mesh>
      <sphereGeometry args={[700, 60, 40]} />
      <meshBasicMaterial map={texture} side={BackSide} />
    </mesh>
  )
}

// src/components/Terrain.tsx

import React from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import colorTexture from '../assets/textures/groundTexture.jpg';
import displacementTexture from '../assets/textures/displacementTexture.jpeg';

interface TerrainProps {
  position: [number, number, number];
}

const Terrain: React.FC<TerrainProps> = ({ position }) => {
  // Load textures
  const colorMap = useLoader(TextureLoader, colorTexture);
  const displacementMap = useLoader(TextureLoader, displacementTexture);

  return (
    <mesh position={position} receiveShadow rotation-x={-Math.PI / 2}>
      <planeGeometry args={[50, 50, 256, 256]} />
      <meshStandardMaterial
        map={colorMap}
        displacementMap={displacementMap}
        displacementScale={2} // Adjust the scale for more or less dramatic hills
      />
    </mesh>
  );
};

export default Terrain;

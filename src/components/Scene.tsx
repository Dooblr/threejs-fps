// src/components/Scene.tsx

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Player from './Player';
import Terrain from './Terrain';

// Import the EXR file
import environmentMap from '../assets/environments/rosendal_plains_2_4k.exr';

const Scene: React.FC = () => {
  const gridSize = 4; // Number of tiles in one dimension
  const tileSize = 50; // Size of each tile (same as the planeGeometry in Terrain)

  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
      {/* Use the Environment component to load the EXR file */}
      <Environment
        files={environmentMap} // Use the imported EXR file
        background // Use EXR as the background
      />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <Player />

      {/* Render the grid of terrain */}
      {Array.from({ length: gridSize }).map((_, rowIndex) =>
        Array.from({ length: gridSize }).map((_, colIndex) => (
          <Terrain
            key={`terrain-${rowIndex}-${colIndex}`}
            position={[
              colIndex * tileSize - (tileSize * (gridSize - 1)) / 2,
              0,
              rowIndex * tileSize - (tileSize * (gridSize - 1)) / 2,
            ]}
          />
        ))
      )}

      <OrbitControls maxPolarAngle={Math.PI / 2.1} /> {/* Limit vertical rotation */}
    </Canvas>
  );
};

export default Scene;

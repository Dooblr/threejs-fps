// src/components/Overlay.tsx

import React from 'react';

interface OverlayProps {
  bulletsCount: number;
  bombsCount: number;
  explosionsCount: number;
}

const Overlay: React.FC<OverlayProps> = ({ bulletsCount, bombsCount, explosionsCount }) => {
  return (
    <div className="overlay">
      <div>Bullets: {bulletsCount}</div>
      <div>Bombs: {bombsCount}</div>
      <div>Explosions: {explosionsCount}</div>
    </div>
  );
};

export default Overlay;

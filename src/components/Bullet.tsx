// src/components/Bullet.tsx

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

interface BulletProps {
  position: Vector3;
  direction: Vector3;
}

const Bullet: React.FC<BulletProps> = ({ position, direction }) => {
  const bulletRef = useRef<any>(null);

  useFrame(() => {
    if (bulletRef.current) {
      bulletRef.current.position.add(direction);
    }
  });

  return (
    <mesh ref={bulletRef} position={position}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

export default Bullet;

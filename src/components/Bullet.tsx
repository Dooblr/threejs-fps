// src/components/Bullet.tsx

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Mesh } from 'three';

interface BulletProps {
  position: Vector3;
  direction: Vector3;
  onCollision: (position: Vector3) => void;
}

const Bullet: React.FC<BulletProps> = ({ position, direction, onCollision }) => {
  const bulletRef = useRef<Mesh | null>(null);

  useFrame(() => {
    if (bulletRef.current) {
      bulletRef.current.position.add(direction);
    }
  });

  // Cleanup bullet if out of bounds
  useEffect(() => {
    const interval = setInterval(() => {
      if (bulletRef.current) {
        const { x, y, z } = bulletRef.current.position;
        if (Math.abs(x) > 50 || Math.abs(y) > 50 || Math.abs(z) > 50) {
          onCollision(bulletRef.current.position);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onCollision]);

  return (
    <mesh ref={bulletRef} position={position}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

export default Bullet;

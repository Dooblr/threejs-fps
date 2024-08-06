// src/components/Bullet.tsx

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, BufferGeometry, Float32BufferAttribute, LineBasicMaterial, Line, Mesh } from 'three';

interface BulletProps {
  position: Vector3;
  direction: Vector3;
  onHit: (enemyIndex: number) => void; // Callback for when a bullet hits an enemy
}

const Bullet: React.FC<BulletProps> = ({ position, direction, onHit }) => {
  const bulletRef = useRef<Mesh | null>(null);
  const trailRef = useRef<Line<BufferGeometry, LineBasicMaterial> | null>(null);

  useEffect(() => {
    const trailGeometry = new BufferGeometry();
    const trailVertices = new Float32Array(20 * 3); // 20 segments for the trail
    trailGeometry.setAttribute('position', new Float32BufferAttribute(trailVertices, 3));
    const trailMaterial = new LineBasicMaterial({ color: 'orange' });

    const trail = new Line(trailGeometry, trailMaterial);
    trailRef.current = trail;

    if (bulletRef.current) {
      bulletRef.current.add(trail);
    }

    // Set a timer to remove the trail after 2 seconds
    const trailTimeout = setTimeout(() => {
      if (bulletRef.current && trailRef.current) {
        bulletRef.current.remove(trailRef.current);
      }
    }, 2000);

    // Clean up on unmount or when trail expires
    return () => {
      clearTimeout(trailTimeout);
      if (bulletRef.current && trailRef.current) {
        bulletRef.current.remove(trailRef.current);
      }
    };
  }, []);

  useFrame(() => {
    if (bulletRef.current) {
      bulletRef.current.position.add(direction);
    }
  });

  return (
    <mesh ref={bulletRef} position={position}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

export default Bullet;

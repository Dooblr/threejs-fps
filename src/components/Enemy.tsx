// src/components/Enemy.tsx

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';

interface EnemyProps {
  position: Vector3;
  playerPosition: Vector3;
  onRemove: (position: Vector3) => void;
  onHit: () => void;
}

const Enemy: React.FC<EnemyProps> = ({ position, playerPosition, onRemove, onHit }) => {
  const enemyRef = useRef<Mesh | null>(null);
  const [hp, setHp] = useState(3); // Each enemy starts with 3 HP
  const [isHit, setIsHit] = useState(false);
  const speed = 0.02; // Speed at which the enemy moves towards the player

  // Move the enemy towards the player
  useFrame(() => {
    if (enemyRef.current) {
      const direction = new Vector3().subVectors(playerPosition, enemyRef.current.position).normalize();
      enemyRef.current.position.add(direction.multiplyScalar(speed));
    }
  });

  // Change color based on hit status
  useFrame(() => {
    if (enemyRef.current) {
      enemyRef.current.material.color.set(isHit ? 'red' : 'green');
    }
  });

  // Handle being hit by a bullet
  const handleHit = () => {
    setHp((prevHp) => prevHp - 1);
    setIsHit(true);
    setTimeout(() => setIsHit(false), 100); // Flash red for 100ms
    onHit();

    if (hp - 1 <= 0) {
      onRemove(position);
    }
  };

  return (
    <mesh ref={enemyRef} position={position}>
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
};

export default Enemy;

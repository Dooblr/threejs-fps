// src/components/Enemy.tsx

import React, { useState } from 'react';
import { useBox } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';

interface EnemyProps {
  position: Vector3;
  playerPosition: Vector3;
  onRemove: () => void;
}

const Enemy: React.FC<EnemyProps> = ({ position, playerPosition, onRemove }) => {
  const [hp, setHp] = useState(3);
  const [isHit, setIsHit] = useState(false);

  const [ref, api] = useBox<Mesh>(() => ({
    mass: 1,
    position: position.toArray(),
    args: [3, 3, 3],
    onCollide: (e) => {
      if (e.body?.userData?.type === 'bullet') {
        handleHit();
      }
    },
  }));

  // Move the enemy towards the player
  useFrame(() => {
    if (ref.current) {
      const direction = new Vector3().subVectors(playerPosition, ref.current.position).normalize();
      api.velocity.set(direction.x * 2, 0, direction.z * 2);
    }
  });

  const handleHit = () => {
    setHp((prevHp) => prevHp - 1);
    setIsHit(true);
    setTimeout(() => setIsHit(false), 100); // Flash red for 100ms
    if (hp - 1 <= 0) {
      onRemove();
    }
  };

  return (
    <mesh ref={ref}>
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial color={isHit ? 'red' : 'green'} />
    </mesh>
  );
};

export default Enemy;

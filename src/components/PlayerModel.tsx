// src/components/PlayerModel.tsx

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface PlayerModelProps {
  isMoving: boolean;
}

const PlayerModel: React.FC<PlayerModelProps> = ({ isMoving }) => {
  // Create refs for each limb segment to animate
  const upperLeftArmRef = useRef<Mesh>(null);
  const lowerLeftArmRef = useRef<Mesh>(null);
  const upperRightArmRef = useRef<Mesh>(null);
  const lowerRightArmRef = useRef<Mesh>(null);
  const upperLeftLegRef = useRef<Mesh>(null);
  const lowerLeftLegRef = useRef<Mesh>(null);
  const upperRightLegRef = useRef<Mesh>(null);
  const lowerRightLegRef = useRef<Mesh>(null);
  const torsoRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const swingSpeed = 6; // Swing speed for walking/running animation
    const armSwing = Math.sin(time * swingSpeed) * 0.8; // Arm swing amplitude
    const legSwing = Math.cos(time * swingSpeed) * 0.8; // Leg swing amplitude
    const lowerLimbSwing = Math.sin(time * swingSpeed) * 0.5; // Lower limb swing amplitude
    const torsoTilt = Math.sin(time * swingSpeed) * 0.05;

    if (isMoving) {
      // Torso slight forward tilt
      if (torsoRef.current) {
        torsoRef.current.rotation.z = torsoTilt;
      }

      // Arms swing back and forth
      if (upperLeftArmRef.current && upperRightArmRef.current) {
        upperLeftArmRef.current.rotation.x = armSwing;
        upperRightArmRef.current.rotation.x = -armSwing;
      }

      // Lower arms swing slightly for natural movement
      if (lowerLeftArmRef.current && lowerRightArmRef.current) {
        lowerLeftArmRef.current.rotation.x = -lowerLimbSwing;
        lowerRightArmRef.current.rotation.x = lowerLimbSwing;
      }

      // Legs swing opposite to arms
      if (upperLeftLegRef.current && upperRightLegRef.current) {
        upperLeftLegRef.current.rotation.x = -legSwing;
        upperRightLegRef.current.rotation.x = legSwing;
      }

      // Lower legs swing slightly for natural movement
      if (lowerLeftLegRef.current && lowerRightLegRef.current) {
        lowerLeftLegRef.current.rotation.x = lowerLimbSwing;
        lowerRightLegRef.current.rotation.x = -lowerLimbSwing;
      }
    } else {
      // Reset limb positions when not moving
      if (torsoRef.current) {
        torsoRef.current.rotation.z = 0;
      }

      if (upperLeftArmRef.current && upperRightArmRef.current) {
        upperLeftArmRef.current.rotation.x = 0;
        upperRightArmRef.current.rotation.x = 0;
      }

      if (lowerLeftArmRef.current && lowerRightArmRef.current) {
        lowerLeftArmRef.current.rotation.x = 0;
        lowerRightArmRef.current.rotation.x = 0;
      }

      if (upperLeftLegRef.current && upperRightLegRef.current) {
        upperLeftLegRef.current.rotation.x = 0;
        upperRightLegRef.current.rotation.x = 0;
      }

      if (lowerLeftLegRef.current && lowerRightLegRef.current) {
        lowerLeftLegRef.current.rotation.x = 0;
        lowerRightLegRef.current.rotation.x = 0;
      }
    }
  });

  return (
    <group>
      {/* Head */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="peachpuff" />
      </mesh>

      {/* Torso */}
      <mesh ref={torsoRef} position={[0, 1, 0]}>
        <boxGeometry args={[0.6, 1, 0.3]} />
        <meshStandardMaterial color="blue" />
      </mesh>

      {/* Upper Left Arm */}
      <mesh ref={upperLeftArmRef} position={[-0.37, 1.3, 0]}>
        <boxGeometry args={[0.15, 0.4, 0.2]} />
        <meshStandardMaterial color="blue" />
      </mesh>

      {/* Lower Left Arm */}
      <mesh ref={lowerLeftArmRef} position={[-0.37, 1, 0]}>
        <boxGeometry args={[0.15, 0.4, 0.2]} />
        <meshStandardMaterial color="blue" />
      </mesh>

      {/* Upper Right Arm */}
      <mesh ref={upperRightArmRef} position={[0.37, 1.3, 0]}>
        <boxGeometry args={[0.15, 0.4, 0.2]} />
        <meshStandardMaterial color="blue" />
      </mesh>

      {/* Lower Right Arm */}
      <mesh ref={lowerRightArmRef} position={[0.37, 1, 0]}>
        <boxGeometry args={[0.15, 0.4, 0.2]} />
        <meshStandardMaterial color="blue" />
      </mesh>

      {/* Upper Left Leg */}
      <mesh ref={upperLeftLegRef} position={[-0.2, 0.5, 0]}>
        <boxGeometry args={[0.2, 0.5, 0.2]} />
        <meshStandardMaterial color="blue" />
      </mesh>

      {/* Lower Left Leg */}
      <mesh ref={lowerLeftLegRef} position={[-0.2, 0, 0]}>
        <boxGeometry args={[0.2, 0.5, 0.2]} />
        <meshStandardMaterial color="blue" />
      </mesh>

      {/* Upper Right Leg */}
      <mesh ref={upperRightLegRef} position={[0.2, 0.5, 0]}>
        <boxGeometry args={[0.2, 0.5, 0.2]} />
        <meshStandardMaterial color="blue" />
      </mesh>

      {/* Lower Right Leg */}
      <mesh ref={lowerRightLegRef} position={[0.2, 0, 0]}>
        <boxGeometry args={[0.2, 0.5, 0.2]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </group>
  );
};

export default PlayerModel;

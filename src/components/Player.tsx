// src/components/Player.tsx

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import Bullet from './Bullet';
import gunshotSound from '../assets/audio/gunshot_1.mp3'; // Import the gunshot sound

const Player: React.FC = () => {
  const playerRef = useRef<any>(null);
  const [bullets, setBullets] = useState<any[]>([]);
  const { camera, gl } = useThree(); // Access the WebGL renderer to manage focus
  const speed = 0.1;
  const rotationSpeed = 0.05;
  const direction = useRef(new Vector3());
  const playerPosition = new Vector3();
  const rotation = useRef(0);

  // Create an audio instance
  const gunshotAudio = useRef(new Audio(gunshotSound));

  // Handle key press and release
  const handleInput = useCallback((event: KeyboardEvent, isKeyDown: boolean) => {
    const velocity = isKeyDown ? speed : 0;
    const rotationVelocity = isKeyDown ? rotationSpeed : 0;

    switch (event.code) {
      case 'KeyW':
        direction.current.z = -velocity;
        break;
      case 'KeyS':
        direction.current.z = velocity;
        break;
      case 'KeyQ':
        direction.current.x = -velocity;
        break;
      case 'KeyE':
        direction.current.x = velocity;
        break;
      case 'KeyA':
        rotation.current = rotationVelocity;
        break;
      case 'KeyD':
        rotation.current = -rotationVelocity;
        break;
    }
  }, []);

  // Handle shooting
  const handleMouseClick = useCallback((event: MouseEvent) => {
    event.preventDefault(); // Prevent default behavior to keep focus
    if (playerRef.current) {
      const bulletPosition = playerRef.current.position.clone();
      const bulletDirection = new Vector3(0, 0, -1).applyQuaternion(playerRef.current.quaternion).normalize();
      setBullets((prevBullets) => [...prevBullets, { position: bulletPosition, direction: bulletDirection }]);

      // Play the gunshot sound
      gunshotAudio.current.currentTime = 0; // Reset time to allow immediate replay
      gunshotAudio.current.play();
    }

    // Re-focus the canvas to ensure key events continue to be captured
    gl.domElement.focus();
  }, [gl]);

  // Add event listeners
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => handleInput(event, true);
    const handleKeyUp = (event: KeyboardEvent) => handleInput(event, false);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    gl.domElement.addEventListener('mousedown', handleMouseClick);

    // Make the canvas focusable and set focus initially
    gl.domElement.tabIndex = 0;
    gl.domElement.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      gl.domElement.removeEventListener('mousedown', handleMouseClick);
    };
  }, [gl, handleInput, handleMouseClick]);

  // Update player position and camera position
  useFrame(() => {
    if (playerRef.current) {
      playerRef.current.rotation.y += rotation.current;

      const forward = new Vector3(0, 0, 1).applyQuaternion(playerRef.current.quaternion).multiplyScalar(direction.current.z);
      const strafe = new Vector3(1, 0, 0).applyQuaternion(playerRef.current.quaternion).multiplyScalar(direction.current.x);

      playerRef.current.position.add(forward).add(strafe);
      playerRef.current.getWorldPosition(playerPosition);

      // Set camera to follow the player with rotation
      const cameraOffset = new Vector3(0, 3, 5).applyQuaternion(playerRef.current.quaternion);
      camera.position.copy(playerPosition).add(cameraOffset);
      camera.lookAt(playerPosition);
    }
  });

  return (
    <>
      <mesh ref={playerRef} position={[0, 1, 0]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      {/* Render bullets */}
      {bullets.map((bullet, index) => (
        <Bullet key={index} position={bullet.position} direction={bullet.direction} />
      ))}
    </>
  );
};

export default Player;

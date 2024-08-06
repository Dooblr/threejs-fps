// src/components/Player.tsx

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, PerspectiveCamera, Mesh } from 'three';
import Bullet from './Bullet';
import Bomb from './Bomb';
import Particles from './Particles';
import Enemy from './Enemy';
import PlayerModel from './PlayerModel';
import gunshotSound from '../assets/audio/gunshot_1.mp3';

const Player: React.FC = () => {
  const playerRef = useRef<Mesh | null>(null);
  const [bullets, setBullets] = useState<{ position: Vector3; direction: Vector3 }[]>([]);
  const [bombs, setBombs] = useState<Vector3[]>([]);
  const [explosions, setExplosions] = useState<Vector3[]>([]);
  const [enemies, setEnemies] = useState<{ position: Vector3; hp: number }[]>([]);
  const [playerHealth, setPlayerHealth] = useState<number>(10);
  const { camera, gl } = useThree();
  const speed = 0.1;
  const rotationSpeed = 0.05;
  const direction = useRef(new Vector3());
  const playerPosition = useRef(new Vector3());
  const rotation = useRef(0);
  const zoomSensitivity = 0.1;
  const [isMoving, setIsMoving] = useState<boolean>(false);

  const keysPressed = useRef<{ [key: string]: boolean }>({});

  const isJumping = useRef(false);
  const verticalVelocity = useRef(0);
  const gravity = 0.015;
  const jumpStrength = 0.5;

  const gunshotAudio = useRef(new Audio(gunshotSound));

  const dropBomb = () => {
    if (playerRef.current) {
      const bombPosition = playerRef.current.position.clone();
      setBombs((prevBombs) => [...prevBombs, bombPosition]);
    }
  };

  const handleExplode = (position: Vector3) => {
    setExplosions((prevExplosions) => [...prevExplosions, position]);
    setBombs((prevBombs) => prevBombs.filter((bomb) => !bomb.equals(position)));
  };

  const updateMovement = useCallback(() => {
    const velocity = keysPressed.current['KeyW'] || keysPressed.current['KeyS'] ? speed : 0;
    const strafeVelocity = keysPressed.current['KeyQ'] || keysPressed.current['KeyE'] ? speed : 0;
    const rotationVelocity = keysPressed.current['KeyA'] || keysPressed.current['KeyD'] ? rotationSpeed : 0;

    direction.current.z = keysPressed.current['KeyW'] ? -velocity : keysPressed.current['KeyS'] ? velocity : 0;
    direction.current.x = keysPressed.current['KeyQ'] ? -strafeVelocity : keysPressed.current['KeyE'] ? strafeVelocity : 0;
    rotation.current = keysPressed.current['KeyA'] ? rotationVelocity : keysPressed.current['KeyD'] ? -rotationVelocity : 0;

    const moving = !!(direction.current.z || direction.current.x || rotation.current);
    setIsMoving(moving);
  }, []);

  const handleInput = useCallback(
    (event: KeyboardEvent, isKeyDown: boolean) => {
      keysPressed.current[event.code] = isKeyDown;
      updateMovement();

      if (event.code === 'Space' && !isJumping.current && isKeyDown) {
        verticalVelocity.current = jumpStrength;
        isJumping.current = true;
      }

      if (event.code === 'KeyF' && isKeyDown) {
        dropBomb();
      }
    },
    [updateMovement]
  );

  const handleMouseClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      if (playerRef.current) {
        const bulletPosition = playerRef.current.position.clone();
        const bulletDirection = new Vector3(0, 0, -1)
          .applyQuaternion(playerRef.current.quaternion)
          .normalize();
        setBullets((prevBullets) => [
          ...prevBullets,
          { position: bulletPosition, direction: bulletDirection },
        ]);

        gunshotAudio.current.currentTime = 0;
        gunshotAudio.current.play();
      }

      gl.domElement.focus();
    },
    [gl]
  );

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();

      if (camera instanceof PerspectiveCamera) {
        camera.fov = Math.min(
          Math.max(camera.fov + event.deltaY * zoomSensitivity, 50),
          100
        );
        camera.updateProjectionMatrix();
      }
    },
    [camera]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => handleInput(event, true);
    const handleKeyUp = (event: KeyboardEvent) => handleInput(event, false);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    gl.domElement.addEventListener('mousedown', handleMouseClick);
    gl.domElement.addEventListener('wheel', handleWheel);

    gl.domElement.tabIndex = 0;
    gl.domElement.focus();

    if (camera instanceof PerspectiveCamera) {
      camera.fov = 100;
      camera.updateProjectionMatrix();
    }

    const interval = setInterval(() => {
      const x = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      const newEnemyPosition = new Vector3(x, 1, z);
      setEnemies((prevEnemies) => [...prevEnemies, { position: newEnemyPosition, hp: 3 }]);
    }, 5000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      gl.domElement.removeEventListener('mousedown', handleMouseClick);
      gl.domElement.removeEventListener('wheel', handleWheel);
      clearInterval(interval);
    };
  }, [gl, handleInput, handleMouseClick, handleWheel, camera]);

  useFrame(() => {
    if (playerRef.current) {
      playerRef.current.rotation.y += rotation.current;

      const forward = new Vector3(0, 0, 1)
        .applyQuaternion(playerRef.current.quaternion)
        .multiplyScalar(direction.current.z);
      const strafe = new Vector3(1, 0, 0)
        .applyQuaternion(playerRef.current.quaternion)
        .multiplyScalar(direction.current.x);

      playerRef.current.position.add(forward).add(strafe);

      if (isJumping.current || playerRef.current.position.y > 1) {
        verticalVelocity.current -= gravity;
        playerRef.current.position.y += verticalVelocity.current;

        if (playerRef.current.position.y <= 1) {
          playerRef.current.position.y = 1;
          verticalVelocity.current = 0;
          isJumping.current = false;
        }
      }

      playerRef.current.getWorldPosition(playerPosition.current);

      const cameraOffset = new Vector3(0, 3, 5).applyQuaternion(
        playerRef.current.quaternion
      );
      camera.position.copy(playerPosition.current).add(cameraOffset);
      camera.lookAt(playerPosition.current);
    }
  });

  // Handle bullet hitting an enemy
  const handleBulletHit = (bulletPosition: Vector3) => {
    setEnemies((prevEnemies) => {
      return prevEnemies.map((enemy, index) => {
        if (bulletPosition.distanceTo(enemy.position) < 1.5) {
          enemy.hp -= 1;
          if (enemy.hp <= 0) {
            setEnemies((prevEnemies) => prevEnemies.filter((_, i) => i !== index));
          }
          return { ...enemy, hp: enemy.hp - 1 };
        }
        return enemy;
      });
    });
  };

  // Handle enemy touching the player
  const handleEnemyCollision = (enemyIndex: number) => {
    setPlayerHealth((prevHealth) => Math.max(0, prevHealth - 1));
    const newEnemies = [...enemies];
    const enemy = newEnemies[enemyIndex];
    // Push enemy away from the player
    const pushDirection = new Vector3()
      .subVectors(enemy.position, playerPosition.current)
      .normalize()
      .multiplyScalar(2); // Adjust push strength as needed
    enemy.position.add(pushDirection);
    setEnemies(newEnemies);
  };

  // Update bullets and check for collisions
  useFrame(() => {
    setBullets((prevBullets) => {
      return prevBullets.filter((bullet) => {
        let hit = false;
        setEnemies((prevEnemies) => {
          return prevEnemies.map((enemy, index) => {
            if (bullet.position.distanceTo(enemy.position) < 1.5) {
              handleBulletHit(bullet.position);
              hit = true;
            }
            return enemy;
          });
        });
        return !hit; // Remove bullet if it hit
      });
    });

    // Check for collisions between player and enemies
    enemies.forEach((enemy, index) => {
      if (playerPosition.current.distanceTo(enemy.position) < 1.5) { // Adjust distance as necessary
        handleEnemyCollision(index);
      }
    });
  });

  return (
    <>
      <mesh ref={playerRef} position={[0, 1, 0]} castShadow>
        <PlayerModel isMoving={isMoving} />
      </mesh>
      {bullets.map((bullet, index) => (
        <Bullet
          key={index}
          position={bullet.position}
          direction={bullet.direction}
          onCollision={(position) => handleBulletHit(position)}
        />
      ))}
      {bombs.map((bombPosition, index) => (
        <Bomb key={index} position={bombPosition} onExplode={handleExplode} />
      ))}
      {explosions.map((explosionPosition, index) => (
        <Particles
          key={index}
          position={explosionPosition}
          onEnd={() => {
            setExplosions((prevExplosions) =>
              prevExplosions.filter((_, i) => i !== index)
            );
          }}
        />
      ))}
      {enemies.map((enemy, index) => (
        <Enemy
          key={index}
          position={enemy.position}
          playerPosition={playerPosition.current}
          onRemove={() => handleBulletHit(enemy.position)}
          onHit={() => handleBulletHit(enemy.position)}
        />
      ))}
      {/* Move the health bar display outside the Canvas */}
    </>
  );
};

export default Player;

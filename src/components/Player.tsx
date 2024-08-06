import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, PerspectiveCamera, Mesh } from 'three';
import Bullet from './Bullet';
import Bomb from './Bomb';
import Particles from './Particles';
import gunshotSound from '../assets/audio/gunshot_1.mp3';

const PlayerModel: React.FC<{ isMoving: boolean }> = ({ isMoving }) => {
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

const Player: React.FC = () => {
  const playerRef = useRef<any>(null);
  const [bullets, setBullets] = useState<any[]>([]);
  const [bombs, setBombs] = useState<Vector3[]>([]);
  const [explosions, setExplosions] = useState<Vector3[]>([]);
  const { camera, gl } = useThree();
  const speed = 0.1;
  const rotationSpeed = 0.05;
  const direction = useRef(new Vector3());
  const playerPosition = new Vector3();
  const rotation = useRef(0);
  const zoomSensitivity = 0.1;
  const [isMoving, setIsMoving] = useState<boolean>(false);

  // Track pressed keys
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // Jumping state
  const isJumping = useRef(false);
  const verticalVelocity = useRef(0);
  const gravity = 0.015; // Gravity strength
  const jumpStrength = 0.5; // Initial jump velocity

  const gunshotAudio = useRef(new Audio(gunshotSound));

  const dropBomb = () => {
    if (playerRef.current) {
      const bombPosition = playerRef.current.position.clone();
      setBombs((prevBombs) => [...prevBombs, bombPosition]);
    }
  };

  const handleExplode = (position: Vector3) => {
    setExplosions((prevExplosions) => [...prevExplosions, position]);
    // Remove the bomb from the state
    setBombs((prevBombs) =>
      prevBombs.filter((bomb) => !bomb.equals(position))
    );
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
        ); // Adjust FOV limits
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

    // Set initial focus on the canvas
    gl.domElement.tabIndex = 0;
    gl.domElement.focus();

    // Set initial FOV to maximum
    if (camera instanceof PerspectiveCamera) {
      camera.fov = 100; // Set this to your maximum FOV value
      camera.updateProjectionMatrix();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      gl.domElement.removeEventListener('mousedown', handleMouseClick);
      gl.domElement.removeEventListener('wheel', handleWheel);
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

      // Apply gravity and vertical movement
      if (isJumping.current || playerRef.current.position.y > 1) {
        // Allow player to drop to terrain
        verticalVelocity.current -= gravity; // Apply gravity
        playerRef.current.position.y += verticalVelocity.current;

        // Check if player has landed on the ground
        if (playerRef.current.position.y <= 1) {
          // Adjusted to player's initial position
          playerRef.current.position.y = 1;
          verticalVelocity.current = 0;
          isJumping.current = false;
        }
      }

      playerRef.current.getWorldPosition(playerPosition);

      const cameraOffset = new Vector3(0, 3, 5).applyQuaternion(
        playerRef.current.quaternion
      );
      camera.position.copy(playerPosition).add(cameraOffset);
      camera.lookAt(playerPosition);
    }
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
          direction={bullet.direction} onHit={function (enemyIndex: number): void {
            throw new Error("Function not implemented.");
          } }        />
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
    </>
  );
};

export default Player

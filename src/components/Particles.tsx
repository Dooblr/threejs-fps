import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferGeometry, Color, Float32BufferAttribute, Points, PointsMaterial, Vector3 } from 'three';

interface ParticlesProps {
  position: Vector3;
  onEnd: () => void;
}

const Particles: React.FC<ParticlesProps> = ({ position, onEnd }) => {
  const particlesRef = useRef<Points | null>(null);
  const velocity = useRef<Vector3[]>([]);

  useEffect(() => {
    const numParticles = 50; // Set the number of particles to 50
    const geometry = new BufferGeometry();
    const vertices = new Float32Array(numParticles * 3);
    const colorArray = new Float32Array(numParticles * 3);

    // Initialize particles at the explosion's position with random velocities and colors
    for (let i = 0; i < numParticles; i++) {
      vertices[i * 3] = position.x;
      vertices[i * 3 + 1] = position.y;
      vertices[i * 3 + 2] = position.z;

      // Random velocity with higher spread
      const randomVelocity = new Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize().multiplyScalar(5); // Increase spread and speed

      velocity.current.push(randomVelocity);

      const color = new Color(
        Math.random(),
        Math.random(),
        Math.random()
      );

      color.toArray(colorArray, i * 3);
    }

    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new Float32BufferAttribute(colorArray, 3));

    particlesRef.current = new Points(
      geometry,
      new PointsMaterial({
        vertexColors: true,
        size: 0.2, // Increase size for better visibility
      })
    );

    // Remove particles after 1 second
    const endTimeout = setTimeout(onEnd, 1000);

    return () => {
      clearTimeout(endTimeout);
    };
  }, [position, onEnd]);

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < velocity.current.length; i++) {
        positions[i * 3] += velocity.current[i].x * 0.1;
        positions[i * 3 + 1] += velocity.current[i].y * 0.1;
        positions[i * 3 + 2] += velocity.current[i].z * 0.1;

        // Gradually reduce velocity for a more realistic effect
        velocity.current[i].multiplyScalar(0.98);
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return particlesRef.current ? <primitive object={particlesRef.current} /> : null;
};

export default Particles;

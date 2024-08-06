import React, { useRef, useEffect } from "react"
import { Mesh, Vector3 } from "three"

interface BombProps {
  position: Vector3
  onExplode: (position: Vector3) => void
}

const Bomb: React.FC<BombProps> = ({ position, onExplode }) => {
  const bombRef = useRef<Mesh | null>(null)

  useEffect(() => {
    // Set a timer to trigger the explosion after 3 seconds
    const explodeTimeout = setTimeout(() => {
      if (bombRef.current) {
        onExplode(bombRef.current.position.clone())
      }
    }, 3000)

    return () => {
      clearTimeout(explodeTimeout)
    }
  }, [onExplode, position])

  return (
    <mesh ref={bombRef} position={position}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="black" />
    </mesh>
  )
}

export default Bomb

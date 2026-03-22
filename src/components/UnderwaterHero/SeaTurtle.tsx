import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import FallbackTurtle from "./FallbackTurtle";

interface SeaTurtleProps {
  scrollProgress: number;
}

const SeaTurtle = ({ scrollProgress }: SeaTurtleProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;

    const progress = Math.min(Math.max(scrollProgress, 0), 1);
    
    // Z position: far to close
    const z = THREE.MathUtils.lerp(-80, 2, progress);
    const scale = THREE.MathUtils.lerp(0.15, 1.1, progress);
    
    // Swim oscillation
    const xOscillation = Math.sin(t * 0.5) * (3 - progress * 2);
    const yBob = Math.sin(t * 0.8) * 0.5;
    
    groupRef.current.position.set(xOscillation, yBob, z);
    groupRef.current.scale.setScalar(scale);
    
    // Gentle rotation
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.2 + Math.PI;
    groupRef.current.rotation.x = Math.sin(t * 0.4) * 0.05;
    groupRef.current.rotation.z = Math.sin(t * 0.6) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <FallbackTurtle />
    </group>
  );
};

export default SeaTurtle;

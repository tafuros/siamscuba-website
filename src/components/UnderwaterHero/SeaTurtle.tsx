import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import FallbackTurtle from "./FallbackTurtle";

interface SeaTurtleProps {
  scrollProgress: number;
}

const MODEL_URL = "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/sea-turtle/model.gltf";

const SeaTurtle = ({ scrollProgress }: SeaTurtleProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [model, setModel] = useState<any>(null);

  useEffect(() => {
    try {
      const gltf = useGLTF.preload(MODEL_URL);
    } catch {
      setUseFallback(true);
    }
  }, []);

  // Try loading the model
  let scene: THREE.Group | null = null;
  try {
    if (!useFallback) {
      const gltf = useGLTF(MODEL_URL);
      scene = gltf.scene;
    }
  } catch {
    // Will use fallback
  }

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;

    // Scroll-driven positioning
    const progress = Math.min(Math.max(scrollProgress, 0), 1);
    
    // Z position: far to close
    const z = THREE.MathUtils.lerp(-80, 2, progress);
    // Scale
    const scale = THREE.MathUtils.lerp(0.15, 1.1, progress);
    // Opacity handled via material would be complex, so we use scale fade
    
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
      {scene && !useFallback ? (
        <primitive object={scene.clone()} />
      ) : (
        <FallbackTurtle />
      )}
    </group>
  );
};

export default SeaTurtle;

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const RAY_COUNT = 5;

const GodRays = () => {
  const groupRef = useRef<THREE.Group>(null);
  const materialRefs = useRef<THREE.MeshBasicMaterial[]>([]);

  useFrame(({ clock }) => {
    materialRefs.current.forEach((mat, i) => {
      if (mat) {
        mat.opacity = 0.03 + Math.sin(clock.elapsedTime * 0.4 + i * 1.2) * 0.025;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: RAY_COUNT }).map((_, i) => (
        <mesh
          key={i}
          position={[(i - RAY_COUNT / 2) * 6 + Math.sin(i) * 3, 5, -8 - i * 2]}
          rotation={[0, 0, (i - RAY_COUNT / 2) * 0.08]}
        >
          <planeGeometry args={[1.5, 30]} />
          <meshBasicMaterial
            ref={(el) => { if (el) materialRefs.current[i] = el; }}
            color="#ffffff"
            transparent
            opacity={0.04}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

export default GodRays;

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const CausticLight = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.opacity = 0.04 + Math.sin(clock.elapsedTime * 0.5) * 0.02;
    }
    if (meshRef.current) {
      meshRef.current.position.y = 8 + Math.sin(clock.elapsedTime * 0.3) * 2;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 8, -5]}>
      <planeGeometry args={[60, 60]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#4a9eff"
        transparent
        opacity={0.05}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export default CausticLight;

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BUBBLE_COUNT = 120;

const Bubbles = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: BUBBLE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 40,
      y: Math.random() * 40 - 20,
      z: (Math.random() - 0.5) * 40 - 10,
      speed: 0.3 + Math.random() * 0.8,
      wobble: Math.random() * Math.PI * 2,
      size: 0.02 + Math.random() * 0.06,
    }));
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      p.y += p.speed * delta;
      p.wobble += delta * 1.5;
      if (p.y > 20) p.y = -20;
      dummy.position.set(
        p.x + Math.sin(p.wobble) * 0.3,
        p.y,
        p.z
      );
      dummy.scale.setScalar(p.size);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, BUBBLE_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
    </instancedMesh>
  );
};

export default Bubbles;

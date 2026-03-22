import { forwardRef, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const FallbackTurtle = forwardRef<THREE.Group>((_, ref) => {
  const flippersRef = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    flippersRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const isFront = i < 2;
      const isLeft = i % 2 === 0;
      const phase = isFront ? 0 : Math.PI;
      const amplitude = isFront ? 0.4 : 0.25;
      mesh.rotation.z = Math.sin(t * 2 + phase) * amplitude * (isLeft ? 1 : -1);
      if (isFront) mesh.rotation.x = Math.sin(t * 2 + phase) * 0.15;
    });
  });

  return (
    <group ref={ref}>
      {/* Shell (flattened sphere) */}
      <mesh position={[0, 0.25, 0]} scale={[1.4, 0.55, 1.15]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshPhongMaterial color="#1D6B3A" shininess={80} specular="#4a9a6a" />
      </mesh>

      {/* Shell pattern (slightly larger, transparent overlay) */}
      <mesh position={[0, 0.35, 0]} scale={[1.35, 0.5, 1.1]}>
        <sphereGeometry args={[1, 6, 4]} />
        <meshPhongMaterial
          color="#28844A"
          shininess={60}
          specular="#5ab87a"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Belly (lighter underside) */}
      <mesh position={[0, -0.1, 0]} scale={[1.2, 0.35, 1.0]}>
        <sphereGeometry args={[1, 20, 12]} />
        <meshPhongMaterial color="#3a9a5a" shininess={40} specular="#6abf8a" />
      </mesh>

      {/* Head */}
      <mesh position={[1.5, 0.15, 0]}>
        <sphereGeometry args={[0.35, 16, 12]} />
        <meshPhongMaterial color="#1D6B3A" shininess={70} specular="#4a9a6a" />
      </mesh>

      {/* Eyes */}
      {[0.15, -0.15].map((zOff, i) => (
        <mesh key={`eye-${i}`} position={[1.75, 0.25, zOff]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshPhongMaterial color="#111111" shininess={120} specular="#ffffff" />
        </mesh>
      ))}

      {/* Front left flipper */}
      <mesh
        ref={(el) => { if (el) flippersRef.current[0] = el; }}
        position={[0.5, -0.1, 1.0]}
        rotation={[0, 0.3, 0.2]}
      >
        <boxGeometry args={[0.9, 0.08, 0.35]} />
        <meshPhongMaterial color="#1D6B3A" shininess={60} specular="#4a9a6a" />
      </mesh>

      {/* Front right flipper */}
      <mesh
        ref={(el) => { if (el) flippersRef.current[1] = el; }}
        position={[0.5, -0.1, -1.0]}
        rotation={[0, -0.3, -0.2]}
      >
        <boxGeometry args={[0.9, 0.08, 0.35]} />
        <meshPhongMaterial color="#1D6B3A" shininess={60} specular="#4a9a6a" />
      </mesh>

      {/* Rear left flipper */}
      <mesh
        ref={(el) => { if (el) flippersRef.current[2] = el; }}
        position={[-0.9, -0.1, 0.7]}
        rotation={[0, 0.5, 0.15]}
      >
        <boxGeometry args={[0.55, 0.06, 0.25]} />
        <meshPhongMaterial color="#1D6B3A" shininess={60} specular="#4a9a6a" />
      </mesh>

      {/* Rear right flipper */}
      <mesh
        ref={(el) => { if (el) flippersRef.current[3] = el; }}
        position={[-0.9, -0.1, -0.7]}
        rotation={[0, -0.5, -0.15]}
      >
        <boxGeometry args={[0.55, 0.06, 0.25]} />
        <meshPhongMaterial color="#1D6B3A" shininess={60} specular="#4a9a6a" />
      </mesh>

      {/* Tail */}
      <mesh position={[-1.4, 0.05, 0]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.4, 0.05, 0.12]} />
        <meshPhongMaterial color="#1D6B3A" shininess={50} specular="#4a9a6a" />
      </mesh>
    </group>
  );
});

FallbackTurtle.displayName = "FallbackTurtle";
export default FallbackTurtle;

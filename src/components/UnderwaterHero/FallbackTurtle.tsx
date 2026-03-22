import { forwardRef } from "react";
import * as THREE from "three";

const FallbackTurtle = forwardRef<THREE.Group>((_, ref) => {
  return (
    <group ref={ref}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 16, 12]} />
        <meshStandardMaterial color="#2d7a4f" roughness={0.6} />
      </mesh>
      {/* Shell top */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[1.1, 16, 12]} />
        <meshStandardMaterial color="#1a5c38" roughness={0.4} />
      </mesh>
      {/* Head */}
      <mesh position={[1.3, 0.1, 0]}>
        <sphereGeometry args={[0.4, 12, 10]} />
        <meshStandardMaterial color="#3a8a5a" roughness={0.5} />
      </mesh>
      {/* Flippers */}
      {[[-0.6, -0.2, 0.9], [-0.6, -0.2, -0.9], [0.4, -0.2, 0.8], [0.4, -0.2, -0.8]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, i < 2 ? 0.3 : -0.3]}>
          <boxGeometry args={[0.6, 0.08, 0.3]} />
          <meshStandardMaterial color="#3a8a5a" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
});

FallbackTurtle.displayName = "FallbackTurtle";
export default FallbackTurtle;

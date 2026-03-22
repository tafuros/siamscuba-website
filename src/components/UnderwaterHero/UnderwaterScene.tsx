import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import Bubbles from "./Bubbles";
import CausticLight from "./CausticLight";
import GodRays from "./GodRays";
import SeaTurtle from "./SeaTurtle";

interface UnderwaterSceneProps {
  scrollProgress: number;
}

const UnderwaterScene = ({ scrollProgress }: UnderwaterSceneProps) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: false }}
      style={{ background: "linear-gradient(180deg, #020B18 0%, #0A2744 100%)" }}
    >
      <color attach="background" args={["#020B18"]} />
      <fog attach="fog" args={["#0A2744", 10, 100]} />

      {/* Lighting */}
      <ambientLight color="#1a4a7a" intensity={0.4} />
      <pointLight position={[0, 15, 5]} color="#ffffff" intensity={0.8} />
      <pointLight position={[-5, 10, -5]} color="#1a6aaa" intensity={0.3} />

      {/* Effects */}
      <Bubbles />
      <CausticLight />
      <GodRays />

      {/* Turtle */}
      <Suspense fallback={null}>
        <SeaTurtle scrollProgress={scrollProgress} />
      </Suspense>
    </Canvas>
  );
};

export default UnderwaterScene;

import { useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Atmosphere } from "./atmosphere";
import { createTerrain, heroHeight } from "./terrain";
import { PrayerFlagLine } from "./props";
import { Kiang } from "./kiang";

function Terrain() {
  const geometry = useMemo(
    () => createTerrain({ width: 440, depth: 270, segmentsX: 210, segmentsZ: 130, centerZ: -100, height: heroHeight }),
    [],
  );
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial vertexColors flatShading roughness={1} />
    </mesh>
  );
}

function Lake() {
  return (
    <mesh position={[-22, -0.45, -46]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[80, 24]} />
      <meshStandardMaterial color="#2FA7AE" roughness={0.12} metalness={0.2} />
    </mesh>
  );
}

function CameraRig({ reduced }: { reduced: boolean }) {
  const look = useMemo(() => new THREE.Vector3(0, 7, -60), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame((state, delta) => {
    const scroll = Math.min(1, window.scrollY / window.innerHeight);
    const px = reduced ? 0 : state.pointer.x;
    const py = reduced ? 0 : state.pointer.y;
    target.set(px * 3.2, 9 + py * 1.2 + scroll * 5, 34 - scroll * 12);
    state.camera.position.lerp(target, 1 - Math.exp(-delta * 2.5));
    look.set(px * 1.5, 7 - scroll * 1.5, -60);
    state.camera.lookAt(look);
  });
  return null;
}

const herd: { x: number; z: number; rotation: number; phase: number }[] = [
  { x: 12, z: 6, rotation: -0.9, phase: 0 },
  { x: 15, z: 8.5, rotation: -1.2, phase: 2.1 },
  { x: 18.5, z: 5, rotation: -0.4, phase: 3.7 },
];

type HeroSceneProps = {
  night: boolean;
  active: boolean;
  reduced: boolean;
};

export default function HeroScene({ night, active, reduced }: HeroSceneProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 9, 34], fov: 50, near: 0.5, far: 1400 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <Atmosphere night={night} />
      <Terrain />
      <Lake />
      <PrayerFlagLine from={[-17, 4.6, 17]} to={[-5, 3.8, 12]} count={11} sag={1.1} />
      {herd.map((kiang) => (
        <Kiang
          key={kiang.x}
          position={[kiang.x, heroHeight(kiang.x, kiang.z), kiang.z]}
          rotation={kiang.rotation}
          phase={kiang.phase}
        />
      ))}
      <CameraRig reduced={reduced} />
    </Canvas>
  );
}

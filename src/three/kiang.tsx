import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Rod } from "./himalayan";

type V3 = [number, number, number];

const coat = "#A8673A";
const cream = "#EFE6D6";
const dark = "#3B2618";
const hoof = "#2A211B";

function Leg({ hip, knee, foot }: { hip: V3; knee: V3; foot: V3 }) {
  return (
    <group>
      <Rod a={hip} b={knee} r={0.075} color={cream} rough={0.85} capsule segments={10} />
      <Rod a={knee} b={foot} r={0.045} color={cream} rough={0.85} capsule segments={8} />
      <mesh position={[foot[0], foot[1] - 0.03, foot[2] + 0.01]}>
        <cylinderGeometry args={[0.05, 0.06, 0.07, 10]} />
        <meshStandardMaterial color={hoof} roughness={0.7} />
      </mesh>
    </group>
  );
}

type KiangProps = {
  position: V3;
  rotation?: number;
  phase?: number;
  scale?: number;
};

export function Kiang({ position, rotation = 0, phase = 0, scale = 1 }: KiangProps) {
  const neck = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const ears = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime + phase;
    const cycle = time % 9;
    const graze = cycle > 5 ? Math.sin(((cycle - 5) / 4) * Math.PI) : 0;
    if (neck.current) neck.current.rotation.x = 0.15 + graze * 1.15 + Math.sin(time * 0.8) * 0.03;
    if (tail.current) tail.current.rotation.z = Math.sin(time * 2.4) * 0.25;
    if (ears.current) ears.current.rotation.x = Math.sin(time * 3.1) > 0.92 ? -0.3 : 0;
  });

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 1.08, 0]} scale={[0.5, 0.56, 1.18]}>
        <sphereGeometry args={[0.5, 24, 16]} />
        <meshStandardMaterial color={coat} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.96, 0.02]} scale={[0.46, 0.4, 1.04]}>
        <sphereGeometry args={[0.5, 24, 16]} />
        <meshStandardMaterial color={cream} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.1, 0.46]} scale={[0.68, 0.86, 0.72]}>
        <sphereGeometry args={[0.36, 20, 14]} />
        <meshStandardMaterial color={coat} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.98, 0.6]} scale={[0.6, 0.8, 0.5]}>
        <sphereGeometry args={[0.3, 16, 12]} />
        <meshStandardMaterial color={cream} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.13, -0.46]} scale={[0.72, 0.8, 0.78]}>
        <sphereGeometry args={[0.42, 20, 14]} />
        <meshStandardMaterial color={coat} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.36, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 1.0, 6]} />
        <meshStandardMaterial color={dark} roughness={1} />
      </mesh>

      <group ref={neck} position={[0, 1.28, 0.6]}>
        <group rotation={[0.62, 0, 0]}>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.12, 0.2, 0.68, 14]} />
            <meshStandardMaterial color={coat} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.32, -0.12]} rotation={[0.08, 0, 0]}>
            <boxGeometry args={[0.05, 0.62, 0.08]} />
            <meshStandardMaterial color={dark} roughness={1} />
          </mesh>
          <group position={[0, 0.66, 0.02]} rotation={[1.05, 0, 0]}>
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.075, 0.13, 0.5, 14]} />
              <meshStandardMaterial color={coat} roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.46, 0.0]} scale={[0.85, 0.8, 1]}>
              <sphereGeometry args={[0.1, 14, 10]} />
              <meshStandardMaterial color={cream} roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.5, 0.04]}>
              <sphereGeometry args={[0.035, 8, 6]} />
              <meshStandardMaterial color={dark} />
            </mesh>
            {[0.1, -0.1].map((x) => (
              <mesh key={x} position={[x, 0.08, 0.06]}>
                <sphereGeometry args={[0.022, 8, 6]} />
                <meshStandardMaterial color="#120C08" />
              </mesh>
            ))}
            <group ref={ears} position={[0, -0.02, -0.1]}>
              {[0.06, -0.06].map((x) => (
                <group key={x} position={[x, 0, 0]} rotation={[-0.9, 0, x > 0 ? -0.25 : 0.25]}>
                  <mesh position={[0, 0.1, 0]}>
                    <coneGeometry args={[0.04, 0.2, 8]} />
                    <meshStandardMaterial color={coat} />
                  </mesh>
                  <mesh position={[0, 0.19, 0]}>
                    <coneGeometry args={[0.018, 0.05, 8]} />
                    <meshStandardMaterial color={dark} />
                  </mesh>
                </group>
              ))}
            </group>
          </group>
        </group>
      </group>

      <Leg hip={[0.13, 0.95, 0.46]} knee={[0.13, 0.5, 0.48]} foot={[0.13, 0.07, 0.46]} />
      <Leg hip={[-0.13, 0.95, 0.46]} knee={[-0.13, 0.5, 0.5]} foot={[-0.13, 0.07, 0.52]} />
      <Leg hip={[0.14, 1.0, -0.5]} knee={[0.14, 0.52, -0.62]} foot={[0.14, 0.07, -0.52]} />
      <Leg hip={[-0.14, 1.0, -0.5]} knee={[-0.14, 0.52, -0.6]} foot={[-0.14, 0.07, -0.48]} />

      <group ref={tail} position={[0, 1.25, -0.86]}>
        <group rotation={[-0.35, 0, 0]}>
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.025, 0.035, 0.5, 8]} />
            <meshStandardMaterial color={coat} />
          </mesh>
          <mesh position={[0, -0.58, 0]}>
            <coneGeometry args={[0.06, 0.26, 8]} />
            <meshStandardMaterial color={dark} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Himalayan, Rod } from "./himalayan";
import type { BikeColors } from "@/data/site";

type V3 = [number, number, number];

const pants = "#2B3036";
const boot = "#16181B";
const skin = "#B9805A";
const hair = "#1E1612";

type StandingRiderProps = {
  position: V3;
  rotation: number;
  jacket: string;
  helmet: string;
  pose: "photo" | "helmet" | "wave";
  phase?: number;
};

export function StandingRider({ position, rotation, jacket, helmet, pose, phase = 0 }: StandingRiderProps) {
  const body = useRef<THREE.Group>(null);
  const waveArm = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime + phase;
    if (body.current) body.current.rotation.z = Math.sin(time * 0.9) * 0.02;
    if (waveArm.current) waveArm.current.rotation.z = -0.35 + Math.sin(time * 6) * 0.35;
  });

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[0.1, -0.1].map((x) => (
        <group key={x}>
          <Rod a={[x, 0.95, 0]} b={[x * 1.15, 0.12, 0.02]} r={0.075} color={pants} rough={0.9} capsule />
          <mesh position={[x * 1.15, 0.07, 0.06]}>
            <boxGeometry args={[0.13, 0.14, 0.28]} />
            <meshStandardMaterial color={boot} roughness={0.8} />
          </mesh>
        </group>
      ))}
      <group ref={body}>
        <Rod a={[0, 0.98, 0]} b={[0, 1.48, 0]} r={0.17} color={jacket} rough={0.85} capsule segments={12} />
        <mesh position={[0, 1.35, -0.16]}>
          <boxGeometry args={[0.3, 0.36, 0.12]} />
          <meshStandardMaterial color="#3B4148" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.6, 0.02]}>
          <cylinderGeometry args={[0.055, 0.06, 0.1, 10]} />
          <meshStandardMaterial color={skin} />
        </mesh>
        <mesh position={[0, 1.76, 0.02]} scale={[0.9, 1.05, 0.95]}>
          <sphereGeometry args={[0.12, 18, 14]} />
          <meshStandardMaterial color={skin} roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.81, -0.01]} scale={[0.95, 0.75, 1]}>
          <sphereGeometry args={[0.122, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={hair} roughness={1} />
        </mesh>

        {pose === "photo" && (
          <>
            {[0.2, -0.2].map((x) => (
              <group key={x}>
                <Rod a={[x, 1.42, 0]} b={[x * 0.9, 1.3, 0.24]} r={0.05} color={jacket} capsule />
                <Rod a={[x * 0.9, 1.3, 0.24]} b={[x * 0.3, 1.58, 0.36]} r={0.045} color={jacket} capsule />
              </group>
            ))}
            <mesh position={[0, 1.62, 0.38]} rotation={[0.2, 0, 0]}>
              <boxGeometry args={[0.16, 0.08, 0.012]} />
              <meshStandardMaterial color="#0E1012" metalness={0.5} roughness={0.2} />
            </mesh>
          </>
        )}

        {pose === "helmet" && (
          <>
            <Rod a={[0.2, 1.42, 0]} b={[0.25, 1.12, 0.04]} r={0.05} color={jacket} capsule />
            <Rod a={[0.25, 1.12, 0.04]} b={[0.28, 0.86, 0.1]} r={0.045} color={jacket} capsule />
            <mesh position={[0.3, 0.76, 0.14]}>
              <sphereGeometry args={[0.15, 18, 14]} />
              <meshStandardMaterial color={helmet} metalness={0.15} roughness={0.35} />
            </mesh>
            <mesh position={[0.3, 0.8, 0.27]} rotation={[0.3, 0, 0]}>
              <boxGeometry args={[0.2, 0.012, 0.14]} />
              <meshStandardMaterial color={helmet} />
            </mesh>
            <Rod a={[-0.2, 1.42, 0]} b={[-0.24, 1.12, -0.02]} r={0.05} color={jacket} capsule />
            <Rod a={[-0.24, 1.12, -0.02]} b={[-0.22, 0.86, 0.02]} r={0.045} color={jacket} capsule />
          </>
        )}

        {pose === "wave" && (
          <>
            <Rod a={[-0.2, 1.42, 0]} b={[-0.24, 1.12, -0.02]} r={0.05} color={jacket} capsule />
            <Rod a={[-0.24, 1.12, -0.02]} b={[-0.22, 0.86, 0.02]} r={0.045} color={jacket} capsule />
            <group ref={waveArm} position={[0.2, 1.42, 0]}>
              <Rod a={[0, 0, 0]} b={[0.22, 0.24, 0]} r={0.05} color={jacket} capsule />
              <Rod a={[0.22, 0.24, 0]} b={[0.24, 0.52, 0.02]} r={0.045} color={jacket} capsule />
            </group>
          </>
        )}
      </group>
    </group>
  );
}

export function ParkedBike({ position, rotation, colors }: { position: V3; rotation: number; colors: BikeColors }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <group rotation={[0, 0, 0.12]}>
        <Himalayan {...colors} night={false} parked />
      </group>
    </group>
  );
}

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { flagColors } from "@/data/site";

type Vec3 = [number, number, number];

export function Milestone({ position, rotation, reached }: { position: Vec3; rotation: number; reached: boolean }) {
  const cap = useRef<THREE.MeshStandardMaterial>(null);
  const grey = useMemo(() => new THREE.Color("#9AA3AD"), []);
  const yellow = useMemo(() => new THREE.Color("#E6B422"), []);
  useFrame(() => {
    cap.current?.color.lerp(reached ? yellow : grey, 0.08);
  });
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.6, 1, 0.28]} />
        <meshStandardMaterial color="#F4F1EA" />
      </mesh>
      <mesh position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 1]}>
        <cylinderGeometry args={[0.3, 0.3, 0.29, 16, 1, false, -Math.PI / 2, Math.PI]} />
        <meshStandardMaterial ref={cap} color="#9AA3AD" />
      </mesh>
    </group>
  );
}

export function Chorten({ position }: { position: Vec3 }) {
  return (
    <group position={position} scale={1.6}>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[2.2, 0.5, 2.2]} />
        <meshStandardMaterial color="#F4F1EA" flatShading />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[1.7, 0.3, 1.7]} />
        <meshStandardMaterial color="#F4F1EA" flatShading />
      </mesh>
      <mesh position={[0, 1.3, 0]} scale={[1, 0.9, 1]}>
        <sphereGeometry args={[0.8, 14, 10]} />
        <meshStandardMaterial color="#F7F4EE" flatShading />
      </mesh>
      <mesh position={[0, 2.05, 0]}>
        <boxGeometry args={[0.5, 0.25, 0.5]} />
        <meshStandardMaterial color="#C8342B" />
      </mesh>
      <mesh position={[0, 2.7, 0]}>
        <coneGeometry args={[0.24, 1.1, 10]} />
        <meshStandardMaterial color="#E6B422" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function PrayerFlagLine({ from, to, count, sag = 0.8 }: { from: Vec3; to: Vec3; count: number; sag?: number }) {
  const flags = useRef<THREE.Group>(null);
  const curve = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const mid = a.clone().lerp(b, 0.5);
    mid.y -= sag;
    return new THREE.QuadraticBezierCurve3(a, mid, b);
  }, [from, to, sag]);
  const line = useMemo(() => new THREE.BufferGeometry().setFromPoints(curve.getPoints(30)), [curve]);
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        position: curve.getPoint((index + 0.5) / count),
        color: flagColors[index % flagColors.length],
      })),
    [curve, count],
  );
  useFrame((state) => {
    flags.current?.children.forEach((flag, index) => {
      flag.rotation.y = Math.sin(state.clock.elapsedTime * 3 + index * 0.9) * 0.45;
      flag.rotation.z = Math.sin(state.clock.elapsedTime * 2.2 + index) * 0.08;
    });
  });
  const poleHeight = Math.max(from[1], to[1]);
  return (
    <group>
      <lineSegments>
        <primitive object={line} attach="geometry" />
        <lineBasicMaterial color="#6E6A64" />
      </lineSegments>
      <mesh position={[from[0], from[1] / 2, from[2]]}>
        <cylinderGeometry args={[0.06, 0.06, poleHeight, 6]} />
        <meshStandardMaterial color="#3A2A20" />
      </mesh>
      <mesh position={[to[0], to[1] / 2, to[2]]}>
        <cylinderGeometry args={[0.06, 0.06, poleHeight, 6]} />
        <meshStandardMaterial color="#3A2A20" />
      </mesh>
      <group ref={flags}>
        {items.map((item) => (
          <group key={`${item.position.x}-${item.position.z}`} position={item.position}>
            <mesh position={[0.26, -0.32, 0]}>
              <planeGeometry args={[0.5, 0.6]} />
              <meshStandardMaterial color={item.color} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

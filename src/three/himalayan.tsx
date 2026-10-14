import { forwardRef, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { BikeColors } from "@/data/site";

type V3 = [number, number, number];

const up = new THREE.Vector3(0, 1, 0);

type RodProps = {
  a: V3;
  b: V3;
  r: number;
  color: string;
  metal?: number;
  rough?: number;
  segments?: number;
  capsule?: boolean;
};

export function Rod({ a, b, r, color, metal = 0.2, rough = 0.6, segments = 8, capsule = false }: RodProps) {
  const { position, quaternion, length } = useMemo(() => {
    const start = new THREE.Vector3(...a);
    const end = new THREE.Vector3(...b);
    const dir = end.clone().sub(start);
    return {
      position: start.clone().add(end).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize()),
      length: dir.length(),
    };
  }, [a, b]);
  return (
    <mesh position={position} quaternion={quaternion}>
      {capsule ? (
        <capsuleGeometry args={[r, Math.max(0.001, length - r * 2), 4, segments]} />
      ) : (
        <cylinderGeometry args={[r, r, length, segments]} />
      )}
      <meshStandardMaterial color={color} metalness={metal} roughness={rough} />
    </mesh>
  );
}

function Path({ points, r, color, metal = 0.3 }: { points: V3[]; r: number; color: string; metal?: number }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    return new THREE.TubeGeometry(curve, points.length * 8, r, 6, false);
  }, [points, r]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} metalness={metal} roughness={0.5} />
    </mesh>
  );
}

const Wheel = forwardRef<THREE.Group, { center: V3; radius: number; width: number }>(function Wheel(
  { center, radius, width },
  ref,
) {
  const spokes = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => {
        const angle = (i / 32) * Math.PI * 2;
        const side = i % 2 === 0 ? 1 : -1;
        const rim = radius - 0.075;
        return {
          a: [Math.cos(angle + side * 0.25) * 0.045, Math.sin(angle + side * 0.25) * 0.045, side * 0.035] as V3,
          b: [Math.cos(angle) * rim, Math.sin(angle) * rim, 0] as V3,
        };
      }),
    [radius],
  );
  return (
    <group position={center}>
      <group ref={ref}>
        <group rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <torusGeometry args={[radius - width / 2, width / 2, 12, 40]} />
            <meshStandardMaterial color="#17191C" roughness={0.95} />
          </mesh>
          {Array.from({ length: 28 }, (_, i) => {
            const angle = (i / 28) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
                rotation={[0, 0, angle]}
              >
                <boxGeometry args={[0.03, 0.045, width * 0.9]} />
                <meshStandardMaterial color="#202326" roughness={1} />
              </mesh>
            );
          })}
          <mesh>
            <torusGeometry args={[radius - 0.075, 0.014, 6, 40]} />
            <meshStandardMaterial color="#1E1F22" metalness={0.7} roughness={0.35} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.12, 12]} />
            <meshStandardMaterial color="#B8BEC5" metalness={0.8} roughness={0.3} />
          </mesh>
          {spokes.map((spoke, i) => (
            <Rod key={i} a={spoke.a} b={spoke.b} r={0.004} color="#C9CED4" metal={0.9} rough={0.25} segments={4} />
          ))}
          <mesh position={[0, 0, 0.07]}>
            <cylinderGeometry args={[0.1, 0.1, 0.008, 18]} />
            <meshStandardMaterial color="#9AA0A8" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      </group>
    </group>
  );
});

type HimalayanProps = BikeColors & {
  night: boolean;
  moving?: { current: number };
  luggage?: boolean;
  parked?: boolean;
};

const rearAxle: V3 = [0, 0.33, -0.73];
const frontAxle: V3 = [0, 0.37, 0.74];

export const Himalayan = forwardRef<THREE.Group, HimalayanProps>(function Himalayan(
  { tank, jacket, helmet, night, moving, luggage = true, parked = false },
  ref,
) {
  const front = useRef<THREE.Group>(null);
  const rear = useRef<THREE.Group>(null);
  const chassis = useRef<THREE.Group>(null);
  const lamp = useRef<THREE.SpotLight>(null);
  const lampTarget = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    const speed = parked ? 0 : moving ? moving.current : 1;
    if (front.current) front.current.rotation.x += delta * speed * 9 * (0.33 / 0.37);
    if (rear.current) rear.current.rotation.x += delta * speed * 9;
    if (chassis.current) chassis.current.position.y = Math.sin(state.clock.elapsedTime * 14) * 0.008 * Math.min(speed, 1.5);
    if (lamp.current) lamp.current.intensity = THREE.MathUtils.lerp(lamp.current.intensity, night && !parked ? 60 : 0, 0.05);
  });

  const black = "#16181B";
  const chrome = "#C9CED4";
  const alloy = "#9AA0A8";

  return (
    <group ref={ref}>
      <Wheel ref={rear} center={rearAxle} radius={0.33} width={0.13} />
      <Wheel ref={front} center={frontAxle} radius={0.37} width={0.1} />

      <group ref={chassis}>
        {[0.1, -0.1].map((x) => (
          <group key={x}>
            <Rod a={[x, 0.37, 0.74]} b={[x, 0.62, 0.62]} r={0.042} color={black} rough={0.9} />
            <Rod a={[x, 0.62, 0.62]} b={[x, 1.08, 0.41]} r={0.025} color={chrome} metal={0.9} rough={0.2} />
            <Rod a={[x, 0.36, -0.73]} b={[x, 0.46, -0.05]} r={0.028} color={black} />
          </group>
        ))}
        <Rod a={[-0.11, 1.08, 0.41]} b={[0.11, 1.08, 0.41]} r={0.03} color={black} />
        <Path points={[[0, 0.62, 0.86], [0, 0.78, 0.74], [0, 0.82, 0.56]]} r={0.05} color={tank} metal={0.1} />

        <Path points={[[0, 1.02, 0.4], [0, 0.95, 0.22], [0, 0.82, -0.05], [0, 0.82, -0.4], [0, 0.95, -0.9]]} r={0.026} color={black} />
        <Path points={[[0, 1.0, 0.4], [0, 0.72, 0.36], [0, 0.42, 0.28], [0, 0.32, 0.0], [0, 0.42, -0.12]]} r={0.026} color={black} />
        {[0.13, -0.13].map((x) => (
          <Path key={x} points={[[x, 0.46, -0.1], [x, 0.68, -0.45], [x, 0.92, -0.95]]} r={0.018} color={black} />
        ))}
        <Rod a={[0, 0.55, -0.12]} b={[0, 0.82, -0.42]} r={0.03} color="#C59A2A" metal={0.4} />

        <mesh position={[0, 0.52, 0.1]}>
          <boxGeometry args={[0.26, 0.3, 0.36]} />
          <meshStandardMaterial color="#2B2E33" metalness={0.5} roughness={0.5} />
        </mesh>
        {[0.135, -0.135].map((x) => (
          <mesh key={x} position={[x, 0.5, 0.06]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.12, 0.12, 0.02, 20]} />
            <meshStandardMaterial color={alloy} metalness={0.85} roughness={0.3} />
          </mesh>
        ))}
        <group position={[0, 0.72, 0.2]} rotation={[0.32, 0, 0]}>
          {Array.from({ length: 8 }, (_, i) => (
            <mesh key={i} position={[0, i * 0.024, 0]}>
              <boxGeometry args={[0.3 - i * 0.006, 0.012, 0.24]} />
              <meshStandardMaterial color={i % 2 ? "#3A3E44" : alloy} metalness={0.7} roughness={0.4} />
            </mesh>
          ))}
        </group>
        <mesh position={[0, 0.33, 0.12]}>
          <boxGeometry args={[0.3, 0.03, 0.52]} />
          <meshStandardMaterial color={alloy} metalness={0.8} roughness={0.35} />
        </mesh>

        <Path
          points={[[0.08, 0.72, 0.36], [0.12, 0.5, 0.42], [0.15, 0.36, 0.22], [0.17, 0.4, -0.2], [0.2, 0.56, -0.48]]}
          r={0.028}
          color="#2A2C30"
          metal={0.6}
        />
        <Rod a={[0.2, 0.55, -0.42]} b={[0.22, 0.7, -0.82]} r={0.06} color="#202226" metal={0.6} rough={0.4} capsule />
        <mesh position={[0.22, 0.705, -0.84]} rotation={[Math.PI / 2 + 0.36, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 14]} />
          <meshStandardMaterial color={chrome} metalness={0.9} roughness={0.2} />
        </mesh>

        <mesh position={[0, 1.0, 0.16]} rotation={[0.12, 0, 0]} scale={[1, 0.72, 1.4]}>
          <sphereGeometry args={[0.2, 20, 14]} />
          <meshStandardMaterial color={tank} metalness={0.25} roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.09, 0.12]} rotation={[0.1, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.02, 14]} />
          <meshStandardMaterial color={chrome} metalness={0.9} roughness={0.2} />
        </mesh>
        {[0.22, -0.22].map((x) => (
          <Path key={x} points={[[x * 0.9, 0.7, 0.4], [x, 0.98, 0.34], [x * 1.05, 1.0, 0.05], [x * 0.9, 0.78, -0.04]]} r={0.016} color={black} />
        ))}
        <mesh position={[0, 0.74, -0.36]}>
          <boxGeometry args={[0.28, 0.2, 0.32]} />
          <meshStandardMaterial color={tank} metalness={0.2} roughness={0.45} />
        </mesh>

        <mesh position={[0, 0.88, -0.24]} rotation={[0.06, 0, 0]}>
          <boxGeometry args={[0.3, 0.08, 0.46]} />
          <meshStandardMaterial color="#121315" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.94, -0.62]}>
          <boxGeometry args={[0.26, 0.07, 0.3]} />
          <meshStandardMaterial color="#121315" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.99, -0.9]}>
          <boxGeometry args={[0.26, 0.02, 0.3]} />
          <meshStandardMaterial color={black} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.88, -1.06]}>
          <boxGeometry args={[0.14, 0.05, 0.03]} />
          <meshStandardMaterial color="#C8342B" emissive="#FF2A1F" emissiveIntensity={night ? 2.5 : 0.4} />
        </mesh>
        <mesh position={[0, 0.72, -0.98]} rotation={[-0.5, 0, 0]}>
          <boxGeometry args={[0.16, 0.02, 0.3]} />
          <meshStandardMaterial color={black} />
        </mesh>

        {luggage &&
          [0.28, -0.28].map((x) => (
            <group key={x}>
              <mesh position={[x, 0.72, -0.62]}>
                <boxGeometry args={[0.16, 0.36, 0.44]} />
                <meshStandardMaterial color="#AEB4BB" metalness={0.75} roughness={0.35} />
              </mesh>
              <mesh position={[x, 0.91, -0.62]}>
                <boxGeometry args={[0.17, 0.03, 0.45]} />
                <meshStandardMaterial color="#2A2C30" />
              </mesh>
            </group>
          ))}

        {[0.2, -0.2].map((x) => (
          <Path key={x} points={[[x * 0.8, 0.82, 0.48], [x, 1.18, 0.56], [x * 0.7, 1.42, 0.5]]} r={0.014} color={black} />
        ))}
        <Rod a={[-0.14, 1.42, 0.5]} b={[0.14, 1.42, 0.5]} r={0.014} color={black} />
        <group position={[0, 1.06, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.09, 0.12, 24]} />
            <meshStandardMaterial color={black} metalness={0.4} />
          </mesh>
          <mesh position={[0, 0.062, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.006, 24]} />
            <meshStandardMaterial color="#FFF3CF" emissive="#FFE29A" emissiveIntensity={night ? 4 : 0.5} />
          </mesh>
        </group>
        <mesh position={[0, 1.33, 0.57]} rotation={[-0.32, 0, 0]}>
          <boxGeometry args={[0.3, 0.42, 0.012]} />
          <meshStandardMaterial color="#5C6A78" transparent opacity={0.55} metalness={0.3} roughness={0.1} />
        </mesh>
        <Path points={[[-0.38, 1.2, 0.32], [-0.18, 1.18, 0.36], [0, 1.16, 0.38], [0.18, 1.18, 0.36], [0.38, 1.2, 0.32]]} r={0.014} color={black} />
        {[0.38, -0.38].map((x) => (
          <group key={x}>
            <Rod a={[x, 1.2, 0.32]} b={[x * 1.02, 1.2, 0.26]} r={0.02} color="#202226" rough={1} />
            <Rod a={[x * 0.62, 1.18, 0.36]} b={[x * 0.7, 1.42, 0.3]} r={0.006} color={black} />
            <mesh position={[x * 0.72, 1.44, 0.3]}>
              <boxGeometry args={[0.1, 0.06, 0.015]} />
              <meshStandardMaterial color={black} metalness={0.6} />
            </mesh>
          </group>
        ))}
        {[0.17, -0.17].map((x) => (
          <Rod key={x} a={[x, 0.38, 0.0]} b={[x * 1.4, 0.38, 0.0]} r={0.015} color={alloy} metal={0.8} />
        ))}

        {!parked && (<group>
          <Rod a={[0, 0.94, -0.22]} b={[0, 1.42, -0.08]} r={0.15} color={jacket} rough={0.85} segments={10} capsule />
          {[0.15, -0.15].map((x) => (
            <group key={x}>
              <Rod a={[x, 1.36, -0.08]} b={[x * 1.6, 1.22, 0.12]} r={0.05} color={jacket} rough={0.85} capsule />
              <Rod a={[x * 1.6, 1.22, 0.12]} b={[x * 2.4, 1.2, 0.32]} r={0.045} color={jacket} rough={0.85} capsule />
              <mesh position={[x * 2.45, 1.2, 0.33]}>
                <sphereGeometry args={[0.045, 8, 6]} />
                <meshStandardMaterial color={black} />
              </mesh>
              <Rod a={[x * 0.9, 0.92, -0.2]} b={[x * 1.3, 0.78, 0.12]} r={0.075} color="#2B3036" rough={0.9} capsule />
              <Rod a={[x * 1.3, 0.78, 0.12]} b={[x * 1.2, 0.42, -0.02]} r={0.06} color="#2B3036" rough={0.9} capsule />
              <mesh position={[x * 1.2, 0.4, 0.03]}>
                <boxGeometry args={[0.1, 0.12, 0.24]} />
                <meshStandardMaterial color={black} roughness={0.8} />
              </mesh>
            </group>
          ))}
          <mesh position={[0, 1.24, -0.32]}>
            <boxGeometry args={[0.28, 0.32, 0.12]} />
            <meshStandardMaterial color="#3B4148" roughness={0.9} />
          </mesh>
          <group position={[0, 1.6, -0.02]} rotation={[0.25, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.15, 20, 16]} />
              <meshStandardMaterial color={helmet} metalness={0.15} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.0, 0.11]} scale={[1, 0.7, 0.6]}>
              <sphereGeometry args={[0.11, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#1E2630" metalness={0.6} roughness={0.15} />
            </mesh>
            <mesh position={[0, 0.1, 0.15]} rotation={[-0.25, 0, 0]}>
              <boxGeometry args={[0.2, 0.012, 0.16]} />
              <meshStandardMaterial color={helmet} />
            </mesh>
            <mesh position={[0, -0.09, 0.14]}>
              <boxGeometry args={[0.1, 0.07, 0.08]} />
              <meshStandardMaterial color={black} />
            </mesh>
          </group>
        </group>)}
      </group>

      <primitive object={lampTarget} position={[0, 0, 14]} />
      <spotLight
        ref={lamp}
        position={[0, 1.06, 0.68]}
        angle={0.45}
        penumbra={0.6}
        distance={30}
        intensity={0}
        color="#FFE6A8"
        target={lampTarget}
      />
    </group>
  );
});


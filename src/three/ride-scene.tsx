import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import * as THREE from "three";
import { Atmosphere } from "./atmosphere";
import { createTerrain } from "./terrain";
import { Chorten, Milestone, PrayerFlagLine } from "./props";
import { Himalayan } from "./himalayan";
import { Kiang } from "./kiang";
import { PassSign } from "./pass-sign";
import { ParkedBike, StandingRider } from "./bikers";
import { createRibbon, frameAt, mountainRoadHeight, roadHalfWidth, stopAt } from "./road";

const lift = 0.06;

function Mountains() {
  const geometry = useMemo(
    () =>
      createTerrain({
        width: 380,
        depth: 330,
        segmentsX: 250,
        segmentsZ: 216,
        centerX: 27,
        centerZ: -8,
        height: mountainRoadHeight,
      }),
    [],
  );
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial vertexColors flatShading roughness={1} />
    </mesh>
  );
}

function Road() {
  const shoulder = useMemo(() => createRibbon(roadHalfWidth * 2 + 1.6, lift - 0.02), []);
  const surface = useMemo(() => createRibbon(roadHalfWidth * 2, lift), []);
  const dashes = useRef<THREE.InstancedMesh>(null);
  const count = 160;

  useLayoutEffect(() => {
    const mesh = dashes.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i += 1) {
      const { point, tangent } = frameAt((i + 0.5) / count);
      dummy.position.set(point.x, point.y + lift + 0.015, point.z);
      dummy.lookAt(point.x + tangent.x, point.y + lift + 0.015 + tangent.y, point.z + tangent.z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group>
      <mesh geometry={shoulder}>
        <meshStandardMaterial color="#B9A587" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={surface}>
        <meshStandardMaterial color="#3A3F45" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      <instancedMesh ref={dashes} args={[undefined, undefined, count]}>
        <boxGeometry args={[0.12, 0.01, 0.9]} />
        <meshStandardMaterial color="#E6B422" />
      </instancedMesh>
    </group>
  );
}

function Rider({ progress, night, reduced }: { progress: MotionValue<number>; night: boolean; reduced: boolean }) {
  const bike = useRef<THREE.Group>(null);
  const eased = useRef(progress.get());
  const speed = useRef(0);
  const lean = useRef(0);
  const look = useMemo(() => new THREE.Vector3(), []);
  const cameraTarget = useMemo(() => new THREE.Vector3(), []);
  const ahead = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const previous = eased.current;
    eased.current += (progress.get() - eased.current) * (reduced ? 1 : 1 - Math.exp(-delta * 5));
    const velocity = Math.abs(eased.current - previous) / Math.max(delta, 0.001);
    speed.current += (Math.min(3, 0.12 + velocity * 70) - speed.current) * 0.1;

    const t = THREE.MathUtils.clamp(0.003 + eased.current * 0.985, 0, 0.995);
    const { point, tangent, flat, side } = frameAt(t);
    const next = frameAt(Math.min(0.999, t + 0.008)).flat;
    const turn = flat.x * next.z - flat.z * next.x;
    lean.current += (THREE.MathUtils.clamp(turn * 14, -0.38, 0.38) - lean.current) * 0.08;

    if (bike.current) {
      bike.current.position.set(point.x, point.y + lift, point.z);
      ahead.copy(point).add(tangent);
      ahead.y += lift;
      bike.current.lookAt(ahead);
      bike.current.rotateZ(lean.current);
    }

    cameraTarget.copy(point).addScaledVector(flat, -9).addScaledVector(side, 3.5);
    cameraTarget.y = Math.max(point.y + 4.2, mountainRoadHeight(cameraTarget.x, cameraTarget.z) + 2.5);
    state.camera.position.lerp(cameraTarget, reduced ? 1 : 1 - Math.exp(-delta * 2.6));
    look.copy(point).addScaledVector(tangent, 5);
    look.y += 1.2;
    state.camera.lookAt(look);
  });

  return <Himalayan ref={bike} tank="#2F6E99" jacket="#A85E22" helmet="#F4F1EA" night={night} moving={speed} />;
}

function Stops({ reached }: { reached: number }) {
  const items = useMemo(
    () =>
      stopAt.map((t) => {
        const { point, flat, side } = frameAt(t);
        const position = point.clone().addScaledVector(side, roadHalfWidth + 1.2);
        return {
          position: [position.x, point.y, position.z] as [number, number, number],
          rotation: Math.atan2(flat.x, flat.z),
        };
      }),
    [],
  );
  const finish = useMemo(() => {
    const { point, flat, side } = frameAt(0.999);
    const base = point.clone().addScaledVector(flat, 7).addScaledVector(side, -6);
    const pole = point.clone().addScaledVector(side, 5).addScaledVector(flat, -3);
    const signFrame = frameAt(0.972);
    const park = frameAt(0.985);
    const heading = Math.atan2(park.flat.x, park.flat.z);
    const spot = (along: number, out: number) => {
      const p = park.point.clone().addScaledVector(park.flat, along).addScaledVector(park.side, out);
      return [p.x, mountainRoadHeight(p.x, p.z), p.z] as [number, number, number];
    };
    const summit = {
      bikes: [
        { position: spot(-3, roadHalfWidth + 3), rotation: heading + 2.2, colors: { tank: "#A8322B", jacket: "#2B3036", helmet: "#F4F1EA" } },
        { position: spot(0.2, roadHalfWidth + 3.4), rotation: heading + 2.1, colors: { tank: "#6B6F6A", jacket: "#2B3036", helmet: "#F4F1EA" } },
        { position: spot(3.4, roadHalfWidth + 3.2), rotation: heading + 2.3, colors: { tank: "#2A2C2E", jacket: "#2B3036", helmet: "#F4F1EA" } },
      ],
      riders: [
        { position: spot(-1.4, roadHalfWidth + 5.6), rotation: heading + Math.PI, jacket: "#C8342B", helmet: "#F4F1EA", pose: "helmet" as const, phase: 0 },
        { position: spot(1.8, roadHalfWidth + 6.2), rotation: heading + Math.PI * 0.85, jacket: "#2E5FA8", helmet: "#E6B422", pose: "photo" as const, phase: 1.3 },
        { position: spot(5, roadHalfWidth + 5.2), rotation: heading - Math.PI / 2, jacket: "#3B4A3A", helmet: "#9AA3AD", pose: "wave" as const, phase: 2.1 },
      ],
    };
    const sign = signFrame.point.clone().addScaledVector(signFrame.side, roadHalfWidth + 2.6);
    return {
      summit,
      sign: [sign.x, signFrame.point.y, sign.z] as [number, number, number],
      signRotation: Math.atan2(-signFrame.flat.x, -signFrame.flat.z) + 0.35,
      base: [base.x, mountainRoadHeight(base.x, base.z), base.z] as [number, number, number],
      flagStart: [base.x, point.y + 6, base.z] as [number, number, number],
      flagEnd: [pole.x, point.y + 3.6, pole.z] as [number, number, number],
    };
  }, []);
  return (
    <group>
      {items.map((item, index) => (
        <Milestone key={stopAt[index]} position={item.position} rotation={item.rotation} reached={reached > index} />
      ))}
      <Chorten position={finish.base} />
      <PassSign position={finish.sign} rotation={finish.signRotation} />
      {finish.summit.bikes.map((bike) => (
        <ParkedBike key={bike.colors.tank} position={bike.position} rotation={bike.rotation} colors={bike.colors} />
      ))}
      {finish.summit.riders.map((rider) => (
        <StandingRider key={rider.jacket} {...rider} />
      ))}
      <PrayerFlagLine from={finish.flagStart} to={finish.flagEnd} count={14} sag={1.2} />
    </group>
  );
}

const herd: [number, number, number, number][] = [
  [-4, 24, 0.6, 0],
  [-1, 27, 1.3, 2.4],
  [22, 30, -0.5, 4.1],
  [36, -10, 2.4, 1.1],
  [39, -7, 2.0, 3.3],
  [58, 24, -1.0, 5.2],
];

type RideSceneProps = {
  night: boolean;
  active: boolean;
  reduced: boolean;
  progress: MotionValue<number>;
  reached: number;
};

export default function RideScene({ night, active, reduced, progress, reached }: RideSceneProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [-70, 6, 84], fov: 48, near: 0.2, far: 1400 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <Atmosphere night={night} sunX={-90} skyZ={-300} fogNear={70} fogFar={380} />
      <Mountains />
      <Road />
      <Stops reached={reached} />
      {herd.map(([x, z, rotation, phase]) => (
        <Kiang key={`${x}-${z}`} position={[x, mountainRoadHeight(x, z) - 0.05, z]} rotation={rotation} phase={phase} />
      ))}
      <Rider progress={progress} night={night} reduced={reduced} />
    </Canvas>
  );
}

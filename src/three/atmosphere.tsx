import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const day = {
  zenith: new THREE.Color("#2E5FAE"),
  horizon: new THREE.Color("#AFCBEA"),
  fog: new THREE.Color("#B7CFE8"),
  hemiSky: new THREE.Color("#CFE0F5"),
  hemiGround: new THREE.Color("#B98A5C"),
};

const night = {
  zenith: new THREE.Color("#03060F"),
  horizon: new THREE.Color("#18213D"),
  fog: new THREE.Color("#121A33"),
  hemiSky: new THREE.Color("#3A4A85"),
  hemiGround: new THREE.Color("#0B0E1A"),
};

const skyVertex = `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const skyFragment = `
uniform vec3 zenith;
uniform vec3 horizon;
varying vec3 vDir;
void main() {
  float h = clamp(vDir.y, 0.0, 1.0);
  gl_FragColor = vec4(mix(horizon, zenith, pow(h, 0.55)), 1.0);
}
`;

function useStarGeometry(count: number) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.92 + 0.04);
      const r = 420;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [count]);
}

type AtmosphereProps = {
  night: boolean;
  sunX?: number;
  skyZ?: number;
  fogNear?: number;
  fogFar?: number;
};

export function Atmosphere({ night: isNight, sunX = 60, skyZ = -260, fogNear = 70, fogFar = 330 }: AtmosphereProps) {
  const mix = useRef(isNight ? 1 : 0);
  const scene = useThree((state) => state.scene);
  const sky = useRef<THREE.ShaderMaterial>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const sunLight = useRef<THREE.DirectionalLight>(null);
  const moonLight = useRef<THREE.DirectionalLight>(null);
  const sun = useRef<THREE.Group>(null);
  const moon = useRef<THREE.Group>(null);
  const stars = useRef<THREE.PointsMaterial>(null);
  const starGeometry = useStarGeometry(1400);
  const uniforms = useMemo(
    () => ({ zenith: { value: day.zenith.clone() }, horizon: { value: day.horizon.clone() } }),
    [],
  );
  const fog = useMemo(() => new THREE.Fog(day.fog.clone(), fogNear, fogFar), [fogNear, fogFar]);

  useFrame((_, delta) => {
    const target = isNight ? 1 : 0;
    mix.current += (target - mix.current) * (1 - Math.exp(-delta * 1.4));
    const t = mix.current;
    uniforms.zenith.value.copy(day.zenith).lerp(night.zenith, t);
    uniforms.horizon.value.copy(day.horizon).lerp(night.horizon, t);
    fog.color.copy(day.fog).lerp(night.fog, t);
    scene.fog = fog;
    if (hemi.current) {
      hemi.current.color.copy(day.hemiSky).lerp(night.hemiSky, t);
      hemi.current.groundColor.copy(day.hemiGround).lerp(night.hemiGround, t);
      hemi.current.intensity = THREE.MathUtils.lerp(1.25, 0.8, t);
    }
    const sunY = THREE.MathUtils.lerp(70, -70, t);
    const moonY = THREE.MathUtils.lerp(-70, 82, t);
    sun.current?.position.set(sunX, sunY, skyZ);
    moon.current?.position.set(sunX * 1.8, moonY, skyZ);
    if (sunLight.current) {
      sunLight.current.position.set(sunX, Math.max(sunY, 5), skyZ + 120);
      sunLight.current.intensity = THREE.MathUtils.lerp(2.6, 0, t);
    }
    if (moonLight.current) {
      moonLight.current.position.set(sunX * 1.8, Math.max(moonY, 5), skyZ + 120);
      moonLight.current.intensity = THREE.MathUtils.lerp(0, 1.6, t);
    }
    if (stars.current) stars.current.opacity = t;
  });

  return (
    <>
      <mesh scale={500} renderOrder={-1}>
        <sphereGeometry args={[1, 32, 16]} />
        <shaderMaterial
          ref={sky}
          side={THREE.BackSide}
          depthWrite={false}
          fog={false}
          uniforms={uniforms}
          vertexShader={skyVertex}
          fragmentShader={skyFragment}
        />
      </mesh>
      <points geometry={starGeometry}>
        <pointsMaterial ref={stars} color="#FFFFFF" size={1.6} sizeAttenuation={false} transparent opacity={0} fog={false} depthWrite={false} />
      </points>
      <group ref={sun}>
        <mesh>
          <sphereGeometry args={[11, 32, 16]} />
          <meshBasicMaterial color="#FFF4D6" fog={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[20, 32, 16]} />
          <meshBasicMaterial color="#FFE9B0" transparent opacity={0.22} fog={false} depthWrite={false} />
        </mesh>
      </group>
      <group ref={moon}>
        <mesh>
          <sphereGeometry args={[8, 32, 16]} />
          <meshBasicMaterial color="#ECEAF6" fog={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[14, 32, 16]} />
          <meshBasicMaterial color="#C9CFF2" transparent opacity={0.12} fog={false} depthWrite={false} />
        </mesh>
      </group>
      <hemisphereLight ref={hemi} args={[day.hemiSky, day.hemiGround, 1.25]} />
      <directionalLight ref={sunLight} color="#FFE7C2" intensity={2.6} />
      <directionalLight ref={moonLight} color="#9FB4FF" intensity={0} />
    </>
  );
}

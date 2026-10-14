import * as THREE from "three";
import { fbm, ridged, smoothstep } from "./noise";

type TerrainOptions = {
  width: number;
  depth: number;
  segmentsX: number;
  segmentsZ: number;
  centerZ: number;
  centerX?: number;
  height: (x: number, z: number) => number;
};

const palette = {
  water: new THREE.Color("#3B8E94"),
  sand: new THREE.Color("#D9C39B"),
  ochre: new THREE.Color("#C08A52"),
  sienna: new THREE.Color("#8A5636"),
  rock: new THREE.Color("#8E8A98"),
  slate: new THREE.Color("#9DA9BF"),
  snow: new THREE.Color("#F4F6F8"),
};

function colorFor(y: number, slope: number, target: THREE.Color) {
  if (y < -0.4) return target.copy(palette.water);
  if (y > 30 && slope > 0.45) return target.copy(palette.snow);
  if (y > 24) return target.copy(palette.slate).lerp(palette.snow, smoothstep(24, 34, y) * slope);
  if (slope < 0.55 && y > 3) return target.copy(palette.rock).lerp(palette.sienna, 0.35);
  if (y < 0.8) return target.copy(palette.sand);
  if (y < 7) return target.copy(palette.sand).lerp(palette.ochre, smoothstep(0.8, 7, y));
  if (y < 16) return target.copy(palette.ochre).lerp(palette.sienna, smoothstep(7, 16, y));
  return target.copy(palette.sienna).lerp(palette.slate, smoothstep(16, 24, y));
}

export function createTerrain({ width, depth, segmentsX, segmentsZ, centerZ, centerX = 0, height }: TerrainOptions) {
  const plane = new THREE.PlaneGeometry(width, depth, segmentsX, segmentsZ);
  plane.rotateX(-Math.PI / 2);
  plane.translate(centerX, 0, centerZ);
  const position = plane.attributes.position;
  for (let i = 0; i < position.count; i += 1) {
    position.setY(i, height(position.getX(i), position.getZ(i)));
  }
  const geometry = plane.toNonIndexed();
  plane.dispose();
  geometry.computeVertexNormals();
  const positions = geometry.attributes.position;
  const colors = new Float32Array(positions.count * 3);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const color = new THREE.Color();
  for (let i = 0; i < positions.count; i += 3) {
    a.fromBufferAttribute(positions, i);
    b.fromBufferAttribute(positions, i + 1);
    c.fromBufferAttribute(positions, i + 2);
    normal.copy(c).sub(b).cross(a.clone().sub(b)).normalize();
    const y = (a.y + b.y + c.y) / 3;
    colorFor(y, Math.abs(normal.y), color);
    const shade = 0.94 + ((i * 7919) % 13) / 100;
    for (let k = 0; k < 3; k += 1) {
      colors[(i + k) * 3] = color.r * shade;
      colors[(i + k) * 3 + 1] = color.g * shade;
      colors[(i + k) * 3 + 2] = color.b * shade;
    }
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

export function heroHeight(x: number, z: number) {
  const far = smoothstep(-30, -110, z);
  const sides = smoothstep(70, 150, Math.abs(x)) * smoothstep(10, -40, z);
  const mountain = Math.max(far, sides * 0.7);
  let h = mountain * (4 + ridged(x * 0.018 + 3.1, z * 0.018) * 58);
  h += (1 - mountain) * fbm(x * 0.06, z * 0.06) * 1.8;
  const lake = Math.hypot((x + 22) / 34, (z + 46) / 9);
  if (lake < 1) h = Math.min(h, -1.6 + lake * 1.6);
  return h;
}

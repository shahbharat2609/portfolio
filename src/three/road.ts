import * as THREE from "three";
import { fbm, ridged, smoothstep } from "./noise";

export { stopAt } from "./stops";

type Segment =
  | { kind: "line"; length: number; rise: number; wide: number }
  | { kind: "arc"; radius: number; turn: number; rise: number; wide: number };

const route: Segment[] = [
  { kind: "line", length: 24, rise: 1.5, wide: 10 },
  { kind: "arc", radius: 6.5, turn: -Math.PI, rise: 1.6, wide: 6 },
  { kind: "line", length: 22, rise: 2.4, wide: 6 },
  { kind: "arc", radius: 6.5, turn: Math.PI, rise: 1.6, wide: 6 },
  { kind: "line", length: 22, rise: 2.4, wide: 6 },
  { kind: "arc", radius: 6.5, turn: -Math.PI, rise: 1.6, wide: 6 },
  { kind: "line", length: 22, rise: 2.4, wide: 6 },
  { kind: "arc", radius: 6.5, turn: Math.PI, rise: 1.6, wide: 8 },
  { kind: "line", length: 10, rise: 1.0, wide: 14 },
  { kind: "arc", radius: 30, turn: -0.55, rise: 0.6, wide: 30 },
  { kind: "line", length: 18, rise: 0, wide: 46 },
  { kind: "arc", radius: 60, turn: 0.45, rise: 0, wide: 46 },
  { kind: "arc", radius: 60, turn: -0.6, rise: 0, wide: 46 },
  { kind: "line", length: 22, rise: 0.4, wide: 40 },
  { kind: "arc", radius: 22, turn: -1.1, rise: 2.5, wide: 14 },
  { kind: "line", length: 14, rise: 3, wide: 8 },
  { kind: "arc", radius: 11, turn: 2.4, rise: 4, wide: 6 },
  { kind: "line", length: 16, rise: 4, wide: 6 },
  { kind: "arc", radius: 12, turn: -2.2, rise: 3.6, wide: 6 },
  { kind: "line", length: 14, rise: 2.4, wide: 8 },
  { kind: "arc", radius: 26, turn: 0.6, rise: 1.2, wide: 14 },
  { kind: "line", length: 14, rise: 0.2, wide: 18 },
];

type RawPoint = { x: number; y: number; z: number; wide: number };

function trace() {
  const points: RawPoint[] = [];
  let x = -64;
  let z = 76;
  let y = 0;
  let heading = 0;
  points.push({ x, y, z, wide: 10 });
  for (const segment of route) {
    const length = segment.kind === "line" ? segment.length : segment.radius * Math.abs(segment.turn);
    const steps = Math.max(4, Math.ceil(length / 0.8));
    const startY = y;
    for (let i = 1; i <= steps; i += 1) {
      if (segment.kind === "arc") heading += segment.turn / steps;
      x += Math.cos(heading) * (length / steps);
      z += Math.sin(heading) * (length / steps);
      const k = i / steps;
      y = startY + segment.rise * (k * k * (3 - 2 * k));
      points.push({ x, y, z, wide: segment.wide });
    }
  }
  for (let pass = 0; pass < 3; pass += 1) {
    for (let i = 1; i < points.length - 1; i += 1) {
      points[i].y = (points[i - 1].y + points[i].y * 2 + points[i + 1].y) / 4;
    }
  }
  return points;
}

const raw = trace();

export const roadCurve = new THREE.CatmullRomCurve3(
  raw.map((p) => new THREE.Vector3(p.x, p.y, p.z)),
  false,
  "centripetal",
);

export const roadHalfWidth = 1.9;

const cell = 12;
const grid = new Map<string, RawPoint[]>();
for (const point of raw) {
  const key = `${Math.floor(point.x / cell)},${Math.floor(point.z / cell)}`;
  const bucket = grid.get(key);
  if (bucket) bucket.push(point);
  else grid.set(key, [point]);
}

function nearestRoadPoint(x: number, z: number) {
  const cx = Math.floor(x / cell);
  const cz = Math.floor(z / cell);
  let best = Infinity;
  let nearest = raw[0];
  for (let ring = 0; ring <= 30; ring += 1) {
    for (let i = cx - ring; i <= cx + ring; i += 1) {
      for (let j = cz - ring; j <= cz + ring; j += 1) {
        if (Math.max(Math.abs(i - cx), Math.abs(j - cz)) !== ring) continue;
        const bucket = grid.get(`${i},${j}`);
        if (!bucket) continue;
        for (const p of bucket) {
          const d = (p.x - x) * (p.x - x) + (p.z - z) * (p.z - z);
          if (d < best) {
            best = d;
            nearest = p;
          }
        }
      }
    }
    const reach = ring * cell;
    if (best < reach * reach) break;
  }
  return { nearest, distance: Math.sqrt(best) };
}

export function frameAt(t: number) {
  const point = roadCurve.getPointAt(t);
  const tangent = roadCurve.getTangentAt(t);
  const flat = new THREE.Vector3(tangent.x, 0, tangent.z).normalize();
  const side = new THREE.Vector3(flat.z, 0, -flat.x);
  return { point, tangent, flat, side };
}

export function mountainRoadHeight(x: number, z: number) {
  const { nearest, distance } = nearestRoadPoint(x, z);
  const shoulder = nearest.y - 0.12;
  const slope = smoothstep(roadHalfWidth + 1.4, roadHalfWidth + 9, distance);
  const reach = Math.max(nearest.wide, 22);
  const plateau = smoothstep(reach, reach + 55, distance);
  const peaks = ridged(x * 0.022 + 5.3, z * 0.022 + 2.1) * 60 * plateau;
  const hillside = (distance - roadHalfWidth - 1.4) * 0.28 * (1 - plateau) * (nearest.wide < 12 ? 1 : 0.15);
  const texture = fbm(x * 0.09, z * 0.09) * 1.4;
  const terrain = nearest.y - 0.6 + texture + Math.max(hillside, 0) + peaks;
  return THREE.MathUtils.lerp(shoulder, terrain, slope);
}

export function createRibbon(width: number, lift: number, samplesCount = 1600) {
  const positions: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i <= samplesCount; i += 1) {
    const { point, side } = frameAt(i / samplesCount);
    const left = point.clone().addScaledVector(side, width / 2);
    const right = point.clone().addScaledVector(side, -width / 2);
    positions.push(left.x, point.y + lift, left.z, right.x, point.y + lift, right.z);
    if (i < samplesCount) {
      const a = i * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

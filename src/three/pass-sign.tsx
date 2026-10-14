import { useEffect, useMemo } from "react";
import * as THREE from "three";

type V3 = [number, number, number];

function drawBoard() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 576;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#F2C200";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 18;
  ctx.strokeRect(22, 22, canvas.width - 44, canvas.height - 44);
  ctx.lineWidth = 4;
  ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);
  ctx.fillStyle = "#111111";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "800 132px Archivo, 'Arial Black', sans-serif";
  ctx.fillText("TANGLANG LA", canvas.width / 2, 170);
  ctx.fillRect(140, 250, canvas.width - 280, 6);
  ctx.font = "700 72px Archivo, Arial, sans-serif";
  ctx.fillText("ALTITUDE 17,582 FT", canvas.width / 2, 330);
  ctx.font = "600 52px 'IBM Plex Mono', monospace";
  ctx.fillText("5,328 M", canvas.width / 2, 412);
  ctx.font = "600 34px 'IBM Plex Sans', Arial, sans-serif";
  ctx.fillText("MANALI – LEH HIGHWAY", canvas.width / 2, 482);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function PassSign({ position, rotation }: { position: V3; rotation: number }) {
  const texture = useMemo(drawBoard, []);

  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (cancelled) return;
      const fresh = drawBoard();
      texture.image = fresh.image;
      texture.needsUpdate = true;
    });
    return () => {
      cancelled = true;
      texture.dispose();
    };
  }, [texture]);

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[-1.35, 1.35].map((x) => (
        <mesh key={x} position={[x, 1.25, -0.04]}>
          <cylinderGeometry args={[0.07, 0.07, 2.5, 8]} />
          <meshStandardMaterial color="#2B2E33" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 2.05, -0.02]}>
        <boxGeometry args={[3.3, 1.9, 0.06]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>
      <mesh position={[0, 2.05, 0.015]}>
        <planeGeometry args={[3.2, 1.8]} />
        <meshStandardMaterial map={texture} roughness={0.7} />
      </mesh>
    </group>
  );
}

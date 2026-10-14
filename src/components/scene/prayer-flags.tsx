import { flagColors } from "@/data/site";

type PrayerFlagsProps = {
  from: [number, number];
  control: [number, number];
  to: [number, number];
  count: number;
  width?: number;
  height?: number;
  stringColor?: string;
};

function pointAt(t: number, a: [number, number], c: [number, number], b: [number, number]) {
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]];
}

const sway = ["", "b", "c"];

export function PrayerFlags({
  from,
  control,
  to,
  count,
  width = 20,
  height = 24,
  stringColor = "rgba(255,255,255,.55)",
}: PrayerFlagsProps) {
  const flags = Array.from({ length: count }, (_, index) => {
    const t = (index + 0.5) / count;
    const [x, y] = pointAt(t, from, control, to);
    return { x: x - width / 2, y, color: flagColors[index % flagColors.length], sway: sway[index % 3] };
  });
  return (
    <g>
      <path
        d={`M${from[0]} ${from[1]} Q${control[0]} ${control[1]} ${to[0]} ${to[1]}`}
        fill="none"
        stroke={stringColor}
        strokeWidth="1.2"
      />
      {flags.map((flag) => (
        <rect
          key={`${flag.x}-${flag.y}`}
          className={`flag ${flag.sway}`}
          x={flag.x}
          y={flag.y}
          width={width}
          height={height}
          fill={flag.color}
        />
      ))}
    </g>
  );
}

export function FlagStrip({ className = "h-2.5" }: { className?: string }) {
  return (
    <div className={`flex ${className}`} aria-hidden="true">
      {flagColors.map((color) => (
        <span key={color} className="flex-1" style={{ background: color }} />
      ))}
    </div>
  );
}

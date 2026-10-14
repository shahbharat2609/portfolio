import { useId } from "react";

const scarf: [number, number, string][] = [
  [66, 166, "#2E5FA8"],
  [83, 170, "#F4F1EA"],
  [100, 171, "#C8342B"],
  [117, 170, "#2E8B57"],
  [134, 166, "#E6B422"],
];

const rings: [number, number, number][] = [
  [46, 104, 6],
  [154, 104, 6],
  [38, 134, 5],
  [162, 134, 5],
  [62, 172, 4.5],
  [138, 172, 4.5],
];

const dots: [number, number, number][] = [
  [100, 60, 3.5],
  [88, 66, 2.6],
  [112, 66, 2.6],
  [80, 56, 2.2],
  [120, 56, 2.2],
];

function Eye({ x }: { x: number }) {
  return (
    <>
      <rect x={x} y="90" width="24" height="40" rx="12" fill="#16251F" />
      <ellipse cx={x + 12} cy="122" rx="7" ry="4" fill="#5CC8C9" opacity="0.9" />
      <path
        d={`M${x + 9} 97 Q${x + 11} 105 ${x + 18} 108 Q${x + 11} 111 ${x + 9} 119 Q${x + 7} 111 ${x} 108 Q${x + 7} 105 ${x + 9} 97 Z`}
        fill="#FFFDF4"
      />
    </>
  );
}

export function Shan({ className }: { className?: string }) {
  const felt = `felt-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg viewBox="0 0 200 200" className={className} style={{ overflow: "visible" }} aria-hidden="true">
      <defs>
        <filter id={felt} x="-3%" y="-3%" width="106%" height="106%">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed="11" result="fibre" />
          <feColorMatrix
            in="fibre"
            type="matrix"
            values=".06 .06 .06 0 .41 .06 .06 .06 0 .41 .06 .06 .06 0 .41 0 0 0 1 0"
          />
          <feComposite in2="SourceGraphic" operator="in" result="grain" />
          <feBlend in="SourceGraphic" in2="grain" mode="soft-light" />
        </filter>
      </defs>
      <ellipse className="cub-shadow" cx="100" cy="196" rx="54" ry="6" fill="rgba(10, 15, 30, 0.22)" />
      <g className="cub-float">
        <g className="cub-tail">
          <path
            d="M150 156 C188 156 196 120 178 100 C168 90 158 98 165 107 C176 120 168 142 144 142 Z"
            fill="#E6E0D4"
            filter={`url(#${felt})`}
          />
          <circle cx="176" cy="122" r="5" fill="none" stroke="#5B5F66" strokeWidth="3" />
          <circle cx="164" cy="146" r="4.5" fill="none" stroke="#5B5F66" strokeWidth="3" />
          <path d="M170 100 C176 98 180 102 178 108" fill="none" stroke="#3A3E45" strokeWidth="5" strokeLinecap="round" />
        </g>
        <g className="cub-ear">
          <path d="M50 74 C42 44 58 32 80 54 Z" fill="#EDE8DE" />
          <path d="M55 64 C52 48 60 44 72 55 Z" fill="#D9BFB4" />
        </g>
        <g className="cub-ear r">
          <path d="M150 74 C158 44 142 32 120 54 Z" fill="#EDE8DE" />
          <path d="M145 64 C148 48 140 44 128 55 Z" fill="#D9BFB4" />
        </g>
        <path
          d="M100 46 C150 46 178 80 178 120 C178 160 148 184 100 184 C52 184 22 160 22 120 C22 80 50 46 100 46 Z"
          fill="#EDE8DE"
          filter={`url(#${felt})`}
        />
        <ellipse cx="68" cy="74" rx="20" ry="9" fill="#FFFFFF" opacity="0.5" transform="rotate(-22 68 74)" />
        <g fill="none" stroke="#5B5F66" strokeWidth="3">
          {rings.map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
          ))}
        </g>
        <g fill="#5B5F66">
          {dots.map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
          ))}
        </g>
        <g className="blink">
          <Eye x={64} />
          <Eye x={112} />
        </g>
        <ellipse cx="100" cy="146" rx="27" ry="17" fill="#FFFDF7" />
        <ellipse cx="52" cy="146" rx="10" ry="6" fill="#F2B3B0" opacity="0.8" />
        <ellipse cx="148" cy="146" rx="10" ry="6" fill="#F2B3B0" opacity="0.8" />
        <path d="M92 136 L108 136 L100 145 Z" fill="#E08E98" stroke="#E08E98" strokeWidth="3" strokeLinejoin="round" />
        <path
          d="M100 145 V149 M100 149 Q94 155 89 150 M100 149 Q106 155 111 150"
          fill="none"
          stroke="#3A3E45"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M72 146 L52 142 M72 151 L54 155 M128 146 L148 142 M128 151 L146 155"
          stroke="#9AA0A8"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M56 164 Q100 176 144 164" fill="none" stroke="#3A3E45" strokeWidth="1.6" />
        {scarf.map(([x, y, color]) => (
          <path key={x} d={`M${x - 8} ${y} L${x + 8} ${y} L${x} ${y + 13} Z`} fill={color} />
        ))}
      </g>
    </svg>
  );
}

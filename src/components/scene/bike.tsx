import type { BikeColors } from "@/data/site";

type BikeProps = BikeColors & {
  dust?: boolean;
  beamLength?: number;
};

function Wheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const rim = r - 3.6;
  const spokes = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const offset = i % 2 ? 0.35 : -0.35;
    return {
      x1: cx + Math.cos(angle + offset) * 2.2,
      y1: cy + Math.sin(angle + offset) * 2.2,
      x2: cx + Math.cos(angle) * rim,
      y2: cy + Math.sin(angle) * rim,
    };
  });
  return (
    <g>
      <circle cx={cx} cy={cy} r={r - 1.6} fill="none" stroke="#17191C" strokeWidth="4.2" />
      <circle cx={cx} cy={cy} r={r + 0.4} fill="none" stroke="#17191C" strokeWidth="1.2" strokeDasharray="1.6 1.6" />
      <g className="wheel">
        <circle cx={cx} cy={cy} r={rim} fill="none" stroke="#2A2C30" strokeWidth="1.2" />
        {spokes.map((s) => (
          <line key={`${s.x2}-${s.y2}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#C9CED4" strokeWidth="0.55" />
        ))}
        <circle cx={cx} cy={cy} r="2.6" fill="#B8BEC5" />
      </g>
    </g>
  );
}

export function BikeShape({ tank, jacket, helmet, dust = true, beamLength = 200 }: BikeProps) {
  return (
    <>
      <polygon className="beam" points={`101,26 ${beamLength},6 ${beamLength},52`} fill="rgba(255, 228, 150, 0.3)" />
      {dust && (
        <>
          <circle className="puff" cx="8" cy="68" r="5" fill="#C9B79A" />
          <circle className="puff b" cx="3" cy="66" r="4" fill="#C9B79A" />
        </>
      )}
      <Wheel cx={26} cy={57} r={15} />
      <Wheel cx={104} cy={55} r={17} />
      <g className="bounce">
        <path d="M26 57 L54 50" stroke="#16181B" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M54 34 L30 30 L12 26" fill="none" stroke="#16181B" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 48 L45 33" stroke="#C59A2A" strokeWidth="2.6" strokeLinecap="round" />
        <rect x="9" y="33" width="24" height="18" rx="2" fill="#AEB4BB" stroke="#2A2C30" strokeWidth="1" />
        <path d="M9 37 H33" stroke="#2A2C30" strokeWidth="1.4" />
        <rect x="50" y="42" width="22" height="14" rx="3" fill="#2B2E33" />
        <circle cx="59" cy="50" r="5" fill="#9AA0A8" />
        <g transform="rotate(18 67 36)">
          <rect x="60" y="29" width="13" height="14" rx="1.5" fill="#3A3E44" />
          {[31, 34, 37, 40].map((y) => (
            <path key={y} d={`M59 ${y} H74`} stroke="#9AA0A8" strokeWidth="1" />
          ))}
        </g>
        <path d="M47 58 H74 L77 53" fill="none" stroke="#9AA0A8" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M74 40 C80 50 75 58 63 58 L41 56 C35 55 31 51 29 46"
          fill="none"
          stroke="#2A2C30"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect x="13" y="38" width="20" height="6.5" rx="3.2" fill="#202226" transform="rotate(-20 23 41)" />
        <path d="M90 22 L77 32 L58 34" fill="none" stroke="#16181B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M90 23 L79 44 L73 55" fill="none" stroke="#16181B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M38 32 L58 33 L56 43 L41 42 Z" fill={tank} />
        <path d="M20 27 L40 28 L40 31 L20 30 Z" fill="#121315" />
        <path d="M40 31 Q51 27 64 29 L64 33 L40 34 Z" fill="#121315" />
        <rect x="9" y="24" width="15" height="2" fill="#16181B" />
        <rect x="7" y="27" width="4" height="3" fill="#C8342B" />
        <path d="M62 29 C66 20 84 18 90 24 L88 32 C80 34 68 34 62 32 Z" fill={tank} />
        <path d="M67 23 C73 20 81 20 86 23" fill="none" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="1.2" />
        <path d="M64 37 L66 24 L86 21 L89 34" fill="none" stroke="#16181B" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M104 55 L99 40" stroke="#16181B" strokeWidth="5" strokeLinecap="round" />
        <path d="M99 40 L92 22" stroke="#C9CED4" strokeWidth="3" strokeLinecap="round" />
        <path d="M93 43 Q104 35 116 43 L114 45 Q104 38 95 45 Z" fill={tank} />
        <path d="M92 34 L94 14 L100 12" fill="none" stroke="#16181B" strokeWidth="1.4" strokeLinejoin="round" />
        <circle cx="99" cy="26" r="4.6" fill="#16181B" />
        <circle cx="99.6" cy="26" r="3" fill="#FFF3CF" />
        <polygon points="93,5 99,3 101,18 95,20" fill="#5C6A78" fillOpacity="0.55" stroke="#16181B" strokeWidth="0.8" />
        <path d="M86 17 L94 14" stroke="#16181B" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M90 15 L88 8" stroke="#16181B" strokeWidth="0.8" />
        <rect x="85.5" y="5.5" width="5" height="2.6" rx="1" fill="#16181B" />
        <rect x="41" y="8" width="9" height="15" rx="2" fill="#3B4148" />
        <path d="M50 28 L64 33" stroke="#2B3036" strokeWidth="7" strokeLinecap="round" />
        <path d="M64 33 L60 48" stroke="#2B3036" strokeWidth="6" strokeLinecap="round" />
        <rect x="55" y="46" width="10" height="6" rx="1.5" fill="#16181B" />
        <path d="M48 28 L59 8" stroke={jacket} strokeWidth="11" strokeLinecap="round" />
        <path d="M59 10 L73 15 L87 16" fill="none" stroke={jacket} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="87.5" cy="16" r="2" fill="#16181B" />
        <circle cx="63" cy="1" r="6.8" fill={helmet} stroke="#16181B" strokeWidth="1.2" />
        <path d="M65 -2 Q70 -1 70 4 L65 4 Z" fill="#1E2630" />
        <path d="M63 -6 L74 -4" stroke={helmet} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M67 6 L71 7" stroke="#16181B" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </>
  );
}

export function Bike(props: BikeProps & { className?: string; style?: React.CSSProperties }) {
  const { className, style, ...colors } = props;
  return (
    <svg viewBox="0 -9 124 84" className={className} style={{ overflow: "visible", ...style }} aria-hidden="true">
      <BikeShape {...colors} />
    </svg>
  );
}

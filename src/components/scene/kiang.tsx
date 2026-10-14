type KiangProps = {
  x: number;
  y: number;
  scale: number;
  flip?: boolean;
};

export function Kiang({ x, y, scale, flip = false }: KiangProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <g className="graze">
        <path d="M13 21 Q6 28 8 37" fill="none" stroke="#3B2618" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M7 35 Q8 40 10 41" fill="none" stroke="#3B2618" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M17 27 L15.5 35 L17 44 L19 44 L18.4 35 L21 28 Z" fill="#E6DCCB" />
        <path d="M47 27 L46.5 44 L48.5 44 L50 28 Z" fill="#E6DCCB" />
        <path
          d="M12 21 C11 14 20 11.5 31 11.5 C41 11.5 48 12 53 14 C55 11 58 7.5 61 5.5 C63 4.2 65.5 4.4 67 5.6 L72.5 10 C74 11.3 73.6 13.4 71.6 13.6 L67.5 13.6 C65 15.4 62 19.5 59 23.5 C57 27 53 29.5 47 29.5 L23 29.5 C16.5 29.5 12.5 26.5 12 21 Z"
          fill="#A8673A"
        />
        <path d="M17 26.5 C25 30.5 45 30.5 55 25.5 L56 28 C47 31.6 25 31.8 17.5 29.2 Z" fill="#EFE6D6" />
        <path d="M53.5 22 C55 24 56.5 25.5 57.5 24" fill="none" stroke="#EFE6D6" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M16 14.4 C26 10.8 44 10.6 54 14" fill="none" stroke="#6E4326" strokeWidth="1.1" />
        <path d="M54 13.6 C56 10 59 6.8 62.5 5" fill="none" stroke="#3B2618" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M68.5 9.6 C71 9.4 73.4 10.6 72.6 12.8 C71.6 14 69.5 13.6 68.4 12.6 Z" fill="#EFE6D6" />
        <path d="M63.5 5.4 L64.4 0 L66.2 5 Z" fill="#7A4A28" />
        <path d="M64.1 1.4 L64.4 0 L64.9 1.4 Z" fill="#3B2618" />
        <circle cx="66.4" cy="7.6" r="0.75" fill="#120C08" />
        <path d="M21 28 L19.5 36 L21.2 44 L23.2 44 L22.6 36 L25 29 Z" fill="#EFE6D6" />
        <path d="M51 28 L51.2 44 L53.2 44 L54.4 28.5 Z" fill="#EFE6D6" />
        {[
          [15.4, 44],
          [19.6, 44],
          [45.9, 44],
          [50.6, 44],
        ].map(([hx, hy]) => (
          <rect key={hx} x={hx} y={hy} width="3.2" height="1.6" rx="0.4" fill="#2A211B" />
        ))}
      </g>
    </g>
  );
}

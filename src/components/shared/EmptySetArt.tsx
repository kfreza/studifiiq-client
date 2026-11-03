export default function Cs_EmptySetArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 300" role="img" aria-label="An empty studio set with a softbox light and a tape mark on the floor" className={className}>
      {/* cyc wall */}
      <path d="M30 20 H450 V196 Q450 252 394 252 H86 Q30 252 30 196 Z" className="fill-muted" />
      <ellipse cx="240" cy="246" rx="190" ry="10" className="fill-foreground/5" />

      {/* light beam */}
      <path d="M338 74 L338 146 L262 246 L118 246 Z" className="fill-primary/10" />

      {/* light stand */}
      <g className="stroke-foreground/60" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M392 120 V232" />
        <path d="M392 222 L370 250" />
        <path d="M392 222 L414 250" />
        <path d="M392 222 V250" />
      </g>

      {/* softbox */}
      <path d="M392 92 L338 70 V150 L392 128 Z" className="fill-primary" />
      <path d="M338 70 V150" className="stroke-primary-foreground/70" strokeWidth="2" />

      {/* tape mark */}
      <g transform="translate(190 236) rotate(45)">
        <rect x="-18" y="-3.5" width="36" height="7" rx="1" className="fill-cs-tape" />
        <rect x="-3.5" y="-18" width="7" height="36" rx="1" className="fill-cs-tape" />
      </g>
    </svg>
  );
}

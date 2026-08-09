import { cn } from "@/lib/utils";

// Dograh brand lockup — rebranded to the ElevenLabs-inspired design system.
//
// WORDMARK: lowercase "dograh" rendered as inline SVG <text>, so it inherits the
// page's Inter typeface and stays razor-sharp at any size. fill="currentColor"
// makes it theme-aware (dark glyph on light surfaces, light on dark) with no
// duplicate assets; pass `inverse` to force white on an always-dark surface.
//
// MARK: the signature gradient "voice orb" — a squircle filled with the brand's
// indigo -> violet -> pink gradient carrying a minimalist white soundwave. Used
// in the sidebar header and anywhere a compact brand glyph is needed.
//
// Height is controlled by the caller via className (e.g. "h-7"); width stays
// auto so each lockup keeps its aspect ratio.
const ORB_GRADIENT_ID = "dograh-voice-orb-gradient";

function VoiceOrbMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("block h-auto", className)} role="img" aria-label="Dograh">
      <defs>
        <linearGradient id={ORB_GRADIENT_ID} x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6EA8FF" />
          <stop offset="0.5" stopColor="#9B6BFF" />
          <stop offset="1" stopColor="#F06AB8" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="32" height="32" rx="9" fill={`url(#${ORB_GRADIENT_ID})`} />
      <g fill="#ffffff">
        <rect x="8.5" y="13" width="2.2" height="6" rx="1.1" opacity="0.82" />
        <rect x="12.6" y="10" width="2.2" height="12" rx="1.1" opacity="0.92" />
        <rect x="16.7" y="7.5" width="2.2" height="17" rx="1.1" />
        <rect x="20.8" y="11" width="2.2" height="10" rx="1.1" opacity="0.88" />
      </g>
    </svg>
  );
}

export function BrandLogo({
  className,
  inverse = false,
  mark = false,
}: {
  className?: string;
  inverse?: boolean;
  mark?: boolean;
}) {
  if (mark) {
    return <VoiceOrbMark className={cn("w-auto select-none", className)} />;
  }
  return (
    <svg
      viewBox="0 0 200 56"
      preserveAspectRatio="xMinYMid meet"
      className={cn("block w-auto select-none", className)}
      role="img"
      aria-label="Dograh"
    >
      <text
        x="0"
        y="43"
        textLength="190"
        lengthAdjust="spacingAndGlyphs"
        fill={inverse ? "#ffffff" : "currentColor"}
        style={{
          fontFamily: "var(--font-sans), Inter, system-ui, sans-serif",
          fontWeight: 700,
          fontSize: 47,
          letterSpacing: "-0.025em",
        }}
      >
        dograh
      </text>
    </svg>
  );
}

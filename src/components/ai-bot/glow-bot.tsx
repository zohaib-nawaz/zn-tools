"use client";

import { useId, type SVGProps } from "react";

type GlowBotProps = {
  size?: number;
  animated?: boolean;
} & Omit<SVGProps<SVGSVGElement>, "children">;

export function GlowBot({
  size = 280,
  animated = true,
  className,
  ...props
}: GlowBotProps) {
  const uid = useId().replace(/:/g, "");
  const ids = {
    body: `body-${uid}`,
    bodySide: `body-side-${uid}`,
    bodySpec: `body-spec-${uid}`,
    bodyShade: `body-shade-${uid}`,
    screen: `screen-${uid}`,
    screenGlow: `screen-glow-${uid}`,
    hand: `hand-${uid}`,
    handSpec: `hand-spec-${uid}`,
    shadow: `shadow-${uid}`,
    blur: `blur-${uid}`,
    scan: `scan-${uid}`,
    faceBloom: `face-bloom-${uid}`,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 440"
      width={size}
      height={size * (440 / 400)}
      role="img"
      aria-label="Glow bot mascot"
      className={className}
      {...props}
    >
      <defs>
        <radialGradient id={ids.shadow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b93a1" stopOpacity="0.42" />
          <stop offset="45%" stopColor="#8b93a1" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#8b93a1" stopOpacity="0" />
        </radialGradient>

        {/* Main plastic body — bright top, cool grey bottom */}
        <radialGradient id={ids.body} cx="42%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#f5f6f8" />
          <stop offset="68%" stopColor="#e4e7ee" />
          <stop offset="100%" stopColor="#c9cfda" />
        </radialGradient>

        <linearGradient id={ids.bodySide} x1="0%" y1="40%" x2="100%" y2="60%">
          <stop offset="0%" stopColor="#b8c0cd" stopOpacity="0.45" />
          <stop offset="22%" stopColor="#b8c0cd" stopOpacity="0" />
          <stop offset="78%" stopColor="#b8c0cd" stopOpacity="0" />
          <stop offset="100%" stopColor="#b8c0cd" stopOpacity="0.4" />
        </linearGradient>

        <radialGradient id={ids.bodySpec} cx="38%" cy="24%" r="42%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        <radialGradient id={ids.bodyShade} cx="50%" cy="88%" r="42%">
          <stop offset="0%" stopColor="#9aa3b3" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#9aa3b3" stopOpacity="0" />
        </radialGradient>

        <radialGradient id={ids.hand} cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#eef0f4" />
          <stop offset="100%" stopColor="#c5ccd8" />
        </radialGradient>

        <radialGradient id={ids.handSpec} cx="35%" cy="28%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        <linearGradient id={ids.screen} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#2a2d36" />
          <stop offset="35%" stopColor="#12141a" />
          <stop offset="100%" stopColor="#050608" />
        </linearGradient>

        <radialGradient id={ids.screenGlow} cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        <filter id={ids.blur} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" />
        </filter>

        <filter id={ids.faceBloom} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Dense scanline fill like the PNG face */}
        <pattern
          id={ids.scan}
          width="100%"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <rect width="100%" height="4" fill="#f4f4f5" />
          <rect y="2.1" width="100%" height="1.5" fill="#a1a1aa" opacity="0.65" />
        </pattern>

        {animated ? (
          <style>{`
            @keyframes glow-float-${uid} {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-9px); }
            }
            @keyframes glow-hand-l-${uid} {
              0%, 100% { transform: translate(0, 0) rotate(-22deg); }
              50% { transform: translate(-3px, 5px) rotate(-28deg); }
            }
            @keyframes glow-hand-r-${uid} {
              0%, 100% { transform: translate(0, 0) rotate(22deg); }
              50% { transform: translate(3px, -4px) rotate(28deg); }
            }
            .glow-body-${uid} {
              transform-origin: 200px 210px;
              animation: glow-float-${uid} 3.6s ease-in-out infinite;
            }
            .glow-hand-l-${uid} {
              transform-origin: 58px 245px;
              animation: glow-hand-l-${uid} 2.5s ease-in-out infinite;
            }
            .glow-hand-r-${uid} {
              transform-origin: 342px 245px;
              animation: glow-hand-r-${uid} 2.5s ease-in-out infinite 0.15s;
            }
          `}</style>
        ) : null}
      </defs>

      {/* Soft ground shadow */}
      <ellipse cx="200" cy="408" rx="108" ry="18" fill={`url(#${ids.shadow})`} />

      <g className={animated ? `glow-body-${uid}` : undefined}>
        {/* ---- Floating hands (detached capsules) ---- */}
        <g className={animated ? `glow-hand-l-${uid}` : undefined}>
          <ellipse
            cx="52"
            cy="248"
            rx="22"
            ry="38"
            fill="#aeb6c4"
            opacity="0.22"
            filter={`url(#${ids.blur})`}
            transform="rotate(-22 52 248)"
          />
          <rect
            x="34"
            y="210"
            width="36"
            height="76"
            rx="18"
            fill={`url(#${ids.hand})`}
            transform="rotate(-22 52 248)"
          />
          <ellipse
            cx="48"
            cy="228"
            rx="10"
            ry="16"
            fill={`url(#${ids.handSpec})`}
            transform="rotate(-22 52 248)"
          />
        </g>

        <g className={animated ? `glow-hand-r-${uid}` : undefined}>
          <ellipse
            cx="348"
            cy="248"
            rx="22"
            ry="38"
            fill="#aeb6c4"
            opacity="0.22"
            filter={`url(#${ids.blur})`}
            transform="rotate(22 348 248)"
          />
          <rect
            x="330"
            y="210"
            width="36"
            height="76"
            rx="18"
            fill={`url(#${ids.hand})`}
            transform="rotate(22 348 248)"
          />
          <ellipse
            cx="344"
            cy="228"
            rx="10"
            ry="16"
            fill={`url(#${ids.handSpec})`}
            transform="rotate(22 348 248)"
          />
        </g>

        {/* Ambient soft halo behind head */}
        <ellipse
          cx="200"
          cy="220"
          rx="138"
          ry="138"
          fill="#b4bcc8"
          opacity="0.16"
          filter={`url(#${ids.blur})`}
        />

        {/* ---- Ear cones (pointier, sitting on top) ---- */}
        <path
          d="M118 118
             C110 96, 118 72, 136 68
             C148 66, 156 78, 158 98
             C148 108, 132 116, 118 118 Z"
          fill={`url(#${ids.body})`}
        />
        <path
          d="M282 118
             C290 96, 282 72, 264 68
             C252 66, 244 78, 242 98
             C252 108, 268 116, 282 118 Z"
          fill={`url(#${ids.body})`}
        />
        {/* Ear highlights */}
        <ellipse cx="132" cy="84" rx="10" ry="8" fill="#ffffff" opacity="0.7" />
        <ellipse cx="268" cy="84" rx="10" ry="8" fill="#ffffff" opacity="0.7" />

        {/* ---- Bulbous head (near-sphere squircle) ---- */}
        <rect
          x="62"
          y="88"
          width="276"
          height="276"
          rx="118"
          ry="118"
          fill={`url(#${ids.body})`}
        />
        <rect
          x="62"
          y="88"
          width="276"
          height="276"
          rx="118"
          ry="118"
          fill={`url(#${ids.bodySide})`}
        />
        <ellipse
          cx="200"
          cy="320"
          rx="95"
          ry="48"
          fill={`url(#${ids.bodyShade})`}
        />
        <ellipse
          cx="160"
          cy="155"
          rx="78"
          ry="58"
          fill={`url(#${ids.bodySpec})`}
        />

        {/* ---- Recessed black screen ---- */}
        {/* Bevel rim */}
        <rect
          x="106"
          y="148"
          width="188"
          height="158"
          rx="46"
          ry="46"
          fill="#d5dae3"
        />
        <rect
          x="110"
          y="152"
          width="180"
          height="150"
          rx="43"
          ry="43"
          fill="#9aa3b2"
        />
        {/* Glass */}
        <rect
          x="114"
          y="156"
          width="172"
          height="142"
          rx="40"
          ry="40"
          fill={`url(#${ids.screen})`}
        />
        <rect
          x="114"
          y="156"
          width="172"
          height="142"
          rx="40"
          ry="40"
          fill={`url(#${ids.screenGlow})`}
        />
        {/* Top glass reflection */}
        <path
          d="M128 172
             C148 164, 180 168, 198 178"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.2"
        />

        {/* ---- Face (scanline glow) ---- */}
        <g filter={`url(#${ids.faceBloom})`}>
          {/* Left eye — rounded square */}
          <rect
            x="144"
            y="188"
            width="44"
            height="40"
            rx="11"
            ry="11"
            fill={`url(#${ids.scan})`}
          />

          {/* Right eye — thicker short wink bar */}
          <rect
            x="220"
            y="198"
            width="44"
            height="16"
            rx="8"
            ry="8"
            fill={`url(#${ids.scan})`}
          />

          {/* Mouth — thick crescent smile like PNG */}
          <path
            d="M162 250
               C172 278, 228 278, 238 250
               C228 272, 172 272, 162 250 Z"
            fill={`url(#${ids.scan})`}
          />
        </g>
      </g>
    </svg>
  );
}

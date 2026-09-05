"use client";

import { useId, type SVGProps } from "react";
import { type AiBotVariant } from "./variants";

export type { AiBotVariant };

type AiBotProps = {
  variant?: AiBotVariant;
  size?: number;
  animated?: boolean;
} & Omit<SVGProps<SVGSVGElement>, "children">;

const THEMES = {
  vio: {
    label: "Vio",
    c0: "#6E00C2",
    c1: "#9A0BD8",
    c2: "#C81FC0",
    face: "#160F20",
    accent: "#C81FC0",
  },
  nova: {
    label: "Nova",
    c0: "#0D7377",
    c1: "#14A3A8",
    c2: "#2DD4BF",
    face: "#0A1F22",
    accent: "#2DD4BF",
  },
  pulse: {
    label: "Pulse",
    c0: "#C2410C",
    c1: "#EA580C",
    c2: "#F97316",
    face: "#1C1008",
    accent: "#F97316",
  },
  pip: {
    label: "Pip",
    c0: "#DB2777",
    c1: "#EC4899",
    c2: "#F9A8D4",
    face: "#2A0F1C",
    accent: "#F472B6",
  },
  mochi: {
    label: "Mochi",
    c0: "#4D7C0F",
    c1: "#65A30D",
    c2: "#A3E635",
    face: "#14200A",
    accent: "#84CC16",
  },
  bean: {
    label: "Bean",
    c0: "#B45309",
    c1: "#D97706",
    c2: "#FBBF24",
    face: "#1F1408",
    accent: "#F59E0B",
  },
} as const;

const WAVING_RIGHT = new Set<AiBotVariant>([
  "vio",
  "nova",
  "pip",
  "mochi",
]);

export function AiBot({
  variant = "vio",
  size = 180,
  animated = true,
  className,
  ...props
}: AiBotProps) {
  const uid = useId().replace(/:/g, "");
  const theme = THEMES[variant];
  const cg = `cg-${uid}`;
  const eg = `eg-${uid}`;
  const sheen = `sheen-${uid}`;
  const fill = `url(#${cg})`;
  const eye = `url(#${eg})`;
  const shine = `url(#${sheen})`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 220 250"
      width={size}
      height={size * (250 / 220)}
      role="img"
      aria-label={`${theme.label} AI bot`}
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id={cg} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={theme.c0} />
          <stop offset="0.55" stopColor={theme.c1} />
          <stop offset="1" stopColor={theme.c2} />
        </linearGradient>
        <linearGradient id={eg} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#EAD6FB" />
        </linearGradient>
        <linearGradient id={sheen} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        {animated ? (
          <style>{`
            @keyframes ai-bot-float-${uid} {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-6px); }
            }
            @keyframes ai-bot-wave-right-${uid} {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(16deg); }
            }
            @keyframes ai-bot-wave-left-${uid} {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(-16deg); }
            }
            @keyframes ai-bot-blink-${uid} {
              0%, 92%, 100% { transform: scaleY(1); }
              96% { transform: scaleY(0.12); }
            }
            @keyframes ai-bot-twinkle-${uid} {
              0%, 100% { opacity: 0.35; transform: scale(0.85); }
              50% { opacity: 1; transform: scale(1.15); }
            }
            .ai-bot-body-${uid} {
              transform-origin: 110px 150px;
              animation: ai-bot-float-${uid} 3.2s ease-in-out infinite;
            }
            .ai-bot-wave-right-${uid} {
              animation: ai-bot-wave-right-${uid} 1.5s ease-in-out infinite;
            }
            .ai-bot-wave-left-${uid} {
              animation: ai-bot-wave-left-${uid} 1.5s ease-in-out infinite;
            }
            .ai-bot-wave-origin-vio-${uid} { transform-origin: 162px 124px; }
            .ai-bot-wave-origin-nova-${uid} { transform-origin: 166px 130px; }
            .ai-bot-wave-origin-pulse-${uid} { transform-origin: 58px 120px; }
            .ai-bot-wave-origin-pip-${uid} { transform-origin: 164px 128px; }
            .ai-bot-wave-origin-mochi-${uid} { transform-origin: 162px 136px; }
            .ai-bot-blink-${uid} {
              transform-origin: 110px 111px;
              animation: ai-bot-blink-${uid} 4.5s ease-in-out infinite;
            }
            .ai-bot-twinkle-${uid} {
              transform-origin: 184px 60px;
              animation: ai-bot-twinkle-${uid} 2.4s ease-in-out infinite;
            }
          `}</style>
        ) : null}
      </defs>

      <g className={animated ? `ai-bot-body-${uid}` : undefined}>
        <Feet variant={variant} fill={fill} />
        <g
          className={
            animated && variant === "pulse"
              ? `ai-bot-wave-left-${uid} ai-bot-wave-origin-pulse-${uid}`
              : undefined
          }
        >
          <LeftArm variant={variant} fill={fill} />
        </g>
        <g
          className={
            animated && WAVING_RIGHT.has(variant)
              ? `ai-bot-wave-right-${uid} ai-bot-wave-origin-${variant}-${uid}`
              : undefined
          }
        >
          <RightArm variant={variant} fill={fill} />
        </g>
        <Body variant={variant} fill={fill} />
        <BodyDetails variant={variant} />
        <Antenna variant={variant} fill={fill} />
        <FacePanel variant={variant} face={theme.face} sheen={shine} />
        <Cheeks variant={variant} accent={theme.accent} />
        <g className={animated ? `ai-bot-blink-${uid}` : undefined}>
          <Eyes variant={variant} eye={eye} />
        </g>
        <Mouth variant={variant} eye={eye} />
        <path
          className={animated ? `ai-bot-twinkle-${uid}` : undefined}
          d="M184,55 L189,60 L184,65 L179,60 Z"
          fill={fill}
        />
      </g>
    </svg>
  );
}

type PartProps = { variant: AiBotVariant; fill: string };

function Feet({ variant, fill }: PartProps) {
  switch (variant) {
    case "nova":
      return (
        <>
          <ellipse cx="88" cy="208" rx="18" ry="8" fill={fill} />
          <ellipse cx="132" cy="208" rx="18" ry="8" fill={fill} />
        </>
      );
    case "pulse":
      return (
        <>
          <rect x="78" y="198" width="22" height="14" rx="4" fill={fill} />
          <rect x="120" y="198" width="22" height="14" rx="4" fill={fill} />
        </>
      );
    case "pip":
      return (
        <>
          <ellipse cx="90" cy="206" rx="20" ry="10" fill={fill} />
          <ellipse cx="130" cy="206" rx="20" ry="10" fill={fill} />
        </>
      );
    case "mochi":
      return (
        <>
          <ellipse cx="86" cy="210" rx="16" ry="7" fill={fill} />
          <ellipse cx="134" cy="210" rx="16" ry="7" fill={fill} />
        </>
      );
    case "bean":
      return (
        <>
          <ellipse cx="96" cy="208" rx="14" ry="8" fill={fill} />
          <ellipse cx="124" cy="208" rx="14" ry="8" fill={fill} />
        </>
      );
    default:
      return (
        <>
          <ellipse cx="94" cy="204" rx="15" ry="9" fill={fill} />
          <ellipse cx="126" cy="204" rx="15" ry="9" fill={fill} />
        </>
      );
  }
}

function LeftArm({ variant, fill }: PartProps) {
  switch (variant) {
    case "nova":
      return (
        <>
          <path d="M54,130 Q28,148 36,176" fill="none" stroke={fill} strokeWidth="12" strokeLinecap="round" />
          <circle cx="36" cy="176" r="8.5" fill={fill} />
        </>
      );
    case "pulse":
      return (
        <>
          <path d="M58,120 Q34,108 30,84" fill="none" stroke={fill} strokeWidth="12" strokeLinecap="round" />
          <circle cx="30" cy="84" r="8.5" fill={fill} />
        </>
      );
    case "pip":
      return (
        <>
          <path d="M56,140 Q34,158 42,178" fill="none" stroke={fill} strokeWidth="14" strokeLinecap="round" />
          <circle cx="42" cy="178" r="10" fill={fill} />
        </>
      );
    case "mochi":
      return (
        <>
          <path d="M58,136 Q40,120 38,98" fill="none" stroke={fill} strokeWidth="11" strokeLinecap="round" />
          <circle cx="38" cy="98" r="8" fill={fill} />
        </>
      );
    case "bean":
      return (
        <>
          <path d="M68,150 Q48,168 62,182" fill="none" stroke={fill} strokeWidth="11" strokeLinecap="round" />
          <circle cx="62" cy="182" r="8" fill={fill} />
        </>
      );
    default:
      return (
        <>
          <path d="M58,128 Q42,150 47,172" fill="none" stroke={fill} strokeWidth="12" strokeLinecap="round" />
          <circle cx="47" cy="172" r="8.5" fill={fill} />
        </>
      );
  }
}

function RightArm({ variant, fill }: PartProps) {
  switch (variant) {
    case "nova":
      return (
        <>
          <path d="M166,130 Q192,148 184,176" fill="none" stroke={fill} strokeWidth="12" strokeLinecap="round" />
          <circle cx="184" cy="176" r="8.5" fill={fill} />
        </>
      );
    case "pulse":
      return (
        <>
          <path d="M162,128 Q188,150 182,172" fill="none" stroke={fill} strokeWidth="12" strokeLinecap="round" />
          <circle cx="182" cy="172" r="8.5" fill={fill} />
        </>
      );
    case "pip":
      return (
        <>
          <path d="M164,128 Q190,100 186,78" fill="none" stroke={fill} strokeWidth="14" strokeLinecap="round" />
          <circle cx="186" cy="78" r="10" fill={fill} />
        </>
      );
    case "mochi":
      return (
        <>
          <path d="M162,136 Q180,120 182,98" fill="none" stroke={fill} strokeWidth="11" strokeLinecap="round" />
          <circle cx="182" cy="98" r="8" fill={fill} />
        </>
      );
    case "bean":
      return (
        <>
          <path d="M152,150 Q172,168 158,182" fill="none" stroke={fill} strokeWidth="11" strokeLinecap="round" />
          <circle cx="158" cy="182" r="8" fill={fill} />
        </>
      );
    default:
      return (
        <>
          <path d="M162,124 Q186,104 182,82" fill="none" stroke={fill} strokeWidth="12" strokeLinecap="round" />
          <circle cx="182" cy="82" r="8.5" fill={fill} />
        </>
      );
  }
}

function Body({ variant, fill }: PartProps) {
  switch (variant) {
    case "nova":
      return <ellipse cx="110" cy="128" rx="58" ry="72" fill={fill} />;
    case "pulse":
      return <path d="M110,48 L158,72 L166,150 L140,198 L80,198 L54,150 L62,72 Z" fill={fill} />;
    case "pip":
      return <circle cx="110" cy="128" r="68" fill={fill} />;
    case "mochi":
      return (
        <path
          d="M70,70 Q110,48 150,70 Q178,100 172,150 Q164,198 110,204 Q56,198 48,150 Q42,100 70,70 Z"
          fill={fill}
        />
      );
    case "bean":
      return (
        <path
          d="M110,46 C150,52 172,90 168,140 C164,188 136,208 110,210 C84,208 56,188 52,140 C48,90 70,52 110,46 Z"
          fill={fill}
        />
      );
    default:
      return (
        <path
          d="M96,52 L124,52 Q166,52 166,94 L166,156 Q166,198 124,198 L96,198 Q54,198 54,156 L54,94 Q54,52 96,52 Z"
          fill={fill}
        />
      );
  }
}

function BodyDetails({ variant }: { variant: AiBotVariant }) {
  switch (variant) {
    case "vio":
      return (
        <>
          <path d="M73,150 Q110,159 147,150" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M113,165 L104,173 L113,181" fill="none" stroke="rgba(255,255,255,.30)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M122,167.5 L127.5,173 L122,178.5 L116.5,173 Z" fill="rgba(255,255,255,.30)" />
          <path d="M70,175.6 L72.4,178 L70,180.4 L67.6,178 Z" fill="rgba(255,255,255,.18)" />
          <path d="M150,175.6 L152.4,178 L150,180.4 L147.6,178 Z" fill="rgba(255,255,255,.18)" />
        </>
      );
    case "nova":
      return (
        <>
          <circle cx="110" cy="168" r="7" fill="rgba(255,255,255,.22)" />
          <circle cx="90" cy="172" r="4" fill="rgba(255,255,255,.14)" />
          <circle cx="130" cy="172" r="4" fill="rgba(255,255,255,.14)" />
        </>
      );
    case "pulse":
      return (
        <>
          <rect x="96" y="158" width="28" height="6" rx="2" fill="rgba(255,255,255,.22)" />
          <rect x="88" y="172" width="44" height="4" rx="2" fill="rgba(255,255,255,.14)" />
        </>
      );
    case "pip":
      return (
        <>
          <circle cx="110" cy="170" r="5" fill="rgba(255,255,255,.28)" />
          <path d="M96,182 Q110,190 124,182" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="2" strokeLinecap="round" />
        </>
      );
    case "mochi":
      return (
        <>
          <ellipse cx="110" cy="172" rx="18" ry="8" fill="rgba(255,255,255,.16)" />
          <circle cx="86" cy="160" r="3.5" fill="rgba(255,255,255,.2)" />
          <circle cx="134" cy="160" r="3.5" fill="rgba(255,255,255,.2)" />
        </>
      );
    case "bean":
      return (
        <>
          <path d="M92,168 Q110,178 128,168" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="110" cy="158" r="4" fill="rgba(255,255,255,.22)" />
        </>
      );
  }
}

function Antenna({ variant, fill }: PartProps) {
  switch (variant) {
    case "nova":
      return (
        <>
          <line x1="110" y1="56" x2="110" y2="28" stroke={fill} strokeWidth="5" strokeLinecap="round" />
          <circle cx="110" cy="20" r="10" fill={fill} />
        </>
      );
    case "pulse":
      return (
        <>
          <line x1="110" y1="52" x2="110" y2="28" stroke={fill} strokeWidth="5" strokeLinecap="round" />
          <path d="M110,8 L122,28 L98,28 Z" fill={fill} />
        </>
      );
    case "pip":
      return (
        <>
          <line x1="110" y1="60" x2="110" y2="34" stroke={fill} strokeWidth="5" strokeLinecap="round" />
          <path d="M110,14 C116,14 122,20 110,30 C98,20 104,14 110,14 Z" fill={fill} />
        </>
      );
    case "mochi":
      return (
        <>
          <path d="M88,62 Q78,28 92,18" fill="none" stroke={fill} strokeWidth="8" strokeLinecap="round" />
          <path d="M132,62 Q142,28 128,18" fill="none" stroke={fill} strokeWidth="8" strokeLinecap="round" />
          <circle cx="92" cy="16" r="7" fill={fill} />
          <circle cx="128" cy="16" r="7" fill={fill} />
        </>
      );
    case "bean":
      return (
        <>
          <line x1="110" y1="50" x2="110" y2="26" stroke={fill} strokeWidth="5" strokeLinecap="round" />
          <path d="M110,8 L114,16 L122,16 L116,22 L118,30 L110,25 L102,30 L104,22 L98,16 L106,16 Z" fill={fill} />
        </>
      );
    default:
      return (
        <>
          <line x1="110" y1="50" x2="110" y2="32" stroke={fill} strokeWidth="5" strokeLinecap="round" />
          <path d="M110,11 L120,21 L110,31 L100,21 Z" fill={fill} />
        </>
      );
  }
}

function FacePanel({
  variant,
  face,
  sheen,
}: {
  variant: AiBotVariant;
  face: string;
  sheen: string;
}) {
  switch (variant) {
    case "nova":
      return (
        <>
          <ellipse cx="110" cy="112" rx="44" ry="34" fill={face} />
          <ellipse cx="110" cy="98" rx="36" ry="14" fill={sheen} opacity="0.25" />
        </>
      );
    case "pulse":
      return (
        <>
          <rect x="68" y="82" width="84" height="56" rx="12" ry="12" fill={face} />
          <rect x="68" y="82" width="84" height="28" rx="10" fill={sheen} opacity="0.25" />
        </>
      );
    case "pip":
      return (
        <>
          <circle cx="110" cy="112" r="42" fill={face} />
          <ellipse cx="110" cy="96" rx="30" ry="14" fill={sheen} opacity="0.28" />
        </>
      );
    case "mochi":
      return (
        <>
          <rect x="66" y="84" width="88" height="58" rx="28" ry="28" fill={face} />
          <rect x="66" y="84" width="88" height="26" rx="20" fill={sheen} opacity="0.25" />
        </>
      );
    case "bean":
      return (
        <>
          <ellipse cx="110" cy="112" rx="40" ry="36" fill={face} />
          <ellipse cx="110" cy="98" rx="28" ry="12" fill={sheen} opacity="0.25" />
        </>
      );
    default:
      return (
        <>
          <rect x="63" y="80" width="94" height="64" rx="30" ry="30" fill={face} />
          <rect x="63" y="80" width="94" height="30" rx="22" fill={sheen} opacity="0.25" />
        </>
      );
  }
}

function Cheeks({ variant, accent }: { variant: AiBotVariant; accent: string }) {
  if (variant === "pip" || variant === "mochi" || variant === "bean") {
    return (
      <>
        <ellipse cx="78" cy="122" rx="8" ry="5" fill={accent} opacity="0.45" />
        <ellipse cx="142" cy="122" rx="8" ry="5" fill={accent} opacity="0.45" />
      </>
    );
  }

  return (
    <>
      <path d="M74,129 L79,134 L74,139 L69,134 Z" fill={accent} opacity="0.55" />
      <path d="M146,129 L151,134 L146,139 L141,134 Z" fill={accent} opacity="0.55" />
    </>
  );
}

function Eyes({ variant, eye }: { variant: AiBotVariant; eye: string }) {
  switch (variant) {
    case "nova":
      return (
        <>
          <circle cx="94" cy="110" r="6" fill={eye} />
          <circle cx="126" cy="110" r="6" fill={eye} />
        </>
      );
    case "pulse":
      return (
        <>
          <ellipse cx="92" cy="110" rx="9" ry="8" fill={eye} />
          <ellipse cx="128" cy="110" rx="9" ry="8" fill={eye} />
          <circle cx="94" cy="108" r="2.8" fill="#1C1008" opacity="0.4" />
          <circle cx="130" cy="108" r="2.8" fill="#1C1008" opacity="0.4" />
        </>
      );
    case "pip":
      return (
        <>
          <circle cx="94" cy="110" r="7" fill={eye} />
          <path d="M118,112 Q126,102 136,112" fill="none" stroke={eye} strokeWidth="5" strokeLinecap="round" />
          <circle cx="92" cy="108" r="2.2" fill="#2A0F1C" opacity="0.35" />
        </>
      );
    case "mochi":
      return (
        <>
          <ellipse cx="94" cy="110" rx="8" ry="10" fill={eye} />
          <ellipse cx="126" cy="110" rx="8" ry="10" fill={eye} />
          <circle cx="96" cy="107" r="2.5" fill="#14200A" opacity="0.35" />
          <circle cx="128" cy="107" r="2.5" fill="#14200A" opacity="0.35" />
        </>
      );
    case "bean":
      return (
        <>
          <path d="M84,112 Q94,102 104,112" fill="none" stroke={eye} strokeWidth="5" strokeLinecap="round" />
          <path d="M116,112 Q126,102 136,112" fill="none" stroke={eye} strokeWidth="5" strokeLinecap="round" />
        </>
      );
    default:
      return (
        <>
          <path d="M84,111 Q94,99 104,111" fill="none" stroke={eye} strokeWidth="5.5" strokeLinecap="round" />
          <path d="M116,111 Q126,99 136,111" fill="none" stroke={eye} strokeWidth="5.5" strokeLinecap="round" />
        </>
      );
  }
}

function Mouth({ variant, eye }: { variant: AiBotVariant; eye: string }) {
  switch (variant) {
    case "nova":
      return (
        <path d="M98,126 Q110,138 122,126" fill="none" stroke={eye} strokeWidth="4" strokeLinecap="round" />
      );
    case "pulse":
      return <rect x="100" y="126" width="20" height="5" rx="2.5" fill={eye} />;
    case "pip":
      return <ellipse cx="110" cy="130" rx="7" ry="5" fill={eye} />;
    case "mochi":
      return (
        <path d="M102,128 Q110,134 118,128" fill="none" stroke={eye} strokeWidth="3.5" strokeLinecap="round" />
      );
    case "bean":
      return (
        <path d="M100,128 Q110,136 120,128" fill="none" stroke={eye} strokeWidth="3.5" strokeLinecap="round" />
      );
    default:
      return <path d="M99,128 Q110,139 121,128 Z" fill={eye} />;
  }
}

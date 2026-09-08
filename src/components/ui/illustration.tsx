import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type IllustrationName =
  | "hero"
  | "welcome"
  | "notes"
  | "code"
  | "links"
  | "organize"
  | "search"
  | "capture"
  | "empty"
  | "error";

type IllustrationSize = "sm" | "md" | "lg" | "hero";

type IllustrationProps = {
  name: IllustrationName;
  size?: IllustrationSize;
  className?: string;
  title?: string;
};

const SIZE_CLASS: Record<IllustrationSize, string> = {
  sm: "illustration--sm",
  md: "illustration--md",
  lg: "illustration--lg",
  hero: "illustration--hero",
};

function SceneHero() {
  return (
    <>
      <rect x="16" y="28" width="288" height="196" rx="24" fill="var(--illustration-stage)" />
      <rect x="36" y="48" width="132" height="156" rx="14" fill="var(--illustration-paper)" stroke="var(--illustration-line)" strokeWidth="1.5" />
      <rect x="50" y="64" width="72" height="10" rx="5" fill="var(--illustration-brand)" opacity="0.85" />
      <rect x="50" y="86" width="104" height="6" rx="3" fill="var(--illustration-ink)" opacity="0.22" />
      <rect x="50" y="102" width="96" height="6" rx="3" fill="var(--illustration-ink)" opacity="0.16" />
      <rect x="50" y="118" width="88" height="6" rx="3" fill="var(--illustration-ink)" opacity="0.12" />
      <rect x="50" y="148" width="40" height="22" rx="8" fill="var(--illustration-soft)" />
      <rect x="96" y="148" width="40" height="22" rx="8" fill="var(--illustration-accent-soft)" />
      <rect x="148" y="72" width="136" height="88" rx="14" fill="var(--illustration-code)" />
      <circle cx="166" cy="90" r="5" fill="#ff5f57" />
      <circle cx="180" cy="90" r="5" fill="#febc2e" />
      <circle cx="194" cy="90" r="5" fill="#28c840" />
      <rect x="162" y="108" width="64" height="6" rx="3" fill="var(--illustration-code-text)" opacity="0.9" />
      <rect x="162" y="122" width="92" height="6" rx="3" fill="var(--illustration-code-text)" opacity="0.45" />
      <rect x="162" y="136" width="48" height="6" rx="3" fill="var(--illustration-code-text)" opacity="0.35" />
      <rect x="176" y="172" width="128" height="52" rx="14" fill="var(--illustration-paper)" stroke="var(--illustration-line)" strokeWidth="1.5" />
      <circle cx="200" cy="198" r="12" fill="var(--illustration-accent-soft)" />
      <path d="M200 191v14M193 198h14" stroke="var(--illustration-accent)" strokeWidth="2" strokeLinecap="round" />
      <rect x="220" y="188" width="64" height="7" rx="3.5" fill="var(--illustration-ink)" opacity="0.28" />
      <rect x="220" y="202" width="48" height="6" rx="3" fill="var(--illustration-ink)" opacity="0.14" />
    </>
  );
}

function SceneWelcome() {
  return (
    <>
      <rect x="24" y="28" width="152" height="108" rx="18" fill="var(--illustration-stage)" />
      <rect x="40" y="48" width="52" height="72" rx="8" fill="var(--illustration-paper)" stroke="var(--illustration-line)" />
      <rect x="48" y="58" width="36" height="6" rx="3" fill="var(--illustration-brand)" opacity="0.7" />
      <rect x="48" y="70" width="28" height="5" rx="2.5" fill="var(--illustration-ink)" opacity="0.18" />
      <rect x="100" y="48" width="56" height="72" rx="8" fill="var(--illustration-paper)" stroke="var(--illustration-line)" />
      <rect x="110" y="62" width="36" height="36" rx="8" fill="var(--illustration-soft)" />
      <circle cx="160" cy="118" r="16" fill="var(--illustration-accent-soft)" />
      <path d="M154 118h12M160 112v12" stroke="var(--illustration-accent)" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function SceneNotes() {
  return (
    <>
      <rect x="36" y="24" width="128" height="116" rx="16" fill="var(--illustration-stage)" />
      <rect x="54" y="40" width="92" height="92" rx="12" fill="var(--illustration-paper)" stroke="var(--illustration-line)" />
      <rect x="68" y="56" width="48" height="8" rx="4" fill="var(--illustration-brand)" opacity="0.8" />
      <rect x="68" y="74" width="64" height="6" rx="3" fill="var(--illustration-ink)" opacity="0.2" />
      <rect x="68" y="88" width="56" height="6" rx="3" fill="var(--illustration-ink)" opacity="0.14" />
      <rect x="68" y="102" width="40" height="6" rx="3" fill="var(--illustration-ink)" opacity="0.1" />
    </>
  );
}

function SceneCode() {
  return (
    <>
      <rect x="28" y="32" width="144" height="100" rx="16" fill="var(--illustration-code)" />
      <circle cx="48" cy="52" r="5" fill="#ff5f57" />
      <circle cx="62" cy="52" r="5" fill="#febc2e" />
      <circle cx="76" cy="52" r="5" fill="#28c840" />
      <rect x="44" y="72" width="72" height="6" rx="3" fill="var(--illustration-code-text)" />
      <rect x="44" y="88" width="96" height="6" rx="3" fill="var(--illustration-code-text)" opacity="0.45" />
      <rect x="44" y="104" width="52" height="6" rx="3" fill="var(--illustration-code-text)" opacity="0.3" />
    </>
  );
}

function SceneLinks() {
  return (
    <>
      <rect x="32" y="36" width="136" height="96" rx="18" fill="var(--illustration-stage)" />
      <rect x="48" y="52" width="104" height="64" rx="12" fill="var(--illustration-paper)" stroke="var(--illustration-line)" />
      <circle cx="72" cy="84" r="12" fill="var(--illustration-soft)" />
      <path d="M68 84h8M72 80v8" stroke="var(--illustration-brand)" strokeWidth="2" strokeLinecap="round" />
      <rect x="92" y="74" width="44" height="7" rx="3.5" fill="var(--illustration-ink)" opacity="0.24" />
      <rect x="92" y="88" width="32" height="6" rx="3" fill="var(--illustration-ink)" opacity="0.12" />
    </>
  );
}

function SceneOrganize() {
  return (
    <>
      <rect x="28" y="52" width="68" height="76" rx="12" fill="var(--illustration-soft)" />
      <rect x="40" y="40" width="44" height="16" rx="6" fill="var(--illustration-brand)" opacity="0.7" />
      <rect x="104" y="52" width="68" height="76" rx="12" fill="var(--illustration-accent-soft)" />
      <rect x="116" y="40" width="44" height="16" rx="6" fill="var(--illustration-accent)" opacity="0.75" />
    </>
  );
}

function SceneSearch() {
  return (
    <>
      <circle cx="88" cy="80" r="36" fill="var(--illustration-stage)" />
      <circle cx="88" cy="80" r="22" fill="none" stroke="var(--illustration-brand)" strokeWidth="6" />
      <path d="M104 98l22 22" stroke="var(--illustration-brand)" strokeWidth="6" strokeLinecap="round" />
    </>
  );
}

function SceneCapture() {
  return (
    <>
      <rect x="48" y="36" width="104" height="104" rx="24" fill="var(--illustration-soft)" />
      <path d="M100 68v40M80 88h40" stroke="var(--illustration-brand)" strokeWidth="8" strokeLinecap="round" />
    </>
  );
}

function SceneEmpty() {
  return (
    <>
      <rect x="40" y="40" width="120" height="88" rx="18" fill="var(--illustration-stage)" />
      <rect x="60" y="60" width="80" height="10" rx="5" fill="var(--illustration-ink)" opacity="0.12" />
      <rect x="60" y="80" width="56" height="8" rx="4" fill="var(--illustration-ink)" opacity="0.08" />
      <circle cx="148" cy="108" r="18" fill="var(--illustration-soft)" />
      <path d="M148 100v16M140 108h16" stroke="var(--illustration-brand)" strokeWidth="2.5" strokeLinecap="round" />
    </>
  );
}

function SceneError() {
  return (
    <>
      <rect x="36" y="36" width="128" height="100" rx="20" fill="var(--illustration-stage)" />
      <circle cx="100" cy="80" r="22" fill="var(--danger-soft)" />
      <path d="M100 70v16" stroke="var(--danger)" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="100" cy="94" r="2.2" fill="var(--danger)" />
    </>
  );
}

const SCENES: Record<IllustrationName, () => ReactNode> = {
  hero: SceneHero,
  welcome: SceneWelcome,
  notes: SceneNotes,
  code: SceneCode,
  links: SceneLinks,
  organize: SceneOrganize,
  search: SceneSearch,
  capture: SceneCapture,
  empty: SceneEmpty,
  error: SceneError,
};

const VIEWBOX: Record<IllustrationName, string> = {
  hero: "0 0 320 248",
  welcome: "0 0 200 160",
  notes: "0 0 200 160",
  code: "0 0 200 160",
  links: "0 0 200 160",
  organize: "0 0 200 160",
  search: "0 0 200 160",
  capture: "0 0 200 160",
  empty: "0 0 200 160",
  error: "0 0 200 160",
};

export function Illustration({
  name,
  size = "md",
  className,
  title,
}: IllustrationProps) {
  const Scene = SCENES[name];
  const labelled = Boolean(title);

  return (
    <svg
      className={cn("illustration", SIZE_CLASS[size], className)}
      viewBox={VIEWBOX[name]}
      role={labelled ? "img" : "presentation"}
      aria-hidden={labelled ? undefined : true}
      aria-label={title}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      <Scene />
    </svg>
  );
}

export function EmptyStateIllustration({
  name,
  className,
}: {
  name: IllustrationName;
  className?: string;
}) {
  return <Illustration name={name} size="md" className={cn("illustration--empty", className)} />;
}

export function FeatureIllustration({
  name,
  className,
}: {
  name: IllustrationName;
  className?: string;
}) {
  return <Illustration name={name} size="lg" className={cn("illustration--feature", className)} />;
}

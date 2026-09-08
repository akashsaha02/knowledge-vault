import Image from "next/image";
import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";

import iconLight from "@/assets/nook_icon_black.png";
import iconDark from "@/assets/nook_icon_white.png";
import wordmarkLight from "@/assets/nook_wordmark_black.png";
import wordmarkDark from "@/assets/nook_wordmark_white.png";
import lockupLight from "@/assets/nook_lockup_black.png";
import lockupDark from "@/assets/nook_lockup_white.png";

type BrandLogoProps = {
  variant?: "icon" | "wordmark" | "lockup";
  href?: string;
  collapsed?: boolean;
  className?: string;
  onNavigate?: () => void;
};

const SOURCES = {
  icon: { light: iconLight, dark: iconDark, width: 40, height: 40 },
  wordmark: { light: wordmarkLight, dark: wordmarkDark, width: 148, height: 40 },
  lockup: { light: lockupLight, dark: lockupDark, width: 168, height: 40 },
} as const;

export function BrandLogo({
  variant = "lockup",
  href,
  collapsed = false,
  className = "",
  onNavigate,
}: BrandLogoProps) {
  const effectiveVariant = collapsed ? "icon" : variant;
  const source = SOURCES[effectiveVariant];
  const imgClass = `brand-logo-img brand-logo-img-${effectiveVariant} ${className}`.trim();
  const imgStyle = {
    width: "auto",
    height: effectiveVariant === "icon" ? 40 : 36,
  } as const;

  const mark = (
    <span className="brand-logo-mark">
      <Image
        src={source.light}
        alt=""
        className={`${imgClass} brand-logo-img--light`}
        priority
        width={source.width}
        height={source.height}
        style={imgStyle}
      />
      <Image
        src={source.dark}
        alt=""
        className={`${imgClass} brand-logo-img--dark`}
        priority
        width={source.width}
        height={source.height}
        style={imgStyle}
      />
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="brand-logo-link"
        aria-label={BRAND_NAME}
        onClick={onNavigate}
      >
        {mark}
      </Link>
    );
  }

  return (
    <span className="brand-logo-standalone" role="img" aria-label={BRAND_NAME}>
      {mark}
    </span>
  );
}

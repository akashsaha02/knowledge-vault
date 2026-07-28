import Image from "next/image";
import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";

import iconDark from "@/assets/nook_icon_white.png";
import wordmarkDark from "@/assets/nook_wordmark_white.png";
import lockupDark from "@/assets/nook_lockup_white.png";

type BrandLogoProps = {
  variant?: "icon" | "wordmark" | "lockup";
  href?: string;
  collapsed?: boolean;
  className?: string;
  onNavigate?: () => void;
};

export function BrandLogo({
  variant = "lockup",
  href,
  collapsed = false,
  className = "",
  onNavigate,
}: BrandLogoProps) {
  const effectiveVariant = collapsed ? "icon" : variant;

  const src =
    effectiveVariant === "icon"
      ? iconDark
      : effectiveVariant === "wordmark"
        ? wordmarkDark
        : lockupDark;

  const image = (
    <Image
      src={src}
      alt={BRAND_NAME}
      className={`brand-logo-img brand-logo-img-${effectiveVariant} ${className}`.trim()}
      priority
      width={effectiveVariant === "icon" ? 40 : effectiveVariant === "wordmark" ? 148 : 168}
      height={effectiveVariant === "icon" ? 40 : 40}
      style={{ width: "auto", height: effectiveVariant === "icon" ? 40 : 36 }}
    />
  );

  if (href) {
    return (
      <Link
        href={href}
        className="brand-logo-link"
        aria-label={BRAND_NAME}
        onClick={onNavigate}
      >
        {image}
      </Link>
    );
  }

  return image;
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type IconContainerTone = "brand" | "accent" | "success" | "warning" | "info" | "muted";
type IconContainerSize = "sm" | "md" | "lg";

type IconContainerProps = {
  children: ReactNode;
  tone?: IconContainerTone;
  size?: IconContainerSize;
  className?: string;
};

export function IconContainer({
  children,
  tone = "brand",
  size = "md",
  className,
}: IconContainerProps) {
  return (
    <span
      className={cn(
        "icon-container",
        `icon-container--${tone}`,
        `icon-container--${size}`,
        className,
      )}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

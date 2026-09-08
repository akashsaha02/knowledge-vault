import type { CSSProperties } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarPaletteIndex, getInitials } from "@/lib/avatar-utils";
import { cn } from "@/lib/utils";

type UserAvatarSize = "sm" | "md" | "lg";

type UserAvatarProps = {
  name: string;
  image?: string | null;
  size?: UserAvatarSize;
  status?: "online" | "offline";
  className?: string;
};

const SIZE_CLASS: Record<UserAvatarSize, string> = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-11 w-11 text-sm",
};

export function UserAvatar({
  name,
  image,
  size = "md",
  status,
  className,
}: UserAvatarProps) {
  const initials = getInitials(name);
  const palette = getAvatarPaletteIndex(name);
  const label = name.trim() || "User";

  return (
    <span
      className={cn("user-avatar-wrap", className)}
      style={
        {
          "--avatar-bg": `var(--avatar-${palette}-bg)`,
          "--avatar-fg": `var(--avatar-${palette}-fg)`,
        } as CSSProperties
      }
    >
      <Avatar className={cn(SIZE_CLASS[size], "user-avatar")}>
        {image ? <AvatarImage src={image} alt="" /> : null}
        <AvatarFallback
          className="user-avatar-fallback !bg-[var(--avatar-bg)] !text-[var(--avatar-fg)]"
          aria-label={label}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      {status ? (
        <span
          className={cn(
            "user-avatar-status",
            status === "online"
              ? "user-avatar-status--online"
              : "user-avatar-status--offline",
          )}
          aria-hidden="true"
        />
      ) : null}
    </span>
  );
}

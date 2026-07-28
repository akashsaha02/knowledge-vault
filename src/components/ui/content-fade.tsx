import type { ReactNode } from "react";

type ContentFadeProps = {
  children: ReactNode;
  className?: string;
};

export function ContentFade({ children, className = "" }: ContentFadeProps) {
  return (
    <div className={`content-fade ${className}`.trim()}>
      {children}
    </div>
  );
}

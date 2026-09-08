import Link from "next/link";
import type { ReactNode } from "react";
import { IconContainer } from "@/components/ui/icon-container";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: number | string;
  hint?: string;
  href?: string;
  className?: string;
};

export function MetricCard({
  icon,
  label,
  value,
  hint,
  href,
  className,
}: MetricCardProps) {
  const content = (
    <>
      <IconContainer tone="brand" size="sm">
        {icon}
      </IconContainer>
      <p className="metric-card-label">{label}</p>
      <p className="metric-card-value">{value}</p>
      {hint ? <p className="metric-card-hint">{hint}</p> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn("metric-card", className)}>
        {content}
      </Link>
    );
  }

  return <div className={cn("metric-card", className)}>{content}</div>;
}

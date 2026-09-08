const DESTRUCTIVE_PATTERNS = [
  /rm\s+-rf/i,
  /drop\s+database/i,
  /git\s+reset\s+--hard/i,
  /sudo\s+dd/i,
  /chmod\s+-R\s+777/i,
];

export type RiskLevel = "safe" | "review" | "destructive";

export function detectCommandRisk(command: string): RiskLevel {
  for (const pattern of DESTRUCTIVE_PATTERNS) {
    if (pattern.test(command)) return "destructive";
  }
  if (/\bsudo\b/i.test(command)) return "review";
  return "safe";
}

export const RISK_LABELS: Record<RiskLevel, string> = {
  safe: "Safe",
  review: "Review first",
  destructive: "Potentially destructive",
};

export const RISK_HELP: Record<RiskLevel, string> = {
  safe: "",
  review: "This command uses elevated privileges. Review it before running.",
  destructive: "This command can modify or delete files. Review it before running.",
};

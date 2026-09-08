const SAFE_ERROR_SNIPPETS = [
  "Item not found",
  "Insufficient permissions",
  "Not a workspace member",
  "Unauthorized",
  "must be in trash",
  "Invalid JSON",
  "Invalid import",
  "A share link must",
  "Share link not found",
  "Item not found in this workspace",
  "Invalid URL",
  "not allowed",
  "Only HTTP",
  "Invalid storage key",
  "Project not found",
  "Collection not found",
  "Parent item not found",
  "One or more tags not found",
];

export function getActionErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error) || !error.message) return fallback;
  const message = error.message;
  if (/prisma|sql|stack|ECONN|internal/i.test(message)) return fallback;
  if (SAFE_ERROR_SNIPPETS.some((snippet) => message.includes(snippet))) {
    return message;
  }
  if (message.length > 0 && message.length < 140 && !message.includes("\n")) {
    return message;
  }
  return fallback;
}

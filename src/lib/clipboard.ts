import { toast } from "sonner";

export async function copyToClipboard(text: string, successMessage = "Copied") {
  await navigator.clipboard.writeText(text);
  toast.success(successMessage);
}

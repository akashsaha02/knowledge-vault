export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function uniqueSlug(base: string, suffix?: string): string {
  const slug = slugify(base) || "untitled";
  return suffix ? `${slug}-${suffix}` : slug;
}

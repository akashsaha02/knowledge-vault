import { db } from "@/lib/db";

const FILE_LIMITS: Record<string, number> = {
  image: 10 * 1024 * 1024,
  pdf: 25 * 1024 * 1024,
  document: 25 * 1024 * 1024,
  other: 10 * 1024 * 1024,
};

export function getFileCategory(mimeType: string) {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (
    mimeType.includes("document") ||
    mimeType.includes("text/") ||
    mimeType.includes("spreadsheet")
  ) {
    return "document";
  }
  return "other";
}

export function validateFile(mimeType: string, sizeBytes: number) {
  const category = getFileCategory(mimeType);
  const limit = FILE_LIMITS[category];
  if (sizeBytes > limit) {
    throw new Error(`File exceeds ${category} size limit`);
  }
}

export async function createAttachmentRecord(data: {
  workspaceId: string;
  itemId: string;
  uploadedById: string;
  storageKey: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  checksum?: string;
}) {
  return db.attachment.create({ data });
}

export async function findAttachmentById(id: string) {
  return db.attachment.findUnique({ where: { id } });
}

export async function findAttachments(itemId: string) {
  return db.attachment.findMany({
    where: { itemId },
    orderBy: { createdAt: "desc" },
  });
}

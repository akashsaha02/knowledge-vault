import { z } from "zod";

export const createShareLinkSchema = z.object({
  workspaceId: z.string().min(1),
  itemId: z.string().min(1),
  expiresAt: z.string().optional(),
  password: z.string().max(200).optional(),
  allowCopy: z.boolean().optional(),
  allowDownload: z.boolean().optional(),
});

export type CreateShareLinkInput = z.infer<typeof createShareLinkSchema>;

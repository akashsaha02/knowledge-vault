import { z } from "zod";
import {
  itemStatusSchema,
  itemTypeSchema,
} from "@/features/items/item.schema";

export const IMPORT_VERSION = 1;
export const IMPORT_MAX_ITEMS = 1000;

export const importItemSchema = z.object({
  title: z.string().min(1).max(500),
  type: itemTypeSchema,
  plainText: z.string().optional(),
  content: z.unknown().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  status: itemStatusSchema.optional(),
});

export const importPayloadSchema = z.object({
  version: z.literal(IMPORT_VERSION).optional().default(IMPORT_VERSION),
  items: z.array(importItemSchema).max(IMPORT_MAX_ITEMS),
});

export type ImportPayload = z.infer<typeof importPayloadSchema>;

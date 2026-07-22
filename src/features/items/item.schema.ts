import { z } from "zod";
import { ItemStatus, ItemType, Visibility } from "@/generated/prisma/client";

export const itemTypeSchema = z.nativeEnum(ItemType);
export const itemStatusSchema = z.nativeEnum(ItemStatus);
export const visibilitySchema = z.nativeEnum(Visibility);

export const createItemSchema = z.object({
  workspaceId: z.string().min(1),
  type: itemTypeSchema,
  title: z.string().min(1).max(500),
  content: z.unknown().optional(),
  plainText: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  projectId: z.string().optional(),
  collectionId: z.string().optional(),
  parentId: z.string().optional(),
  visibility: visibilitySchema.optional(),
  tagIds: z.array(z.string()).optional(),
});

export const updateItemSchema = z.object({
  id: z.string().min(1),
  workspaceId: z.string().min(1),
  title: z.string().min(1).max(500).optional(),
  content: z.unknown().optional(),
  plainText: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  projectId: z.string().nullable().optional(),
  collectionId: z.string().nullable().optional(),
  status: itemStatusSchema.optional(),
  visibility: visibilitySchema.optional(),
  isPinned: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  tagIds: z.array(z.string()).optional(),
});

export const searchItemsSchema = z.object({
  workspaceId: z.string().min(1),
  query: z.string().optional(),
  type: itemTypeSchema.optional(),
  status: itemStatusSchema.optional(),
  projectId: z.string().optional(),
  collectionId: z.string().optional(),
  tagId: z.string().optional(),
  limit: z.number().min(1).max(100).optional(),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type SearchItemsInput = z.infer<typeof searchItemsSchema>;

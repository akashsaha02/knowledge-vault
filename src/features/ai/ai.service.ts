import "server-only";

import { db } from "@/lib/db";
import { searchWorkspaceItems } from "@/features/search/search.service";

export async function askVault(
  userId: string,
  workspaceId: string,
  question: string,
) {
  const results = await searchWorkspaceItems(userId, {
    workspaceId,
    query: question,
    limit: 5,
  });

  const sources = Array.isArray(results)
    ? results.map((item) => {
        if ("plain_text" in item) {
          return {
            id: item.id,
            title: item.title,
            excerpt: item.plain_text.slice(0, 200),
            type: item.type,
          };
        }
        return {
          id: item.id,
          title: item.title,
          excerpt: item.plainText.slice(0, 200),
          type: item.type,
        };
      })
    : [];

  if (sources.length === 0) {
    return {
      answer:
        "I could not find relevant content in your vault to answer this question.",
      sources: [],
      confidence: "low" as const,
    };
  }

  const context = sources.map((s) => `- ${s.title}: ${s.excerpt}`).join("\n");

  return {
    answer: `Based on your vault content:\n\n${context}\n\nThis is a retrieval-only response. Connect an AI provider in production to generate natural language answers with citations.`,
    sources,
    confidence: "medium" as const,
  };
}

export async function suggestTagsFromContent(plainText: string) {
  const words = plainText
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 4);
  const freq = new Map<string, number>();
  for (const word of words) {
    freq.set(word, (freq.get(word) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

export async function storeEmbeddingChunk(data: {
  workspaceId: string;
  itemId: string;
  chunkIndex: number;
  content: string;
  model: string;
  contentHash: string;
}) {
  return db.embedding.create({ data });
}

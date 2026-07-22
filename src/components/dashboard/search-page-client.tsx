"use client";

import { Input, List, Select, Typography } from "antd";
import { useState } from "react";
import { searchAction } from "@/features/search/search.actions";
import type { ItemType } from "@/generated/prisma/client";

const { Title } = Typography;

type SearchResult = {
  id: string;
  title: string;
  type: ItemType;
  plainText?: string;
  plain_text?: string;
};

export function SearchPageClient({ workspaceId }: { workspaceId: string }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<ItemType | undefined>();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function runSearch(value: string) {
    setLoading(true);
    try {
      const data = await searchAction(
        { workspaceId, query: value, type, limit: 50 },
        true,
      );
      setResults(data as SearchResult[]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl">
      <Title level={3}>Search</Title>
      <div className="flex gap-2 mb-4">
        <Input.Search
          placeholder="Search your vault..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onSearch={runSearch}
          loading={loading}
          enterButton
        />
        <Select
          allowClear
          placeholder="Type"
          style={{ width: 140 }}
          value={type}
          onChange={setType}
          options={[
            "NOTE",
            "SNIPPET",
            "COMMAND",
            "BOOKMARK",
            "PROMPT",
            "FILE",
          ].map((t) => ({ value: t, label: t }))}
        />
      </div>
      <List
        loading={loading}
        dataSource={results}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.title}
              description={
                item.plainText ?? item.plain_text ?? `${item.type} item`
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}

"use client";

import { BookOutlined, CodeOutlined, RocketOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Typography } from "antd";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const { Title, Paragraph, Text } = Typography;

export function LandingShell() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur">
        <Space>
          <BookOutlined className="text-lg !text-[var(--accent)]" />
          <Text strong className="font-mono !text-[var(--accent)]">
            Knowledge Vault
          </Text>
        </Space>
        <Space>
          <ThemeToggle />
          <Link href="/sign-in">
            <Button type="text">Sign in</Button>
          </Link>
          <Link href="/sign-up">
            <Button type="primary">Get started</Button>
          </Link>
        </Space>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center mb-16">
          <Title level={1} className="!font-mono !text-5xl !mb-4 !text-[var(--foreground)]">
            Your personal knowledge vault
          </Title>
          <Paragraph className="text-lg !text-[var(--muted)] max-w-2xl mx-auto">
            Capture notes, code snippets, terminal commands, bookmarks, and
            prompts in one secure workspace.
          </Paragraph>
          <Space className="mt-6">
            <Link href="/sign-up">
              <Button type="primary" size="large" icon={<RocketOutlined />}>
                Start for free
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="large">Sign in</Button>
            </Link>
          </Space>
        </div>

        <Row gutter={[24, 24]}>
          {[
            {
              icon: <BookOutlined className="!text-[var(--accent)]" />,
              title: "Notes & projects",
              description:
                "Organize knowledge with projects, collections, and tags.",
            },
            {
              icon: <CodeOutlined className="!text-[var(--accent)]" />,
              title: "Snippets & commands",
              description:
                "Save reusable code and shell commands with syntax highlighting.",
            },
            {
              icon: <RocketOutlined className="!text-[var(--accent)]" />,
              title: "Search everything",
              description:
                "Find anything quickly with full-text search across your vault.",
            },
          ].map((feature) => (
            <Col xs={24} md={8} key={feature.title}>
              <Card className="!border-[var(--border)] !bg-[var(--card)]">
                <Space orientation="vertical" size="middle">
                  <span className="text-2xl">{feature.icon}</span>
                  <Title level={4} className="!mb-0 !text-[var(--foreground)]">
                    {feature.title}
                  </Title>
                  <Paragraph className="!mb-0 !text-[var(--muted)]">
                    {feature.description}
                  </Paragraph>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </main>
    </div>
  );
}

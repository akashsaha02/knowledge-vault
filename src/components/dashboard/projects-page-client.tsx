"use client";

import { App, Button, Card, Form, Input, List, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/dashboard/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { PageSkeleton } from "@/components/ui/loading-skeleton";
import {
  createProjectAction,
  deleteProjectAction,
  listProjectsAction,
} from "@/features/projects/project.actions";

type Project = Awaited<ReturnType<typeof listProjectsAction>>[number];

export function ProjectsPageClient({ workspaceId }: { workspaceId: string }) {
  const { message } = App.useApp();
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    listProjectsAction(workspaceId).then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, [workspaceId]);

  return (
    <PageShell
      title="Projects"
      description="Group related notes, snippets, and files into focused projects."
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          New project
        </Button>
      }
    >
      {loading ? (
        <PageSkeleton />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Group related notes, snippets, and files into focused projects."
          primaryAction={{
            label: "Create project",
            onClick: () => setOpen(true),
          }}
        />
      ) : (
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, xl: 3, xxl: 4 }}
        dataSource={projects}
        renderItem={(project) => (
          <List.Item>
            <Card
              className="h-full !border-[var(--border)]"
              title={project.name}
              extra={
                <Button
                  danger
                  size="small"
                  type="text"
                  onClick={async () => {
                    await deleteProjectAction(workspaceId, project.id);
                    message.success("Project deleted");
                    setProjects((prev) => prev.filter((p) => p.id !== project.id));
                  }}
                >
                  Delete
                </Button>
              }
            >
              <p className="text-[var(--muted)] mb-3 min-h-[40px]">
                {project.description || "No description"}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {project._count.items} item{project._count.items === 1 ? "" : "s"}
              </p>
            </Card>
          </List.Item>
        )}
      />
      )}

      <Modal
        title="Create project"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form
          layout="vertical"
          onFinish={async (values) => {
            const project = await createProjectAction(
              workspaceId,
              values.name,
              values.description,
            );
            setProjects((prev) => [...prev, { ...project, _count: { items: 0 } }]);
            setOpen(false);
            message.success("Project created");
          }}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Side project, Work notes" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="What is this project about?" rows={3} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create project
          </Button>
        </Form>
      </Modal>
    </PageShell>
  );
}

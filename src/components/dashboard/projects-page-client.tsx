"use client";

import { App, Button, Card, Form, Input, List, Modal, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  createProjectAction,
  deleteProjectAction,
  listProjectsAction,
} from "@/features/projects/project.actions";

const { Title } = Typography;

type Project = Awaited<ReturnType<typeof listProjectsAction>>[number];

export function ProjectsPageClient({ workspaceId }: { workspaceId: string }) {
  const { message } = App.useApp();
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    listProjectsAction(workspaceId).then(setProjects);
  }, [workspaceId]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={3} className="!mb-0">
          Projects
        </Title>
        <Button type="primary" onClick={() => setOpen(true)}>
          New project
        </Button>
      </div>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={projects}
        renderItem={(project) => (
          <List.Item>
            <Card
              title={project.name}
              extra={
                <Button
                  danger
                  size="small"
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
              {project.description || "No description"}
              <p className="text-xs text-neutral-400 mt-2">
                {project._count.items} items
              </p>
            </Card>
          </List.Item>
        )}
      />
      <Modal
        title="Create project"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
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
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

"use client";

import { App, Button, Card, Form, Input, Typography } from "antd";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const { Title } = Typography;

export default function ResetPasswordClient() {
  const { message } = App.useApp();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <Title level={3}>Set new password</Title>
        <Form
          layout="vertical"
          className="mt-4"
          onFinish={async (values) => {
            if (!token) {
              message.error("Invalid reset token");
              return;
            }
            const { error } = await authClient.resetPassword({
              newPassword: values.password,
              token,
            });
            if (error) {
              message.error(error.message ?? "Reset failed");
              return;
            }
            message.success("Password updated");
          }}
        >
          <Form.Item
            name="password"
            label="New password"
            rules={[{ required: true, min: 8 }]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Update password
          </Button>
        </Form>
      </Card>
    </div>
  );
}

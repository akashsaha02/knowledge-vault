"use client";

import { App, Button, Card, Form, Input, Typography } from "antd";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const { Title } = Typography;

export default function ForgotPasswordPage() {
  const { message } = App.useApp();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <Title level={3}>Reset password</Title>
        <Form
          layout="vertical"
          className="mt-4"
          onFinish={async (values) => {
            const { error } = await authClient.requestPasswordReset({
              email: values.email,
              redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) {
              message.error(error.message ?? "Request failed");
              return;
            }
            message.success("Check your email for reset instructions");
          }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Send reset link
          </Button>
        </Form>
        <p className="mt-4 text-center text-sm">
          <Link href="/sign-in">Back to sign in</Link>
        </p>
      </Card>
    </div>
  );
}

"use client";

import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { App, Button, Card, Divider, Form, Input, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const { Title, Text } = Typography;

export function SignInForm() {
  const router = useRouter();
  const { message } = App.useApp();

  return (
    <Card className="w-full max-w-md shadow-sm">
      <Title level={2} className="!font-[family-name:var(--font-display)] !mb-2">
        Welcome back
      </Title>
      <Text type="secondary">Sign in to your Knowledge Vault</Text>

      <Form
        layout="vertical"
        className="mt-6"
        onFinish={async (values) => {
          const { error } = await authClient.signIn.email({
            email: values.email,
            password: values.password,
          });
          if (error) {
            message.error(error.message ?? "Sign in failed");
            return;
          }
          message.success("Signed in");
          router.push("/dashboard");
          router.refresh();
        }}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input prefix={<MailOutlined />} placeholder="you@example.com" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, min: 8 }]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>
        <div className="flex justify-end mb-4">
          <Link href="/forgot-password">Forgot password?</Link>
        </div>
        <Button type="primary" htmlType="submit" block>
          Sign in
        </Button>
      </Form>

      <Divider>or</Divider>

      <Button
        block
        onClick={async () => {
          await authClient.signIn.social({ provider: "google" });
        }}
      >
        Continue with Google
      </Button>

      <p className="text-center mt-4 text-sm">
        No account? <Link href="/sign-up">Sign up</Link>
      </p>
    </Card>
  );
}

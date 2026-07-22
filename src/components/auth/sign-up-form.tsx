"use client";

import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { App, Button, Card, Divider, Form, Input, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const { Title, Text } = Typography;

export function SignUpForm() {
  const router = useRouter();
  const { message } = App.useApp();

  return (
    <Card className="w-full max-w-md shadow-sm">
      <Title level={2} className="!font-[family-name:var(--font-display)] !mb-2">
        Create account
      </Title>
      <Text type="secondary">Start building your personal knowledge vault</Text>

      <Form
        layout="vertical"
        className="mt-6"
        onFinish={async (values) => {
          const { error } = await authClient.signUp.email({
            email: values.email,
            password: values.password,
            name: values.name,
          });
          if (error) {
            message.error(error.message ?? "Sign up failed");
            return;
          }
          message.success("Account created");
          router.push("/dashboard");
          router.refresh();
        }}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input prefix={<MailOutlined />} />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, min: 8 }]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Create account
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
        Already have an account? <Link href="/sign-in">Sign in</Link>
      </p>
    </Card>
  );
}

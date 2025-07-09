"use client";
import HttpRequest from "@/lib/http-request";
import { Button, Card, Form, Input, message } from "antd";
import Image from "next/image";
import Link from "next/link";
import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";
import Cookie from "universal-cookie";

const Login = () => {
  const router = useRouter();
  const cookie = new Cookie();
  const login = async (values: Record<string, unknown>) => {
    try {
      const { data } = await HttpRequest.post("/auth/login", values);
      cookie.set("accessToken", data.accessToken, { path: "/", maxAge: 840 });
      cookie.set("refreshToken", data.refreshToken, {
        path: "/",
        maxAge: 2588400,
      });

      router.replace("/admin");
    } catch (error: any) {
      const errorMessage = error.response
        ? error.response.data.message || error.response.data
        : "Failed To Login";
      message.error(errorMessage);
    }
  };
  return (
    <div className="bg-gradient-to-t from-gray-700 via-gray-800 to-gray-900 min-h-screen flex items-center justify-center p-2 lg:p-0">
      <Card
        hoverable
        className="!bg-gray-600 !border-gray-500 lg:w-1/3 w-full animate__animated animate__fadeIn "
      >
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/image/logo.jpeg"
            alt="logo"
            width={80}
            height={80}
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-sm"
          />
          <Card.Meta
            title={
              <span className="text-white text-lg font-semibold text-center block">
                Welcome Back
              </span>
            }
            description={
              <span className="text-gray-300 text-sm text-center block">
                Login to continue using <strong>Tuber Service</strong>.
              </span>
            }
            className="!text-center !mt-2"
          />
          <Form className="w-full" layout="vertical" onFinish={login}>
            <Form.Item
              name="email"
              label={<label className="!font-bold !text-gray-300">Email</label>}
              rules={[{ required: true, type: "email" }]}
            >
              <Input
                placeholder="a@a.com"
                size="large"
                className="!bg-gray-400 !border-gray-400  !text-gray-300"
              />
            </Form.Item>
            <Form.Item
              name="password"
              label={
                <label className="!font-bold !text-gray-300">Password</label>
              }
              rules={[{ required: true }]}
            >
              <Input
                placeholder="************"
                size="large"
                type="password"
                className="!bg-gray-400 !border-gray-400  !text-gray-300"
              />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                size="large"
                className="!bg-gray-500 hover:!bg-gray-400 !text-gray-300 !font-medium !border-gray-500 hover:!border-gray-400 !p-4"
              >
                Log In
              </Button>
            </Form.Item>
          </Form>
          <div>
            <p className="text-sm text-gray-300">
              Don’t have an account?{" "}
              <Link
                href="/signup"
                className="!text-gray-400 hover:!text-gray-300 underline transition"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;

"use client";
import { GoogleCircleFilled } from "@ant-design/icons";
import { Button, Card, Form, Input, message } from "antd";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import "@ant-design/v5-patch-for-react-19";
import HttpRequest from "@/lib/http-request";
import { useRouter } from "next/navigation";

const Signup = () => {
  const { data: session } = useSession();
  const [singupForm] = Form.useForm();
  const router = useRouter();
  useEffect(() => {
    if (session?.user) {
      singupForm.setFieldsValue({
        fullname: session.user.name,
        email: session.user.email,
      });
    }
  }, [session, singupForm]);
  const signup = async (values: Record<string, unknown>) => {
    try {
      console.log("Submitted values:", values);
      await HttpRequest.post("/auth/signup", values);
      await signOut({ redirect: false });
      router.push("/login");
    } catch (error: any) {
      const errorMessage = error.response
        ? error.response.data.message || error.response.data
        : "Failed To Create User";
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
                Create An Account
              </span>
            }
            description={
              <span className="text-gray-300 text-sm text-center block">
                Sing Up to continue using <strong>Tuber Service</strong>.
              </span>
            }
            className="!text-center !mt-2"
          />
          <Form
            className="w-full"
            layout="vertical"
            onFinish={signup}
            form={singupForm}
          >
            <Form.Item
              name="fullname"
              label={
                <label className="!font-bold !text-gray-300">Full Name</label>
              }
              rules={[{ required: true }]}
            >
              <Input
                readOnly
                placeholder="Full Name Sign in WIth Google"
                size="large"
                type="text"
                className="!bg-gray-400 !border-gray-400  !text-gray-300"
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item
              name="channelName"
              label={
                <label className="!font-bold !text-gray-300">
                  Channel Name
                </label>
              }
              rules={[{ required: true }]}
            >
              <Input
                placeholder="Channel Name"
                size="large"
                type="text"
                className="!bg-gray-400 !border-gray-400  !text-gray-300"
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item
              name="email"
              label={<label className="!font-bold !text-gray-300">Email</label>}
              rules={[{ required: true, type: "email" }]}
            >
              <Input
                readOnly
                placeholder="a@a.com Sign in WIth Google"
                size="large"
                className="!bg-gray-400 !border-gray-400  !text-gray-300"
                autoComplete="off"
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
          <Button
            onClick={() => signIn("google")}
            htmlType="button"
            icon={<GoogleCircleFilled className="!text-xl !text-gray-200 " />}
            size="large"
            className="!font-bold !bg-gray-400 !border-gray-400 !text-gray-300"
          >
            Sign Up With Google
          </Button>
          <div>
            <p className="text-sm text-gray-300">
              Already have an account?
              <Link
                href="/login"
                className="!text-gray-400 hover:!text-gray-300 underline transition"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Signup;

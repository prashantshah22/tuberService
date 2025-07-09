"use client";
import HttpRequest from "@/lib/http-request";
import {
  AppstoreAddOutlined,
  LoginOutlined,
  MenuOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, ReactNode, useState } from "react";
import useSWR from "swr";
import Cookies from "universal-cookie";
import '@ant-design/v5-patch-for-react-19';
const menu = [
  {
    key: "/admin/dashboard",
    label: "Dashboard",
    icon: <AppstoreAddOutlined />,
  },
  {
    key: "/admin/videos",
    label: "Videos",
    icon: <VideoCameraOutlined />,
  },
];
const AdminLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const navigate = (menu: any) => {
    router.push(menu.key);
  };
  const logout = async () => {
    const cookie = new Cookies();
    const cookies = cookie.getAll();
    Object.keys(cookies).forEach((key) => cookie.remove(key));

    router.replace("/login");
  };
  const refreshToken = async (url: string) => {
    try {
      const cookie = new Cookies();
      const refreshToken = cookie.get("refreshToken");
      if (!refreshToken) throw new Error("Refresh Token Not Found");
      const { data } = await HttpRequest.post(url, { refreshToken });
      cookie.set("accessToken", data.accessToken, { path: "/", maxAge: 840 });
      cookie.set("refreshToken", data.refreshToken, {
        path: "/",
        maxAge: 2588400,
      });
    } catch (error) {
      logout();
    }
  };
  useSWR("/auth/refresh-token", refreshToken, {
    refreshInterval: 13 * 60 * 1000,
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });
  return (
    <Layout className="!min-h-screen ">
      <Sider collapsible collapsed={open} className="py-10">
        <Menu
          items={menu}
          theme="dark"
          defaultOpenKeys={["dashboard"]}
          onClick={navigate}
        />
      </Sider>
      <Layout>
        <Header className="!p-0 bg-[#001529]">
          <div className="flex items-center justify-between px-4 py-2 h-full">
            <div className="flex items-center gap-3">
              <Image
                src="/image/logo.jpeg"
                alt="Logo"
                width={40}
                height={40}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-none"
              />
              <span className="hidden sm:inline text-white text-lg font-semibold">
                Tuber Service
              </span>
            </div>
            <div className="space-x-5">
              <Button
                type="text"
                icon={<LoginOutlined className="!text-white !text-lg" />}
                onClick={logout}
              />
              <Button
                type="text"
                icon={<MenuOutlined className="!text-white !text-lg" />}
                onClick={() => setOpen(!open)}
              />
            </div>
          </div>
        </Header>
        <Content className="!p-8 bg-gray-800">
          <div className="bg-gray-700 p-8 rounded-md shadow-md text-white border border-gray-600">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

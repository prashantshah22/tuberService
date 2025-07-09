"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { FC, ReactNode } from "react";
import "animate.css";
import { SessionProvider } from "next-auth/react";
import { App as AntdApp, ConfigProvider, theme } from "antd";
interface MainLayoutInterface {
  children: ReactNode;
}
const MainLayout: FC<MainLayoutInterface> = ({ children }) => {
  return (
    <SessionProvider>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorBgBase: "#3C4758",
            colorBgContainer: "#3C4758",
            colorTextBase: "#F1F5F9",
            colorBorder: "#3C4758",
            colorPrimary: "#94A3B8",
            colorFillAlter: "#4B5563",
            colorBgElevated: "#4B5563",
            colorTextPlaceholder: "#A0AEC0",
            colorTextDisabled: "#A0AEC0",
            colorFillContent: "#475569",
            colorBgLayout: "#3C4758",
          },
        }}
      >
        <AntdRegistry>
          <AntdApp>
            <div className="min-h-screen bg-gray-800 text-white">
              <main>{children}</main>
            </div>
          </AntdApp>
        </AntdRegistry>
      </ConfigProvider>
    </SessionProvider>
  );
};

export default MainLayout;

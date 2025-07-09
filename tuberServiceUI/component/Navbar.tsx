import { LoginOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div>
      <nav className="flex items-center justify-between gap-4 p-4 bg-gray-900 shadow-md border-b border-gray-700">
        <div className="flex items-center gap-4">
          <Image
            src="/image/logo.jpeg"
            alt="Logo"
            width={40}
            height={40}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-none"
          />
          <span className="hidden sm:inline text-lg font-semibold">
            Tuber Service
          </span>
        </div>
        <div className="space-x-6">
          <Link href="/login">
            <Button size="large" icon={<LoginOutlined />}>
              LogIn
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="large" icon={<UserAddOutlined />}>
              Register Now
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

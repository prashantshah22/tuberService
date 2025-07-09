"use client";
import { Card } from "antd";
import React, { FC } from "react";
import Navbar from "./Navbar";
import { EyeOutlined, LikeOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import "@ant-design/v5-patch-for-react-19";
interface HomeInterface {
  data: any;
}
const Home: FC<HomeInterface> = ({ data }) => {
  return (
    <div>
      <Navbar />
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-12 p-4">
        {data?.map((items: any, index: number) => (
          <Card
            key={index}
            hoverable
            cover={
              <Image
                src={
                  items.thumbnail
                    ? `${process.env.NEXT_PUBLIC_STREAMING_SERVER}/${items.thumbnail}`
                    : "/image/thumb.jpg"
                }
                alt={items.title}
                width={1280}
                height={720}
              />
            }
            actions={[
              <div key="views" className="space-x-4">
                <EyeOutlined />
                <span>{items.views}</span>
              </div>,
              <div key="like" className="space-x-4">
                <LikeOutlined />
                <span>20K</span>
              </div>,
              <div key="date">
                {new Date(items.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>,
            ]}
          >
            <Card.Meta
              title={
                <Link href={`/videos/${items._id}`}>
                  <span className="text-gray-300 capitalize">
                    {items.title}
                  </span>
                </Link>
              }
              description="Wap institute"
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;

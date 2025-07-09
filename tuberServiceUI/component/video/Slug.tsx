"use client";
import { Button, Card, Divider, Form, Input, message } from "antd";
import Navbar from "../Navbar";
import Image from "next/image";
import { DislikeOutlined, EyeOutlined, LikeOutlined } from "@ant-design/icons";
import { Avatar, List } from "antd";
import { FC, useState } from "react";
import VideoPlayer from "../shared/VideoPlayer";
import HttpRequest from "@/lib/http-request";
import "@ant-design/v5-patch-for-react-19";
import useSWR, { mutate } from "swr";
import fetcher from "@/lib/fetcher";

interface SlugInterface {
  data: any;
}
const Slug: FC<SlugInterface> = ({ data }) => {
  const [disabledComment, setDisabledComment] = useState(true);
  const [form] = Form.useForm();
  const { data: comments } = useSWR(`/comment/${data._id}`, fetcher);
  const { data: likeData } = useSWR(`/like/${data._id}`, fetcher);
  const { data: recomendedVideos } = useSWR(`/video/recommended`, fetcher);
  console.log("recommended", recomendedVideos);
  const createComment = async (values: any, videoId: string) => {
    try {
      values.videoId = videoId;
      await HttpRequest.post("/comment", values);
      form.resetFields();
      mutate(`/comment/${data._id}`);
      message.success("Comment Successful");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Unexpected error occurred";

      message.error(msg);
    }
  };
  const likeDislike = async (videoId: string, status: "like" | "dislike") => {
    try {
      await HttpRequest.post("/like", { status, videoId });
      mutate(`/like/${data._id}`);
    } catch (error: any) {
      if (error.status == 401) {
        message.error(`please login to ${status}`);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex lg:flex-row flex-col gap-8 lg:p-10 p-2">
        <div className="lg:w-7/10 w-full">
          <VideoPlayer
            src={`${process.env.NEXT_PUBLIC_STREAMING_SERVER}/${data.path}`}
            poster={
              data.thumbnail
                ? `${process.env.NEXT_PUBLIC_STREAMING_SERVER}/${data.thumbnail}`
                : "/image/thumb.jpg"
            }
          />
          <div className=" space-y-4">
            <h1 className="font-bolder lg:text-3xl text-gray-300 mt-4">
              {data.title}
            </h1>
            <div className="flex gap-8">
              <h1 className="text-xl font-bold text-gray-300 capitalize">
                {data.videoOwner.channelName}
              </h1>
              <Button
                className="space-x-4"
                icon={<LikeOutlined />}
                onClick={() => likeDislike(data._id, "like")}
              >
                {likeData?.like}
              </Button>
              <Button
                className="space-x-4"
                icon={<DislikeOutlined />}
                onClick={() => likeDislike(data._id, "dislike")}
              >
                {likeData?.dislike}
              </Button>
              <Button className="space-x-4" icon={<EyeOutlined />}>
                {data.views}
              </Button>
            </div>
            <Divider />
            <div className="space-y-4">
              <h1 className="text-xl font-bold text-gray-300">Comments</h1>
              <Form
                form={form}
                className="w-full flex flex-col"
                onFinish={(values: any) => createComment(values, data._id)}
              >
                <Form.Item name="comment">
                  <Input.TextArea
                    size="large"
                    placeholder="Add a comment"
                    onChange={() => setDisabledComment(false)}
                  />
                </Form.Item>
                <Form.Item className="self-end ">
                  <div className="space-x-4">
                    <Button
                      onClick={() => {
                        form.resetFields();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button htmlType="submit" disabled={disabledComment}>
                      Comment
                    </Button>
                  </div>
                </Form.Item>
              </Form>
              {comments && (
                <List
                  itemLayout="horizontal"
                  dataSource={comments}
                  renderItem={(item: any, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                          />
                        }
                        title={
                          <label className="capitalize">
                            {item.user.channelName}
                          </label>
                        }
                        description={
                          <label className="!text-gray-300 !font-semibold ">
                            {item.comment}
                          </label>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </div>
          </div>
        </div>
        {/* <Card
          className="flex-1 max-h-[70vh] overflow-y-scroll"
          title={<h1 className="text-gray-400 text-lg">Recommended videos</h1>}
        >
          <div className="flex flex-col gap-4">
            {recomendedVideos?.map((item: any, index: number) => (
              <div key={index} className="flex flex-row gap-4">
                <Image
                  src="/image/thumb.jpg"
                  alt="thumbnail"
                  width={100}
                  height={50}
                  className="rounded"
                />
                <Card.Meta
                  title="Intro to HTML language"
                  description={
                    <div className="flex justify-between">
                      <label>Ravi Sah</label>
                      <label className="space-x-1">
                        <EyeOutlined />
                        <span>20K</span>
                      </label>
                      <label className="space-x-1">
                        <LikeOutlined />
                        <span>20K</span>
                      </label>
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        </Card> */}

        <Card
          className="flex-1 h-[500px] overflow-auto"
          title={<h1 className="text-lg">Recomended Videos</h1>}
        >
          <div className="space-y-4">
            {recomendedVideos &&
              recomendedVideos.map((item: any, index: number) => (
                <div key={index} className="flex gap-4">
                  <Image
                    src={
                      item.thumbnail
                        ? `${process.env.NEXT_PUBLIC_STREAMING_SERVER}/${item.thumbnail}`
                        : "/images/thumb.webp"
                    }
                    width={100}
                    height={55}
                    alt={item.title}
                    className="rounded"
                  />
                  <div>
                    <Card.Meta
                      title={<label className="capitalize">{item.title}</label>}
                      description={
                        <div className="flex gap-4 text-xs">
                          <label className="capitalize">
                            {item.user.channelName}
                          </label>
                          <label>{item.views}</label>
                          <label>
                            {new Date(item.createdAt).toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </label>
                        </div>
                      }
                    />
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Slug;

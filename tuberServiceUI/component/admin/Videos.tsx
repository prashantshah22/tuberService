"use client";
import fetcher from "@/lib/fetcher";
import HttpRequest from "@/lib/http-request";
import {
  ArrowUpOutlined,
  DeleteOutlined,
  PictureOutlined,
  PlayCircleOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Skeleton,
  Table,
  Tag,
  Tooltip,
  Upload,
  UploadProps,
} from "antd";
import Image from "next/image";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import "@ant-design/v5-patch-for-react-19";

const { Dragger } = Upload;

const Videos = () => {
  const [file, setFile] = useState<File | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const { data, isLoading } = useSWR("/video/admin", fetcher);
  const props: UploadProps = {
    accept: "video/mp4",
    name: "file",
    multiple: false,
    beforeUpload: (file) => {
      const isMp4 = file.type === "video/mp4";
      if (!isMp4) {
        message.error("Only MP4 files are allowed!");
      }
      return isMp4 || Upload.LIST_IGNORE;
    },
    onChange(info) {
      if (info?.file?.originFileObj) {
        setFile(info.file.originFileObj);
        setOpenModal(true);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  const uploadVideo = (values: any) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.src = url;
    video.preload = "metadata";
    video.load();
    video.onloadedmetadata = async () => {
      values.duration = video.duration;
      values.size = file.size;
      values.status = "private";
      try {
        const options = {
          headers: {
            "Content-Type": file.type,
          },
        };

        const { data } = await HttpRequest.post("/video", values);
        await HttpRequest.put(data.signedUrl, file, options);
        mutate("/video/admin");
      } catch (error: any) {
        message.error(
          error?.response?.data?.message ?? "Unable to upload video"
        );
      } finally {
        setFile(null);
        setOpenModal(false);
      }
    };
  };
  const play = (path: string) => {
    console.log(`${process.env.NEXT_PUBLIC_STREAMING_SERVER}/${path}`);
  };
  const deleteVideo = async (id: string) => {
    try {
      await HttpRequest.delete(`/video/${id}`);
      message.success("successfully deleted");
      mutate("/video/admin");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Unexpected error occurred";
      message.error(msg);
    }
  };
  const changeThumbnail = async (id: string) => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.click();

      input.onchange = async () => {
        if (input.files) {
          const file = input.files[0];
          const options = {
            headers: {
              "Content-Type": file.type,
            },
          };
          const { data } = await HttpRequest.post(`/video/thumbnail`, {
            type: file.type,
          });
          await HttpRequest.put(data.signedUrl, file, options);
          await HttpRequest.put(`/video/${id}`, { thumbnail: data.path }); //bad idea no time to fix
          mutate("/video/admin");
          message.success("Thumbnail chnaged successfully");
        }
      };
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Unexpected error occurred";

      message.error(msg);
    }
  };
  const columns = [
    {
      title: "Thumbnail",
      key: "thumbnail",
      render: (item: any) => (
        <Image
          src={
            item.thumbnail
              ? `${process.env.NEXT_PUBLIC_STREAMING_SERVER}/${item.thumbnail}`
              : "/image/thumb.jpg"
          }
          width={100}
          height={100}
          alt={item._id}
        />
      ),
    },
    {
      key: "title",
      title: "Title",
      dataIndex: "title",
    },
    {
      key: "duration",
      title: "Duration",
      dataIndex: "duration",
    },
    {
      key: "size",
      title: "Size",
      dataIndex: "size",
    },
    {
      key: "date",
      title: "Date",
      dataIndex: "createdAt",
    },
    {
      key: "status",
      title: "Status",
      render: (item: any) => (
        <Tag
          color={item.status === "private" ? "#d89614" : "green"}
          className="capitalize !text-gray-300 !font-bold !text-lg"
        >
          {item.status}
        </Tag>
      ),
    },
    {
      key: "action",
      title: "Actions",
      render: (item: any) => (
        <div className="flex justify-evenly gap-2">
          <Tooltip title="Change Thumbnail">
            <Button
              icon={<PictureOutlined />}
              type="primary"
              className="!bg-amber-600 border-none"
              onClick={() => changeThumbnail(item._id)}
            />
          </Tooltip>
          <Button
            icon={<PlayCircleOutlined />}
            type="primary"
            className="!bg-blue-600 border-none"
            onClick={() => play(item.path)}
          />
          <Popconfirm
            title="Delete this Video"
            description="Are you sure you want to delete this video?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteVideo(item._id)}
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              type="primary"
              className="!bg-red-600 border-none"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <VideoCameraAddOutlined />
          </p>
          <p className="ant-upload-text !text-gray-300">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint !text-gray-300">
            Support for a single or bulk upload. Strictly prohibited from
            uploading company data or other banned files.
          </p>
        </Dragger>
      </div>
      {isLoading && <Skeleton />}
      {data && (
        <Table
          columns={columns}
          dataSource={data}
          className="!font-bold !text-lg !capitalize"
          rowKey="_id"
        />
      )}
      <Modal
        open={openModal}
        footer={null}
        title="Add a New Video"
        className="!w-4/10"
      >
        <Form layout="vertical" onFinish={uploadVideo}>
          <Form.Item
            label={
              <label className="text-gray-300 font-bold">Video Title</label>
            }
            name="title"
            rules={[{ required: true }]}
          >
            <Input size="large" placeholder="Enter Video Name" />
          </Form.Item>

          <Form.Item
            label={
              <label className="text-gray-300 font-bold">
                Video Description
              </label>
            }
            name="description"
            rules={[{ required: true }]}
          >
            <Input.TextArea
              rows={5}
              size="large"
              placeholder="Description goes here"
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              className="!p-2 !font-extrabold"
              size="large"
              icon={<ArrowUpOutlined />}
            >
              Start Uploading
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Videos;

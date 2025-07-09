import { message } from "antd";
import { FC, useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-hls-quality-selector";
import "videojs-hotkeys";
import "@ant-design/v5-patch-for-react-19";
interface videoPlayerInterface {
  src: string;
  poster?: string;
}
const VideoPlayer: FC<videoPlayerInterface> = ({ src, poster }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (!videoRef.current) return;
    const options = {
      sources: [{ src, type: getVideoType(src) }],
      fluid: true,
      poster,
      plugins: {
        hotkeys: {
          volumeStep: 0.1,
          seekStep: 5,
          enableModifiersForNumbers: false,
        },
      },
    };
    const player: any = videojs(videoRef.current, options);
    player.ready(() => {
      player.hlsQualitySelector({
        displayCurrentQuality: true,
      });
    });
  }, [src, poster]);
  const getVideoType = (src: string): string | undefined => {
    const ext = src.split(".").pop()?.toLowerCase();

    try {
      switch (ext) {
        case "m3u8":
          return "application/x-mpegURL"; // HLS
        case "mpd":
          return "application/dash+xml"; // MPEG-DASH
        case "mp4":
          return "video/mp4";
        default:
          throw new Error(`Unsupported video format: .${ext}`);
      }
    } catch (error: any) {
      message.error(error.message || "Unknown video format error");
      return undefined;
    }
  };
  return (
    <div data-vjs-player className="video-container">
      <video className="video-js" ref={videoRef} controls></video>
    </div>
  );
};

export default VideoPlayer;

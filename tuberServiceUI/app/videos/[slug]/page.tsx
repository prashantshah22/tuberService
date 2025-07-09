import Slug from "@/component/video/Slug";
import { FC } from "react";

interface SlugRouterInterface {
  params: any;
}
const SlugRouter: FC<SlugRouterInterface> = async ({ params: { slug } }) => {
  const videoRes = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER}/video/${slug}`,
    { next: { revalidate: 3600 } }
  );
  const video = await videoRes.json();
  return <Slug data={video} />;
};

export default SlugRouter;

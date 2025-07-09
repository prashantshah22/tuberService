import Home from "@/component/Home";

const HomeRouter = async () => {
  const videoRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/video`, {
    next: {
      revalidate: 3600,
    },
  });
  const videos = await videoRes.json();
  return <Home data={videos} />;
};

export default HomeRouter;

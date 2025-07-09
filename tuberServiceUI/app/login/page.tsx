import Login from "@/component/Login";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Login – Tuber Service",
  description:
    "Login to your Tuber Service account to access your personalized video streaming dashboard. Enjoy secure access to your favorite content.",
  keywords: [
    "Tuber Service login",
    "video streaming login",
    "streaming platform authentication",
    "account login tuber service",
    "auth tuber service",
    "Tuber Service account access",
    "secure video streaming",
    "login page",
  ],
};
const LoginRouter = () => {
  return <Login />;
};

export default LoginRouter;

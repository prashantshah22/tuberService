import Signup from "@/component/Singup";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sign Up - Tuber Service",
  description:
    "Create an account to start using Tuber Service, your trusted video platform.",
  keywords: ["Tuber Service", "Signup", "Create Account", "Video Platform"],
};
const SignupRouter = () => {
  return <Signup />;
};

export default SignupRouter;

import { NextResponse, NextRequest } from "next/server";

const server = process.env.NEXT_PUBLIC_SERVER;

const AdminGuard = async (req: NextRequest) => {
  const accessToken = req.cookies.get("accessToken");
  if (!accessToken) return redirectToLogin(req);

  const res = await fetch(`${server}/auth/verify-token`, {
    method: "POST",
    headers: {
      "x-auth-token": accessToken.value,
    },
  });

  if (!res.ok) return redirectToLogin(req, true);

  const payload = await res.json();
  delete payload.id;

  const nextRes = NextResponse.next();
  nextRes.cookies.set({
    name: "session",
    value: JSON.stringify(payload),
    path: "/",
    maxAge: 86400,
  });

  return nextRes;
};

const LoginGuard = async (req: NextRequest) => {
  const accessToken = req.cookies.get("accessToken");
  if (!accessToken) return NextResponse.next();

  const res = await fetch(`${server}/auth/verify-token`, {
    method: "POST",
    headers: {
      "x-auth-token": accessToken.value,
    },
  });

  if (!res.ok) return redirectToLogin(req, true);
  return NextResponse.redirect(new URL("/admin", req.url));
};

const redirectToLogin = (req: NextRequest, clearCookie: boolean = false) => {
  const res = NextResponse.redirect(new URL("/login", req.url));
  if (clearCookie) {
    res.cookies.set({
      name: "accessToken",
      value: "",
      path: "/",
      maxAge: 0,
    });
    res.cookies.set({
      name: "session",
      value: "",
      path: "/",
      maxAge: 0,
    });
    res.cookies.set({
      name: "refreshToken",
      value: "",
      path: "/",
      maxAge: 0,
    });
  }
  return res;
};

export const middleware = (req: NextRequest) => {
  if (req.nextUrl.pathname.startsWith("/admin")) return AdminGuard(req);
  if (req.nextUrl.pathname.startsWith("/login")) return LoginGuard(req);
};

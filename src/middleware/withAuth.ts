import { getToken } from "next-auth/jwt";
import { useSession, getSession } from "next-auth/react";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

const onlyAdmin = ["/admin"];
const notAuth = ["/"];

export default function withAuth(
  middleware: NextMiddleware,
  requireAuth: string[] = []
) {
  return async (req: NextRequest, next: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname;

    const requestForNextAuth: any = {
      headers: {
        cookie: req.headers.get("cookie"),
      },
    };
    const session = await getSession({ req: requestForNextAuth });
    const token = session?.user?.token || null;

    // console.log("SESSION ", session);
    // console.log("TOKEN ", token);
    // console.log("pathname ", pathname);

    if (requireAuth.includes(pathname)) {
      if (!token) {
        const url = new URL("/", req.url);
        return NextResponse.redirect(url);
      }
      if (session?.user?.role !== "admin" && onlyAdmin.includes(pathname)) {
        return NextResponse.redirect(new URL("/master/product", req.url));
      }
      return NextResponse.next();
      // if (notAuth.includes(pathname) && !requireAuth.includes(pathname)) {
      //   if (token) {
      //     const url = new URL("/admin", req.url);
      //     return NextResponse.redirect(url);
      //   }
      // }
    }
    return middleware(req, next);
  };
}

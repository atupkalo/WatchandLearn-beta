import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/home/:path*",
    "/lessons/:path*",
    "/grammar/:path*",
    "/pronunciation/:path*",
    "/vocabulary/:path*",
    "/admin/:path*",
    "/api/lesson-likes/:path*",
  ],
};

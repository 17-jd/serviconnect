import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Only run auth middleware if Supabase is configured
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    try {
      return await updateSession(request);
    } catch {
      // If middleware fails, allow the request through
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only run on login/signup for redirect-if-authenticated logic
    "/login",
    "/signup",
  ],
};

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Refresh the session (important for keeping auth state fresh)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;

    // If user is logged in and visiting login/signup, redirect to dashboard
    if (user && (path === "/login" || path === "/signup")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const url = request.nextUrl.clone();
      url.pathname =
        profile?.role === "provider"
          ? "/provider/dashboard"
          : "/customer/dashboard";
      return NextResponse.redirect(url);
    }
  } catch (e) {
    // If Supabase auth fails, just continue without auth
    // Pages will handle their own auth state
  }

  return supabaseResponse;
}

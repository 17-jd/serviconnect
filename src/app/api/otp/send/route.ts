import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateOTP } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId, type } = await request.json();

    if (!bookingId || !type) {
      return NextResponse.json(
        { error: "bookingId and type (start|completion) are required" },
        { status: 400 }
      );
    }

    const otp = generateOTP();
    const field = type === "start" ? "start_otp" : "completion_otp";

    const { error } = await supabase
      .from("bookings")
      .update({ [field]: otp })
      .eq("id", bookingId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ otp });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

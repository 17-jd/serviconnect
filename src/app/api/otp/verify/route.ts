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

    const { bookingId, otp, type } = await request.json();

    // Fetch booking
    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (error || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const storedOtp = type === "start" ? booking.start_otp : booking.completion_otp;

    if (otp !== storedOtp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Update booking status
    if (type === "start") {
      const completionOtp = generateOTP();
      await supabase
        .from("bookings")
        .update({
          status: "in_progress",
          start_otp_verified_at: new Date().toISOString(),
          completion_otp: completionOtp,
        })
        .eq("id", bookingId);

      return NextResponse.json({ success: true, status: "in_progress" });
    } else {
      await supabase
        .from("bookings")
        .update({
          status: "completed",
          completion_otp_verified_at: new Date().toISOString(),
        })
        .eq("id", bookingId);

      return NextResponse.json({ success: true, status: "completed" });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

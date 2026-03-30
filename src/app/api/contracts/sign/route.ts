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

    const { bookingId, signatureDataUrl, role } = await request.json();

    if (!bookingId || !signatureDataUrl || !role) {
      return NextResponse.json(
        { error: "bookingId, signatureDataUrl, and role are required" },
        { status: 400 }
      );
    }

    // Upload signature image to Supabase Storage
    const fileName = `${bookingId}_${role}_${Date.now()}.png`;
    const base64Data = signatureDataUrl.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("signatures")
      .upload(fileName, buffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      // Continue even if storage upload fails — store the data URL directly
    }

    const signatureUrl = uploadData
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/signatures/${fileName}`
      : signatureDataUrl;

    // Update booking with signature
    const signatureField = role === "customer" ? "customer_signature_url" : "provider_signature_url";
    const signedAtField = role === "customer" ? "customer_signed_at" : "provider_signed_at";

    await supabase
      .from("bookings")
      .update({
        [signatureField]: signatureUrl,
        [signedAtField]: new Date().toISOString(),
      })
      .eq("id", bookingId);

    // Check if both parties have signed
    const { data: booking } = await supabase
      .from("bookings")
      .select("customer_signed_at, provider_signed_at")
      .eq("id", bookingId)
      .single();

    if (booking?.customer_signed_at && booking?.provider_signed_at) {
      // Both signed — generate start OTP and update status
      const startOtp = generateOTP();
      await supabase
        .from("bookings")
        .update({
          status: "contract_signed",
          start_otp: startOtp,
        })
        .eq("id", bookingId);

      return NextResponse.json({ success: true, bothSigned: true, status: "contract_signed" });
    }

    return NextResponse.json({ success: true, bothSigned: false, status: "contract_pending" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

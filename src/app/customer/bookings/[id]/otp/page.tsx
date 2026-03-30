"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Check, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { OTPInput } from "@/components/shared/otp-input";

export default function OTPPage() {
  const params = useParams();
  const router = useRouter();
  const [otpType, setOtpType] = useState<"start" | "completion">("start");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // Start OTP is shown to customer (they share with provider)
  const startOTP = "482957";

  const handleCompletionOTP = async (otp: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    // In production, verify against DB
    if (otp === "739264") {
      setVerified(true);
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-lg mx-auto space-y-6"
    >
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <GlassCard variant="strong" hoverable={false} className="p-8 text-center">
        <Shield className="w-16 h-16 text-[var(--color-primary-light)] mx-auto mb-6" />

        {otpType === "start" ? (
          <>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
              Start Verification
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mb-8">
              Share this code with your service provider when they arrive at your location
            </p>

            <div className="flex justify-center gap-3 mb-8">
              {startOTP.split("").map((digit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-14 h-16 rounded-xl glass-strong flex items-center justify-center text-2xl font-bold text-[var(--color-primary-light)]"
                >
                  {digit}
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-muted)]">
              <Clock className="w-4 h-4" />
              Waiting for provider to enter code...
            </div>
          </>
        ) : !verified ? (
          <>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
              Completion Verification
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mb-8">
              Enter the completion code provided by your service provider
            </p>

            <OTPInput onComplete={handleCompletionOTP} />

            {loading && (
              <p className="text-sm text-[var(--color-text-muted)] mt-4 animate-pulse">
                Verifying...
              </p>
            )}
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Check className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
              Service Completed!
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              The service has been successfully completed. Thank you!
            </p>
            <GlassButton
              variant="primary"
              onClick={() => router.push(`/bookings/${params.id}`)}
            >
              View Booking Details
            </GlassButton>
          </>
        )}
      </GlassCard>
    </motion.div>
  );
}

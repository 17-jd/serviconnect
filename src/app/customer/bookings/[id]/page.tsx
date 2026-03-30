"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  Shield,
  CreditCard,
  Check,
  X,
  Download,
  Star,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassBadge } from "@/components/ui/glass-badge";
import { formatCurrency } from "@/lib/utils";
import { BOOKING_STATUS_LABELS } from "@/lib/constants";
import type { BookingStatus } from "@/types/database";

const mockBooking = {
  id: "b1",
  status: "contract_signed" as BookingStatus,
  provider: { name: "Mike Johnson", headline: "Professional Plumber" },
  service: "General Plumbing",
  scheduled_date: "2026-04-02",
  scheduled_time: "10:00",
  duration_hours: 2,
  address_text: "123 Main St, Brooklyn, NY",
  subtotal: 15000,
  platform_fee: 2250,
  total: 17250,
  payment_method: "stripe" as const,
  start_otp: "482957",
  completion_otp: null as string | null,
  customer_signed: true,
  provider_signed: true,
};

const statusSteps = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "contract_signed", label: "Contract Signed" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const booking = mockBooking;

  const currentStepIndex = statusSteps.findIndex((s) => s.key === booking.status);
  const statusInfo = BOOKING_STATUS_LABELS[booking.status];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Bookings
      </button>

      {/* Status Header */}
      <GlassCard variant="strong" hoverable={false} className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
            Booking Details
          </h1>
          <GlassBadge variant={statusInfo.color as "success" | "warning" | "primary" | "danger"}>
            {statusInfo.label}
          </GlassBadge>
        </div>

        {/* Status Timeline */}
        <div className="flex items-center gap-1">
          {statusSteps.map((step, i) => (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    i <= currentStepIndex
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--color-glass-white)] text-[var(--color-text-muted)]"
                  }`}
                >
                  {i < currentStepIndex ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)] mt-1 text-center">
                  {step.label}
                </span>
              </div>
              {i < statusSteps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 -mt-4 ${
                    i < currentStepIndex ? "bg-[var(--color-primary)]" : "bg-[var(--color-glass-border)]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Booking Info */}
      <div className="grid sm:grid-cols-2 gap-4">
        <GlassCard hoverable={false}>
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-[var(--color-primary-light)]" />
            <h3 className="font-semibold text-[var(--color-text-primary)]">Provider</h3>
          </div>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{booking.provider.name}</p>
          <p className="text-xs text-[var(--color-text-muted)]">{booking.provider.headline}</p>
        </GlassCard>

        <GlassCard hoverable={false}>
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-[var(--color-primary-light)]" />
            <h3 className="font-semibold text-[var(--color-text-primary)]">Schedule</h3>
          </div>
          <p className="text-sm text-[var(--color-text-primary)]">{booking.scheduled_date}</p>
          <p className="text-xs text-[var(--color-text-muted)]">{booking.scheduled_time} - {booking.duration_hours} hours</p>
        </GlassCard>

        <GlassCard hoverable={false}>
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-[var(--color-primary-light)]" />
            <h3 className="font-semibold text-[var(--color-text-primary)]">Location</h3>
          </div>
          <p className="text-sm text-[var(--color-text-primary)]">{booking.address_text}</p>
        </GlassCard>

        <GlassCard hoverable={false}>
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-5 h-5 text-[var(--color-primary-light)]" />
            <h3 className="font-semibold text-[var(--color-text-primary)]">Payment</h3>
          </div>
          <p className="text-sm font-bold text-[var(--color-primary-light)]">{formatCurrency(booking.total)}</p>
          <p className="text-xs text-[var(--color-text-muted)] capitalize">{booking.payment_method}</p>
        </GlassCard>
      </div>

      {/* OTP Section */}
      {(booking.status === "contract_signed" || booking.status === "in_progress") && (
        <GlassCard variant="strong" hoverable={false} className="text-center p-8">
          <Shield className="w-10 h-10 text-[var(--color-primary-light)] mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
            {booking.status === "contract_signed" ? "Start OTP" : "Completion OTP"}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            {booking.status === "contract_signed"
              ? "Share this code with your provider when they arrive"
              : "Enter the completion code provided by your provider"}
          </p>
          <div className="flex justify-center gap-3">
            {(booking.status === "contract_signed" ? booking.start_otp : "------")
              ?.split("")
              .map((digit, i) => (
                <div
                  key={i}
                  className="w-14 h-16 rounded-xl glass flex items-center justify-center text-2xl font-bold text-[var(--color-primary-light)]"
                >
                  {digit}
                </div>
              ))}
          </div>
        </GlassCard>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        {booking.status === "confirmed" && (
          <GlassButton
            variant="primary"
            onClick={() => router.push(`/bookings/${booking.id}/contract`)}
            icon={<FileText className="w-4 h-4" />}
          >
            View Contract
          </GlassButton>
        )}
        {booking.status === "completed" && (
          <>
            <GlassButton variant="secondary" icon={<Download className="w-4 h-4" />}>
              Download Invoice
            </GlassButton>
            <GlassButton variant="primary" icon={<Star className="w-4 h-4" />}>
              Leave Review
            </GlassButton>
          </>
        )}
        {booking.status === "pending" && (
          <GlassButton variant="danger" icon={<X className="w-4 h-4" />}>
            Cancel Booking
          </GlassButton>
        )}
      </div>
    </motion.div>
  );
}

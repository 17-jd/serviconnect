"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  FileText,
  Banknote,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassBadge } from "@/components/ui/glass-badge";
import { useBookingStore } from "@/stores/booking-store";
import { useAuth } from "@/components/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, cn } from "@/lib/utils";
import { DURATION_OPTIONS, PLATFORM_FEE_PERCENT } from "@/lib/constants";

const fallbackServices = [
  { id: "s1", name: "General Plumbing", rate: 7500 },
  { id: "s2", name: "Drain Cleaning", rate: 8500 },
  { id: "s3", name: "Water Heater", rate: 9500 },
  { id: "s4", name: "Bathroom Renovation", rate: 12000 },
];

const availableSlots = [
  "08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00",
];

const steps = [
  { id: 1, label: "Service", icon: FileText },
  { id: 2, label: "Date & Time", icon: Calendar },
  { id: 3, label: "Duration", icon: Clock },
  { id: 4, label: "Location", icon: MapPin },
  { id: 5, label: "Confirm", icon: Check },
];

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const store = useBookingStore();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState(fallbackServices);
  const [providerName, setProviderName] = useState("Provider");

  useEffect(() => {
    const fetchProvider = async () => {
      const supabase = createClient();
      const { data: provider } = await supabase
        .from("provider_profiles")
        .select("*, profiles(full_name), provider_services(*, service_categories(id, name))")
        .eq("id", params.providerId)
        .single();

      if (provider) {
        const name = (provider.profiles as { full_name: string })?.full_name || "Provider";
        setProviderName(name);
        store.setProvider(provider.id, name, provider.hourly_rate);

        const svcList = (provider.provider_services as { service_categories: { id: string; name: string }; custom_rate: number | null }[]) || [];
        if (svcList.length > 0) {
          setServices(svcList.map((s) => ({
            id: s.service_categories.id,
            name: s.service_categories.name,
            rate: s.custom_rate || provider.hourly_rate,
          })));
        }
      } else {
        store.setProvider(params.providerId as string, "Provider", 7500);
      }
    };
    fetchProvider();
    return () => store.reset();
  }, [params.providerId]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const subtotal = store.getSubtotal();
      const platformFee = store.getPlatformFee();
      const total = store.getTotal();

      const { data: booking, error } = await supabase.from("bookings").insert({
        customer_id: user?.id,
        provider_id: store.providerId,
        category_id: store.categoryId,
        scheduled_date: store.scheduledDate,
        scheduled_time: store.scheduledTime,
        duration_hours: store.durationHours,
        address_text: store.addressText,
        hourly_rate: store.hourlyRate,
        subtotal,
        platform_fee: platformFee,
        total,
        payment_method: store.paymentMethod,
        notes: store.notes,
        status: "pending",
      }).select().single();

      if (error) {
        console.error("Booking error:", error);
        alert("Failed to create booking. Please try again.");
      } else if (booking) {
        router.push(`/customer/bookings/${booking.id}`);
      }
    } catch {
      alert("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  const canProceed = () => {
    switch (store.step) {
      case 1: return !!store.serviceName;
      case 2: return !!store.scheduledDate && !!store.scheduledTime;
      case 3: return store.durationHours > 0;
      case 4: return !!store.addressText;
      case 5: return !!store.paymentMethod;
      default: return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto"
    >
      {/* Back */}
      <button
        onClick={() => store.step > 1 ? store.setStep(store.step - 1) : router.back()}
        className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {store.step > 1 ? "Previous Step" : "Back"}
      </button>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                store.step === s.id
                  ? "bg-[var(--color-primary)] text-white shadow-lg"
                  : store.step > s.id
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "glass-subtle text-[var(--color-text-muted)]"
              )}
            >
              {store.step > s.id ? (
                <Check className="w-4 h-4" />
              ) : (
                <s.icon className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                "w-8 h-px",
                store.step > s.id ? "bg-emerald-500/50" : "bg-[var(--color-glass-border)]"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={store.step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Step 1: Service Selection */}
          {store.step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                Select a Service
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {services.map((service) => (
                  <GlassCard
                    key={service.id}
                    className={cn(
                      "!p-5 cursor-pointer",
                      store.serviceName === service.name &&
                        "!border-[var(--color-primary)] !bg-[var(--color-primary)]/10"
                    )}
                    onClick={() => {
                      store.setService(service.id, service.name);
                      store.setProvider(params.providerId as string, "Mike Johnson", service.rate);
                    }}
                  >
                    <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                      {service.name}
                    </h3>
                    <p className="text-sm text-[var(--color-primary-light)] font-bold">
                      {formatCurrency(service.rate)}/hr
                    </p>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {store.step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                Choose Date & Time
              </h2>
              <GlassInput
                label="Date"
                type="date"
                value={store.scheduledDate || ""}
                onChange={(e) => store.setDateTime(e.target.value, store.scheduledTime || "")}
                min={new Date().toISOString().split("T")[0]}
                icon={<Calendar className="w-4 h-4" />}
              />
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                  Available Slots
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => store.setDateTime(store.scheduledDate || "", slot)}
                      className={cn(
                        "py-3 rounded-xl text-sm font-medium transition-all",
                        store.scheduledTime === slot
                          ? "bg-[var(--color-primary)] text-white shadow-lg"
                          : "glass-subtle text-[var(--color-text-secondary)] hover:bg-[var(--color-glass-white)]"
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Duration */}
          {store.step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                Select Duration
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {DURATION_OPTIONS.map((opt) => (
                  <GlassCard
                    key={opt.value}
                    className={cn(
                      "!p-6 text-center cursor-pointer",
                      store.durationHours === opt.value &&
                        "!border-[var(--color-primary)] !bg-[var(--color-primary)]/10"
                    )}
                    onClick={() => store.setDuration(opt.value)}
                  >
                    <div className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">
                      {opt.value}
                    </div>
                    <div className="text-sm text-[var(--color-text-muted)] mb-3">
                      {opt.label}
                    </div>
                    <div className="text-lg font-bold text-[var(--color-primary-light)]">
                      {formatCurrency(store.hourlyRate * opt.value)}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                      {opt.description}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Location */}
          {store.step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                Service Location
              </h2>
              <GlassInput
                label="Address"
                placeholder="Enter your address"
                value={store.addressText}
                onChange={(e) => store.setLocation(e.target.value, 0, 0)}
                icon={<MapPin className="w-4 h-4" />}
              />
              <GlassInput
                label="Notes for Provider (optional)"
                placeholder="Any special instructions..."
                value={store.notes}
                onChange={(e) => store.setNotes(e.target.value)}
              />
            </div>
          )}

          {/* Step 5: Confirm */}
          {store.step === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                Review & Confirm
              </h2>

              <GlassCard hoverable={false}>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Provider</span>
                    <span className="font-medium text-[var(--color-text-primary)]">{store.providerName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Service</span>
                    <span className="font-medium text-[var(--color-text-primary)]">{store.serviceName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Date</span>
                    <span className="font-medium text-[var(--color-text-primary)]">{store.scheduledDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Time</span>
                    <span className="font-medium text-[var(--color-text-primary)]">{store.scheduledTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Duration</span>
                    <span className="font-medium text-[var(--color-text-primary)]">{store.durationHours} hour(s)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Location</span>
                    <span className="font-medium text-[var(--color-text-primary)]">{store.addressText}</span>
                  </div>

                  <div className="border-t border-[var(--color-glass-border)] pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">Subtotal</span>
                      <span className="text-[var(--color-text-primary)]">{formatCurrency(store.getSubtotal())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">Platform Fee (15%)</span>
                      <span className="text-[var(--color-text-primary)]">{formatCurrency(store.getPlatformFee())}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-[var(--color-glass-border)]">
                      <span className="text-[var(--color-text-primary)]">Total</span>
                      <span className="text-[var(--color-primary-light)]">{formatCurrency(store.getTotal())}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                  Payment Method
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                  <GlassCard
                    className={cn(
                      "!p-5 cursor-pointer flex items-center gap-4",
                      store.paymentMethod === "stripe" &&
                        "!border-[var(--color-primary)] !bg-[var(--color-primary)]/10"
                    )}
                    onClick={() => store.setPaymentMethod("stripe")}
                  >
                    <CreditCard className="w-6 h-6 text-[var(--color-primary-light)]" />
                    <div>
                      <div className="font-semibold text-[var(--color-text-primary)]">Card Payment</div>
                      <div className="text-xs text-[var(--color-text-muted)]">Pay securely via Stripe</div>
                    </div>
                  </GlassCard>
                  <GlassCard
                    className={cn(
                      "!p-5 cursor-pointer flex items-center gap-4",
                      store.paymentMethod === "cash" &&
                        "!border-[var(--color-primary)] !bg-[var(--color-primary)]/10"
                    )}
                    onClick={() => store.setPaymentMethod("cash")}
                  >
                    <Banknote className="w-6 h-6 text-emerald-400" />
                    <div>
                      <div className="font-semibold text-[var(--color-text-primary)]">Cash</div>
                      <div className="text-xs text-[var(--color-text-muted)]">Pay after service completion</div>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <GlassButton
          variant="secondary"
          onClick={() => store.step > 1 ? store.setStep(store.step - 1) : router.back()}
        >
          {store.step > 1 ? "Back" : "Cancel"}
        </GlassButton>

        {store.step < 5 ? (
          <GlassButton
            variant="primary"
            onClick={() => store.setStep(store.step + 1)}
            disabled={!canProceed()}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Continue
          </GlassButton>
        ) : (
          <GlassButton
            variant="primary"
            onClick={handleConfirm}
            loading={loading}
            disabled={!canProceed()}
            icon={<Check className="w-4 h-4" />}
          >
            Confirm Booking
          </GlassButton>
        )}
      </div>
    </motion.div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { CreditCard, Check } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function CheckoutForm({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/customer/bookings`,
      },
      redirect: "if_required",
    });

    if (error) {
      onError(error.message || "Payment failed");
    } else {
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 rounded-xl overflow-hidden">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>
      <GlassButton
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        disabled={!stripe || !elements}
        className="w-full"
        icon={<CreditCard className="w-4 h-4" />}
      >
        Pay Now
      </GlassButton>
    </form>
  );
}

interface StripeCheckoutProps {
  bookingId: string;
  amount: number;
  onSuccess: () => void;
}

export function StripeCheckout({
  bookingId,
  amount,
  onSuccess,
}: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    fetch("/api/payments/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, amount }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.error || "Failed to initialize payment");
        }
      })
      .catch((err) => setError(err.message));
  }, [bookingId, amount]);

  if (paid) {
    return (
      <GlassCard hoverable={false} className="text-center p-8">
        <Check className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
          Payment Successful!
        </h3>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard hoverable={false} className="p-6">
        <p className="text-red-400 text-sm">{error}</p>
      </GlassCard>
    );
  }

  if (!clientSecret) {
    return (
      <GlassCard hoverable={false} className="p-6">
        <div className="h-32 skeleton rounded-xl" />
      </GlassCard>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "night",
          variables: {
            colorPrimary: "#6366f1",
            colorBackground: "#12122a",
            colorText: "#f1f5f9",
            colorTextSecondary: "#94a3b8",
            borderRadius: "12px",
            fontFamily: "Inter, system-ui, sans-serif",
          },
        },
      }}
    >
      <CheckoutForm
        onSuccess={() => {
          setPaid(true);
          onSuccess();
        }}
        onError={setError}
      />
    </Elements>
  );
}

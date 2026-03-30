"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, FileCheck, PenTool, Check, Download } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassBadge } from "@/components/ui/glass-badge";
import SignaturePad from "signature_pad";

export default function ContractPage() {
  const params = useParams();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(2, 2);

      signaturePadRef.current = new SignaturePad(canvas, {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        penColor: "#818cf8",
        minWidth: 1.5,
        maxWidth: 3,
      });

      signaturePadRef.current.addEventListener("endStroke", () => {
        setHasDrawn(true);
      });
    }

    return () => {
      signaturePadRef.current?.off();
    };
  }, []);

  const handleClear = () => {
    signaturePadRef.current?.clear();
    setHasDrawn(false);
  };

  const handleSign = async () => {
    if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) return;
    setLoading(true);
    // Simulate signing
    await new Promise((r) => setTimeout(r, 1500));
    setSigned(true);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Service Contract
        </h1>
        {signed && <GlassBadge variant="success">Signed</GlassBadge>}
      </div>

      {/* Contract Content */}
      <GlassCard variant="strong" hoverable={false} className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <FileCheck className="w-6 h-6 text-[var(--color-primary-light)]" />
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Service Agreement
          </h2>
        </div>

        <div className="space-y-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
          <p>
            <strong className="text-[var(--color-text-primary)]">Contract ID:</strong>{" "}
            SC-2026-{params.id}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 py-4 border-y border-[var(--color-glass-border)]">
            <div>
              <p className="text-xs text-[var(--color-text-muted)] mb-1">Customer</p>
              <p className="font-medium text-[var(--color-text-primary)]">Guest User</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] mb-1">Service Provider</p>
              <p className="font-medium text-[var(--color-text-primary)]">Mike Johnson</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] mb-1">Service</p>
              <p className="font-medium text-[var(--color-text-primary)]">General Plumbing</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] mb-1">Date & Duration</p>
              <p className="font-medium text-[var(--color-text-primary)]">April 2, 2026 - 2 hours</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] mb-1">Location</p>
              <p className="font-medium text-[var(--color-text-primary)]">123 Main St, Brooklyn, NY</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] mb-1">Total Amount</p>
              <p className="font-bold text-[var(--color-primary-light)]">$172.50</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-[var(--color-text-primary)]">Terms & Conditions</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>The Service Provider agrees to perform the specified services at the agreed-upon location and time.</li>
              <li>Service commencement is verified via OTP shared by the Customer upon Provider arrival.</li>
              <li>Service completion is verified via a separate OTP confirmed by the Customer.</li>
              <li>Payment will be processed upon successful completion of the service.</li>
              <li>Either party may cancel the booking with at least 24 hours notice without penalty.</li>
              <li>Late cancellations (less than 24 hours) may incur a 25% cancellation fee.</li>
              <li>The Provider shall maintain professional conduct throughout the service period.</li>
              <li>ServiConnect acts as a platform facilitator and is not directly liable for service quality.</li>
            </ol>
          </div>
        </div>
      </GlassCard>

      {/* Signature Section */}
      {!signed ? (
        <GlassCard hoverable={false} className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <PenTool className="w-5 h-5 text-[var(--color-primary-light)]" />
            <h3 className="font-semibold text-[var(--color-text-primary)]">
              Your Signature
            </h3>
          </div>

          <div className="rounded-xl border border-[var(--color-glass-border)] overflow-hidden mb-4">
            <canvas
              ref={canvasRef}
              className="w-full h-40 cursor-crosshair"
              style={{ touchAction: "none" }}
            />
          </div>

          <div className="flex gap-3">
            <GlassButton variant="secondary" onClick={handleClear} size="sm">
              Clear
            </GlassButton>
            <GlassButton
              variant="primary"
              onClick={handleSign}
              loading={loading}
              disabled={!hasDrawn}
              icon={<Check className="w-4 h-4" />}
            >
              Sign Contract
            </GlassButton>
          </div>
        </GlassCard>
      ) : (
        <GlassCard hoverable={false} className="p-6 text-center">
          <Check className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
            Contract Signed Successfully
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            Waiting for provider to sign. You&apos;ll be notified once both parties have signed.
          </p>
          <GlassButton variant="secondary" icon={<Download className="w-4 h-4" />}>
            Download PDF
          </GlassButton>
        </GlassCard>
      )}
    </motion.div>
  );
}

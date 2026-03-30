"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Calendar, ArrowUp, ArrowDown } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassTabs } from "@/components/ui/glass-tabs";
import { GlassBadge } from "@/components/ui/glass-badge";
import { formatCurrency } from "@/lib/utils";

const earningsData = {
  thisMonth: 245000,
  lastMonth: 198000,
  thisWeek: 67500,
  totalEarnings: 1856000,
};

const transactions = [
  { id: "t1", customer: "Alice Monroe", service: "General Plumbing", date: "Mar 28, 2026", amount: 17250, status: "paid" },
  { id: "t2", customer: "Bob Richardson", service: "Drain Cleaning", date: "Mar 26, 2026", amount: 9775, status: "paid" },
  { id: "t3", customer: "Carol Smith", service: "Water Heater", date: "Mar 24, 2026", amount: 21850, status: "paid" },
  { id: "t4", customer: "Dave Wilson", service: "Pipe Installation", date: "Mar 22, 2026", amount: 14500, status: "pending" },
  { id: "t5", customer: "Eve Johnson", service: "Faucet Replacement", date: "Mar 20, 2026", amount: 8625, status: "paid" },
];

const tabs = [
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "year", label: "This Year" },
];

export default function EarningsPage() {
  const [period, setPeriod] = useState("month");
  const growthPercent = ((earningsData.thisMonth - earningsData.lastMonth) / earningsData.lastMonth * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
        Earnings
      </h1>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard variant="strong" hoverable={false} className="!p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[var(--color-text-muted)]">This Month</span>
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <ArrowUp className="w-3 h-3" />
              {growthPercent}%
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">
            {formatCurrency(earningsData.thisMonth)}
          </p>
        </GlassCard>

        <GlassCard hoverable={false} className="!p-5">
          <span className="text-xs text-[var(--color-text-muted)]">Last Month</span>
          <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-3">
            {formatCurrency(earningsData.lastMonth)}
          </p>
        </GlassCard>

        <GlassCard hoverable={false} className="!p-5">
          <span className="text-xs text-[var(--color-text-muted)]">This Week</span>
          <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-3">
            {formatCurrency(earningsData.thisWeek)}
          </p>
        </GlassCard>

        <GlassCard hoverable={false} className="!p-5">
          <span className="text-xs text-[var(--color-text-muted)]">All Time</span>
          <p className="text-2xl font-bold text-[var(--color-primary-light)] mt-3">
            {formatCurrency(earningsData.totalEarnings)}
          </p>
        </GlassCard>
      </div>

      {/* Earnings Chart Placeholder */}
      <GlassCard hoverable={false} className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Revenue</h2>
          <GlassTabs tabs={tabs} activeTab={period} onTabChange={setPeriod} />
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="flex items-end gap-2 h-48">
            {[40, 65, 55, 80, 70, 90, 75, 85, 60, 95, 88, 72].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="w-8 rounded-t-lg bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-accent)] opacity-80 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Transactions */}
      <GlassCard hoverable={false}>
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">
          Recent Transactions
        </h2>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between py-3 border-b border-[var(--color-glass-border)] last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{tx.customer}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{tx.service} - {tx.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[var(--color-text-primary)]">
                  {formatCurrency(tx.amount)}
                </p>
                <GlassBadge variant={tx.status === "paid" ? "success" : "warning"}>
                  {tx.status}
                </GlassBadge>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

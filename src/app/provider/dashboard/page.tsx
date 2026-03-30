"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  DollarSign,
  Star,
  Users,
  Clock,
  Check,
  X,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassBadge } from "@/components/ui/glass-badge";
import { StarRating } from "@/components/shared/star-rating";
import { formatCurrency, getGreeting } from "@/lib/utils";
import Link from "next/link";

const stats = [
  { label: "Today's Bookings", value: "3", icon: Calendar, color: "text-[var(--color-primary-light)]", bg: "bg-[var(--color-primary)]/10" },
  { label: "This Month", value: "$2,450", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Avg Rating", value: "4.8", icon: Star, color: "text-amber-400", bg: "bg-amber-500/10" },
  { label: "Total Clients", value: "124", icon: Users, color: "text-cyan-400", bg: "bg-cyan-500/10" },
];

const pendingBookings = [
  {
    id: "pb1",
    customer: "Alice Monroe",
    service: "General Plumbing",
    date: "Apr 2, 2026",
    time: "10:00 AM",
    duration: 2,
    total: 17250,
  },
  {
    id: "pb2",
    customer: "Bob Richardson",
    service: "Drain Cleaning",
    date: "Apr 3, 2026",
    time: "2:00 PM",
    duration: 1,
    total: 9775,
  },
];

const todaySchedule = [
  { id: "ts1", customer: "Carol Smith", service: "Water Heater Repair", time: "9:00 AM", status: "completed" },
  { id: "ts2", customer: "Dave Wilson", service: "Pipe Installation", time: "1:00 PM", status: "in_progress" },
  { id: "ts3", customer: "Eve Johnson", service: "Faucet Replacement", time: "4:00 PM", status: "upcoming" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

export default function ProviderDashboard() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Greeting */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          {getGreeting()}, Provider 👋
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Here&apos;s your overview for today
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <GlassCard key={stat.label} hoverable={false} className="!p-5">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{stat.value}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{stat.label}</p>
          </GlassCard>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Requests */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              Pending Requests
            </h2>
            <GlassBadge variant="warning">{pendingBookings.length} new</GlassBadge>
          </div>

          <div className="space-y-3">
            {pendingBookings.map((booking) => (
              <GlassCard key={booking.id} hoverable={false} className="!p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-[var(--color-text-primary)]">
                      {booking.customer}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)]">{booking.service}</p>
                  </div>
                  <span className="text-sm font-bold text-[var(--color-primary-light)]">
                    {formatCurrency(booking.total)}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)] mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {booking.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {booking.time} ({booking.duration}hr)
                  </span>
                </div>

                <div className="flex gap-2">
                  <GlassButton variant="primary" size="sm" icon={<Check className="w-3.5 h-3.5" />}>
                    Accept
                  </GlassButton>
                  <GlassButton variant="secondary" size="sm" icon={<X className="w-3.5 h-3.5" />}>
                    Decline
                  </GlassButton>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Today's Schedule */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              Today&apos;s Schedule
            </h2>
            <Link href="/provider/bookings" className="text-sm text-[var(--color-primary-light)] hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {todaySchedule.map((item) => (
              <GlassCard key={item.id} hoverable={false} className="!p-4 flex items-center gap-4">
                <div className="text-center min-w-[60px]">
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">{item.time}</p>
                </div>
                <div className="w-px h-10 bg-[var(--color-glass-border)]" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{item.customer}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{item.service}</p>
                </div>
                <GlassBadge
                  variant={
                    item.status === "completed" ? "success" :
                    item.status === "in_progress" ? "primary" : "default"
                  }
                >
                  {item.status === "completed" ? "Done" :
                   item.status === "in_progress" ? "Active" : "Upcoming"}
                </GlassBadge>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Links */}
      <motion.div variants={itemVariants} className="grid sm:grid-cols-3 gap-4">
        <Link href="/provider/availability">
          <GlassCard className="flex items-center gap-4 !p-5">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[var(--color-primary-light)]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Availability</h3>
              <p className="text-xs text-[var(--color-text-muted)]">Manage your schedule</p>
            </div>
          </GlassCard>
        </Link>
        <Link href="/provider/earnings">
          <GlassCard className="flex items-center gap-4 !p-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Earnings</h3>
              <p className="text-xs text-[var(--color-text-muted)]">View your income</p>
            </div>
          </GlassCard>
        </Link>
        <Link href="/provider/portfolio">
          <GlassCard className="flex items-center gap-4 !p-5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Portfolio</h3>
              <p className="text-xs text-[var(--color-text-muted)]">Showcase your work</p>
            </div>
          </GlassCard>
        </Link>
      </motion.div>
    </motion.div>
  );
}

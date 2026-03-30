"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  BadgeCheck,
  Star,
  Phone,
  Mail,
  ArrowLeft,
  Calendar,
  Image as ImageIcon,
  MessageSquare,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassBadge } from "@/components/ui/glass-badge";
import { GlassTabs } from "@/components/ui/glass-tabs";
import { StarRating } from "@/components/shared/star-rating";
import { formatCurrency } from "@/lib/utils";

const mockProvider = {
  id: "1",
  user_id: "u1",
  full_name: "Mike Johnson",
  headline: "Professional Plumber | 10yr Experience",
  bio: "With over 10 years of experience in residential and commercial plumbing, I provide reliable, efficient service at fair prices. I specialize in emergency repairs, bathroom renovations, and water heater installations. Licensed and insured.",
  hourly_rate: 7500,
  rating_avg: 4.8,
  rating_count: 124,
  avatar_url: null,
  distance_km: 2.3,
  address_text: "Brooklyn, NY",
  is_verified: true,
  services: ["Plumbing", "Drain Cleaning", "Water Heater", "Bathroom Renovation"],
  availability: {
    mon: { start: "08:00", end: "18:00" },
    tue: { start: "08:00", end: "18:00" },
    wed: { start: "08:00", end: "18:00" },
    thu: { start: "08:00", end: "18:00" },
    fri: { start: "08:00", end: "17:00" },
    sat: { start: "09:00", end: "14:00" },
    sun: null,
  },
};

const mockReviews = [
  { id: "r1", customer: "Alice M.", rating: 5, comment: "Mike was incredibly professional and fixed our leaking pipe in no time. Highly recommend!", date: "2026-03-15" },
  { id: "r2", customer: "Bob K.", rating: 5, comment: "Great work on the bathroom renovation. Clean, efficient, and fair pricing.", date: "2026-03-10" },
  { id: "r3", customer: "Carol S.", rating: 4, comment: "Good service overall. Arrived on time and completed the work well.", date: "2026-02-28" },
];

const tabs = [
  { id: "about", label: "About", icon: <MessageSquare className="w-4 h-4" /> },
  { id: "portfolio", label: "Portfolio", icon: <ImageIcon className="w-4 h-4" /> },
  { id: "reviews", label: "Reviews", icon: <Star className="w-4 h-4" /> },
  { id: "availability", label: "Availability", icon: <Calendar className="w-4 h-4" /> },
];

export default function ProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("about");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Provider Header */}
      <GlassCard variant="strong" hoverable={false} className="p-8">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center shrink-0">
            <span className="text-white text-3xl font-bold">
              {mockProvider.full_name.charAt(0)}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                {mockProvider.full_name}
              </h1>
              {mockProvider.is_verified && (
                <BadgeCheck className="w-5 h-5 text-[var(--color-primary-light)]" />
              )}
            </div>
            <p className="text-[var(--color-text-secondary)] mb-3">
              {mockProvider.headline}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <StarRating
                rating={mockProvider.rating_avg}
                showValue
                count={mockProvider.rating_count}
              />
              <span className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                <MapPin className="w-4 h-4" />
                {mockProvider.distance_km} km away
              </span>
              <span className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                <Clock className="w-4 h-4" />
                Usually responds in 15 min
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-[var(--color-primary-light)]">
                {formatCurrency(mockProvider.hourly_rate)}
              </span>
              <span className="text-sm text-[var(--color-text-muted)]">/hour</span>
            </div>
          </div>

          <div className="sm:self-start">
            <GlassButton
              variant="primary"
              size="lg"
              onClick={() => router.push(`/booking/${mockProvider.id}`)}
            >
              Book Now
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* Tabs */}
      <GlassTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="w-full"
      />

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === "about" && (
          <div className="space-y-6">
            <GlassCard hoverable={false}>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
                About
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {mockProvider.bio}
              </p>
            </GlassCard>

            <GlassCard hoverable={false}>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
                Services Offered
              </h3>
              <div className="flex flex-wrap gap-2">
                {mockProvider.services.map((service) => (
                  <GlassBadge key={service} variant="primary">
                    {service}
                  </GlassBadge>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === "portfolio" && (
          <GlassCard hoverable={false} className="text-center py-16">
            <ImageIcon className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
            <p className="text-[var(--color-text-muted)]">
              Portfolio images will be displayed here
            </p>
          </GlassCard>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4">
            {mockReviews.map((review) => (
              <GlassCard key={review.id} hoverable={false}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-glass-white-strong)] flex items-center justify-center">
                      <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {review.customer.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                      {review.customer}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--color-text-muted)]">{review.date}</span>
                </div>
                <StarRating rating={review.rating} size="sm" />
                <p className="text-sm text-[var(--color-text-secondary)] mt-2 leading-relaxed">
                  {review.comment}
                </p>
              </GlassCard>
            ))}
          </div>
        )}

        {activeTab === "availability" && (
          <GlassCard hoverable={false}>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
              Weekly Schedule
            </h3>
            <div className="space-y-3">
              {Object.entries(mockProvider.availability).map(([day, hours]) => (
                <div
                  key={day}
                  className="flex items-center justify-between py-2 border-b border-[var(--color-glass-border)] last:border-0"
                >
                  <span className="text-sm font-medium text-[var(--color-text-primary)] capitalize w-20">
                    {day}
                  </span>
                  {hours ? (
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      {hours.start} - {hours.end}
                    </span>
                  ) : (
                    <span className="text-sm text-[var(--color-text-muted)]">Closed</span>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </motion.div>
    </motion.div>
  );
}

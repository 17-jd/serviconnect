"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock, BadgeCheck } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassBadge } from "@/components/ui/glass-badge";
import { StarRating } from "@/components/shared/star-rating";
import { formatCurrency } from "@/lib/utils";
import type { NearbyProvider } from "@/types/database";

interface ProviderCardProps {
  provider: NearbyProvider;
  services?: string[];
}

export function ProviderCard({ provider, services = [] }: ProviderCardProps) {
  return (
    <Link href={`/providers/${provider.provider_id}`}>
      <GlassCard className="group p-5">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {provider.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-[var(--color-text-primary)] truncate">
                {provider.full_name}
              </h3>
              <BadgeCheck className="w-4 h-4 text-[var(--color-primary-light)] shrink-0" />
            </div>

            {provider.headline && (
              <p className="text-sm text-[var(--color-text-secondary)] truncate mb-2">
                {provider.headline}
              </p>
            )}

            <div className="flex items-center gap-4 mb-3">
              <StarRating
                rating={provider.rating_avg}
                size="sm"
                showValue
                count={provider.rating_count}
              />
            </div>

            {/* Tags */}
            {services.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {services.slice(0, 3).map((service) => (
                  <GlassBadge key={service} variant="primary">
                    {service}
                  </GlassBadge>
                ))}
                {services.length > 3 && (
                  <GlassBadge>+{services.length - 3}</GlassBadge>
                )}
              </div>
            )}

            {/* Bottom row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {provider.distance_km.toFixed(1)} km
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Available
                </span>
              </div>
              <span className="text-sm font-bold text-[var(--color-primary-light)]">
                {formatCurrency(provider.hourly_rate)}/hr
              </span>
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}

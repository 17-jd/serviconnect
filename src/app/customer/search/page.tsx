"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, SlidersHorizontal, Grid3X3, List } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassTabs } from "@/components/ui/glass-tabs";
import { SearchBar } from "@/components/shared/search-bar";
import { ProviderCard } from "@/components/providers/provider-card";
import { useGeolocation } from "@/hooks/use-geolocation";
import { cn } from "@/lib/utils";
import type { NearbyProvider } from "@/types/database";

const mockResults: NearbyProvider[] = [
  { provider_id: "1", user_id: "u1", full_name: "Mike Johnson", headline: "Professional Plumber | 10yr Experience", hourly_rate: 7500, rating_avg: 4.8, rating_count: 124, avatar_url: null, distance_km: 2.3 },
  { provider_id: "2", user_id: "u2", full_name: "Sarah Williams", headline: "Licensed Electrician | Safety First", hourly_rate: 8500, rating_avg: 4.9, rating_count: 89, avatar_url: null, distance_km: 3.1 },
  { provider_id: "3", user_id: "u3", full_name: "David Chen", headline: "Cleaning Expert | Eco-Friendly Products", hourly_rate: 5000, rating_avg: 4.7, rating_count: 256, avatar_url: null, distance_km: 1.8 },
  { provider_id: "4", user_id: "u4", full_name: "Emily Rodriguez", headline: "Interior & Exterior Painting Pro", hourly_rate: 6500, rating_avg: 4.6, rating_count: 67, avatar_url: null, distance_km: 4.2 },
  { provider_id: "5", user_id: "u5", full_name: "James Park", headline: "Master Carpenter & General Handyman", hourly_rate: 7000, rating_avg: 4.9, rating_count: 198, avatar_url: null, distance_km: 1.2 },
  { provider_id: "6", user_id: "u6", full_name: "Lisa Thompson", headline: "Deep Cleaning Specialist", hourly_rate: 4500, rating_avg: 4.5, rating_count: 312, avatar_url: null, distance_km: 5.0 },
];

const categories = [
  { id: "all", label: "All" },
  { id: "plumbing", label: "Plumbing" },
  { id: "electrical", label: "Electrical" },
  { id: "cleaning", label: "Cleaning" },
  { id: "painting", label: "Painting" },
  { id: "repairs", label: "Repairs" },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [view, setView] = useState<"grid" | "list">("grid");
  const { latitude, longitude } = useGeolocation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          Find Service Providers
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {mockResults.length} providers found near you
        </p>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search providers or services..."
        showLocationBadge
        location={latitude ? "Your location" : undefined}
      />

      {/* Filters Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                activeCategory === cat.id
                  ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary-glow)]"
                  : "glass-subtle text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("grid")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              view === "grid" ? "bg-[var(--color-glass-white)] text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"
            )}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              view === "list" ? "bg-[var(--color-glass-white)] text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results */}
      <div
        className={cn(
          view === "grid"
            ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-3"
        )}
      >
        {mockResults.map((provider, i) => (
          <motion.div
            key={provider.provider_id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <ProviderCard
              provider={provider}
              services={["Plumbing", "General Repairs"]}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="space-y-4">{Array.from({length:6}).map((_,i) => <div key={i} className="h-32 skeleton rounded-2xl" />)}</div>}>
      <SearchContent />
    </Suspense>
  );
}

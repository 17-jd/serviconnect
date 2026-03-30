"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/components/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";
import {
  Droplets,
  Zap,
  SprayCan,
  Paintbrush,
  Wrench,
  Truck,
  TreePine,
  Thermometer,
  Settings,
  Bug,
  Home,
  BookOpen,
  ArrowRight,
  MapPin,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { SearchBar } from "@/components/shared/search-bar";
import { ProviderCard } from "@/components/providers/provider-card";
import { useGeolocation } from "@/hooks/use-geolocation";
import { getGreeting } from "@/lib/utils";
import type { NearbyProvider } from "@/types/database";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  droplets: Droplets,
  zap: Zap,
  "spray-can": SprayCan,
  paintbrush: Paintbrush,
  wrench: Wrench,
  truck: Truck,
  trees: TreePine,
  thermometer: Thermometer,
  settings: Settings,
  bug: Bug,
  home: Home,
  "book-open": BookOpen,
};

const popularServices = [
  { name: "Plumbing", slug: "plumbing", icon: "droplets", color: "from-blue-500 to-cyan-500" },
  { name: "Electrical", slug: "electrical", icon: "zap", color: "from-amber-500 to-yellow-500" },
  { name: "Cleaning", slug: "cleaning", icon: "spray-can", color: "from-green-500 to-emerald-500" },
  { name: "Painting", slug: "painting", icon: "paintbrush", color: "from-purple-500 to-pink-500" },
  { name: "Repairs", slug: "repairs", icon: "wrench", color: "from-orange-500 to-red-500" },
  { name: "Moving", slug: "moving", icon: "truck", color: "from-indigo-500 to-blue-500" },
  { name: "Landscaping", slug: "landscaping", icon: "trees", color: "from-lime-500 to-green-500" },
  { name: "HVAC", slug: "hvac", icon: "thermometer", color: "from-red-500 to-orange-500" },
];

// Mock data for demo
const mockProviders: NearbyProvider[] = [
  {
    provider_id: "1",
    user_id: "u1",
    full_name: "Mike Johnson",
    headline: "Professional Plumber | 10yr Experience",
    hourly_rate: 7500,
    rating_avg: 4.8,
    rating_count: 124,
    avatar_url: null,
    distance_km: 2.3,
  },
  {
    provider_id: "2",
    user_id: "u2",
    full_name: "Sarah Williams",
    headline: "Licensed Electrician | Safety First",
    hourly_rate: 8500,
    rating_avg: 4.9,
    rating_count: 89,
    avatar_url: null,
    distance_km: 3.1,
  },
  {
    provider_id: "3",
    user_id: "u3",
    full_name: "David Chen",
    headline: "Cleaning Expert | Eco-Friendly Products",
    hourly_rate: 5000,
    rating_avg: 4.7,
    rating_count: 256,
    avatar_url: null,
    distance_km: 1.8,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

export default function CustomerDashboard() {
  const { profile } = useAuth();
  const { latitude, longitude, loading: locationLoading } = useGeolocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [providers, setProviders] = useState<NearbyProvider[]>(mockProviders);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string; icon: string }[]>([]);

  // Fetch real providers from API
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const params = new URLSearchParams();
        if (latitude) params.set("lat", latitude.toString());
        if (longitude) params.set("lng", longitude.toString());
        const res = await fetch(`/api/providers/search?${params}`);
        const data = await res.json();
        if (data.providers && data.providers.length > 0) {
          setProviders(data.providers);
        }
      } catch {
        // Fall back to mock data
      }
    };
    if (!locationLoading) fetchProviders();
  }, [latitude, longitude, locationLoading]);

  // Fetch real service categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("service_categories")
          .select("id, name, slug, icon")
          .eq("is_popular", true)
          .order("sort_order");
        if (data && data.length > 0) {
          setCategories(data);
        }
      } catch {
        // Fall back to hardcoded
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      window.location.href = `/search?q=${encodeURIComponent(query)}${latitude ? `&lat=${latitude}&lng=${longitude}` : ""}`;
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10"
    >
      {/* Greeting */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          {getGreeting()}{profile ? `, ${profile.full_name.split(" ")[0]}` : ""} 👋
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          What service do you need today?
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div variants={itemVariants}>
        <SearchBar
          placeholder="Search for plumbing, cleaning, electrical..."
          onSearch={handleSearch}
          showLocationBadge
          location={latitude ? "Your location" : "Location off"}
        />
      </motion.div>

      {/* Popular Services */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            Popular Services
          </h2>
          <Link
            href="/search"
            className="text-sm text-[var(--color-primary-light)] hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {popularServices.map((service) => {
            const Icon = iconMap[service.icon] || Wrench;
            return (
              <Link key={service.slug} href={`/search?category=${service.slug}`}>
                <GlassCard className="!p-4 text-center group">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">
                    {service.name}
                  </span>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Nearby Providers */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              Nearby Providers
            </h2>
            {locationLoading && (
              <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Locating...
              </div>
            )}
            {latitude && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <MapPin className="w-3.5 h-3.5" />
                Location active
              </div>
            )}
          </div>
          <Link
            href="/search"
            className="text-sm text-[var(--color-primary-light)] hover:underline flex items-center gap-1"
          >
            See All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.provider_id}
              provider={provider}
              services={["Plumbing", "Repairs"]}
            />
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link href="/bookings">
            <GlassCard className="flex items-center gap-4 !p-5">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[var(--color-primary-light)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                  My Bookings
                </h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                  View upcoming & past
                </p>
              </div>
            </GlassCard>
          </Link>
          <Link href="/payments">
            <GlassCard className="flex items-center gap-4 !p-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Payments
                </h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                  History & invoices
                </p>
              </div>
            </GlassCard>
          </Link>
          <Link href="/profile">
            <GlassCard className="flex items-center gap-4 !p-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Profile
                </h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Edit your info
                </p>
              </div>
            </GlassCard>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

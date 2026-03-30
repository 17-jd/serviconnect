"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, DollarSign, FileText, Save } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";

export default function ProviderProfilePage() {
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "Mike Johnson",
    email: "mike@example.com",
    phone: "+1 555-0123",
    headline: "Professional Plumber | 10yr Experience",
    bio: "With over 10 years of experience in residential and commercial plumbing, I provide reliable, efficient service at fair prices.",
    hourlyRate: "75",
    address: "Brooklyn, NY",
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Profile Settings
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Manage your provider profile
          </p>
        </div>
        <GlassButton
          variant="primary"
          onClick={handleSave}
          loading={saving}
          icon={<Save className="w-4 h-4" />}
        >
          Save Changes
        </GlassButton>
      </div>

      {/* Avatar */}
      <GlassCard hoverable={false} className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
          <span className="text-white text-3xl font-bold">M</span>
        </div>
        <div>
          <h3 className="font-semibold text-[var(--color-text-primary)]">{profile.fullName}</h3>
          <p className="text-sm text-[var(--color-text-muted)]">Service Provider</p>
          <GlassButton variant="secondary" size="sm" className="mt-2">
            Change Photo
          </GlassButton>
        </div>
      </GlassCard>

      {/* Personal Info */}
      <GlassCard hoverable={false}>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
          Personal Information
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <GlassInput
            label="Full Name"
            value={profile.fullName}
            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
            icon={<User className="w-4 h-4" />}
          />
          <GlassInput
            label="Email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            icon={<Mail className="w-4 h-4" />}
          />
          <GlassInput
            label="Phone"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            icon={<Phone className="w-4 h-4" />}
          />
          <GlassInput
            label="Location"
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            icon={<MapPin className="w-4 h-4" />}
          />
        </div>
      </GlassCard>

      {/* Professional Info */}
      <GlassCard hoverable={false}>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
          Professional Details
        </h2>
        <div className="space-y-4">
          <GlassInput
            label="Professional Headline"
            value={profile.headline}
            onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
            placeholder="e.g., Professional Plumber | 10yr Experience"
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
              Bio
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              className="glass-input resize-none"
              placeholder="Tell customers about your experience and expertise..."
            />
          </div>
          <GlassInput
            label="Hourly Rate ($)"
            type="number"
            value={profile.hourlyRate}
            onChange={(e) => setProfile({ ...profile, hourlyRate: e.target.value })}
            icon={<DollarSign className="w-4 h-4" />}
          />
        </div>
      </GlassCard>
    </motion.div>
  );
}

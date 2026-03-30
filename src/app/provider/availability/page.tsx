"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { cn } from "@/lib/utils";
import type { DayOfWeek } from "@/types/database";

interface DaySchedule {
  day: DayOfWeek;
  label: string;
  isActive: boolean;
  startTime: string;
  endTime: string;
}

const initialSchedule: DaySchedule[] = [
  { day: "mon", label: "Monday", isActive: true, startTime: "08:00", endTime: "18:00" },
  { day: "tue", label: "Tuesday", isActive: true, startTime: "08:00", endTime: "18:00" },
  { day: "wed", label: "Wednesday", isActive: true, startTime: "08:00", endTime: "18:00" },
  { day: "thu", label: "Thursday", isActive: true, startTime: "08:00", endTime: "18:00" },
  { day: "fri", label: "Friday", isActive: true, startTime: "08:00", endTime: "17:00" },
  { day: "sat", label: "Saturday", isActive: true, startTime: "09:00", endTime: "14:00" },
  { day: "sun", label: "Sunday", isActive: false, startTime: "09:00", endTime: "14:00" },
];

export default function AvailabilityPage() {
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule);
  const [saving, setSaving] = useState(false);

  const toggleDay = (index: number) => {
    const updated = [...schedule];
    updated[index].isActive = !updated[index].isActive;
    setSchedule(updated);
  };

  const updateTime = (index: number, field: "startTime" | "endTime", value: string) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

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
            Availability
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Set your weekly working hours
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

      <GlassCard variant="strong" hoverable={false}>
        <div className="space-y-4">
          {schedule.map((day, index) => (
            <div
              key={day.day}
              className={cn(
                "flex items-center gap-4 py-4 border-b border-[var(--color-glass-border)] last:border-0",
                !day.isActive && "opacity-50"
              )}
            >
              {/* Toggle */}
              <button
                onClick={() => toggleDay(index)}
                className={cn(
                  "w-12 h-7 rounded-full relative transition-all",
                  day.isActive ? "bg-[var(--color-primary)]" : "bg-[var(--color-glass-white)]"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full bg-white absolute top-1 transition-all",
                    day.isActive ? "left-6" : "left-1"
                  )}
                />
              </button>

              {/* Day Label */}
              <span className="w-28 text-sm font-medium text-[var(--color-text-primary)]">
                {day.label}
              </span>

              {/* Time Inputs */}
              {day.isActive ? (
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <input
                      type="time"
                      value={day.startTime}
                      onChange={(e) => updateTime(index, "startTime", e.target.value)}
                      className="glass-input !py-2 !px-3 !rounded-lg text-sm w-32"
                    />
                  </div>
                  <span className="text-sm text-[var(--color-text-muted)]">to</span>
                  <input
                    type="time"
                    value={day.endTime}
                    onChange={(e) => updateTime(index, "endTime", e.target.value)}
                    className="glass-input !py-2 !px-3 !rounded-lg text-sm w-32"
                  />
                </div>
              ) : (
                <span className="text-sm text-[var(--color-text-muted)]">Day off</span>
              )}
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

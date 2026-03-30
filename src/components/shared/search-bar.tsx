"use client";

import { useState, useCallback } from "react";
import { Search, MapPin, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  showLocationBadge?: boolean;
  location?: string;
}

export function SearchBar({
  placeholder = "Search for services...",
  onSearch,
  className,
  showLocationBadge = false,
  location,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch?.(query);
    },
    [query, onSearch]
  );

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div
        className={cn(
          "flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300",
          "bg-[var(--color-glass-white)] backdrop-blur-xl border border-[var(--color-glass-border)]",
          focused &&
            "border-[var(--color-primary)] shadow-[0_0_0_3px_var(--color-primary-glow),0_8px_32px_var(--color-glass-shadow)]"
        )}
      >
        <Search className="w-5 h-5 text-[var(--color-text-muted)] shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              onSearch?.("");
            }}
            className="p-1 rounded-lg hover:bg-[var(--color-glass-white)] transition-colors"
          >
            <X className="w-4 h-4 text-[var(--color-text-muted)]" />
          </button>
        )}
        {showLocationBadge && location && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20">
            <MapPin className="w-3.5 h-3.5 text-[var(--color-primary-light)]" />
            <span className="text-xs font-medium text-[var(--color-primary-light)]">
              {location}
            </span>
          </div>
        )}
      </div>
    </form>
  );
}

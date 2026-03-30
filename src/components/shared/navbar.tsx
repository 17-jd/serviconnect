"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  user?: {
    full_name: string;
    avatar_url: string | null;
    role: "customer" | "provider";
  } | null;
  onLogout?: () => void;
  notificationCount?: number;
}

export function Navbar({ user, onLogout, notificationCount = 0 }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const dashboardPath = user?.role === "provider" ? "/provider/dashboard" : "/customer/dashboard";

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="glass-strong rounded-2xl px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href={user ? dashboardPath : "/"} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-accent-light)] bg-clip-text text-transparent">
              ServiConnect
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {/* Notifications */}
                <button className="relative p-2.5 rounded-xl hover:bg-[var(--color-glass-white)] transition-colors">
                  <Bell className="w-5 h-5 text-[var(--color-text-secondary)]" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--color-glass-white)] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.full_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                      {user.full_name}
                    </span>
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-56 glass-strong p-2 rounded-2xl"
                      >
                        <Link
                          href={dashboardPath}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-[var(--color-glass-white)] transition-colors text-[var(--color-text-secondary)] text-sm"
                          onClick={() => setProfileOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href={`/${user.role}/profile`}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-[var(--color-glass-white)] transition-colors text-[var(--color-text-secondary)] text-sm"
                          onClick={() => setProfileOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link
                          href={`/${user.role}/settings`}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-[var(--color-glass-white)] transition-colors text-[var(--color-text-secondary)] text-sm"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <div className="my-1 border-t border-[var(--color-glass-border)]" />
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            onLogout?.();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors text-red-400 text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="glass-btn glass-btn-secondary px-5 py-2.5 text-sm rounded-xl font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="glass-btn glass-btn-primary px-5 py-2.5 text-sm rounded-xl font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-[var(--color-glass-white)] transition-colors"
          >
            {menuOpen ? (
              <X className="w-5 h-5 text-[var(--color-text-primary)]" />
            ) : (
              <Menu className="w-5 h-5 text-[var(--color-text-primary)]" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-2 glass-strong rounded-2xl overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {user ? (
                  <>
                    <Link
                      href={dashboardPath}
                      className="block px-4 py-3 rounded-xl hover:bg-[var(--color-glass-white)] transition-colors text-[var(--color-text-secondary)] text-sm"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href={`/${user.role}/profile`}
                      className="block px-4 py-3 rounded-xl hover:bg-[var(--color-glass-white)] transition-colors text-[var(--color-text-secondary)] text-sm"
                      onClick={() => setMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onLogout?.();
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors text-red-400 text-sm"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-3 rounded-xl hover:bg-[var(--color-glass-white)] transition-colors text-[var(--color-text-secondary)] text-sm"
                      onClick={() => setMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-3 rounded-xl bg-[var(--color-primary)] text-white text-sm text-center font-medium"
                      onClick={() => setMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

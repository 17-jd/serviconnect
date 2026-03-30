"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Wrench,
  Paintbrush,
  Zap,
  Droplets,
  SprayCan,
  Truck,
  Shield,
  Clock,
  Star,
  ArrowRight,
  MapPin,
  FileCheck,
  Smartphone,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { GlassCard } from "@/components/ui/glass-card";

const popularServices = [
  { name: "Plumbing", icon: Droplets, color: "from-blue-500 to-cyan-500", slug: "plumbing" },
  { name: "Electrical", icon: Zap, color: "from-amber-500 to-yellow-500", slug: "electrical" },
  { name: "Cleaning", icon: SprayCan, color: "from-green-500 to-emerald-500", slug: "cleaning" },
  { name: "Painting", icon: Paintbrush, color: "from-purple-500 to-pink-500", slug: "painting" },
  { name: "Repairs", icon: Wrench, color: "from-orange-500 to-red-500", slug: "repairs" },
  { name: "Moving", icon: Truck, color: "from-indigo-500 to-blue-500", slug: "moving" },
];

const features = [
  {
    icon: MapPin,
    title: "Find Nearby Providers",
    description: "Discover verified service providers in your area with real-time availability.",
  },
  {
    icon: FileCheck,
    title: "Secure Contracts",
    description: "Digital contracts signed by both parties before any work begins.",
  },
  {
    icon: Smartphone,
    title: "OTP Verification",
    description: "Secure start and completion verification with one-time passwords.",
  },
  {
    icon: CreditCard,
    title: "Flexible Payments",
    description: "Pay securely with card via Stripe or choose cash on completion.",
  },
];

const stats = [
  { value: "10K+", label: "Service Providers" },
  { value: "50K+", label: "Completed Jobs" },
  { value: "4.9", label: "Average Rating" },
  { value: "15min", label: "Avg Response Time" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Decorative Orbs */}
        <div className="orb orb-primary w-[500px] h-[500px] -top-20 -left-20 opacity-30" />
        <div className="orb orb-accent w-[400px] h-[400px] top-40 right-[-10%] opacity-20" />
        <div className="orb w-[300px] h-[300px] bottom-0 left-1/3 opacity-15 bg-purple-500/30 blur-[100px]" />

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-[var(--color-text-secondary)]">
                Trusted by 10,000+ customers
              </span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6">
              <span className="text-[var(--color-text-primary)]">
                Find Expert{" "}
              </span>
              <span className="bg-gradient-to-r from-[var(--color-primary-light)] via-[var(--color-accent-light)] to-[var(--color-primary-light)] bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
                Service Providers
              </span>
              <br />
              <span className="text-[var(--color-text-primary)]">
                Near You
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
              Book verified professionals for any home service. Secure contracts,
              real-time tracking, and guaranteed satisfaction — all in one platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup?role=customer">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-btn glass-btn-primary px-8 py-4 text-base rounded-2xl font-semibold w-full sm:w-auto"
                >
                  Find a Service Provider
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
              </Link>
              <Link href="/signup?role=provider">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-btn glass-btn-secondary px-8 py-4 text-base rounded-2xl font-semibold w-full sm:w-auto"
                >
                  Join as Provider
                  <ChevronRight className="w-5 h-5 ml-1" />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-20 glass-strong rounded-3xl p-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-extrabold bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-accent-light)] bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[var(--color-text-muted)] mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                Popular Services
              </h2>
              <p className="text-[var(--color-text-secondary)] max-w-lg mx-auto">
                Browse our most requested service categories and find the right
                professional for your needs.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularServices.map((service) => (
                <motion.div key={service.slug} variants={itemVariants}>
                  <Link href={`/search?category=${service.slug}`}>
                    <GlassCard className="text-center group p-6">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <service.icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {service.name}
                      </span>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                How It Works
              </h2>
              <p className="text-[var(--color-text-secondary)] max-w-lg mx-auto">
                Get your service done in four simple steps
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Search",
                  desc: "Find service providers near your location",
                  icon: MapPin,
                },
                {
                  step: "02",
                  title: "Book",
                  desc: "Choose date, time, and duration that works for you",
                  icon: Clock,
                },
                {
                  step: "03",
                  title: "Verify",
                  desc: "Sign contract and verify with OTP on arrival",
                  icon: Shield,
                },
                {
                  step: "04",
                  title: "Pay",
                  desc: "Pay securely via card or cash after completion",
                  icon: CreditCard,
                },
              ].map((item) => (
                <motion.div key={item.step} variants={itemVariants}>
                  <GlassCard hoverable={false} className="relative p-8 text-center h-full">
                    <div className="text-6xl font-black text-[var(--color-primary)]/10 absolute top-4 right-6">
                      {item.step}
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center mx-auto mb-5">
                      <item.icon className="w-6 h-6 text-[var(--color-primary-light)]" />
                    </div>
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {item.desc}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                Why ServiConnect?
              </h2>
              <p className="text-[var(--color-text-secondary)] max-w-lg mx-auto">
                Built with trust and security at its core
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature) => (
                <motion.div key={feature.title} variants={itemVariants}>
                  <GlassCard hoverable={false} className="flex gap-5 p-8 h-full">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-strong p-12 sm:p-16 text-center rounded-3xl relative overflow-hidden"
          >
            <div className="orb orb-primary w-[300px] h-[300px] -top-20 -right-20 opacity-40" />
            <div className="orb orb-accent w-[200px] h-[200px] -bottom-10 -left-10 opacity-30" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-8 max-w-lg mx-auto">
                Join thousands of customers and providers already using
                ServiConnect for seamless service experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup?role=customer">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-btn glass-btn-primary px-8 py-4 text-base rounded-2xl font-semibold w-full sm:w-auto"
                  >
                    Book a Service
                  </motion.button>
                </Link>
                <Link href="/signup?role=provider">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-btn glass-btn-accent px-8 py-4 text-base rounded-2xl font-semibold w-full sm:w-auto"
                  >
                    Become a Provider
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-[var(--color-glass-border)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-lg font-bold text-[var(--color-text-primary)]">
                  ServiConnect
                </span>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Connecting customers with trusted local service providers.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
                For Customers
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/search" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">
                    Find Services
                  </Link>
                </li>
                <li>
                  <Link href="/signup?role=customer" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
                For Providers
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/signup?role=provider" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">
                    Join as Provider
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">
                    Provider Resources
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">
                    Earnings Calculator
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
                Company
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[var(--color-glass-border)] text-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              &copy; {new Date().getFullYear()} ServiConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

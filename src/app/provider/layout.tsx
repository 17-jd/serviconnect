"use client";

import { Navbar } from "@/components/shared/navbar";

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mockUser = {
    full_name: "Provider User",
    avatar_url: null,
    role: "provider" as const,
  };

  return (
    <div className="min-h-screen">
      <Navbar user={mockUser} />
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

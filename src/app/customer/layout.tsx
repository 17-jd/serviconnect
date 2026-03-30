"use client";

import { Navbar } from "@/components/shared/navbar";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In production, this would come from the auth context
  const mockUser = {
    full_name: "Guest User",
    avatar_url: null,
    role: "customer" as const,
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

"use client";

import { Navbar } from "@/components/shared/navbar";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const navUser = profile
    ? { full_name: profile.full_name, avatar_url: profile.avatar_url, role: profile.role }
    : null;

  return (
    <div className="min-h-screen">
      <Navbar user={navUser} onLogout={handleLogout} />
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { LogoutIcon } from "@/components/ui/icons/LogoutIcon";
import { authService } from "@/utils/api";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
      aria-label="Logout"
      title="Logout"
    >
      <LogoutIcon size={16} />
    </button>
  );
}

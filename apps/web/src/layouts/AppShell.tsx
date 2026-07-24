import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAuthStore } from "@/stores/authStore";
import { apiClient } from "@/lib/apiClient";
import { CommandPalette } from "@/components/CommandPalette/CommandPalette";

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const clear = useAuthStore((s) => s.clear);

  const handleSignOut = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // ignore — client-side sign out proceeds regardless
    }
    clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar onSignOut={handleSignOut} />
      <div className="md:pl-64">
        <Header onSignOut={handleSignOut} />
        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}

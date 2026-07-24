import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { SuperAdminRoute } from "@/routes/SuperAdminRoute";
import { AppShell } from "@/layouts/AppShell";
import { LoginPage } from "@/features/auth/LoginPage";
import { NotFoundPage } from "@/routes/NotFoundPage";
import { useIsDesktop } from "@/hooks/useIsDesktop";

const HomePage = lazy(() => import("@/features/home/HomePage").then((m) => ({ default: m.HomePage })));
const DashboardPage = lazy(() => import("@/features/dashboard/DashboardPage").then((m) => ({ default: m.DashboardPage })));
const ClientsPage = lazy(() => import("@/features/clients/ClientsPage").then((m) => ({ default: m.ClientsPage })));
const ProjectsListPage = lazy(() => import("@/features/projects/ProjectsListPage").then((m) => ({ default: m.ProjectsListPage })));
const CreateProjectPage = lazy(() => import("@/features/projects/CreateProjectPage").then((m) => ({ default: m.CreateProjectPage })));
const CreateProjectModal = lazy(() => import("@/features/projects/CreateProjectModal").then((m) => ({ default: m.CreateProjectModal })));
const MyProjectsPage = lazy(() => import("@/features/my-projects/MyProjectsPage").then((m) => ({ default: m.MyProjectsPage })));
const CredentialsPage = lazy(() => import("@/features/credentials/CredentialsPage").then((m) => ({ default: m.CredentialsPage })));
const ProfilePage = lazy(() => import("@/features/profile/ProfilePage").then((m) => ({ default: m.ProfilePage })));
const UserControlPage = lazy(() => import("@/features/admin/UserControlPage").then((m) => ({ default: m.UserControlPage })));
const BillingPage = lazy(() => import("@/features/billing/BillingPage").then((m) => ({ default: m.BillingPage })));
const CheckoutPage = lazy(() => import("@/features/billing/CheckoutPage").then((m) => ({ default: m.CheckoutPage })));
const ThankYouPage = lazy(() => import("@/features/billing/ThankYouPage").then((m) => ({ default: m.ThankYouPage })));

interface LocationState {
  backgroundLocation?: Location;
}

function RouteFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin text-text-tertiary" />
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isDesktop = useIsDesktop();
  const state = location.state as LocationState | null;
  const backgroundLocation = isDesktop ? state?.backgroundLocation : undefined;

  return (
    <>
      <Suspense fallback={<RouteFallback />}>
        <Routes location={backgroundLocation ?? location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/projects" element={<ProjectsListPage />} />
              <Route path="/projects/new" element={<CreateProjectPage />} />
              <Route path="/my-projects" element={<MyProjectsPage />} />
              <Route path="/credentials" element={<CredentialsPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              <Route element={<SuperAdminRoute />}>
                <Route path="/admin/users" element={<UserControlPage />} />
                <Route path="/billing" element={<BillingPage />} />
                <Route path="/billing/checkout" element={<CheckoutPage />} />
                <Route path="/billing/thank-you" element={<ThankYouPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      {backgroundLocation && (
        <Suspense fallback={null}>
          <Routes>
            <Route path="/projects/new" element={<CreateProjectModal />} />
          </Routes>
        </Suspense>
      )}
    </>
  );
}

import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import AdminLayout from "./components/AdminLayout";
import AppLayout from "./components/AppLayout";
import CommunityPage from "./pages/CommunityPage";
import DashboardPage from "./pages/DashboardPage";
import InsightsPage from "./pages/InsightsPage";
import LandingPage from "./pages/LandingPage";
import LogFoodPage from "./pages/LogFoodPage";
import LogMoodPage from "./pages/LogMoodPage";
import OnboardingPage from "./pages/OnboardingPage";
import ProfilePage from "./pages/ProfilePage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ResourcesPage from "./pages/ResourcesPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminAuditLogsPage from "./pages/admin/AdminAuditLogsPage";
import AdminContentPage from "./pages/admin/AdminContentPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AdminUserDetailPage from "./pages/admin/AdminUserDetailPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LandingPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: AdminLoginPage,
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding",
  component: OnboardingPage,
});

const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  component: AppLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const logFoodRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/log-food",
  component: LogFoodPage,
});

const logMoodRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/log-mood",
  component: LogMoodPage,
});

const insightsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/insights",
  component: InsightsPage,
});

const recommendationsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/recommendations",
  component: RecommendationsPage,
});

const communityRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/community",
  component: CommunityPage,
});

const resourcesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/resources",
  component: ResourcesPage,
});

const profileRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/profile",
  component: ProfilePage,
});

const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin",
  component: AdminLayout,
});

const adminOverviewRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin",
  component: AdminOverviewPage,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/users",
  component: AdminUsersPage,
});

const adminUserDetailRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/user/$userId",
  component: AdminUserDetailPage,
});

const adminAnalyticsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/analytics",
  component: AdminAnalyticsPage,
});

const adminAuditLogsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/audit",
  component: AdminAuditLogsPage,
});

const adminContentRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/content",
  component: AdminContentPage,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  adminLoginRoute,
  onboardingRoute,
  appLayoutRoute.addChildren([
    dashboardRoute,
    logFoodRoute,
    logMoodRoute,
    insightsRoute,
    recommendationsRoute,
    communityRoute,
    resourcesRoute,
    profileRoute,
  ]),
  adminLayoutRoute.addChildren([
    adminOverviewRoute,
    adminUsersRoute,
    adminUserDetailRoute,
    adminAnalyticsRoute,
    adminAuditLogsRoute,
    adminContentRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

import { Button } from "@/components/ui/button";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Brain,
  LayoutDashboard,
  LineChart,
  LogOut,
  Smile,
  Star,
  User,
  Users,
  Utensils,
} from "lucide-react";
import { useEffect } from "react";
import { UserRole } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCurrentUserProfile, useUserRole } from "../hooks/useQueries";
import { useUserAuth } from "../hooks/useUserAuth";

export default function AppLayout() {
  const { identity, isInitializing, clear } = useInternetIdentity();
  const { isLoggedIn: isCredLoggedIn, logout: credLogout } = useUserAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useCurrentUserProfile();
  const { data: role } = useUserRole();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isAuthenticated = !!identity || isCredLoggedIn;

  useEffect(() => {
    if (isInitializing) return;
    if (!isAuthenticated) {
      navigate({ to: "/" });
      return;
    }
    // Only check onboarding for Internet Identity users
    if (identity && !profileLoading && profile === null) {
      navigate({ to: "/onboarding" });
    }
  }, [
    identity,
    isInitializing,
    isAuthenticated,
    profile,
    profileLoading,
    navigate,
  ]);

  function handleLogout() {
    if (identity) clear();
    if (isCredLoggedIn) credLogout();
    navigate({ to: "/" });
  }

  const navItems = [
    { to: "/dashboard", label: "Home", icon: LayoutDashboard },
    { to: "/log-food", label: "Food", icon: Utensils },
    { to: "/log-mood", label: "Mood", icon: Smile },
    { to: "/insights", label: "Insights", icon: LineChart },
    { to: "/recommendations", label: "Plans", icon: Star },
    { to: "/resources", label: "Learn", icon: BookOpen },
    { to: "/community", label: "Community", icon: Users },
    { to: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-xs">
        <div className="flex items-center justify-between px-4 h-14 max-w-2xl mx-auto w-full">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img
              src="/assets/generated/psychediet-logo-transparent.dim_400x200.png"
              alt="PsycheDiet"
              className="h-7 object-contain"
            />
          </Link>
          <div className="flex items-center gap-2">
            {role === UserRole.admin && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="text-xs">
                  <Brain className="h-3 w-3 mr-1" />
                  Admin
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              data-ocid="header.button"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 pb-20 max-w-2xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border">
        <div className="flex items-center justify-around max-w-2xl mx-auto h-16 px-2">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = currentPath === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="nav.link"
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

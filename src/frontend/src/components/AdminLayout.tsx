import { Button } from "@/components/ui/button";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import { useAdminAuth } from "../hooks/useAdminAuth";

export default function AdminLayout() {
  const { isLocalAdmin, clearLocalAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    if (!isLocalAdmin) {
      navigate({ to: "/admin/login" });
    }
  }, [isLocalAdmin, navigate]);

  const navItems = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/admin/audit", label: "Audit Logs", icon: ClipboardList },
    { to: "/admin/content", label: "Content", icon: BookOpen },
  ];

  function handleLogout() {
    clearLocalAdmin();
    navigate({ to: "/admin/login" });
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-56 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/psychediet-logo-transparent.dim_200x200.png"
              alt="PsycheDiet"
              className="h-8 w-8 object-contain"
            />
            <div>
              <p className="font-semibold text-sm">PsycheDiet</p>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = currentPath === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                data-ocid="admin-nav.link"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground"
            onClick={handleLogout}
            data-ocid="admin-nav.button"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

"use client";

// Standardized Dashboard Page Component - Used across all apps
// Uses Tailwind design tokens for consistent dark/light mode support

import { Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import * as React from "react";
import { cn } from "../../lib";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[]; // Support for nested navigation
}

interface DashboardPageProps {
  appName?: string;
  themeColor?: string;
  themeColorSecondary?: string;
  logoIcon?: React.ReactNode;
  children?: React.ReactNode;
  navItems?: NavItem[];
  activeNavItem?: string;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export function DashboardPage({
  appName = "App",
  themeColor,
  themeColorSecondary,
  logoIcon,
  children,
  navItems = DEFAULT_NAV_ITEMS,
  activeNavItem = "/dashboard",
}: DashboardPageProps) {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(
    new Set(),
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (user) return;

    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setUser(JSON.parse(userStr));
      } else {
        const hasRedirected = sessionStorage.getItem(
          "dashboard-redirect-attempt",
        );
        if (!hasRedirected) {
          sessionStorage.setItem("dashboard-redirect-attempt", "true");
          navigate({ to: "/login" });
        }
      }
    } catch (e) {
      console.error("Error reading user from localStorage:", e);
      const hasRedirected = sessionStorage.getItem(
        "dashboard-redirect-attempt",
      );
      if (!hasRedirected) {
        sessionStorage.setItem("dashboard-redirect-attempt", "true");
        navigate({ to: "/login" });
      }
    }
  }, []);

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(href)) {
        next.delete(href);
      } else {
        next.add(href);
      }
      return next;
    });
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("isDemo");
    }
    navigate({ to: "/" });
  };

  const renderNavItem = (item: NavItem, depth: number = 0): React.ReactNode => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = activeNavItem === item.href;
    const isExpanded = expandedItems.has(item.href);

    return (
      <div key={item.href}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.href)}
            className={cn(
              "flex w-full items-center justify-between space-x-3 rounded-xl px-4 py-3 font-medium transition-colors",
              "text-foreground/70 hover:bg-accent hover:text-foreground",
              isActive && "bg-primary text-primary-foreground",
            )}
            style={{ paddingLeft: `${1 + depth}rem` }}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <span
              className={cn("transition-transform", isExpanded && "rotate-90")}
            >
              ›
            </span>
          </button>
        ) : (
          <Link
            to={item.href}
            className={cn(
              "flex items-center space-x-3 rounded-xl px-4 py-3 font-medium no-underline transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-foreground/70 hover:bg-accent hover:text-foreground",
            )}
            style={{ paddingLeft: `${1 + depth}rem` }}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        )}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  const isDemo =
    typeof window !== "undefined" && localStorage.getItem("isDemo") === "true";

  return (
    <div className="flex min-h-screen bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-border border-r bg-card lg:static",
          "transform transition-transform duration-200 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-border border-b p-4">
            <Link to="/" className="flex items-center space-x-2 no-underline">
              {logoIcon || (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <span className="font-bold text-lg">{appName.charAt(0)}</span>
                </div>
              )}
              <span className="font-bold text-foreground text-lg">
                {appName}
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-muted-foreground hover:text-foreground lg:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {isDemo && (
            <div className="mx-4 mt-4 rounded-lg border border-primary/20 bg-primary/10 p-3 text-primary text-sm">
              Demo Mode Active
            </div>
          )}

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navItems.map((item) => renderNavItem(item, 0))}
          </nav>

          <div className="border-border border-t p-4">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground">
                {user.firstName?.charAt(0) || user.email?.charAt(0) || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">
                  {user.firstName || user.email?.split("@")[0]}
                </p>
                <p className="truncate text-muted-foreground text-sm">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center space-x-2 rounded-xl px-4 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-border border-b bg-card">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-muted-foreground hover:text-foreground lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="font-semibold text-foreground text-xl">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative text-muted-foreground hover:text-foreground">
                <Bell className="h-6 w-6" />
                <span className="-top-1 -right-1 absolute h-2 w-2 rounded-full bg-primary" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {children || (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Total Users", value: "1,234", change: "+12%" },
                { label: "Revenue", value: "$45,678", change: "+8%" },
                { label: "Active Sessions", value: "567", change: "+24%" },
                { label: "Conversion Rate", value: "3.2%", change: "+2%" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm"
                >
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="mt-1 font-bold text-2xl text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-primary text-sm">
                    {stat.change} from last month
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export { DEFAULT_NAV_ITEMS as DASHBOARD_DEFAULT_NAV_ITEMS };

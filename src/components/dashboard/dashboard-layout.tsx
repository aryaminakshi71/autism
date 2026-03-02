import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Calendar,
  ClipboardCheck,
  Clock,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Target,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { authClient } from "~/lib/auth/client";
import { isDemoModeEnabled, readDemoUserProfile } from "~/lib/demo-mode";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard/",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Patients",
    href: "/dashboard/patients",
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: "Goals",
    href: "/dashboard/goals",
    icon: <Target className="h-5 w-5" />,
  },
  {
    label: "Sessions",
    href: "/dashboard/sessions",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    label: "Visual Schedules",
    href: "/dashboard/schedules",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    label: "Communication",
    href: "/dashboard/communication",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    label: "Assessments",
    href: "/dashboard/assessments",
    icon: <ClipboardCheck className="h-5 w-5" />,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export function DashboardLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: session, isPending } = authClient.useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // "Demo mode" is used for local testing / previews when auth isn't configured.
  // It is enabled by the `/demo` route, which sets localStorage flags.
  const isDemoMode = isDemoModeEnabled();
  const demoUser = isDemoMode ? readDemoUserProfile() : {};

  const user =
    isDemoMode && (demoUser.email || demoUser.name) ? demoUser : session?.user;
  const pending = isDemoMode ? false : isPending;

  useEffect(() => {
    if (!pending && !user) {
      navigate({ to: "/login", replace: true });
    }
  }, [navigate, pending, user]);

  const handleLogout = async () => {
    if (isDemoMode && typeof window !== "undefined") {
      window.localStorage.removeItem("demo_mode");
      window.localStorage.removeItem("isDemo");
      window.localStorage.removeItem("user");
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("companyId");
    } else {
      await authClient.signOut();
    }
    navigate({ to: "/", replace: true });
  };

  if (pending || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-900 transition-transform duration-200 ease-in-out lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-gray-800 border-b p-4">
            <Link to="/" className="flex items-center space-x-2 no-underline">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-lg text-white">AutismCare</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white lg:hidden"
              aria-label="Close navigation menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-3 rounded-xl px-4 py-3 font-medium no-underline transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-gray-800 border-t p-4">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-medium text-white">
                {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white">
                  {user.name || user.email?.split("@")[0] || "User"}
                </p>
                <p className="truncate text-gray-400 text-sm">
                  {user.email ?? ""}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center space-x-2 rounded-xl px-4 py-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-gray-200 border-b bg-white">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-600 hover:text-gray-900 lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="font-semibold text-gray-900 text-xl">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative text-gray-600 hover:text-gray-900">
                <Bell className="h-6 w-6" />
                <span className="-top-1 -right-1 absolute h-2 w-2 rounded-full bg-indigo-600" />
              </button>
            </div>
          </div>
          {isDemoMode ? (
            <div className="bg-amber-50 px-4 py-2 text-amber-800 text-sm">
              Demo mode is read-only. Sign in with a real account to create and
              save data.
            </div>
          ) : null}
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

export const dashboardStats = [
  {
    label: "Active Patients",
    value: "24",
    change: "+3 this month",
    icon: <Users className="h-6 w-6" />,
  },
  {
    label: "Goals in Progress",
    value: "156",
    change: "78% on track",
    icon: <Target className="h-6 w-6" />,
  },
  {
    label: "Sessions This Week",
    value: "48",
    change: "12 remaining",
    icon: <Calendar className="h-6 w-6" />,
  },
  {
    label: "Assessments Due",
    value: "8",
    change: "3 pending",
    icon: <ClipboardCheck className="h-6 w-6" />,
  },
];

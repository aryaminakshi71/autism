import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Calendar,
  Car,
  ClipboardCheck,
  Clock,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  ParkingCircle,
  Settings,
  Target,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { authClient } from "~/lib/auth/client";

type DemoUser = {
  name?: string;
  email?: string;
};

function readDemoUserFromStorage(): DemoUser {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem("user");
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      name: typeof parsed.name === "string" ? parsed.name : undefined,
      email: typeof parsed.email === "string" ? parsed.email : undefined,
    };
  } catch {
    return {};
  }
}

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Patients",
    href: "/dashboard/patients",
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: "Goals",
    href: "/dashboard/goals",
    icon: <Target className="w-5 h-5" />,
  },
  {
    label: "Sessions",
    href: "/dashboard/sessions",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    label: "Visual Schedules",
    href: "/dashboard/schedules",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    label: "Communication",
    href: "/dashboard/communication",
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    label: "Assessments",
    href: "/dashboard/assessments",
    icon: <ClipboardCheck className="w-5 h-5" />,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="w-5 h-5" />,
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
  const isDemoMode =
    typeof window !== "undefined" &&
    (window.localStorage.getItem("demo_mode") === "true" ||
      window.localStorage.getItem("isDemo") === "true");
  const demoUser = isDemoMode ? readDemoUserFromStorage() : {};

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen ? (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <Link to="/" className="flex items-center space-x-2 no-underline">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold text-white">ParkingPro</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors no-underline ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium bg-indigo-600">
                {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {user.name || user.email?.split("@")[0] || "User"}
                </p>
                <p className="text-gray-400 text-sm truncate">
                  {user.email ?? ""}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full" />
              </button>
            </div>
          </div>
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
    icon: <Users className="w-6 h-6" />,
  },
  {
    label: "Goals in Progress",
    value: "156",
    change: "78% on track",
    icon: <Target className="w-6 h-6" />,
  },
  {
    label: "Sessions This Week",
    value: "48",
    change: "12 remaining",
    icon: <Calendar className="w-6 h-6" />,
  },
  {
    label: "Assessments Due",
    value: "8",
    change: "3 pending",
    icon: <ClipboardCheck className="w-6 h-6" />,
  },
];

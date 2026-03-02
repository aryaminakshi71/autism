import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  FolderOpen,
  Inbox,
  LayoutDashboard,
  Megaphone,
  ScrollText,
  Settings,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const navItems = [
    { to: "/app", label: "Dashboard", icon: LayoutDashboard },
    { to: "/app/contacts", label: "Learners", icon: Users },
    { to: "/app/deals", label: "Care Plans", icon: ClipboardList },
    { to: "/app/leads", label: "Referrals", icon: Inbox },
    { to: "/app/activities", label: "Sessions", icon: CalendarCheck },
    { to: "/app/assets", label: "Assets", icon: FolderOpen },
    { to: "/app/knowledge", label: "Knowledge", icon: BookOpen },
    { to: "/app/marketing", label: "Family Outreach", icon: Megaphone },
    { to: "/app/blog", label: "Internal Blog", icon: ScrollText },
    { to: "/app/billing", label: "Billing", icon: CreditCard },
    { to: "/app/settings", label: "Settings", icon: Settings },
  ] as const;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-72 border-gray-200 border-r bg-white p-4">
        <div className="mb-6 font-semibold text-blue-600 text-lg">
          Autism Platform
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{
                  className:
                    "flex items-center gap-3 rounded-md bg-blue-50 px-3 py-2 font-medium text-blue-700 text-sm",
                }}
                activeOptions={{ exact: item.to === "/app" }}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 text-sm hover:bg-blue-50 hover:text-blue-700"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

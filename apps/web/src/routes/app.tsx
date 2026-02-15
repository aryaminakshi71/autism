import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Inbox,
  CalendarCheck,
  Megaphone,
  Settings,
} from "lucide-react";

export const Route = createFileRoute('/app')({
  component: AppLayout,
})

function AppLayout() {
  const navItems = [
    { to: "/app", label: "Dashboard", icon: LayoutDashboard },
    { to: "/app/contacts", label: "Learners", icon: Users },
    { to: "/app/deals", label: "Care Plans", icon: ClipboardList },
    { to: "/app/leads", label: "Referrals", icon: Inbox },
    { to: "/app/activities", label: "Sessions", icon: CalendarCheck },
    { to: "/app/marketing", label: "Family Outreach", icon: Megaphone },
    { to: "/app/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="text-lg font-semibold text-blue-600 mb-6">Autism Platform</div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              >
                <Icon className="w-4 h-4" />
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

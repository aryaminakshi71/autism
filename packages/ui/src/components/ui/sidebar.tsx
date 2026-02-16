"use client";

import {
  BarChart3,
  FileText,
  Home,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import * as React from "react";

interface SidebarItem {
  name: string;
  href: string;
  icon?: string | React.ReactNode;
  active?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  appName: string;
  themeColor?: string;
  logoIcon?: React.ReactNode;
  className?: string;
}

export function Sidebar({
  items,
  appName,
  themeColor = "#3b82f6",
  logoIcon,
  className,
}: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } catch (e) {
      console.error("Error reading user from localStorage:", e);
    }
  }, []);

  // Close sidebar when clicking outside on mobile
  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const getIcon = (icon?: string | React.ReactNode) => {
    if (typeof icon === "string") {
      const IconMap: Record<string, React.ReactNode> = {
        H: <Home className="h-5 w-5" />,
        T: <FileText className="h-5 w-5" />,
        $: <BarChart3 className="h-5 w-5" />,
        W: <Users className="h-5 w-5" />,
        S: <Settings className="h-5 w-5" />,
      };
      return IconMap[icon] || <FileText className="h-5 w-5" />;
    }
    return icon || <FileText className="h-5 w-5" />;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-20 left-4 z-50 rounded-lg border border-gray-200 bg-white p-2 shadow-lg transition-colors hover:bg-gray-100 lg:hidden dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? (
          <X className="h-6 w-6 text-gray-900 dark:text-white" />
        ) : (
          <Menu className="h-6 w-6 text-gray-900 dark:text-white" />
        )}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden dark:bg-black/70"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-56 transform border-gray-200 border-r bg-white transition-transform duration-300 ease-in-out lg:static dark:border-slate-800 dark:bg-slate-900 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${className || ""}
        `}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center space-x-2 border-gray-200 border-b p-4 dark:border-slate-800">
            {logoIcon || (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-lg text-white"
                style={{
                  background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
                }}
              >
                {appName.charAt(0)}
              </div>
            )}
            <span className="font-bold text-gray-900 text-lg dark:text-white">
              {appName}
            </span>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`flex items-center space-x-3 rounded-xl px-4 py-3 font-medium no-underline transition-colors ${
                  item.active
                    ? "text-white dark:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                }
                `}
                style={item.active ? { backgroundColor: themeColor } : {}}
              >
                {getIcon(item.icon)}
                <span>{item.name}</span>
              </a>
            ))}
          </nav>

          {user && (
            <div className="border-gray-200 border-t p-4 dark:border-slate-800">
              <div className="mb-4 flex items-center space-x-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full font-medium text-white"
                  style={{ backgroundColor: themeColor }}
                >
                  {user.firstName?.charAt(0) || user.email?.charAt(0) || "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900 dark:text-white">
                    {user.firstName || user.email?.split("@")[0]}
                  </p>
                  <p className="truncate text-gray-500 text-sm dark:text-slate-400">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden dark:bg-black/70"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}

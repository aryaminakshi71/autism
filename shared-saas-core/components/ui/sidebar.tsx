"use client";

import { Link } from "@tanstack/react-router";
import { BarChart3, FileText, Home, Settings, Users } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib";

interface SidebarItem {
  name: string;
  href: string;
  icon?: string | React.ReactNode;
  active?: boolean;
  children?: SidebarItem[]; // Support for sub-links
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
  themeColor,
  logoIcon,
  className,
}: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(
    new Set(),
  );

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

  const renderNavItem = (
    item: SidebarItem,
    depth: number = 0,
  ): React.ReactNode => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.href);

    return (
      <div key={item.href}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.href)}
            className={cn(
              "flex w-full items-center justify-between space-x-3 rounded-xl px-4 py-3 font-medium transition-colors",
              "text-foreground/70 hover:bg-accent hover:text-foreground",
              item.active && "bg-primary text-primary-foreground",
            )}
            style={{ paddingLeft: `${1 + depth}rem` }}
          >
            <div className="flex items-center space-x-3">
              {getIcon(item.icon)}
              <span>{item.name}</span>
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
              item.active
                ? "bg-primary text-primary-foreground"
                : "text-foreground/70 hover:bg-accent hover:text-foreground",
            )}
            style={{ paddingLeft: `${1 + depth}rem` }}
          >
            {getIcon(item.icon)}
            <span>{item.name}</span>
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

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-border border-r bg-card lg:static",
          "transform transition-transform duration-200 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className,
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center space-x-2 border-border border-b p-4">
            {logoIcon || (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-lg text-primary-foreground">
                {appName.charAt(0)}
              </div>
            )}
            <span className="font-bold text-foreground text-lg">{appName}</span>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {items.map((item) => renderNavItem(item, 0))}
          </nav>

          {user && (
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
            </div>
          )}
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}

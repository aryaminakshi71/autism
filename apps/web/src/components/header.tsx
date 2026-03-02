import { Button } from "@autism-legacy-20260205/ui";
import { Link, useNavigate } from "@tanstack/react-router";

interface HeaderProps {
  showTryDemo?: boolean;
}

export function Header({ showTryDemo = true }: HeaderProps) {
  const navigate = useNavigate();

  const handleTryDemo = () => {
    const demoUserData = {
      id: `demo-user-${Date.now()}`,
      email: "demo@autism.app",
      name: "Demo Clinician",
      firstName: "Demo",
      lastName: "Clinician",
      role: "admin",
      companyId: "demo-company",
      isDemo: true,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("user", JSON.stringify(demoUserData));
    localStorage.setItem("isDemo", "true");
    localStorage.setItem("demo_mode", "true");
    localStorage.setItem("accessToken", "demo-token");
    localStorage.setItem("companyId", "demo-company");
    navigate({ to: "/app" });
  };

  const navLinks = [
    { to: "/pricing", label: "Pricing" },
    { to: "/blog", label: "Blog" },
    { to: "/docs", label: "Docs" },
    { to: "/about", label: "About" },
  ] as const;

  return (
    <nav className="border-gray-200 border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-bold text-2xl text-blue-600">
              Autism Platform
            </Link>
            <div className="hidden items-center gap-5 md:flex">
              {navLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="font-medium text-gray-600 text-sm hover:text-gray-900"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="font-medium text-gray-600 text-sm hover:text-gray-900"
            >
              Sign In
            </Link>
            {showTryDemo && (
              <Link
                to="/app"
                onClick={handleTryDemo}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 px-2.5 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50 sm:px-3"
              >
                Try Demo
              </Link>
            )}
            <Link to="/register">
              <Button
                variant="primary"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

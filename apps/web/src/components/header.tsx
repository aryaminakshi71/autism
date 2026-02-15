import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@autism-legacy-20260205/ui";

interface HeaderProps {
  showTryDemo?: boolean;
}

export function Header({ showTryDemo = true }: HeaderProps) {
  const navigate = useNavigate();

  const handleTryDemo = () => {
    const demoUserData = {
      id: "demo-user-" + Date.now(),
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

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Autism Platform
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Sign In
            </Link>
            {showTryDemo && (
              <Link
                to="/app"
                onClick={handleTryDemo}
                className="inline-flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium"
              >
                Try Demo
              </Link>
            )}
            <Link to="/register">
              <Button variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

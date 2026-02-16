import { useDarkMode } from "@shared/saas-core/components/ui";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "~/components/dashboard/dashboard-layout";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 font-semibold text-lg">Account Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block font-medium text-gray-700 text-sm">
                Email
              </label>
              <input
                type="email"
                defaultValue="user@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-gray-700 text-sm">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>
            <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
              Save Changes
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 font-semibold text-lg">Appearance</h2>
          <p className="mb-4 text-gray-600 text-sm">
            Customize the appearance of the application.
          </p>
          <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
            <span className="text-gray-700">Dark Mode</span>
            <label
              htmlFor="darkMode"
              className="relative inline-flex cursor-pointer items-center"
            >
              <input
                type="checkbox"
                id="darkMode"
                className="peer sr-only"
                checked={darkMode}
                onChange={toggleDarkMode}
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300" />
            </label>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 font-semibold text-lg">Notifications</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-gray-700">Email notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-gray-700">Push notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-700">SMS notifications</span>
            </label>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 font-semibold text-lg">Security</h2>
          <div className="space-y-4">
            <button className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
              Change Password
            </button>
            <button className="w-full rounded-lg border border-red-300 px-4 py-2 text-red-600 hover:bg-red-50">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

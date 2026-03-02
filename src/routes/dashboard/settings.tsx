import { useDarkMode } from "@shared/saas-core/components/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "~/components/dashboard/dashboard-layout";
import {
  isDemoModeEnabled,
  readDemoUserProfile,
  writeDemoUserProfile,
} from "~/lib/demo-mode";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const isDemoMode = isDemoModeEnabled();
  const [email, setEmail] = useState("user@example.com");
  const [fullName, setFullName] = useState("John Doe");
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    const demoUser = readDemoUserProfile();
    if (demoUser.email) setEmail(demoUser.email);
    if (demoUser.name) setFullName(demoUser.name);
  }, []);

  const handleSaveChanges = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextEmail = email.trim();
    const nextName = fullName.trim();

    if (!nextEmail || !nextName) {
      setSaveStatus("Email and full name are required.");
      return;
    }

    writeDemoUserProfile({ email: nextEmail, name: nextName });
    setSaveStatus(
      isDemoMode ? "Profile saved for demo mode." : "Profile updated locally.",
    );
  };

  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 font-semibold text-lg">Account Settings</h2>
          <form onSubmit={handleSaveChanges} className="space-y-4">
            <div>
              <label className="mb-1 block font-medium text-gray-700 text-sm">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-gray-700 text-sm">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>
            {saveStatus ? (
              <p className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-indigo-700 text-sm">
                {saveStatus}
              </p>
            ) : null}
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </form>
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

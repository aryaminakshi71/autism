import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "~/components/dashboard/dashboard-layout";

export const Route = createFileRoute("/dashboard/users")({
  component: UsersPage,
});

function UsersPage() {
  const users = [
    {
      id: "USR001",
      name: "John Doe",
      email: "john@example.com",
      status: "active",
      role: "User",
      joined: "2025-01-15",
    },
    {
      id: "USR002",
      name: "Jane Smith",
      email: "jane@example.com",
      status: "active",
      role: "Admin",
      joined: "2025-01-10",
    },
    {
      id: "USR003",
      name: "Bob Wilson",
      email: "bob@example.com",
      status: "inactive",
      role: "User",
      joined: "2025-01-05",
    },
  ];

  return (
    <DashboardLayout title="Users">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900 text-lg">Manage users</h2>
          <p className="mt-1 text-gray-600">
            Control access and permissions across your organization.
          </p>
        </div>
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
          Add User
        </button>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="flex gap-4 border-gray-200 border-b p-4">
          <input
            type="text"
            placeholder="Search users..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
          />
          <select className="rounded-lg border border-gray-300 px-4 py-2">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase">
                User
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase">
                Joined
              </th>
              <th className="px-6 py-3 text-center font-medium text-gray-500 text-xs uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-gray-500 text-sm">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-900">{user.role}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2 py-1 font-medium text-xs ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.joined}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="text-blue-600 text-sm hover:text-blue-800">
                      Edit
                    </button>
                    <button className="text-red-600 text-sm hover:text-red-800">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

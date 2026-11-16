import { createFileRoute } from "@tanstack/react-router";
import { Edit, Plus, Search, Trash } from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "~/components/dashboard/dashboard-layout";
import { isDemoModeEnabled } from "~/lib/demo-mode";

export const Route = createFileRoute("/dashboard/users")({
  component: UsersPage,
});

const DEFAULT_USERS = [
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

function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [users, setUsers] = useState(DEFAULT_USERS);
  const isDemoMode = isDemoModeEnabled();

  const handleAddUser = () => {
    const nextId = String(users.length + 1).padStart(3, "0");
    const now = new Date().toISOString().split("T")[0];
    setUsers((prev) => [
      {
        id: `USR${nextId}`,
        name: `New User ${nextId}`,
        email: `user${nextId}@example.com`,
        status: "active",
        role: "User",
        joined: now,
      },
      ...prev,
    ]);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout title="Users">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900 text-lg">Manage users</h2>
          <p className="mt-1 text-gray-600">
            Control access and permissions across your organization.
          </p>
        </div>
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {isDemoMode ? (
        <p className="mb-4 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-indigo-800 text-sm">
          Demo mode: changes are saved locally for this session.
        </p>
      ) : null}

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="flex gap-4 border-gray-200 border-b p-4">
          <div className="relative flex-1">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
            {filteredUsers.map((user) => (
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
                  <div className="flex items-center justify-center gap-2">
                    <button className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="rounded p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
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

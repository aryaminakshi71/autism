import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Filter, Plus, Search } from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "~/components/dashboard/dashboard-layout";

export const Route = createFileRoute("/dashboard/patients/")({
  component: PatientsPage,
});

function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const patients = [
    {
      id: "1",
      firstName: "Emma",
      lastName: "Johnson",
      dateOfBirth: "2018-05-15",
      diagnosis: "Autism Spectrum Disorder - Level 1",
      status: "active",
      assignedTherapist: "Sarah Smith",
      lastSession: "2024-01-15",
    },
    {
      id: "2",
      firstName: "Liam",
      lastName: "Williams",
      dateOfBirth: "2019-08-22",
      diagnosis: "Autism Spectrum Disorder - Level 2",
      status: "active",
      assignedTherapist: "Michael Brown",
      lastSession: "2024-01-14",
    },
    {
      id: "3",
      firstName: "Olivia",
      lastName: "Davis",
      dateOfBirth: "2020-02-10",
      diagnosis: "Autism Spectrum Disorder - Level 1",
      status: "active",
      assignedTherapist: "Sarah Smith",
      lastSession: "2024-01-15",
    },
    {
      id: "4",
      firstName: "Noah",
      lastName: "Martinez",
      dateOfBirth: "2017-11-28",
      diagnosis: "Autism Spectrum Disorder - Level 3",
      status: "inactive",
      assignedTherapist: "Michael Brown",
      lastSession: "2024-01-10",
    },
  ];

  const filteredPatients = patients.filter(
    (patient) =>
      patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <DashboardLayout title="Patients">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 rounded-xl border border-gray-200 py-2 pr-4 pl-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="flex items-center space-x-2 rounded-xl border border-gray-200 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-50">
            <Filter className="h-5 w-5" />
            <span>Filter</span>
          </button>
        </div>
        <button className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700">
          <Plus className="h-5 w-5" />
          <span>Add Patient</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-gray-100 border-b bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-600 text-sm">
                Patient
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-600 text-sm">
                Date of Birth
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-600 text-sm">
                Diagnosis
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-600 text-sm">
                Status
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-600 text-sm">
                Therapist
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-600 text-sm">
                Last Session
              </th>
              <th className="px-6 py-4 text-right font-semibold text-gray-600 text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPatients.map((patient) => (
              <tr
                key={patient.id}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-medium text-indigo-600">
                      {patient.firstName.charAt(0)}
                      {patient.lastName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-gray-500 text-sm">ID: {patient.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{patient.dateOfBirth}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-600">{patient.diagnosis}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 font-medium text-xs ${
                      patient.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {patient.assignedTherapist}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {patient.lastSession}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="font-medium text-indigo-600 text-sm hover:text-indigo-800">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

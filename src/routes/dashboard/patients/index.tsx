import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar,
  Filter,
  Mail,
  Phone,
  Plus,
  Search,
  User,
} from "lucide-react";
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Add Patient</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                Patient
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                Date of Birth
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                Diagnosis
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                Status
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                Therapist
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                Last Session
              </th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPatients.map((patient) => (
              <tr
                key={patient.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium">
                      {patient.firstName.charAt(0)}
                      {patient.lastName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-sm text-gray-500">ID: {patient.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{patient.dateOfBirth}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-600">{patient.diagnosis}</span>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      patient.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {patient.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-600">
                  {patient.assignedTherapist}
                </td>
                <td className="py-4 px-6 text-gray-600">
                  {patient.lastSession}
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
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

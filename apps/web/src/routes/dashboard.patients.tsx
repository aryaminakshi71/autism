"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/dashboard/patients")({
  component: DashboardPatientsPage,
});

const patients = [
  { name: "Emma Johnson", age: 8, program: "ABA Therapy" },
  { name: "Liam Williams", age: 9, program: "Speech Therapy" },
  { name: "Noah Martinez", age: 7, program: "Occupational Therapy" },
];

function DashboardPatientsPage() {
  const [query, setQuery] = useState("");

  const filteredPatients = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();
    if (!lowerQuery) return patients;
    return patients.filter((patient) =>
      patient.name.toLowerCase().includes(lowerQuery),
    );
  }, [query]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl text-gray-900">Patients</h1>
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Add Patient
        </button>
      </div>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search patients..."
        className="w-full rounded-lg border border-gray-300 px-3 py-2"
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-gray-600 text-sm">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Age</th>
              <th className="px-4 py-3">Program</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.name} className="border-gray-100 border-t">
                <td className="px-4 py-3 text-gray-900">{patient.name}</td>
                <td className="px-4 py-3 text-gray-700">{patient.age}</td>
                <td className="px-4 py-3 text-gray-700">{patient.program}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

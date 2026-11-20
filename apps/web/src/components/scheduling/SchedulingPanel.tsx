"use client";

import { useCallback, useEffect, useState } from "react";

interface Session {
  id: string;
  patientId: string;
  patientName?: string;
  type: string;
  status: string;
  scheduledStart: string;
  scheduledEnd: string;
  location?: string | null;
  telehealth?: boolean;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
}

function orgHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  if (localStorage.getItem("demo_mode") === "true") {
    return { "x-demo-mode": "true", "x-organization-id": "demo-org" };
  }
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.companyId) return { "x-organization-id": user.companyId };
  } catch {}
  return {};
}

export function SchedulingPanel() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    patientId: "",
    type: "ABA Therapy",
    scheduledStart: "",
    scheduledEnd: "",
    location: "",
    telehealth: false,
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const headers = orgHeaders();
      const [sRes, pRes] = await Promise.all([
        fetch("/api/v1/sessions?limit=100", { headers }),
        fetch("/api/v1/patients?limit=200", { headers }),
      ]);
      const sJson: any = await sRes.json();
      const pJson: any = await pRes.json();
      setSessions(sJson.data || []);
      setPatients(pJson.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load schedule");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientId || !form.scheduledStart || !form.scheduledEnd) return;
    const res = await fetch("/api/v1/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...orgHeaders() },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError("Failed to create session");
      return;
    }
    setShowForm(false);
    setForm({ ...form, patientId: "", scheduledStart: "", scheduledEnd: "" });
    load();
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/v1/sessions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...orgHeaders() },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this session?")) return;
    await fetch(`/api/v1/sessions/${id}`, {
      method: "DELETE",
      headers: orgHeaders(),
    });
    load();
  };

  const patientName = (id: string) => {
    const p = patients.find((x) => x.id === id);
    return p ? `${p.firstName} ${p.lastName}` : "Patient";
  };

  const fmt = (iso: string) =>
    iso ? new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "—";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-bold text-3xl text-gray-900">Scheduling</h1>
        <div className="flex items-center gap-2">
          <div className="inline-flex gap-1 rounded-xl bg-gray-100 p-1">
            {(["list", "grid"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setViewMode(m)}
                className={`rounded-lg px-3 py-1.5 font-medium capitalize ${
                  viewMode === m ? "bg-white shadow-sm" : "text-gray-600"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
          >
            + New Session
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={createSession}
          className="grid gap-3 rounded-xl border border-gray-200 bg-white p-5 md:grid-cols-2"
        >
          <label className="text-sm">
            <span className="mb-1 block font-medium text-gray-700">Patient</span>
            <select
              required
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="">Select patient…</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-gray-700">Type</span>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              {["ABA Therapy", "Speech Therapy", "Occupational Therapy", "Assessment", "Parent Training"].map(
                (t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ),
              )}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-gray-700">Start</span>
            <input
              required
              type="datetime-local"
              value={form.scheduledStart}
              onChange={(e) => setForm({ ...form, scheduledStart: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-gray-700">End</span>
            <input
              required
              type="datetime-local"
              value={form.scheduledEnd}
              onChange={(e) => setForm({ ...form, scheduledEnd: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-gray-700">Location</span>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Room / clinic"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.telehealth}
              onChange={(e) => setForm({ ...form, telehealth: e.target.checked })}
            />
            Telehealth
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
            >
              Schedule Session
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
          Loading schedule…
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
          No sessions scheduled yet.
        </div>
      ) : viewMode === "list" ? (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                {["Patient", "Type", "Start", "End", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sessions.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3">{s.patientName || patientName(s.patientId)}</td>
                  <td className="px-4 py-3">{s.type}</td>
                  <td className="px-4 py-3">{fmt(s.scheduledStart)}</td>
                  <td className="px-4 py-3">{fmt(s.scheduledEnd)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {s.status !== "completed" && (
                        <button
                          onClick={() => updateStatus(s.id, "completed")}
                          className="rounded bg-green-600 px-2 py-1 text-xs text-white"
                        >
                          Complete
                        </button>
                      )}
                      {s.status !== "cancelled" && (
                        <button
                          onClick={() => updateStatus(s.id, "cancelled")}
                          className="rounded bg-amber-600 px-2 py-1 text-xs text-white"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => remove(s.id)}
                        className="rounded bg-red-600 px-2 py-1 text-xs text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((s) => (
            <div key={s.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  {s.patientName || patientName(s.patientId)}
                </h3>
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
                  {s.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{s.type}</p>
              <p className="mt-2 text-sm text-gray-500">{fmt(s.scheduledStart)}</p>
              <p className="text-sm text-gray-500">{fmt(s.scheduledEnd)}</p>
              {s.location && <p className="mt-1 text-sm text-gray-500">{s.location}</p>}
              <div className="mt-3 flex gap-2">
                {s.status !== "completed" && (
                  <button
                    onClick={() => updateStatus(s.id, "completed")}
                    className="rounded bg-green-600 px-2 py-1 text-xs text-white"
                  >
                    Complete
                  </button>
                )}
                <button
                  onClick={() => remove(s.id)}
                  className="rounded bg-red-600 px-2 py-1 text-xs text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

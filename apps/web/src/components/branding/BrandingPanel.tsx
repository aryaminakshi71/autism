"use client";

import { useEffect, useState } from "react";

interface Branding {
  brandName: string;
  logoUrl: string;
  primaryColor: string;
  supportEmail: string;
  customDomain: string;
}

const DEFAULTS: Branding = {
  brandName: "SpectrumAI",
  logoUrl: "",
  primaryColor: "#6366f1",
  supportEmail: "",
  customDomain: "",
};

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

export function BrandingPanel() {
  const [branding, setBranding] = useState<Branding>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/rpc/branding/get", { credentials: "include", headers: orgHeaders() })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: any) => {
        const b = d?.json ?? d;
        if (b) {
          setBranding({
            brandName: b.brandName ?? DEFAULTS.brandName,
            logoUrl: b.logoUrl ?? "",
            primaryColor: b.primaryColor ?? DEFAULTS.primaryColor,
            supportEmail: b.supportEmail ?? "",
            customDomain: b.customDomain ?? "",
          });
        }
      })
      .catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/rpc/branding/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...orgHeaders() },
        credentials: "include",
        body: JSON.stringify({
          json: {
            brandName: branding.brandName,
            logoUrl: branding.logoUrl || null,
            primaryColor: branding.primaryColor,
            supportEmail: branding.supportEmail || null,
            customDomain: branding.customDomain || null,
          },
        }),
      });
      const d: any = await res.json().catch(() => null);
      setMessage(res.ok ? "Branding saved" : d?.message || "Failed to save");
    } catch {
      setMessage("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof Branding, type = "text") => (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-gray-700">{label}</span>
      <input
        type={type}
        value={branding[key]}
        onChange={(e) => setBranding({ ...branding, [key]: e.target.value })}
        className="w-full rounded-lg border border-gray-300 px-3 py-2"
      />
    </label>
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-bold text-3xl text-gray-900">White-label branding</h1>
        <p className="mt-1 text-gray-600">
          Resell SpectrumAI under your own brand. These settings apply to your organization.
        </p>
      </div>

      {message && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-blue-800">
          {message}
        </div>
      )}

      <div className="grid gap-4 rounded-xl border border-gray-200 bg-white p-6 md:grid-cols-2">
        {field("Brand name", "brandName")}
        {field("Logo URL", "logoUrl")}
        {field("Primary color", "primaryColor")}
        {field("Support email", "supportEmail", "email")}
        {field("Custom domain", "customDomain")}
        <div className="md:col-span-2">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save branding"}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="mb-3 text-sm font-medium text-gray-700">Preview</p>
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg font-bold text-white"
            style={{ backgroundColor: branding.primaryColor }}
          >
            {branding.brandName.charAt(0).toUpperCase()}
          </div>
          <span className="text-lg font-semibold text-gray-900">
            {branding.brandName}
          </span>
        </div>
      </div>
    </div>
  );
}

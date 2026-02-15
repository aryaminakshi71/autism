/**
 * Referrals Route
 *
 * Referral management page.
 */

import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Card,
  CardContent,
  Button,
  Input,
  Badge,
  FormModal,
  FormField,
  EmptyState,
  Loading,
} from "@autism-legacy-20260205/ui";
import { Plus, Search, Mail, Webhook, UserPlus } from "lucide-react";
import { leadsApi } from "../lib/api";
import { toast } from "sonner";
import { Pagination } from "@/components/pagination";

export const Route = createFileRoute("/app/leads")({
  component: LeadsPage,
});

const LEAD_SOURCES = [
  { value: "clinic", label: "Clinic Referral" },
  { value: "school", label: "School Referral" },
  { value: "pediatrician", label: "Pediatrician" },
  { value: "self", label: "Self-Referral" },
  { value: "community", label: "Community Organization" },
  { value: "other", label: "Other" },
];

function LeadsPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [newLead, setNewLead] = useState({
    email: "",
    firstName: "",
    lastName: "",
    companyName: "",
    phone: "",
    source: "clinic",
    notes: "",
  });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["leads", currentPage],
    queryFn: () => leadsApi.list({ page: currentPage, limit: itemsPerPage }),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof newLead) => {
      // Validate required fields
      if (!data.email.trim()) {
        throw new Error("Email is required");
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        throw new Error("Please enter a valid email address");
      }
      return leadsApi.create({
        email: data.email.trim(),
        firstName: data.firstName.trim() || undefined,
        lastName: data.lastName.trim() || undefined,
        companyName: data.companyName.trim() || undefined,
        phone: data.phone.trim() || undefined,
        source: data.source,
        notes: data.notes.trim() || undefined,
      });
    },
    onSuccess: () => {
      toast.success("Referral created successfully");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setIsModalOpen(false);
      setNewLead({
        email: "",
        firstName: "",
        lastName: "",
        companyName: "",
        phone: "",
        source: "clinic",
        notes: "",
      });
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Failed to create referral";
      toast.error(errorMessage);
      console.error("Referral creation error:", error);
    },
  });

  const convertMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => leadsApi.convert(id, data),
    onSuccess: () => {
      toast.success("Referral converted to learner");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  const leads = data?.data || [];
  const totalItems = data?.total || 0;
  const totalPages = data?.total && data?.limit ? Math.ceil(data.total / data.limit) : 1;
  
  // Client-side filtering for search
  const filteredLeads = leads.filter((lead: any) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      lead.email?.toLowerCase().includes(searchLower) ||
      lead.firstName?.toLowerCase().includes(searchLower) ||
      lead.lastName?.toLowerCase().includes(searchLower) ||
      lead.companyName?.toLowerCase().includes(searchLower)
    );
  });

  const leadCounts = {
    new: leads.filter((l: any) => l.status === "new").length,
    contacted: leads.filter((l: any) => l.status === "contacted").length,
    qualified: leads.filter((l: any) => l.status === "qualified").length,
    converted: leads.filter((l: any) => l.status === "converted").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
          <p className="text-gray-500">Capture and manage referrals from community partners</p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          Add Referral
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">New</p>
            <p className="text-2xl font-bold text-blue-600">{leadCounts.new}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Contacted</p>
            <p className="text-2xl font-bold text-yellow-600">{leadCounts.contacted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Qualified</p>
            <p className="text-2xl font-bold text-green-600">{leadCounts.qualified}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Converted</p>
            <p className="text-2xl font-bold text-purple-600">{leadCounts.converted}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search referrals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Referrals List */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <Loading text="Loading referrals..." />
          </CardContent>
        </Card>
      ) : leads.length === 0 ? (
        <EmptyState
          icon={<Webhook className="w-12 h-12" />}
          title="No referrals yet"
          description="Start capturing referrals by adding your first one."
          action={{ label: "Add Referral", onClick: () => setIsModalOpen(true) }}
        />
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {filteredLeads.map((lead: any) => (
                <div key={lead.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {lead.firstName} {lead.lastName}
                        {lead.companyName && <span className="text-gray-500"> at {lead.companyName}</span>}
                      </p>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        lead.status === "converted"
                          ? "success"
                          : lead.status === "qualified"
                          ? "primary"
                          : "default"
                      }
                    >
                      {lead.status}
                    </Badge>
                    <Badge variant="outline">{lead.source}</Badge>
                    {lead.status !== "converted" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<UserPlus className="w-4 h-4" />}
                        onClick={() =>
                          convertMutation.mutate({
                            id: lead.id,
                            data: {
                              firstName: lead.firstName || "Unknown",
                              lastName: lead.lastName || "",
                              companyName: lead.companyName,
                            },
                          })
                        }
                        loading={convertMutation.isPending}
                      >
                        Convert
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        )}
      </>
      )}

      {/* Create Referral Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate(newLead);
        }}
        title="Add New Referral"
        submitText="Create Referral"
        loading={createMutation.isPending}
      >
        <div className="space-y-4">
          <FormField label="Email" required>
            <Input
              type="email"
              value={newLead.email}
              onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
              required
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First Name">
              <Input
                value={newLead.firstName}
                onChange={(e) => setNewLead({ ...newLead, firstName: e.target.value })}
              />
            </FormField>
            <FormField label="Last Name">
              <Input
                value={newLead.lastName}
                onChange={(e) => setNewLead({ ...newLead, lastName: e.target.value })}
              />
            </FormField>
          </div>
          <FormField label="Clinic or School">
            <Input
              value={newLead.companyName}
              onChange={(e) => setNewLead({ ...newLead, companyName: e.target.value })}
            />
          </FormField>
          <FormField label="Phone">
            <Input
              value={newLead.phone}
              onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
            />
          </FormField>
          <FormField label="Source">
            <select
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              value={newLead.source}
              onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
            >
              {LEAD_SOURCES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </FormField>
        </div>
      </FormModal>
    </div>
  );
}

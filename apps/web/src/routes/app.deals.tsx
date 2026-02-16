/**
 * Care Plans Route
 *
 * Care plan pathway with kanban view.
 */

import {
  Badge,
  Button,
  Card,
  CardContent,
  EmptyState,
  FormField,
  FormModal,
  Input,
  Loading,
  Textarea,
  cn,
} from "@autism-legacy-20260205/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, CheckCircle, ClipboardList, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { dealsApi } from "../lib/api";

export const Route = createFileRoute("/app/deals")({
  component: DealsPage,
});

const DEAL_STAGES = [
  { key: "lead", label: "Intake", color: "bg-gray-100" },
  { key: "qualified", label: "Assessment", color: "bg-blue-100" },
  { key: "proposal", label: "Plan Draft", color: "bg-yellow-100" },
  { key: "negotiation", label: "In Therapy", color: "bg-orange-100" },
  { key: "won", label: "Completed", color: "bg-green-100" },
  { key: "lost", label: "On Hold", color: "bg-red-100" },
];

function DealsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [newDeal, setNewDeal] = useState({
    name: "",
    value: "",
    stage: "lead",
    notes: "",
  });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["deals"],
    queryFn: () => dealsApi.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof newDeal) => {
      // Validate required fields
      if (!data.name.trim()) {
        throw new Error("Plan name is required");
      }
      const value = parseFloat(data.value);
      if (isNaN(value) || value <= 0) {
        throw new Error("Plan value must be a positive number");
      }
      return dealsApi.create({
        name: data.name.trim(),
        value: value,
        stage: data.stage,
        notes: data.notes.trim() || undefined,
      });
    },
    onSuccess: () => {
      toast.success("Care plan created successfully");
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      setIsModalOpen(false);
      setNewDeal({ name: "", value: "", stage: "lead", notes: "" });
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Failed to create care plan";
      toast.error(errorMessage);
      console.error("Care plan creation error:", error);
    },
  });

  const updateStageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) =>
      dealsApi.updateStage(id, stage),
    onSuccess: () => {
      toast.success("Care plan stage updated");
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });

  const deals = data?.data || [];

  // Pagination
  const totalPages = Math.ceil(deals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDeals = deals.slice(startIndex, endIndex);

  // Group deals by stage
  const dealsByStage = DEAL_STAGES.reduce(
    (acc, stage) => {
      acc[stage.key] = deals.filter((d: any) => d.stage === stage.key);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  // Calculate totals
  const totalValue = deals.reduce(
    (sum: number, d: any) => sum + Number(d.value || 0),
    0,
  );
  const wonValue = deals
    .filter((d: any) => d.stage === "won")
    .reduce((sum: number, d: any) => sum + Number(d.value || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl text-gray-900">Care Plans</h1>
          <p className="text-gray-500">
            Manage care plans and progress across teams.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          New Care Plan
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <ClipboardList className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Authorized Units</p>
                <p className="font-bold text-gray-900 text-xl">
                  {totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="font-bold text-gray-900 text-xl">
                  {wonValue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Care Plans</p>
                <p className="font-bold text-gray-900 text-xl">
                  {deals.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <Loading text="Loading care plans..." />
          </CardContent>
        </Card>
      ) : deals.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="h-12 w-12" />}
          title="No care plans yet"
          description="Start by creating your first care plan."
          action={{
            label: "Create Care Plan",
            onClick: () => setIsModalOpen(true),
          }}
        />
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {DEAL_STAGES.map((stage) => {
            const stageDeals = dealsByStage[stage.key] || [];
            const stageValue = stageDeals.reduce(
              (sum: number, d: any) => sum + Number(d.value || 0),
              0,
            );
            return (
              <div key={stage.key} className="w-72 flex-shrink-0">
                <div className={cn("rounded-t-lg px-3 py-2", stage.color)}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">
                      {stage.label}
                    </span>
                    <Badge variant="outline">{stageDeals.length}</Badge>
                  </div>
                  <p className="text-gray-500 text-sm">
                    {stageValue.toLocaleString()} units
                  </p>
                </div>
                <div className="min-h-[400px] space-y-2 rounded-b-lg bg-gray-50 p-2">
                  {stageDeals.map((deal: any) => (
                    <Card key={deal.id} hover className="p-3">
                      <p className="font-medium text-gray-900">{deal.name}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-semibold text-green-600 text-sm">
                          {Number(deal.value).toLocaleString()}
                        </span>
                        <select
                          className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                          value={deal.stage}
                          onChange={(e) =>
                            updateStageMutation.mutate({
                              id: deal.id,
                              stage: e.target.value,
                            })
                          }
                        >
                          {DEAL_STAGES.map((s) => (
                            <option key={s.key} value={s.key}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Care Plan Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate(newDeal);
        }}
        title="Create New Care Plan"
        submitText="Create Care Plan"
        loading={createMutation.isPending}
      >
        <div className="space-y-4">
          <FormField label="Plan Name" required>
            <Input
              value={newDeal.name}
              onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
              required
            />
          </FormField>
          <FormField label="Authorized Units" required>
            <Input
              type="number"
              value={newDeal.value}
              onChange={(e) =>
                setNewDeal({ ...newDeal, value: e.target.value })
              }
              required
            />
          </FormField>
          <FormField label="Stage">
            <select
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              value={newDeal.stage}
              onChange={(e) =>
                setNewDeal({ ...newDeal, stage: e.target.value })
              }
            >
              {DEAL_STAGES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Notes">
            <Textarea
              value={newDeal.notes}
              onChange={(e) =>
                setNewDeal({ ...newDeal, notes: e.target.value })
              }
            />
          </FormField>
        </div>
      </FormModal>
    </div>
  );
}

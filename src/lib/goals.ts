import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Goal {
  id: string;
  title: string;
  description?: string;
  patientId: string;
  category: GoalCategory;
  status: GoalStatus;
  priority: GoalPriority;
  progress: number; // 0-100
  targetDate?: string;
  startDate: string;
  completedDate?: string;
  milestones: Milestone[];
  attachments: Attachment[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isTemplate: boolean;
}

export type GoalCategory =
  | "communication"
  | "social"
  | "behavioral"
  | "academic"
  | "life_skills"
  | "motor"
  | "sensory"
  | "play"
  | "other";

export type GoalStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "mastered"
  | "discontinued"
  | "on_hold";

export type GoalPriority = "low" | "medium" | "high" | "urgent";

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;
  completedDate?: string;
  isCompleted: boolean;
  order: number;
}

export interface Attachment {
  id: string;
  type: "image" | "video" | "document";
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  createdAt: string;
}

export interface CreateGoalInput {
  title: string;
  description?: string;
  patientId: string;
  category: GoalCategory;
  priority: GoalPriority;
  targetDate?: string;
  milestones?: Omit<Milestone, "id">[];
  tags?: string[];
  isTemplate?: boolean;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string;
  category?: GoalCategory;
  status?: GoalStatus;
  priority?: GoalPriority;
  progress?: number;
  targetDate?: string;
  milestones?: Milestone[];
  tags?: string[];
}

// API Functions
const API_BASE = "/api/goals";

async function fetchGoals(patientId?: string): Promise<Goal[]> {
  const url = patientId ? `${API_BASE}?patientId=${patientId}` : API_BASE;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch goals");
  return response.json();
}

async function fetchGoal(id: string): Promise<Goal> {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch goal");
  return response.json();
}

async function createGoal(input: CreateGoalInput): Promise<Goal> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("Failed to create goal");
  return response.json();
}

async function updateGoal(id: string, input: UpdateGoalInput): Promise<Goal> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("Failed to update goal");
  return response.json();
}

async function deleteGoal(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete goal");
}

async function fetchGoalTemplates(): Promise<Goal[]> {
  const response = await fetch(`${API_BASE}/templates`);
  if (!response.ok) throw new Error("Failed to fetch templates");
  return response.json();
}

// React Query Hooks
export function useGoals(patientId?: string) {
  return useQuery({
    queryKey: ["goals", patientId],
    queryFn: () => fetchGoals(patientId),
  });
}

export function useGoal(id: string) {
  return useQuery({
    queryKey: ["goals", id],
    queryFn: () => fetchGoal(id),
    enabled: !!id,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGoal,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["goals", data.patientId] });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateGoalInput }) =>
      updateGoal(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["goals", data.id] });
      queryClient.invalidateQueries({ queryKey: ["goals", data.patientId] });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useGoalTemplates() {
  return useQuery({
    queryKey: ["goals", "templates"],
    queryFn: fetchGoalTemplates,
  });
}

// Utility functions
export function calculateGoalProgress(milestones: Milestone[]): number {
  if (milestones.length === 0) return 0;
  const completed = milestones.filter((m) => m.isCompleted).length;
  return Math.round((completed / milestones.length) * 100);
}

export function getGoalStatusColor(status: GoalStatus): string {
  const colors: Record<GoalStatus, string> = {
    not_started: "bg-gray-100 text-gray-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-emerald-100 text-emerald-700",
    mastered: "bg-purple-100 text-purple-700",
    discontinued: "bg-red-100 text-red-700",
    on_hold: "bg-amber-100 text-amber-700",
  };
  return colors[status];
}

export function getGoalPriorityColor(priority: GoalPriority): string {
  const colors: Record<GoalPriority, string> = {
    low: "bg-gray-100 text-gray-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };
  return colors[priority];
}

export const GOAL_CATEGORIES: { value: GoalCategory; label: string }[] = [
  { value: "communication", label: "Communication" },
  { value: "social", label: "Social Skills" },
  { value: "behavioral", label: "Behavioral" },
  { value: "academic", label: "Academic" },
  { value: "life_skills", label: "Life Skills" },
  { value: "motor", label: "Motor Skills" },
  { value: "sensory", label: "Sensory" },
  { value: "play", label: "Play Skills" },
  { value: "other", label: "Other" },
];

export const GOAL_STATUSES: { value: GoalStatus; label: string }[] = [
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "mastered", label: "Mastered" },
  { value: "on_hold", label: "On Hold" },
  { value: "discontinued", label: "Discontinued" },
];

export const GOAL_PRIORITIES: { value: GoalPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

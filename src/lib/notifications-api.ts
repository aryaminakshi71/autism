import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Notification, NotificationPreference } from "~/types/models";

const API_BASE = "/api/notifications";

async function fetchNotifications(
  userId: string,
  status?: string,
): Promise<Notification[]> {
  let url = `${API_BASE}?userId=${userId}`;
  if (status) url += `&status=${status}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch notifications");
  return response.json();
}

async function fetchNotificationPreferences(
  userId: string,
): Promise<NotificationPreference[]> {
  const response = await fetch(`${API_BASE}/preferences?userId=${userId}`);
  if (!response.ok) throw new Error("Failed to fetch notification preferences");
  return response.json();
}

async function markNotificationRead(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}/read`, {
    method: "PATCH",
  });
  if (!response.ok) throw new Error("Failed to mark notification as read");
}

async function markAllNotificationsRead(userId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/read-all?userId=${userId}`, {
    method: "PATCH",
  });
  if (!response.ok) throw new Error("Failed to mark all notifications as read");
}

async function updateNotificationPreference(
  userId: string,
  type: string,
  data: Partial<NotificationPreference>,
): Promise<void> {
  const response = await fetch(
    `${API_BASE}/preferences?userId=${userId}&type=${type}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  if (!response.ok) throw new Error("Failed to update notification preference");
}

async function deleteNotification(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete notification");
}

// React Query Hooks
export function useNotifications(userId: string, status?: string) {
  return useQuery({
    queryKey: ["notifications", userId, status],
    queryFn: () => fetchNotifications(userId, status),
    enabled: !!userId,
  });
}

export function useNotificationPreferences(userId: string) {
  return useQuery({
    queryKey: ["notification-preferences", userId],
    queryFn: () => fetchNotificationPreferences(userId),
    enabled: !!userId,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useUpdateNotificationPreference() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      type,
      data,
    }: {
      userId: string;
      type: string;
      data: Partial<NotificationPreference>;
    }) => updateNotificationPreference(userId, type, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-preferences"] });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

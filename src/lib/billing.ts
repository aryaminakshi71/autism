import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Invoice, Payment } from "~/types/models";

const API_BASE = "/api/billing";

async function fetchInvoices(
  patientId?: string,
  status?: string,
): Promise<Invoice[]> {
  let url = API_BASE;
  const params = new URLSearchParams();
  if (patientId) params.append("patientId", patientId);
  if (status) params.append("status", status);
  if (params.toString()) url += `?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch invoices");
  return response.json();
}

async function fetchInvoice(id: string): Promise<Invoice> {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch invoice");
  return response.json();
}

async function createInvoice(data: Partial<Invoice>): Promise<Invoice> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create invoice");
  return response.json();
}

async function updateInvoice(
  id: string,
  data: Partial<Invoice>,
): Promise<Invoice> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update invoice");
  return response.json();
}

async function deleteInvoice(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete invoice");
}

async function recordPayment(
  invoiceId: string,
  paymentData: Partial<Payment>,
): Promise<void> {
  const response = await fetch(`${API_BASE}/${invoiceId}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentData),
  });
  if (!response.ok) throw new Error("Failed to record payment");
}

async function sendInvoice(invoiceId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${invoiceId}/send`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to send invoice");
}

// React Query Hooks
export function useInvoices(patientId?: string, status?: string) {
  return useQuery({
    queryKey: ["invoices", patientId, status],
    queryFn: () => fetchInvoices(patientId, status),
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ["invoices", id],
    queryFn: () => fetchInvoice(id),
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Invoice> }) =>
      updateInvoice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      invoiceId,
      paymentData,
    }: { invoiceId: string; paymentData: Partial<Payment> }) =>
      recordPayment(invoiceId, paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useSendInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

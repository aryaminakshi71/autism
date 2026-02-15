/**
 * Learners Route
 *
 * Learner management page with list view.
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
import { Plus, Search, Mail, Building2 } from "lucide-react";
import { contactsApi } from "../lib/api";
import { toast } from "sonner";
import { Pagination } from "@/components/pagination";

export const Route = createFileRoute("/app/contacts")({
  component: ContactsPage,
});

function ContactsPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [newContact, setNewContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
  });
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["contacts", search, currentPage],
    queryFn: () => contactsApi.list({ page: currentPage, limit: itemsPerPage, search }),
    retry: 2,
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof newContact) => {
      // Validate required fields
      if (!data.firstName.trim() || !data.lastName.trim()) {
        throw new Error("First name and last name are required");
      }
      return contactsApi.create({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim() || undefined,
        phone: data.phone.trim() || undefined,
        companyName: data.companyName.trim() || undefined,
      });
    },
    onSuccess: () => {
      toast.success("Learner created successfully");
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      setIsModalOpen(false);
      setNewContact({ firstName: "", lastName: "", email: "", phone: "", companyName: "" });
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Failed to create contact";
      toast.error(errorMessage);
      console.error("Learner creation error:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contactsApi.delete(id),
    onSuccess: () => {
      toast.success("Learner deleted");
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  const contacts = data?.data || [];
  const totalItems = data?.total || 0;
  const totalPages = data?.totalPages || (data?.total && data?.limit ? Math.ceil(data.total / data.limit) : 1);

  // Client-side filtering for search (server-side search can be added later)
  const filteredContacts = contacts.filter((contact: any) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      contact.firstName?.toLowerCase().includes(searchLower) ||
      contact.lastName?.toLowerCase().includes(searchLower) ||
      contact.email?.toLowerCase().includes(searchLower) ||
      contact.companyName?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Learners</h1>
          <p className="text-gray-500">Manage learner profiles, care teams, and relationships</p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          Add Learner
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Learners List */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <Loading text="Loading learners..." />
          </CardContent>
        </Card>
      ) : contacts.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-12 h-12" />}
          title="No contacts yet"
          description="Get started by adding your first contact."
          action={{ label: "Add Learner", onClick: () => setIsModalOpen(true) }}
        />
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {filteredContacts.map((contact: any) => (
                  <div key={contact.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {contact.firstName?.[0]}{contact.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{contact.firstName} {contact.lastName}</p>
                        <div className="flex items-center gap-4 mt-1">
                          {contact.email && (
                            <span className="flex items-center gap-1 text-sm text-gray-500">
                              <Mail className="w-3 h-3" /> {contact.email}
                            </span>
                          )}
                          {contact.companyName && (
                            <span className="flex items-center gap-1 text-sm text-gray-500">
                              <Building2 className="w-3 h-3" /> {contact.companyName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={contact.status === 'customer' ? 'success' : 'default'}>
                        {contact.status || 'contact'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(contact.id)}
                        loading={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
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

      {/* Create Learner Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate(newContact);
        }}
        title="Add New Learner"
        submitText="Create Learner"
        loading={createMutation.isPending}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First Name" required>
              <Input
                value={newContact.firstName}
                onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                required
              />
            </FormField>
            <FormField label="Last Name" required>
              <Input
                value={newContact.lastName}
                onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                required
              />
            </FormField>
          </div>
          <FormField label="Email">
            <Input
              type="email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
            />
          </FormField>
          <FormField label="Phone">
            <Input
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            />
          </FormField>
          <FormField label="Clinic or School">
            <Input
              value={newContact.companyName}
              onChange={(e) => setNewContact({ ...newContact, companyName: e.target.value })}
            />
          </FormField>
        </div>
      </FormModal>
    </div>
  );
}

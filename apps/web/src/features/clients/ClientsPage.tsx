import { useState } from "react";
import { Building2, Mail, Phone, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { useClients, useDeleteClient } from "./api";
import { ClientFormModal } from "./ClientFormModal";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { formatDate } from "@/lib/formatters";
import type { Client } from "@/types/api";

export function ClientsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const { data: clients, isLoading } = useClients(debouncedSearch);
  const deleteClient = useDeleteClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const columns: Column<Client>[] = [
    {
      key: "name",
      header: "Client",
      render: (c) => (
        <div>
          <p className="font-medium text-text-primary">{c.name}</p>
          {c.company && c.company !== c.name && <p className="text-xs text-text-tertiary">{c.company}</p>}
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (c) => (
        <div className="space-y-0.5">
          {c.email && (
            <p className="flex items-center gap-1.5 text-xs text-text-secondary">
              <Mail className="h-3 w-3 text-text-tertiary" /> {c.email}
            </p>
          )}
          {c.phone && (
            <p className="flex items-center gap-1.5 text-xs text-text-secondary">
              <Phone className="h-3 w-3 text-text-tertiary" /> {c.phone}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "projects",
      header: "Projects",
      render: (c) => <span className="text-text-secondary">{c._count?.projects ?? 0}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (c) => <Badge tone={c.status === "active" ? "green" : "slate"}>{c.status === "active" ? "Active" : "Inactive"}</Badge>,
    },
    {
      key: "createdAt",
      header: "Client since",
      render: (c) => <span className="text-text-tertiary">{formatDate(c.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      render: (c) => (
        <button
          onClick={async (e) => {
            e.stopPropagation();
            if (!confirm(`Delete ${c.name}? This cannot be undone.`)) return;
            try {
              await deleteClient.mutateAsync(c.id);
              toast.success("Client deleted");
            } catch {
              toast.error("Failed to delete client");
            }
          }}
          className="rounded-md p-1.5 text-text-tertiary hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-500/10"
          aria-label={`Delete ${c.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
      className: "text-right",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Organizations you deliver projects for"
        actions={
          <Button
            onClick={() => {
              setEditingClient(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> New Client
          </Button>
        }
      />

      <Card>
        <div className="border-b border-border p-4">
          <div className="relative max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients…"
              className="pl-8"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={clients ?? []}
          getRowId={(c) => c.id}
          isLoading={isLoading}
          onRowClick={(c) => {
            setEditingClient(c);
            setModalOpen(true);
          }}
          emptyState={
            <EmptyState
              icon={Building2}
              title="No clients yet"
              description="Add your first client to start assigning projects to them."
              action={
                <Button size="sm" onClick={() => setModalOpen(true)}>
                  <Plus className="h-4 w-4" /> New Client
                </Button>
              }
            />
          }
        />
      </Card>

      <ClientFormModal open={modalOpen} onClose={() => setModalOpen(false)} client={editingClient} />
    </div>
  );
}

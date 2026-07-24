import { useState } from "react";
import { toast } from "sonner";
import { KeyRound, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCredentials, useDeleteCredential } from "./api";
import { CredentialFormModal } from "./CredentialFormModal";
import { CredentialSecretCell } from "./CredentialSecretCell";
import { formatDate } from "@/lib/formatters";
import type { Credential } from "@/types/api";

export function CredentialsPage() {
  const { data: credentials, isLoading } = useCredentials();
  const deleteCredential = useDeleteCredential();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Credential | null>(null);

  const columns: Column<Credential>[] = [
    { key: "toolName", header: "Tool", render: (c) => <span className="font-medium text-text-primary">{c.toolName}</span> },
    { key: "username", header: "Username", render: (c) => <span className="text-text-secondary">{c.username}</span> },
    { key: "secret", header: "Secret", render: (c) => <CredentialSecretCell credential={c} /> },
    { key: "updatedAt", header: "Last updated", render: (c) => <span className="text-text-tertiary">{formatDate(c.updatedAt)}</span> },
    {
      key: "actions",
      header: "",
      render: (c) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => {
              setEditing(c);
              setModalOpen(true);
            }}
            className="rounded-md px-2 py-1 text-xs font-medium text-text-secondary hover:bg-bg hover:text-text-primary"
          >
            Edit
          </button>
          <button
            onClick={async () => {
              if (!confirm(`Delete credential for ${c.toolName}?`)) return;
              try {
                await deleteCredential.mutateAsync(c.id);
                toast.success("Credential deleted");
              } catch {
                toast.error("Failed to delete credential");
              }
            }}
            className="rounded-md p-1.5 text-text-tertiary hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-500/10"
            aria-label={`Delete ${c.toolName} credential`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Credentials"
        description="Shared access to tools and services, encrypted at rest"
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add Credential
          </Button>
        }
      />

      <Card>
        <DataTable
          columns={columns}
          rows={credentials ?? []}
          getRowId={(c) => c.id}
          isLoading={isLoading}
          emptyState={
            <EmptyState
              icon={KeyRound}
              title="No credentials stored"
              description="Add shared logins and API keys so your team can access tools securely."
              action={
                <Button size="sm" onClick={() => setModalOpen(true)}>
                  <Plus className="h-4 w-4" /> Add Credential
                </Button>
              }
            />
          }
        />
      </Card>

      <CredentialFormModal open={modalOpen} onClose={() => setModalOpen(false)} credential={editing} />
    </div>
  );
}

import { useState } from "react";
import { toast } from "sonner";
import { Ban, CheckCircle2, Plus, Trash2, UsersRound } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge, RoleBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAdminUsers, useDeleteUser, useUpdateUser } from "./api";
import { UserFormModal } from "./UserFormModal";
import { formatDate } from "@/lib/formatters";
import type { AdminUser } from "@/types/api";

function DeactivateToggle({ user }: { user: AdminUser }) {
  const updateUser = useUpdateUser(user.id);

  return (
    <button
      onClick={async (e) => {
        e.stopPropagation();
        try {
          await updateUser.mutateAsync({ isActive: !user.isActive });
          toast.success(user.isActive ? `${user.name} deactivated` : `${user.name} reactivated`);
        } catch {
          toast.error("Failed to update user status");
        }
      }}
      className="rounded-md p-1.5 text-text-tertiary hover:bg-bg hover:text-text-primary"
      aria-label={user.isActive ? `Deactivate ${user.name}` : `Reactivate ${user.name}`}
      title={user.isActive ? "Deactivate" : "Reactivate"}
    >
      {user.isActive ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
    </button>
  );
}

export function UserControlPage() {
  const [search, setSearch] = useState("");
  const { data: users, isLoading } = useAdminUsers();
  const deleteUser = useDeleteUser();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const filtered = (users ?? []).filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.department ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const columns: Column<AdminUser>[] = [
    {
      key: "name",
      header: "User",
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={u.name} src={u.avatarUrl} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-text-primary">{u.name}</p>
            <p className="truncate text-xs text-text-tertiary">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: "department", header: "Department", render: (u) => <span className="text-text-secondary">{u.department ?? "—"}</span> },
    { key: "role", header: "Role", render: (u) => <RoleBadge role={u.role} /> },
    {
      key: "status",
      header: "Status",
      render: (u) => <Badge tone={u.isActive ? "green" : "slate"}>{u.isActive ? "Active" : "Deactivated"}</Badge>,
    },
    { key: "createdAt", header: "Joined", render: (u) => <span className="text-text-tertiary">{formatDate(u.createdAt)}</span> },
    {
      key: "actions",
      header: "",
      render: (u) =>
        u.role === "super_admin" ? (
          <span className="block text-right text-xs text-text-tertiary">—</span>
        ) : (
          <div className="flex justify-end gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingUser(u);
                setModalOpen(true);
              }}
              className="rounded-md px-2 py-1 text-xs font-medium text-text-secondary hover:bg-bg hover:text-text-primary"
            >
              Edit
            </button>
            <DeactivateToggle user={u} />
            <button
              onClick={async (e) => {
                e.stopPropagation();
                if (!confirm(`Delete ${u.name}? This cannot be undone.`)) return;
                try {
                  await deleteUser.mutateAsync(u.id);
                  toast.success("User deleted");
                } catch (err: unknown) {
                  const message =
                    (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? "Failed to delete user";
                  toast.error(message);
                }
              }}
              className="rounded-md p-1.5 text-text-tertiary hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-500/10"
              aria-label={`Delete ${u.name}`}
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
        title="User Control"
        description="Manage who has access to Pulse and what they can do"
        actions={
          <Button
            onClick={() => {
              setEditingUser(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Invite User
          </Button>
        }
      />

      <Card>
        <div className="border-b border-border p-4">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or department…"
            className="max-w-xs"
          />
        </div>

        <DataTable
          columns={columns}
          rows={filtered}
          getRowId={(u) => u.id}
          isLoading={isLoading}
          emptyState={
            <EmptyState
              icon={UsersRound}
              title="No users found"
              description="Try a different search, or invite your first team member."
            />
          }
        />
      </Card>

      <UserFormModal open={modalOpen} onClose={() => setModalOpen(false)} user={editingUser} />
    </div>
  );
}

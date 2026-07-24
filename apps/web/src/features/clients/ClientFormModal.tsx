import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FieldError, FieldLabel, Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useCreateClient, useUpdateClient } from "./api";
import type { Client } from "@/types/api";

const clientSchema = z.object({
  name: z.string().min(1, "Client name is required"),
  company: z.string().optional(),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

type ClientForm = z.infer<typeof clientSchema>;

interface ClientFormModalProps {
  open: boolean;
  onClose: () => void;
  client?: Client | null;
}

export function ClientFormModal({ open, onClose, client }: ClientFormModalProps) {
  const isEdit = !!client;
  const createClient = useCreateClient();
  const updateClient = useUpdateClient(client?.id ?? "");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
    values: {
      name: client?.name ?? "",
      company: client?.company ?? "",
      email: client?.email ?? "",
      phone: client?.phone ?? "",
      address: client?.address ?? "",
      status: client?.status ?? "active",
    },
  });

  const onSubmit = async (values: ClientForm) => {
    try {
      if (isEdit) {
        await updateClient.mutateAsync(values);
        toast.success("Client updated");
      } else {
        await createClient.mutateAsync(values);
        toast.success("Client created");
      }
      reset();
      onClose();
    } catch {
      toast.error(isEdit ? "Failed to update client" : "Failed to create client");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Client" : "New Client"} size="md">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <FieldLabel required>Client name</FieldLabel>
          <Input invalid={!!errors.name} {...register("name")} />
          <FieldError>{errors.name?.message}</FieldError>
        </div>
        <div>
          <FieldLabel>Company</FieldLabel>
          <Input {...register("company")} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Email</FieldLabel>
            <Input type="email" invalid={!!errors.email} {...register("email")} />
            <FieldError>{errors.email?.message}</FieldError>
          </div>
          <div>
            <FieldLabel>Phone</FieldLabel>
            <Input {...register("phone")} />
          </div>
        </div>
        <div>
          <FieldLabel>Address</FieldLabel>
          <Textarea rows={2} placeholder="Street, city, state, postal code" {...register("address")} />
        </div>
        <div>
          <FieldLabel>Status</FieldLabel>
          <Select {...register("status")}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? "Save changes" : "Create client"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FieldError, FieldLabel, Input, Textarea } from "@/components/ui/Input";
import { useCreateCredential, useUpdateCredential } from "./api";
import type { Credential } from "@/types/api";

const baseSchema = {
  toolName: z.string().min(1, "Tool name is required"),
  username: z.string().min(1, "Username is required"),
  notes: z.string().optional(),
};

interface CredentialFormModalProps {
  open: boolean;
  onClose: () => void;
  credential?: Credential | null;
}

export function CredentialFormModal({ open, onClose, credential }: CredentialFormModalProps) {
  const isEdit = !!credential;
  const schema = z.object({
    ...baseSchema,
    secret: isEdit ? z.string().optional() : z.string().min(1, "Secret is required"),
  });
  type FormValues = z.infer<typeof schema>;

  const createCredential = useCreateCredential();
  const updateCredential = useUpdateCredential(credential?.id ?? "");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      toolName: credential?.toolName ?? "",
      username: credential?.username ?? "",
      secret: "",
      notes: credential?.notes ?? "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEdit) {
        await updateCredential.mutateAsync({ ...values, secret: values.secret || undefined });
        toast.success("Credential updated");
      } else {
        await createCredential.mutateAsync(values as Required<FormValues>);
        toast.success("Credential added");
      }
      reset();
      onClose();
    } catch {
      toast.error(isEdit ? "Failed to update credential" : "Failed to add credential");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Credential" : "Add Credential"} size="md">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <FieldLabel required>Tool name</FieldLabel>
          <Input placeholder="e.g. GitHub, AWS Console" invalid={!!errors.toolName} {...register("toolName")} />
          <FieldError>{errors.toolName?.message}</FieldError>
        </div>
        <div>
          <FieldLabel required>Username</FieldLabel>
          <Input invalid={!!errors.username} {...register("username")} />
          <FieldError>{errors.username?.message}</FieldError>
        </div>
        <div>
          <FieldLabel required={!isEdit}>{isEdit ? "New secret (leave blank to keep current)" : "Secret"}</FieldLabel>
          <Input type="password" invalid={!!errors.secret} {...register("secret")} />
          <FieldError>{errors.secret?.message as string}</FieldError>
        </div>
        <div>
          <FieldLabel>Notes</FieldLabel>
          <Textarea rows={2} {...register("notes")} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? "Save changes" : "Add credential"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

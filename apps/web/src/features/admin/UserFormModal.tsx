import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FieldError, FieldLabel, Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ASSIGNABLE_USER_ROLES } from "@/types/api";
import { useCreateUser, useUpdateUser } from "./api";
import type { AdminUser } from "@/types/api";

const ROLE_LABEL: Record<string, string> = { admin: "Admin", manager: "Manager", member: "Member" };

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  user?: AdminUser | null;
}

export function UserFormModal({ open, onClose, user }: UserFormModalProps) {
  const isEdit = !!user;
  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    email: isEdit ? z.string().optional() : z.string().min(1, "Email is required").email("Enter a valid email"),
    password: isEdit ? z.string().optional() : z.string().min(8, "Must be at least 8 characters"),
    role: z.enum(ASSIGNABLE_USER_ROLES),
    department: z.string().optional(),
    jobTitle: z.string().optional(),
  });
  type FormValues = z.infer<typeof schema>;

  const createUser = useCreateUser();
  const updateUser = useUpdateUser(user?.id ?? "");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      role: (user?.role === "super_admin" ? "admin" : user?.role) ?? "member",
      department: user?.department ?? "",
      jobTitle: user?.jobTitle ?? "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEdit) {
        await updateUser.mutateAsync({
          name: values.name,
          role: values.role,
          department: values.department,
          jobTitle: values.jobTitle,
        });
        toast.success("User updated");
      } else {
        await createUser.mutateAsync({
          name: values.name,
          email: values.email!,
          password: values.password!,
          role: values.role,
          department: values.department,
          jobTitle: values.jobTitle,
        });
        toast.success(`${values.name} was added — share the temporary password with them directly.`);
      }
      reset();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        (isEdit ? "Failed to update user" : "Failed to add user");
      toast.error(message);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit User" : "Invite User"} size="md">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <FieldLabel required>Full name</FieldLabel>
          <Input invalid={!!errors.name} {...register("name")} />
          <FieldError>{errors.name?.message}</FieldError>
        </div>
        {!isEdit && (
          <>
            <div>
              <FieldLabel required>Email</FieldLabel>
              <Input type="email" invalid={!!errors.email} {...register("email")} />
              <FieldError>{errors.email?.message}</FieldError>
            </div>
            <div>
              <FieldLabel required>Temporary password</FieldLabel>
              <Input type="password" invalid={!!errors.password} {...register("password")} />
              <FieldError>{errors.password?.message}</FieldError>
              <p className="mt-1 text-xs text-text-tertiary">
                Share this with the new user directly — Pulse doesn't send invite emails in this demo.
              </p>
            </div>
          </>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Department</FieldLabel>
            <Input {...register("department")} />
          </div>
          <div>
            <FieldLabel>Job title</FieldLabel>
            <Input {...register("jobTitle")} />
          </div>
        </div>
        <div>
          <FieldLabel required>Role</FieldLabel>
          <Select {...register("role")}>
            {ASSIGNABLE_USER_ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? "Save changes" : "Add user"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

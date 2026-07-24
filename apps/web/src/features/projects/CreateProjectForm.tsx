import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { FieldError, FieldLabel, Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { TagInput } from "@/components/ui/TagInput";
import { FileDropzone, type StagedFile } from "@/components/ui/FileDropzone";
import { useUsers } from "@/lib/queries/users";
import { useClients } from "@/features/clients/api";
import { useCreateProject, useUploadAttachment } from "./api";
import { PROJECT_PRIORITIES, PROJECT_STATUSES } from "@/types/api";

const projectFormSchema = z.object({
  title: z.string().min(1, "Project title is required").max(160, "Keep the title under 160 characters"),
  description: z.string().optional(),
  clientId: z.string().optional(),
  priority: z.enum(PROJECT_PRIORITIES),
  status: z.enum(PROJECT_STATUSES),
  dueDate: z.string().optional(),
  estimatedHours: z
    .union([z.coerce.number().min(0, "Must be zero or greater"), z.literal("")])
    .optional(),
  notes: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

const STATUS_LABEL: Record<string, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  in_review: "In Review",
  completed: "Completed",
  blocked: "Blocked",
};

const PRIORITY_LABEL: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

interface CreateProjectFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateProjectForm({ onSuccess, onCancel }: CreateProjectFormProps) {
  const { data: users } = useUsers();
  const { data: clients } = useClients();
  const createProject = useCreateProject();
  const uploadAttachment = useUploadAttachment();

  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [files, setFiles] = useState<StagedFile[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [uploadingAttachments, setUploadingAttachments] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      clientId: "",
      priority: "medium",
      status: "not_started",
      dueDate: "",
      estimatedHours: "",
      notes: "",
    },
  });

  const busy = isSubmitting || uploadingAttachments;

  const onSubmit = async (values: ProjectFormValues) => {
    setServerError(null);
    try {
      const project = await createProject.mutateAsync({
        title: values.title,
        description: values.description || undefined,
        clientId: values.clientId || null,
        priority: values.priority,
        status: values.status,
        dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
        estimatedHours: values.estimatedHours === "" ? null : Number(values.estimatedHours),
        notes: values.notes || undefined,
        assigneeIds,
        tags,
      });

      if (files.length > 0) {
        setUploadingAttachments(true);
        const results = await Promise.allSettled(
          files.map((sf) =>
            uploadAttachment.mutateAsync({
              projectId: project.id,
              file: sf.file,
              onProgress: () => undefined,
            }),
          ),
        );
        setUploadingAttachments(false);
        const failed = results.filter((r) => r.status === "rejected").length;
        if (failed > 0) {
          toast.warning(`Project created, but ${failed} attachment${failed > 1 ? "s" : ""} failed to upload.`);
        }
      }

      toast.success(`"${project.title}" created successfully`);
      onSuccess();
    } catch {
      setServerError("Something went wrong creating this project. Please try again.");
    }
  };

  const userOptions = (users ?? []).map((u) => ({ id: u.id, label: u.name, sublabel: u.department ?? undefined, avatarUrl: u.avatarUrl }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && (
        <div className="flex items-start gap-2 rounded-md border border-danger-100 bg-danger-50 px-3 py-2.5 text-sm text-danger-700 dark:border-danger-500/20 dark:bg-danger-500/10 dark:text-danger-500">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <div className="flex-1">
            <p>{serverError}</p>
          </div>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-1 text-xs font-semibold underline underline-offset-2"
          >
            <RotateCcw className="h-3 w-3" /> Retry
          </button>
        </div>
      )}

      <div>
        <FieldLabel required>Project Title</FieldLabel>
        <Input invalid={!!errors.title} placeholder="e.g. Meridian Retail — Loyalty Revamp" {...register("title")} />
        <FieldError>{errors.title?.message}</FieldError>
      </div>

      <div>
        <FieldLabel>Description</FieldLabel>
        <Textarea rows={3} placeholder="What is this project about?" {...register("description")} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>Client</FieldLabel>
          <Select {...register("clientId")}>
            <option value="">No client (internal)</option>
            {(clients ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel>Due Date</FieldLabel>
          <Input type="date" {...register("dueDate")} />
        </div>
        <div>
          <FieldLabel>Priority</FieldLabel>
          <Select {...register("priority")}>
            {PROJECT_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABEL[p]}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel>Status</FieldLabel>
          <Select {...register("status")}>
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <FieldLabel>Assign Team Members</FieldLabel>
        <MultiSelect options={userOptions} value={assigneeIds} onChange={setAssigneeIds} placeholder="Select team members…" />
      </div>

      <div>
        <FieldLabel>Tags</FieldLabel>
        <TagInput value={tags} onChange={setTags} placeholder="Add a tag and press Enter…" />
      </div>

      <div>
        <FieldLabel>Estimated Hours</FieldLabel>
        <Controller
          control={control}
          name="estimatedHours"
          render={({ field }) => (
            <Input
              type="number"
              min={0}
              step={1}
              placeholder="e.g. 120"
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
              invalid={!!errors.estimatedHours}
              className="max-w-[160px]"
            />
          )}
        />
        <FieldError>{errors.estimatedHours?.message as string}</FieldError>
      </div>

      <div>
        <FieldLabel>Attachments</FieldLabel>
        <FileDropzone files={files} onChange={setFiles} disabled={busy} />
      </div>

      <div>
        <FieldLabel>Notes</FieldLabel>
        <Textarea rows={2} placeholder="Internal notes, context, links…" {...register("notes")} />
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button type="submit" loading={busy} disabled={!isValid || busy}>
          {uploadingAttachments ? "Uploading files…" : isSubmitting ? "Creating…" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}

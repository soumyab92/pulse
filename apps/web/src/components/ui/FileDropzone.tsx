import { useRef, useState } from "react";
import { AlertCircle, CheckCircle2, File as FileIcon, Loader2, UploadCloud, X } from "lucide-react";
import { formatFileSize } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export interface StagedFile {
  id: string;
  file: File;
  status?: "pending" | "uploading" | "done" | "error";
  progress?: number;
  error?: string;
}

interface FileDropzoneProps {
  files: StagedFile[];
  onChange: (files: StagedFile[]) => void;
  disabled?: boolean;
}

const MAX_SIZE = 10 * 1024 * 1024;

export function FileDropzone({ files, onChange, disabled }: FileDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const next: StagedFile[] = Array.from(fileList)
      .filter((f) => f.size <= MAX_SIZE)
      .map((file) => ({ id: crypto.randomUUID(), file, status: "pending" as const }));
    onChange([...files, ...next]);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!disabled) addFiles(e.dataTransfer.files);
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border border-dashed px-4 py-6 text-center transition-colors duration-150",
          dragging ? "border-brand-500 bg-brand-50 dark:bg-brand-900/10" : "border-border-strong bg-bg",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <UploadCloud className="h-5 w-5 text-text-tertiary" aria-hidden="true" />
        <p className="text-sm text-text-secondary">
          <span className="font-medium text-brand-600 dark:text-brand-400">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-text-tertiary">PDF, DOC, XLS, images up to 10MB</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          disabled={disabled}
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((sf) => (
            <li
              key={sf.id}
              className="flex items-center gap-2.5 rounded-md border border-border bg-surface px-3 py-2 text-sm"
            >
              <FileIcon className="h-4 w-4 shrink-0 text-text-tertiary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-text-primary">{sf.file.name}</p>
                <p className="text-xs text-text-tertiary">{formatFileSize(sf.file.size)}</p>
              </div>
              {sf.status === "uploading" && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-600" />}
              {sf.status === "done" && <CheckCircle2 className="h-4 w-4 shrink-0 text-success-600" />}
              {sf.status === "error" && <AlertCircle className="h-4 w-4 shrink-0 text-danger-600" />}
              {(!sf.status || sf.status === "pending") && !disabled && (
                <button
                  type="button"
                  onClick={() => onChange(files.filter((f) => f.id !== sf.id))}
                  className="shrink-0 rounded-md p-1 text-text-tertiary hover:bg-bg hover:text-text-primary"
                  aria-label={`Remove ${sf.file.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

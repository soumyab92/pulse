import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-9 w-full rounded-md border bg-surface px-3 text-sm text-text-primary placeholder:text-text-tertiary transition-colors duration-150",
        "focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500",
        invalid ? "border-danger-500" : "border-border",
        "disabled:cursor-not-allowed disabled:bg-bg disabled:text-text-tertiary",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-md border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary transition-colors duration-150",
      "focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500",
      invalid ? "border-danger-500" : "border-border",
      "disabled:cursor-not-allowed disabled:bg-bg disabled:text-text-tertiary",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-text-primary">
      {children}
      {required && <span className="text-danger-600 ml-0.5">*</span>}
    </label>
  );
}

export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-1 text-xs text-danger-600">{children}</p>;
}

import { useEffect, useRef, useState } from "react";
import { Copy, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRevealCredential } from "./api";
import type { Credential } from "@/types/api";

const AUTO_HIDE_MS = 15_000;

export function CredentialSecretCell({ credential }: { credential: Credential }) {
  const [revealed, setRevealed] = useState<string | null>(null);
  const reveal = useRevealCredential();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  async function handleToggle() {
    if (revealed) {
      setRevealed(null);
      clearTimeout(timeoutRef.current);
      return;
    }
    try {
      const secret = await reveal.mutateAsync(credential.id);
      setRevealed(secret);
      timeoutRef.current = setTimeout(() => setRevealed(null), AUTO_HIDE_MS);
    } catch {
      toast.error("Failed to reveal secret");
    }
  }

  async function handleCopy() {
    if (!revealed) return;
    await navigator.clipboard.writeText(revealed);
    toast.success("Copied to clipboard");
  }

  return (
    <div className="flex items-center gap-2 font-mono text-xs">
      <span className={revealed ? "text-text-primary" : "text-text-tertiary"}>{revealed ?? credential.maskedSecret}</span>
      <button
        onClick={handleToggle}
        aria-label={revealed ? "Hide secret" : "Reveal secret"}
        className="rounded-md p-1 text-text-tertiary hover:bg-bg hover:text-text-primary"
      >
        {reveal.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </button>
      {revealed && (
        <button onClick={handleCopy} aria-label="Copy secret" className="rounded-md p-1 text-text-tertiary hover:bg-bg hover:text-text-primary">
          <Copy className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

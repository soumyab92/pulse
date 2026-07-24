import { useEffect } from "react";

export function useHotkey(key: string, handler: () => void, options?: { meta?: boolean }) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const metaOrCtrl = e.metaKey || e.ctrlKey;
      if (e.key.toLowerCase() === key.toLowerCase() && (!options?.meta || metaOrCtrl)) {
        e.preventDefault();
        handler();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, handler, options?.meta]);
}

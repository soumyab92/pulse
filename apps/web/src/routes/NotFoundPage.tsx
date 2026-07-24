import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-4 text-center">
      <p className="text-sm font-medium text-text-tertiary">404</p>
      <h1 className="text-xl font-semibold text-text-primary">Page not found</h1>
      <p className="text-sm text-text-tertiary">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard">
        <Button className="mt-2">Back to Dashboard</Button>
      </Link>
    </div>
  );
}

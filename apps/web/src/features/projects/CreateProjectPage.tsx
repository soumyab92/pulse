import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { CreateProjectForm } from "./CreateProjectForm";

export function CreateProjectPage() {
  const navigate = useNavigate();
  const goBack = () => navigate("/projects");

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={goBack}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </button>
      <h1 className="mb-1 text-xl font-semibold tracking-tight text-text-primary">Create Project</h1>
      <p className="mb-6 text-sm text-text-tertiary">Set up a new project and assign your team.</p>
      <Card>
        <CardContent>
          <CreateProjectForm onSuccess={goBack} onCancel={goBack} />
        </CardContent>
      </Card>
    </div>
  );
}

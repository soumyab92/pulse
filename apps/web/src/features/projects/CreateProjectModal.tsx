import { useNavigate } from "react-router-dom";
import { Modal } from "@/components/ui/Modal";
import { CreateProjectForm } from "./CreateProjectForm";

export function CreateProjectModal() {
  const navigate = useNavigate();
  const close = () => navigate(-1);

  return (
    <Modal open onClose={close} title="Create Project" description="Set up a new project and assign your team." size="xl">
      <CreateProjectForm onSuccess={close} onCancel={close} />
    </Modal>
  );
}

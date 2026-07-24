import fs from "fs";
import path from "path";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../middleware/errorHandler";
import { uploadRoot } from "../../middleware/upload";

export async function addAttachment(projectId: string, file: Express.Multer.File) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    fs.unlink(file.path, () => undefined);
    throw new ApiError(404, "Project not found");
  }

  return prisma.attachment.create({
    data: {
      projectId,
      fileName: file.originalname,
      storedName: file.filename,
      mimeType: file.mimetype,
      sizeBytes: file.size,
    },
  });
}

export async function getAttachmentPath(projectId: string, attachmentId: string) {
  const attachment = await prisma.attachment.findFirst({ where: { id: attachmentId, projectId } });
  if (!attachment) throw new ApiError(404, "Attachment not found");
  return { attachment, filePath: path.join(uploadRoot, attachment.storedName) };
}

export async function deleteAttachment(projectId: string, attachmentId: string) {
  const { attachment, filePath } = await getAttachmentPath(projectId, attachmentId);
  await prisma.attachment.delete({ where: { id: attachment.id } });
  fs.unlink(filePath, () => undefined);
}

import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { upload } from "../../middleware/upload";
import { createProjectSchema, projectQuerySchema, updateProjectSchema } from "./projects.schema";
import * as projectsService from "./projects.service";
import * as attachmentsService from "./attachments.service";

export const projectsRouter = Router();

projectsRouter.use(requireAuth);

projectsRouter.get("/", async (req, res, next) => {
  try {
    const query = projectQuerySchema.parse(req.query);
    res.json(await projectsService.listProjects(query));
  } catch (err) {
    next(err);
  }
});

projectsRouter.get("/mine", async (req, res, next) => {
  try {
    const query = projectQuerySchema.parse(req.query);
    res.json(await projectsService.listProjects(query, req.user!.sub));
  } catch (err) {
    next(err);
  }
});

projectsRouter.post("/", async (req, res, next) => {
  try {
    const input = createProjectSchema.parse(req.body);
    res.status(201).json(await projectsService.createProject(input, req.user!.sub));
  } catch (err) {
    next(err);
  }
});

projectsRouter.get("/:id", async (req, res, next) => {
  try {
    res.json(await projectsService.getProject(req.params.id));
  } catch (err) {
    next(err);
  }
});

projectsRouter.patch("/:id", async (req, res, next) => {
  try {
    const input = updateProjectSchema.parse(req.body);
    res.json(await projectsService.updateProject(req.params.id, input));
  } catch (err) {
    next(err);
  }
});

projectsRouter.delete("/:id", async (req, res, next) => {
  try {
    await projectsService.deleteProject(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

projectsRouter.post("/:id/attachments", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });
    const attachment = await attachmentsService.addAttachment(req.params.id, req.file);
    res.status(201).json(attachment);
  } catch (err) {
    next(err);
  }
});

projectsRouter.get("/:id/attachments/:attachmentId/download", async (req, res, next) => {
  try {
    const { attachment, filePath } = await attachmentsService.getAttachmentPath(
      req.params.id,
      req.params.attachmentId,
    );
    res.download(filePath, attachment.fileName);
  } catch (err) {
    next(err);
  }
});

projectsRouter.delete("/:id/attachments/:attachmentId", async (req, res, next) => {
  try {
    await attachmentsService.deleteAttachment(req.params.id, req.params.attachmentId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { createCredentialSchema, updateCredentialSchema } from "./credentials.schema";
import * as credentialsService from "./credentials.service";

export const credentialsRouter = Router();

credentialsRouter.use(requireAuth);

credentialsRouter.get("/", async (_req, res, next) => {
  try {
    res.json(await credentialsService.listCredentials());
  } catch (err) {
    next(err);
  }
});

credentialsRouter.post("/", async (req, res, next) => {
  try {
    const input = createCredentialSchema.parse(req.body);
    res.status(201).json(await credentialsService.createCredential(input));
  } catch (err) {
    next(err);
  }
});

credentialsRouter.patch("/:id", async (req, res, next) => {
  try {
    const input = updateCredentialSchema.parse(req.body);
    res.json(await credentialsService.updateCredential(req.params.id, input));
  } catch (err) {
    next(err);
  }
});

credentialsRouter.delete("/:id", async (req, res, next) => {
  try {
    await credentialsService.deleteCredential(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

credentialsRouter.post("/:id/reveal", async (req, res, next) => {
  try {
    res.json(await credentialsService.revealCredential(req.params.id));
  } catch (err) {
    next(err);
  }
});

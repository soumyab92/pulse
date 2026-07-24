import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { createClientSchema, updateClientSchema } from "./clients.schema";
import * as clientsService from "./clients.service";

export const clientsRouter = Router();

clientsRouter.use(requireAuth);

clientsRouter.get("/", async (req, res, next) => {
  try {
    res.json(await clientsService.listClients(req.query.q as string | undefined));
  } catch (err) {
    next(err);
  }
});

clientsRouter.post("/", async (req, res, next) => {
  try {
    const input = createClientSchema.parse(req.body);
    res.status(201).json(await clientsService.createClient(input));
  } catch (err) {
    next(err);
  }
});

clientsRouter.get("/:id", async (req, res, next) => {
  try {
    res.json(await clientsService.getClient(req.params.id));
  } catch (err) {
    next(err);
  }
});

clientsRouter.patch("/:id", async (req, res, next) => {
  try {
    const input = updateClientSchema.parse(req.body);
    res.json(await clientsService.updateClient(req.params.id, input));
  } catch (err) {
    next(err);
  }
});

clientsRouter.delete("/:id", async (req, res, next) => {
  try {
    await clientsService.deleteClient(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

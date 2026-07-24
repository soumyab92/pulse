import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import * as dashboardService from "./dashboard.service";

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);

dashboardRouter.get("/kpis", async (_req, res, next) => {
  try {
    res.json(await dashboardService.getKpis());
  } catch (err) {
    next(err);
  }
});

dashboardRouter.get("/productivity-trend", async (req, res, next) => {
  try {
    res.json(await dashboardService.getProductivityTrend(req.query.range as string | undefined));
  } catch (err) {
    next(err);
  }
});

dashboardRouter.get("/team-comparison", async (_req, res, next) => {
  try {
    res.json(await dashboardService.getTeamComparison());
  } catch (err) {
    next(err);
  }
});

dashboardRouter.get("/task-status-distribution", async (_req, res, next) => {
  try {
    res.json(await dashboardService.getTaskStatusDistribution());
  } catch (err) {
    next(err);
  }
});

dashboardRouter.get("/workload-distribution", async (_req, res, next) => {
  try {
    res.json(await dashboardService.getWorkloadDistribution());
  } catch (err) {
    next(err);
  }
});

dashboardRouter.get("/productivity-heatmap", async (req, res, next) => {
  try {
    res.json(await dashboardService.getProductivityHeatmap(req.query.weeks as string | undefined));
  } catch (err) {
    next(err);
  }
});

dashboardRouter.get("/attendance-trend", async (req, res, next) => {
  try {
    res.json(await dashboardService.getAttendanceTrend(req.query.range as string | undefined));
  } catch (err) {
    next(err);
  }
});

dashboardRouter.get("/activity-feed", async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    res.json(await dashboardService.getActivityFeed(limit));
  } catch (err) {
    next(err);
  }
});

dashboardRouter.get("/ai-insights", async (_req, res, next) => {
  try {
    res.json(await dashboardService.getAiInsights());
  } catch (err) {
    next(err);
  }
});

dashboardRouter.get("/project-overview", async (_req, res, next) => {
  try {
    res.json(await dashboardService.getProjectOverview());
  } catch (err) {
    next(err);
  }
});

dashboardRouter.get("/employee-performance", async (req, res, next) => {
  try {
    const query = {
      q: req.query.q as string | undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
      sortBy: (req.query.sortBy as string) || "avgProductivity",
      sortDir: (req.query.sortDir as "asc" | "desc") || "desc",
    };
    res.json(await dashboardService.getEmployeePerformance(query));
  } catch (err) {
    next(err);
  }
});

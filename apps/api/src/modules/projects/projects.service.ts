import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../middleware/errorHandler";
import { CreateProjectInput, ProjectQueryInput, UpdateProjectInput } from "./projects.schema";

const projectInclude = {
  client: true,
  assignments: { include: { user: { select: { id: true, name: true, avatarUrl: true } } } },
  tags: { include: { tag: true } },
  attachments: true,
} satisfies Prisma.ProjectInclude;

function shapeProject(project: Prisma.ProjectGetPayload<{ include: typeof projectInclude }>) {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    priority: project.priority,
    status: project.status,
    dueDate: project.dueDate,
    estimatedHours: project.estimatedHours,
    notes: project.notes,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    client: project.client,
    assignees: project.assignments.map((a) => a.user),
    tags: project.tags.map((t) => t.tag.name),
    attachments: project.attachments,
  };
}

function buildWhere(query: Partial<ProjectQueryInput> & { assigneeId?: string }): Prisma.ProjectWhereInput {
  const where: Prisma.ProjectWhereInput = {};

  if (query.q) {
    where.title = { contains: query.q };
  }
  if (query.status) where.status = query.status;
  if (query.priority) where.priority = query.priority;
  if (query.clientId) where.clientId = query.clientId;
  if (query.assigneeId) {
    where.assignments = { some: { userId: query.assigneeId } };
  }
  if (query.dueBefore || query.dueAfter) {
    where.dueDate = {
      ...(query.dueBefore ? { lte: new Date(query.dueBefore) } : {}),
      ...(query.dueAfter ? { gte: new Date(query.dueAfter) } : {}),
    };
  }

  return where;
}

export async function listProjects(query: ProjectQueryInput, assigneeId?: string) {
  const where = buildWhere({ ...query, assigneeId });
  const [total, items] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.findMany({
      where,
      include: projectInclude,
      orderBy: { [query.sortBy]: query.sortDir },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
  ]);

  return {
    items: items.map(shapeProject),
    total,
    page: query.page,
    pageSize: query.pageSize,
    totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
  };
}

export async function getProject(id: string) {
  const project = await prisma.project.findUnique({ where: { id }, include: projectInclude });
  if (!project) throw new ApiError(404, "Project not found");
  return shapeProject(project);
}

async function ensureTags(tagNames: string[]) {
  const unique = Array.from(new Set(tagNames.map((t) => t.trim()).filter(Boolean)));
  const tags = await Promise.all(
    unique.map((name) =>
      prisma.tag.upsert({ where: { name }, update: {}, create: { name } }),
    ),
  );
  return tags;
}

export async function createProject(input: CreateProjectInput, createdById: string) {
  const tags = await ensureTags(input.tags);

  const project = await prisma.project.create({
    data: {
      title: input.title,
      description: input.description,
      clientId: input.clientId || null,
      priority: input.priority,
      status: input.status,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      estimatedHours: input.estimatedHours ?? null,
      notes: input.notes,
      createdById,
      assignments: {
        create: input.assigneeIds.map((userId) => ({ userId })),
      },
      tags: {
        create: tags.map((tag) => ({ tagId: tag.id })),
      },
    },
    include: projectInclude,
  });

  await prisma.activityEvent.create({
    data: {
      userId: createdById,
      type: "project_created",
      message: `created project "${project.title}"`,
      entityType: "project",
      entityId: project.id,
    },
  });

  return shapeProject(project);
}

export async function updateProject(id: string, input: UpdateProjectInput) {
  await getProject(id);

  const data: Prisma.ProjectUpdateInput = {
    title: input.title,
    description: input.description,
    priority: input.priority,
    status: input.status,
    dueDate: input.dueDate === undefined ? undefined : input.dueDate ? new Date(input.dueDate) : null,
    estimatedHours: input.estimatedHours ?? undefined,
    notes: input.notes,
  };

  if (input.clientId !== undefined) {
    data.client = input.clientId ? { connect: { id: input.clientId } } : { disconnect: true };
  }

  if (input.assigneeIds) {
    await prisma.projectAssignment.deleteMany({ where: { projectId: id } });
    data.assignments = { create: input.assigneeIds.map((userId) => ({ userId })) };
  }

  if (input.tags) {
    const tags = await ensureTags(input.tags);
    await prisma.projectTag.deleteMany({ where: { projectId: id } });
    data.tags = { create: tags.map((tag) => ({ tagId: tag.id })) };
  }

  const project = await prisma.project.update({ where: { id }, data, include: projectInclude });
  return shapeProject(project);
}

export async function deleteProject(id: string) {
  await getProject(id);
  await prisma.project.delete({ where: { id } });
}

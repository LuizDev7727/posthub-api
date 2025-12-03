import { db } from "@/infra/database/drizzle/client";
import { bestMomentsTable } from "@/infra/database/drizzle/tables/best-moments.table";
import { projectsTable } from "@/infra/database/drizzle/tables/projects.table";
import { usersTable } from "@/infra/database/drizzle/tables/users.table";
import { and, count, desc, eq, lt } from "drizzle-orm";

type GetProjectsParams = {
  organizationSlug: string;
  cursor: string | undefined;
  limit: number;
};

type GetProjectsResponse = {
  projects: {
    id: string;
    thumbnailUrl: string | null;
    title: string;
    createdAt: Date;
    totalClips: number;
    status: "SUCCESS" | "SCHEDULED" | "ERROR" | "PROCESSING";
    owner: {
      name: string;
      avatarUrl: string | null;
    };
  }[];
  nextCursor: string | null;
};

export async function getProjects(
  params: GetProjectsParams,
): Promise<GetProjectsResponse> {
  const { cursor, organizationSlug, limit } = params;

  const projects = await db
    .select({
      id: projectsTable.id,
      thumbnailUrl: projectsTable.thumbnailUrl,
      title: projectsTable.title,
      createdAt: projectsTable.createdAt,
      status: projectsTable.status,
      totalClips: count(bestMomentsTable),
      owner: {
        name: usersTable.name,
        avatarUrl: usersTable.image,
      },
    })
    .from(projectsTable)
    .innerJoin(usersTable, eq(projectsTable.ownerId, usersTable.id))
    .innerJoin(
      bestMomentsTable,
      eq(bestMomentsTable.projectId, projectsTable.id),
    )
    .where(
      and(
        eq(projectsTable.organizationSlug, organizationSlug),
        cursor ? lt(projectsTable.id, cursor) : undefined,
      ),
    )
    .orderBy(desc(projectsTable.id))
    .limit(limit + 1);

  const hasMore = projects.length > limit;
  const items = hasMore ? projects.slice(0, limit) : projects;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return {
    projects,
    nextCursor,
  };
}

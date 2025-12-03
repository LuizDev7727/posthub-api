import { db } from "@/infra/database/drizzle/client";
import { membersTable } from "@/infra/database/drizzle/tables/members.table";
import { organizationsTable } from "@/infra/database/drizzle/tables/organizations.table";
import { postsTable } from "@/infra/database/drizzle/tables/posts.table";
import { usersTable } from "@/infra/database/drizzle/tables/users.table";
import { sql, sum } from "drizzle-orm";
import { count } from "drizzle-orm";
import { eq } from "drizzle-orm";

type GetOrganizationsParams = {
  ownerId: string;
};

type GetOrganizationsResponse = {
  organizations: {
    id: string;
    name: string;
    slug: string;
    avatarUrl: string | null;
    createdAt: Date;
    plan: "FREE" | "PRO" | "PREMIUM";
    owner: {
      name: string;
      avatarUrl: string | null;
    };
    postsCount: number;
    storageCount: number;
  }[];
};

export async function getOrganizations({
  ownerId,
}: GetOrganizationsParams): Promise<GetOrganizationsResponse> {
  const organizations = await db
    .select({
      id: organizationsTable.id,
      name: organizationsTable.name,
      slug: organizationsTable.slug,
      avatarUrl: organizationsTable.logo,
      createdAt: organizationsTable.createdAt,
      plan: organizationsTable.plan,
      owner: {
        name: usersTable.name,
        avatarUrl: usersTable.image,
      },
      postsCount: count(postsTable.id),
      storageCount: sql`COALESCE(${sum(postsTable.size)}, 0)::bigint`.mapWith(
        Number,
      ),
    })
    .from(organizationsTable)
    .innerJoin(
      membersTable,
      eq(membersTable.organizationId, organizationsTable.id),
    )
    .innerJoin(
      usersTable,
      sql`${organizationsTable.metadata}::jsonb ->> 'ownerId' = ${usersTable.id}`,
    )
    .leftJoin(postsTable, eq(organizationsTable.id, postsTable.organizationId))
    .where(eq(membersTable.userId, ownerId))
    .groupBy(
      organizationsTable.id,
      organizationsTable.name,
      organizationsTable.slug,
      organizationsTable.logo,
      organizationsTable.createdAt,
      usersTable.name,
      usersTable.image,
    );

  return {
    organizations,
  };
}

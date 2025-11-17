import { db } from "@/infra/database/drizzle/client"
import { organizationsTable } from "@/infra/database/drizzle/tables/organizations.table"
import { eq } from "drizzle-orm"

type GetOrganizationsParams = {
  ownerId:string
}

type GetOrganizationsResponse = {
  organizations: {
    name:string
    slug:string
    avatarUrl: string| null
    plan: "FREE" | "PRO" | "PREMIUM"
  }[]
}

export async function getOrganizations({ ownerId }:GetOrganizationsParams): Promise<GetOrganizationsResponse> {
  const organizations = await db
  .select({
    name: organizationsTable.name,
    slug: organizationsTable.slug,
    avatarUrl: organizationsTable.logo,
    plan: organizationsTable.plan
  })
  .from(organizationsTable)
  .where(
    eq(organizationsTable.ownerId, ownerId)
  )

  return {
    organizations
  }
}
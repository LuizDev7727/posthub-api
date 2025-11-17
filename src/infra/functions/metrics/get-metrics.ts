import { db } from "@/infra/database/drizzle/client"
import { integrationsTable } from "@/infra/database/drizzle/tables/integrations.table"
import { membersTable } from "@/infra/database/drizzle/tables/members.table"
import { organizationsTable } from "@/infra/database/drizzle/tables/organizations.table"
import { postsTable } from "@/infra/database/drizzle/tables/posts.table"
import { dayjs } from "@/lib/dayjs"
import { and, count, eq, gte, sum } from "drizzle-orm"

type GetMetricsParams = {
  organizationId:string
}

type GetMetricsResponse = {
  totalPosts: number
  totalMembers: number
  totalIntegrations: number
  usage: {
    totalStorage: number
    totalMonthlyBandwidth: number
  }
}

export async function getMetrics({ organizationId }:GetMetricsParams): Promise<GetMetricsResponse> {
  
  const [
    [{ totalPosts }],
    [{ totalMembers }],
    [{ totalIntegrations }],
    [{ totalStorage }],
    [{ totalMonthlyBandwidth }],
  ] = await Promise.all([
    db
    .select({
      totalPosts: count()
    })
    .from(postsTable)
    .where(
      eq(postsTable.organizationId, organizationId)
    ),

    db
    .select({
      totalMembers: count()
    })
    .from(membersTable)
    .where(
      eq(membersTable.organizationId, organizationId)
    ),
    
    db
    .select({
      totalIntegrations: count()
    })
    .from(integrationsTable)
    .where(
      eq(integrationsTable.organizationId, organizationId)
    ),

    db
    .select({
      totalStorage: sum(postsTable.size).mapWith(Number)
    })
    .from(postsTable)
    .where(
      and (
        eq(postsTable.organizationId, organizationId)
      )
    ),
    
    db
    .select({
      totalMonthlyBandwidth: sum(postsTable.size).mapWith(Number)
    })
    .from(postsTable)
    .where(
      and (
        gte(postsTable.createdAt, dayjs().subtract(30, 'days').toDate()),
        eq(postsTable.organizationId, organizationId)
      )
    )

  ])

  return {
    totalPosts,
    totalIntegrations,
    totalMembers,
    usage: {
      totalMonthlyBandwidth,
      totalStorage
    }
  }
}
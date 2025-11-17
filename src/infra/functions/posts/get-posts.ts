import { db } from "@/infra/database/drizzle/client"
import { postsTable } from "@/infra/database/drizzle/tables/posts.table"
import { socialsToPostTable } from "@/infra/database/drizzle/tables/socials-to-post.table"
import { usersTable } from "@/infra/database/drizzle/tables/users.table"
import { and, desc, eq, like, sql } from "drizzle-orm"

type GetPostsParams = {
  organizationId:string,
  titleFilter: string | undefined,
  statusFilter: 'SUCCESS' | 'PROCESSING' | 'SCHEDULED' | 'ERROR'| undefined,
  pageSize: number
  pageIndex: number
}

type GetPostsResponse = {
  posts: {
    thumbnailUrl:string
    title:string
    status: 'SUCCESS' | 'PROCESSING' | 'SCHEDULED' | 'ERROR'
    duration:number
    size:number
    scheduledTo: Date | null
    socialsToPost: {
      social: string
    }[]
    author: {
      name: string
      avatarUrl: string | null
    }
  }[]
}

export async function getPosts(params:GetPostsParams): Promise<GetPostsResponse> {

  const {
    organizationId,
    statusFilter,
    titleFilter,
    pageIndex,
    pageSize
  } = params

  const posts = await db
  .select({
    id: postsTable.id,
    thumbnailUrl: postsTable.thumbnailUrl,
    title: postsTable.title,
    size: postsTable.size,
    status: postsTable.status,
    scheduledTo: postsTable.scheduledTo,
    duration: postsTable.duration,
    createdAt: postsTable.createdAt,
    socialsToPost: sql<{ social: string }[]>`
      json_agg(
        json_build_object(
          'social', ${socialsToPostTable.social}
        )
      )
    `.as("socialsToPost"),
    author: {
      name: usersTable.name,
      avatarUrl: usersTable.image,
    }
  })
  .from(postsTable)
  .where(
    and(
      eq(postsTable.organizationId, organizationId),
      titleFilter ? like(postsTable.title, `%${titleFilter}%`) : undefined,
      statusFilter ? eq(postsTable.status, statusFilter) : undefined,
    )
  )
  .innerJoin(socialsToPostTable, eq(postsTable.id, socialsToPostTable.postId))
  .innerJoin(usersTable, eq(postsTable.ownerId, usersTable.id))
  .orderBy(desc(postsTable.createdAt))
  .offset(pageIndex * pageSize)
  .limit(pageSize)
  .groupBy(postsTable.id, usersTable.name, usersTable.image);

  return {
    posts
  }
}
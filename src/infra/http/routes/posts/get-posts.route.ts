import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { checkRequestSession } from "../../middleware/check-request-session"
import { z } from 'zod'
import { getPosts } from "@/infra/functions/posts/get-posts"

export const getPostsRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/organizations/:id/posts', {
    preHandler: [
      checkRequestSession,
    ],
    schema: {
      tags: ['posts'],
      summary: 'Get all posts from organization',
      params: z.object({
        id: z.string()
      }),
      querystring: z.object({
        titleFilter: z.string().optional(),
        statusFilter: z.enum(['SUCCESS', 'SCHEDULED', 'ERROR', 'PROCESSING']).optional(),
        pageSize: z.number(),
        pageIndex: z.number(),
      }),
      response: {
        200: z.object(
          {
            posts: z.array(
              z.object({
                thumbnailUrl: z.url(),
                title: z.string(),
                status: z.string(),
                size: z.number(),
                duration: z.number(),
                scheduledTo: z.date().nullable(),
                socialsToPost: z.array(
                  z.object({
                    social: z.string()
                  })
                ),
                author: z.object({
                  name: z.string(),
                  avatarUrl: z.url().nullable(),
                })
              })
            )
          }
        )
      }
    },
  }, async (request, reply) => {

    const { id } = request.params
    const { titleFilter, statusFilter, pageIndex, pageSize } = request.query

    const { posts } = await getPosts({
      organizationId: id,
      pageIndex,
      pageSize,
      titleFilter,
      statusFilter
    })

    return reply.status(200).send({
      posts
    })
  })
}
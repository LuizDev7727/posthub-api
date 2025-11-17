import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { checkRequestSession } from "../../middleware/check-request-session"
import { z } from 'zod'
import { getOrganizations } from "@/infra/functions/organizations/get-organizations"
import { getAuthenticatedUserFromRequest } from "@/utils/get-authenticated-user-from-request"

export const getOrganizationsRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/organizations', {
    preHandler: [
      checkRequestSession,
    ],
    schema: {
      tags: ['organizations'],
      summary: 'Get all organizations from user',
      response: {
        200: z.object(
          {
            organizations: z.array(
              z.object({
                name: z.string(),
                slug: z.string(),
                avatarUrl: z.string().nullable(),
                plan: z.string(),
              })
            )
          }
        )
      }
    },
  }, async (request, reply) => {

    const { id: ownerId } = getAuthenticatedUserFromRequest(request)

    const { organizations } = await getOrganizations({
      ownerId
    })

    return reply.status(200).send({ organizations })
  })
}
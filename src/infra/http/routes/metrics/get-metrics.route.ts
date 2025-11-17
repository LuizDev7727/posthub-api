import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { checkRequestSession } from "../../middleware/check-request-session"
import { z } from 'zod'
import { getOrganizations } from "@/infra/functions/organizations/get-organizations"
import { getAuthenticatedUserFromRequest } from "@/utils/get-authenticated-user-from-request"
import { getMetrics } from "@/infra/functions/metrics/get-metrics"

export const getMetricsRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/organizations/:id/metrics', {
    preHandler: [
      checkRequestSession,
    ],
    schema: {
      tags: ['metrics'],
      summary: 'Get organization metrics',
      params: z.object({
        id: z.string()
      }),
      response: {
        200: z.object(
          {
            totalPosts: z.number(),
            totalMembers: z.number(),
            totalIntegrations: z.number(),
            usage: z.object({
              totalStorage: z.number(),
              totalMonthlyBandwidth: z.number(),
            })
          }
        )
      }
    },
  }, async (request, reply) => {

    const { id } = request.params
    
    const {
      totalPosts,
      totalMembers,
      totalIntegrations,
      usage: {
        totalStorage,
        totalMonthlyBandwidth,
      }
    } = await getMetrics({
      organizationId: id
    })

    return reply.status(200).send({
      totalPosts,
      totalIntegrations,
      totalMembers,
      usage: {
        totalStorage,
        totalMonthlyBandwidth
      }
    })
  })
}
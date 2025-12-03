import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { checkRequestSession } from "../../middleware/check-request-session";
import { z } from "zod";
import { getProjects } from "@/infra/functions/projects/get-projects";

export const getProjectsRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/organizations/:slug/projects",
    {
      preHandler: [checkRequestSession],
      schema: {
        tags: ["projects"],
        summary: "Get all projects from organization",
        params: z.object({
          slug: z.string(),
        }),
        querystring: z.object({
          limit: z.coerce.number().min(1).max(100).default(20),
          cursor: z.string().optional(),
        }),
        response: {
          200: z.object({
            projects: z.array(
              z.object({
                id: z.uuidv7(),
                thumbnailUrl: z.url().nullable(),
                title: z.string(),
                status: z.string(),
                createdAt: z.date(),
                totalClips: z.number(),
                owner: z.object({
                  name: z.string(),
                  avatarUrl: z.url().nullable(),
                }),
              }),
            ),
            nextCursor: z.string().nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params;
      const { limit, cursor } = request.query;

      const { projects, nextCursor } = await getProjects({
        cursor,
        limit,
        organizationSlug: slug,
      });

      return reply.status(200).send({
        projects,
        nextCursor,
      });
    },
  );
};

import fastify from "fastify";
import { jsonSchemaTransform, validatorCompiler, serializerCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import cors from '@fastify/cors'
import { env } from "./env";
import fastifySwagger from "@fastify/swagger";
import scalar from '@scalar/fastify-api-reference'
import { authRoute } from "./infra/http/routes/auth/auth.route";
import { getOrganizationsRoute } from "./infra/http/routes/organizations/get-organizations.route";
import { getPostsRoute } from "./infra/http/routes/posts/get-posts.route";
import { getProjectsRoute } from "./infra/http/routes/projects/get-projecs.route";

const server = fastify().withTypeProvider<ZodTypeProvider>()

server.register(cors, {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:8080",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With"
  ],
  credentials: true,
  maxAge: 86400
});

if(env.NODE_ENV === 'development') {
  
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Posthub API',
        description: 'API for creating posts to social medias with thumbnail, metadata and best moments.',
        version: '1.0.0',
      }
    },
    transform: jsonSchemaTransform,
  })

  server.register(scalar, {
    routePrefix: '/api/docs'
  })
}

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

// Register authentication endpoint
server.register(authRoute)
server.register(getOrganizationsRoute)
server.register(getPostsRoute)
server.register(getProjectsRoute)

server.listen({ port: env.PORT }).then(() => {
  console.log(`💻 HTTP server running on http://localhost:${env.PORT}`)
  console.log(`📝 Docs available at http://localhost:${env.PORT}/api/docs`)
})
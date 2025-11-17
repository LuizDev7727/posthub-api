import fastify from "fastify";
import { jsonSchemaTransform, validatorCompiler, serializerCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import cors from '@fastify/cors'
import { env } from "./env";
import fastifySwagger from "@fastify/swagger";
import scalar from '@scalar/fastify-api-reference'

const server = fastify().withTypeProvider<ZodTypeProvider>()

server.register(cors,{
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
})

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

server.listen({ port: env.PORT }).then(() => {
  console.log(`💻 HTTP server running on http://localhost:${env.PORT}`)
  console.log(`📝 Docs available at http://localhost:${env.PORT}/api/docs`)
})
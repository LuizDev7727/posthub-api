import { FastifyRequest } from "fastify"
import { auth } from "../../../../auth"

export async function checkRequestSession(request: FastifyRequest) {
  const authSession = await auth.api.getSession({
    headers: request.headers
  })

  if(!authSession) {
    throw new Error('Session expired or invalid.')
  }

  const { session, user } = authSession

  if (!session || !user) {
    throw new Error('Session expired or invalid.')
  }

  request.user = {
    id: user.id
  }
}
import { db } from "@/infra/database/drizzle/client"
import { organizationsTable } from "@/infra/database/drizzle/tables/organizations.table"
import { projectsTable } from "@/infra/database/drizzle/tables/projects.table"
import { convertVideoToMp3Task } from "@/infra/trigger/convert-video-to-mp3.trigger"
import { tasks } from "@trigger.dev/sdk"
import { eq } from "drizzle-orm"

type CreateProjectParams = {
  organizationId: string
  videoUrl: string
  ownerId: string
  fileName: string
}

function getProviderByVideoUrl(videoUrl:string) {
  const videoDomain = videoUrl.split('/')[2]

  switch(videoDomain) {
    case 'www.youtube.com':
      return 'youtube'
    case 'www.cloudflare.com':
      return 'cloudflare'
  }

}

export async function createProject(params:CreateProjectParams) {

  const { organizationId, videoUrl, ownerId, fileName } = params

  const [organization] = await db
  .select()
  .from(organizationsTable)
  .where(
    eq(organizationsTable.id, params.organizationId)
  )

  if(!organization) {
    throw new Error(`Organization with id:${organizationId} not found.`)
  }
  
  const [{ projectId }] = await db
  .insert(projectsTable)
  .values({
    title: fileName,
    ownerId,
    organizationId
  }).returning({ projectId: projectsTable.id })

  const provider = getProviderByVideoUrl(
    videoUrl
  )

  // folder r2 key to save videos(best moments)
  const r2Key = `${organization.slug}/projects/${fileName}`

  const handle = await tasks.trigger<typeof convertVideoToMp3Task>(
    "convert-video-to-mp3",
    {
      videoUrl,
      pathToSaveOnR2: r2Key
    }
  )

  // convert mp4 to mp3 task com streams

  // transcrever audio task com replicate

  // usar o gemini AI para identificar os melhores moments (sem trigger)
    //pedir para ele retornar com título do clip, além do startTime, endTime e text

  // download mp4 and cut best moments
    // para cada corte que for começar, criar um bestMoments no banco de dados com título(título/mp4), e status 'PROCESSING'.
    // para cada corte que finalizar, atualizar o status do best moments para SUCCESS e fazer o upload do video cortado para o r2

}
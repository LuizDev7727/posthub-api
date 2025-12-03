import { r2Client } from "@/lib/r2";
import { logger, schemaTask } from "@trigger.dev/sdk";
import { z } from 'zod'

export const convertVideoToMp3Task = schemaTask({
  id: "convert-video-to-mp3",
  schema: z.object({
    videoUrl: z.url(),
    pathToSaveOnR2: z.string(),
  }),

  onSuccess: (data) => {},
  onFailure: () => {},
  catchError: (error) => {},

  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async ({ videoUrl , pathToSaveOnR2 }, { ctx }) => {

    logger.log('Video Url: ', { videoUrl })
    logger.log('Path to save on R2: ', { pathToSaveOnR2 })

    const audioTitle = ''
    const pathToSave = ''
    

    return {
      message: 'asdasd'
    }
  },
});
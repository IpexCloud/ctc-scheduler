import 'reflect-metadata'
import * as express from 'express'
import * as http from 'http'
import { config } from 'dotenv'

config({ path: './env/.env' })

import logger from './utils/logger/logger'
import { PORT } from '~/config'
import { initRedisSubscriber } from '~/config/redis'
import initREST from 'interfaces/rest'
;(async () => {
  try {
    logger.info(`APP_STARTED`)

    const app: express.Application = express()

    await initRedisSubscriber()
    initREST(app)

    const server = http.createServer(app)
    await server.listen(PORT)
    logger.info(`Server running on: http://localhost:${PORT}`)
  } catch (error) {
    logger.error(error.message, { data: error })
    process.exit(1)
  }
})()

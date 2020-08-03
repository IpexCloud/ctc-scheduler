import 'reflect-metadata'
import * as express from 'express'
import * as http from 'http'
import * as bodyParser from 'body-parser'

import { logger } from './utils/logger/logger'
import { PORT } from '~/config'
import { initRedisConnection } from '~/config/redis'
;(async function() {
  const app: express.Application = express()

  app.use(bodyParser.json())
  await initRedisConnection()
  const server = http.createServer(app)

  server.listen(PORT, () => {
    logger.info(`Server running on: http://localhost:${PORT}`)
  })
})()

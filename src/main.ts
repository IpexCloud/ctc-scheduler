import 'reflect-metadata'
import * as express from 'express'
import * as http from 'http'
import * as bodyParser from 'body-parser'

import { logger } from './utils/logger/logger'
import { PORT } from '~/config'
import { initRedisSubscriber } from '~/config/redis'
import initREST from './interfaces/rest'
;(async function() {
  const app: express.Application = express()

  app.use(bodyParser.json())
  await initRedisSubscriber()
  initREST(app)

  const server = http.createServer(app)

  server.listen(PORT, () => {
    logger.info(`Server running on: http://localhost:${PORT}`)
  })
})()

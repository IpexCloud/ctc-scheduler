import Debug from 'debug'
import { getConnection } from 'typeorm'
import {REDIS_DB_INDEX} from '~/config'

import { getRedisSubscriber } from '~/config/redis'
import { getPbxDetail, makeCall } from '@/utils/pbx'
import { initDbConnection, Connections } from '~/config/mysql'
import * as ctcCallsRepository from '@/repositories/ctcCalls'
import { logger } from '@/utils/logger/logger'

const debug = Debug('ctc-scheduler')
const redisSubscriber = getRedisSubscriber()

async function performScheduledCall(key: string) {
  let configConnection = null

  debug(`Start perform scheduled call with key - ${key}`)
  const [, pbxId, ctcCallId] = key.split('_')

  try {
    const { dbHost } = await getPbxDetail(Number(pbxId))

    if (!dbHost) {
      logger.error(
        `Error by performing scheduled call with ID ${ctcCallId} - configuration database hostname not found`
      )
      return
    }
    await initDbConnection(Connections.config, { database: `ipbxdb_${pbxId}`, host: dbHost })
    configConnection = getConnection(Connections.config)
    const ctcCall = await ctcCallsRepository.findOne(configConnection, Number(ctcCallId))

    if (!ctcCall) {
      logger.error(`Error by performing scheduled call with ID ${ctcCallId} - call not found in configuration database`)
      return
    }

    const {
      number,
      ctc: { callerId, inRouteExtenId, outRoutingId }
    } = ctcCall
    debug(`Loaded scheduled call detail - ${JSON.stringify(ctcCall)}`)
    await makeCall(pbxId, { number, callerId, inRouteExtenId, outRoutingId })
  } catch (error) {
    logger.error(`Error by performing scheduled call - ${error}`)
  } finally {
    if (configConnection) {
      await ctcCallsRepository.remove(configConnection, Number(ctcCallId))
      configConnection.close()
    }
  }
}

redisSubscriber.psubscribe(`__keyevent@${REDIS_DB_INDEX}__:expired`)
redisSubscriber.on('pmessage', async function(pattern, _, key) {
  const [jobType] = key.split('_')
  debug(`Expired key ${key}`)

  if (pattern === `__keyevent@${REDIS_DB_INDEX}__:expired` && jobType === 'ctc') {
    // Key example for click-to-call service: `ctc_${pbxId}_${ctcCallId}`
    await performScheduledCall(key)
  }
})

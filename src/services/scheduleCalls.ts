import Debug from 'debug'
import { getConnection } from 'typeorm'

import { getRedisSubscriber } from '~/config/redis'
import { getPbxDetail, makeCall } from '@/utils/pbx'
import { initDbConnection, Connections } from '~/config/mysql'
import * as ctcCallsRepository from '@/repositories/ctcCalls'
import { logger } from '@/utils/logger/logger'

const debug = Debug('ctc-scheduler')
const redisSubscriber = getRedisSubscriber()

async function performScheduledCall(key: string) {
  let configConnection = null

  try {
    debug(`Start perform scheduled call with key - ${key}`)
    const [, pbxId, ctcCallId] = key.split('_')
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

    debug(`Loaded scheduled call detail - ${JSON.stringify(ctcCall)}`)
    await makeCall(pbxId, ctcCall.number)
    await ctcCallsRepository.remove(configConnection, Number(ctcCallId))
  } catch (error) {
    logger.error(`Error by performing scheduled call - ${error}`)
  } finally {
    if (configConnection) configConnection.close()
  }
}

redisSubscriber.psubscribe('__keyevent@0__:expired')
redisSubscriber.on('pmessage', async function(pattern, _, key) {
  const [jobType] = key.split('_')
  debug(`Expired key ${key}`)

  if (pattern === '__keyevent@0__:expired' && jobType === 'ctc') {
    // Key example for click-to-call service: `ctc_${pbxId}_${ctcCallId}`
    await performScheduledCall(key)
  }
})

import Debug from 'debug'
import { Connection } from 'typeorm'

import { REDIS_DB_INDEX } from '~/config'
import { subscriber } from '~/config/redis'
import { getPbxDetail, makeCall } from '@/utils/pbx'
import { initDbConnection, Databases } from '~/config/databases'
import * as ctcCallsRepository from 'repositories/ctcCalls'
import logger from '@/utils/logger/logger'

const debug = Debug('ctc-scheduler')

async function performScheduledCall(key: string) {
  let configConnection: Connection | undefined = undefined

  debug(`Start perform scheduled call with key - ${key}`)
  const [, pbxId, ctcCallId] = key.split('_')

  try {
    const pbxDetail = await getPbxDetail(Number(pbxId))

    if (!pbxDetail.configDatabase.host || !pbxDetail.configDatabase.name) {
      logger.error(`Error by performing scheduled call with ID ${ctcCallId} - configuration database not found`)
      return
    }

    configConnection = await initDbConnection(Databases.pbxConfig, {
      database: pbxDetail.configDatabase.name,
      host: pbxDetail.configDatabase.host
    })

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
    logger.error(`Error by performing scheduled call - ${error.message}`)
  } finally {
    if (configConnection) {
      await ctcCallsRepository.remove(configConnection, Number(ctcCallId))
      await configConnection.close()
    }
  }
}

subscriber.psubscribe(`__keyevent@${REDIS_DB_INDEX}__:expired`)
subscriber.on('pmessage', async function (pattern: string, _: any, key: string) {
  const [jobType] = key.split('_')
  debug(`Expired key ${key}`)

  if (pattern === `__keyevent@${REDIS_DB_INDEX}__:expired` && jobType === 'ctc') {
    // Key example for click-to-call service: `ctc_${pbxId}_${ctcCallId}`
    await performScheduledCall(key)
  }
})

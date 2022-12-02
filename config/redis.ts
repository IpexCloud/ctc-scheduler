import { createClient, RedisClient } from 'redis'

import { REDIS_USERNAME, REDIS_PASSWORD, REDIS_HOST, REDIS_PORT, REDIS_DB_INDEX } from '.'
import logger from '@/utils/logger/logger'

let subscriber: RedisClient

const initRedisSubscriber = () => {
  return new Promise((resolve, reject) => {
    subscriber = createClient({
      url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}?db=${REDIS_DB_INDEX}`
    })

    subscriber.on('error', function (error) {
      logger.error(`Error by creating Redis subscriber `, error)
      reject(error)
    })

    subscriber.on('connect', function () {
      logger.info('Redis subscriber successfully connected')
      resolve(subscriber)
    })
  })
}

export { subscriber, initRedisSubscriber }

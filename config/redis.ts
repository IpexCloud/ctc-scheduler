import { createClient, RedisClient } from 'redis'

import { REDIS_PORT, REDIS_HOST } from '.'
import logger from '@/utils/logger/logger'

let subscriber: RedisClient

const initRedisSubscriber = () => {
  return new Promise((resolve, reject) => {
    subscriber = createClient({
      host: REDIS_HOST,
      port: REDIS_PORT
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

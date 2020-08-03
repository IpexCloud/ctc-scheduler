import { createClient } from 'redis'
import { REDIS_PORT, REDIS_HOST } from '.'
import { logger } from '@/utils/logger/logger'

export async function initRedisConnection() {
  return new Promise((resolve, reject) => {
    const client = createClient({
      host: REDIS_HOST,
      port: REDIS_PORT
    })

    client.on('error', function(error) {
      reject(error)
    })

    client.on('connect', function() {
      logger.info('Redis successfully connected')
      resolve()
    })
  })
}

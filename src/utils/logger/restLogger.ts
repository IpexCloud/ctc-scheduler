import { createLogger, format, transports, LoggerOptions } from 'winston'
import { Request } from 'express'
import { logger } from 'express-winston'
import { hostname } from 'os'

import { version } from '~/package.json'
import { ENVIRONMENT_NAME } from '~/config'
import { getAuthType, getBasicAuthMeta, getBearerAuthMeta } from '@/utils/auth'

interface LogFormat {
  '@timestamp': string
  '@version': string
  source: string
  host: string
  instanceId: string
  user: string | null
  correlationId: string | null
  forwardedFor: string | null
  severity: string
  route: string
  path: string
  responseTime: number
  statusCode: number
  method: string
  query: object
  authorization: string | null
  requestPayload?: object | null
  responsePayload?: object | null
  metadata?: object | null
}

const requestFormat = format.printf(data => {
  const { meta, level, timestamp } = data
  const auth = meta.req.headers.authorization || null
  let userId: LogFormat['user'] = null
  if (getAuthType(auth) === 'basicAuth') {
    const credentials = getBasicAuthMeta(auth)
    userId = credentials ? credentials.user : null
  } else if (getAuthType(auth) === 'bearerToken') {
    const tokenPayload = getBearerAuthMeta(auth)
    userId = tokenPayload ? (tokenPayload.sub ? tokenPayload.sub : null) : null
  }

  let log: LogFormat = {
    '@timestamp': timestamp,
    '@version': version,
    authorization: auth ? `...${auth.substr(auth.length - 15)}` : null,
    correlationId: meta.req.headers['x-correlation-id'] || meta.req.headers['x-amzn-trace-id'] || null,
    forwardedFor: meta.req.headers['x-forwarded-for'] ? meta.req.headers['x-forwarded-for'].split(',')[0] : null,
    host: hostname(),
    instanceId: hostname(),
    method: meta.req.method,
    path: meta.req.url, // TODO: get pure route without parameters e.g. /users/{userId}
    query: meta.req.query,
    responseTime: meta.responseTime,
    route: meta.req.url,
    severity: level,
    source: ENVIRONMENT_NAME || 'typescript-skeleton',
    statusCode: meta.res.statusCode,
    user: userId,
    metadata: typeof meta.req.body === 'object' ? meta.req.body : { msg: meta.req.body }
  }

  if (!(meta.res.statusCode >= 200 && meta.res.statusCode < 300)) {
    log = {
      ...log,
      requestPayload: meta.req.body || null,
      responsePayload: meta.res.body
    }
  }

  return JSON.stringify(log)
})

const loggerOptions: LoggerOptions = {
  transports: [
    new transports.Console({
      format: format.combine(format.splat(), format.timestamp(), requestFormat)
    })
  ]
}

export default logger({
  bodyBlacklist: ['password'], // omit this keys from logged body
  ignoreRoute: (req: Request) => {
    if (req.method === 'OPTIONS') return true
    if (req.url.startsWith('/documentation')) return true
    return false
  },
  ignoredRoutes: ['/health', '/alive', '/'],
  meta: true,
  requestWhitelist: ['headers', 'query', 'body', 'method', 'url'],
  responseWhitelist: ['body', 'statusCode'],
  winstonInstance: createLogger(loggerOptions)
})

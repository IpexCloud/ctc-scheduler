import { loadEnv } from '@/utils/helpers'

export const PORT = process.env.PORT || '8080'

export const REDIS_HOST = loadEnv('REDIS_HOST')
export const REDIS_PORT = Number(loadEnv('REDIS_PORT'))
export const REDIS_DB_INDEX = Number(process.env.REDIS_DB_INDEX || 0)
export const REDIS_USERNAME = loadEnv('REDIS_USERNAME')
export const REDIS_PASSWORD = loadEnv('REDIS_PASSWORD')

export const ENVIRONMENT_NAME = process.env.ENVIRONMENT_NAME || 'ctc-scheduler'

export const CONFIG_DATABASE_PASSWORD = loadEnv('CONFIG_DATABASE_PASSWORD')
export const CONFIG_DATABASE_USER = loadEnv('CONFIG_DATABASE_USER')

export const PBX_OPERATOR_URL = loadEnv('PBX_OPERATOR_URL')
export const PBX_OPERATOR_USER = loadEnv('PBX_OPERATOR_USER')
export const PBX_OPERATOR_PASSWORD = loadEnv('PBX_OPERATOR_PASSWORD')

export const IPBX_API_URL = loadEnv('IPBX_API_URL')

export const CENTRAL_API_URL = loadEnv('CENTRAL_API_URL')
export const CENTRAL_API_USER = loadEnv('CENTRAL_API_USER')
export const CENTRAL_API_PASSWORD = loadEnv('CENTRAL_API_PASSWORD')

export const PBX_DETAIL_CACHE_DURATION = Number(process.env.PBX_DETAIL_CACHE_DURATION) || 3600
export const PBX_DETAIL_CACHE_PERIOD = Number(process.env.PBX_DETAIL_CACHE_PERIOD) || 60

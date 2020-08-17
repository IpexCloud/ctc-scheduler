import { config } from 'dotenv'
config({ path: './env/.env' })

export const PORT = process.env.PORT || '3000'
export const REDIS_PORT = Number(process.env.REDIS_PORT)
export const REDIS_HOST = process.env.REDIS_HOST
export const REDIS_DB_INDEX = process.env.REDIS_DB_INDEX || 0

export const ENVIRONMENT_NAME = process.env.ENVIRONMENT_NAME

export const CONFIG_DATABASE_PASSWORD = process.env.CONFIG_DATABASE_PASSWORD
export const CONFIG_DATABASE_USER = process.env.CONFIG_DATABASE_USER

export const PBX_OPERATOR_URL = process.env.PBX_OPERATOR_URL
export const PBX_OPERATOR_USER = process.env.PBX_OPERATOR_USER || ''
export const PBX_OPERATOR_PASSWORD = process.env.PBX_OPERATOR_PASSWORD || ''

export const IPBX_API_URL = process.env.IPBX_API_URL

export const CENTRAL_API_URL = process.env.CENTRAL_API_URL
export const CENTRAL_API_USER = process.env.CENTRAL_API_USER || ''
export const CENTRAL_API_PASSWORD = process.env.CENTRAL_API_PASSWORD || ''

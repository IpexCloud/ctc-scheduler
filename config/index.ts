import { config } from 'dotenv'
config({ path: './env/.env' })

export const PORT = process.env.PORT || '3000'
export const REDIS_PORT = Number(process.env.REDIS_PORT)
export const REDIS_HOST = process.env.REDIS_HOST
export const ENVIRONMENT_NAME = process.env.ENVIRONMENT_NAME

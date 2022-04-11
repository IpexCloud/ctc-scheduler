import { existsSync } from 'fs'

interface ResponseFormat {
  duration: number
  message: string
  name: string
  statusCode: number
}

const DEFAULT_RESPONSE = {
  duration: 0,
  message: 'OK',
  name: 'maintenance',
  statusCode: 200
}

const checkMaintenance = async (): Promise<ResponseFormat> => {
  const start = Date.now()
  const response = { ...DEFAULT_RESPONSE, name: 'maintenance' }
  if (existsSync('maintenance')) {
    response.statusCode = 423
    response.message = 'maintenance'
  }
  const end = Date.now()
  response.duration = end - start
  return response
}

export { checkMaintenance }

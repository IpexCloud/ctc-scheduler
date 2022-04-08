import { JsonController, Get, Res } from 'routing-controllers'
import { Response } from 'express'

import { version } from '~/package.json'
import { checkMaintenance } from '@/utils/health'

@JsonController()
export class RootController {
  @Get('/alive')
  alive() {
    return {
      status: 'OK',
      uptime: Math.ceil(process.uptime()),
      version
    }
  }

  @Get('/health')
  async health(@Res() response: Response) {
    let statusCode = 200
    const checks = (await Promise.all([checkMaintenance()])).map(check => {
      if (check.statusCode === 503) {
        statusCode = 503
      }
      return check
    })
    return response.status(statusCode).json(checks)
  }
}

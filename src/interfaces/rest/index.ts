import { useExpressServer } from 'routing-controllers'

import * as express from 'express'

import { setLoggerSilent } from '@/utils/logger/logger'
import CorrelationIdMiddleware from './middlewares/correlationIdMiddleware'
import ErrorHandlerMiddleware from './middlewares/errorHandlerMiddleware'

export default function initREST(app: express.Application) {
  // Enable logs
  setLoggerSilent(false)

  const routingControllersOptions = {
    controllers: [__dirname + '/controllers/**/*.+(js|ts)'],
    defaultErrorHandler: false,
    cors: true,
    defaults: {
      nullResultCode: 404,
      undefinedResultCode: 204
    },
    middlewares: [CorrelationIdMiddleware, ErrorHandlerMiddleware]
  }
  useExpressServer(app, routingControllersOptions)
}

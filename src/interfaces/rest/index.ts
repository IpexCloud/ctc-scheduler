import { useExpressServer } from 'routing-controllers'
import * as express from 'express'

import ErrorHandlerMiddleware from './middlewares/errorHandlerMiddleware'

export default function initREST(app: express.Application) {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  const routingControllersOptions = {
    controllers: [__dirname + '/controllers/**/*.+(js|ts)'],
    defaultErrorHandler: false,
    cors: true,
    defaults: {
      nullResultCode: 404,
      undefinedResultCode: 204
    },
    validation: {
      whitelist: true,
      forbidNonWhitelisted: true
    },
    middlewares: [ErrorHandlerMiddleware]
  }
  useExpressServer(app, routingControllersOptions)
}

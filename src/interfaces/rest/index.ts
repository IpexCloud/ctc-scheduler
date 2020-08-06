import { useExpressServer, getMetadataArgsStorage } from 'routing-controllers'
import { routingControllersToSpec } from 'routing-controllers-openapi'
import { getFromContainer, MetadataStorage } from 'class-validator'
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import * as swaggerUi from 'swagger-ui-express'
import * as express from 'express'

import { setLoggerSilent } from '@/utils/logger/logger'
import restLogger from '@/utils/logger/restLogger'
import CorrelationIdMiddleware from './middlewares/correlationIdMiddleware'
import ErrorHandlerMiddleware from './middlewares/errorHandlerMiddleware'
import { version } from '~/package.json'

export default function initREST(app: express.Application) {
  // Enable logs
  setLoggerSilent(false)
  // Register request logging middleware
  app.use(restLogger)

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
  // app.use(errorLogger)

  // Generate documentation
  const metadatas = (getFromContainer(MetadataStorage) as any).validationMetadatas
  const schemas = validationMetadatasToSchemas(metadatas, {
    refPointerPrefix: '#/components/schemas/'
  })
  const storage = getMetadataArgsStorage()
  const spec = routingControllersToSpec(storage, routingControllersOptions, {
    components: {
      schemas,
      securitySchemes: {
        bearerAuth: {
          scheme: 'bearer',
          type: 'http'
        },
        basicAuth: {
          scheme: 'basic',
          type: 'http'
        }
      }
    },
    info: {
      description: 'Microservice for `scheduling calls`',
      title: 'CTC-Scheduler',
      version
    }
  })
  // Use route for documentation
  app.use('/documentation', swaggerUi.serve, swaggerUi.setup(spec))
}

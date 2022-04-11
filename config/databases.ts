import { createConnection, ConnectionOptions, Connection } from 'typeorm'
import { resolve } from 'path'

import { CONFIG_DATABASE_USER, CONFIG_DATABASE_PASSWORD } from '.'

enum Databases {
  pbxConfig = 'pbxConfig'
}

type DatabaseConnectionOptions = ConnectionOptions & { temporary?: boolean }

const getConnectionOptions = (name: Databases): DatabaseConnectionOptions => {
  switch (name) {
    case Databases.pbxConfig: {
      return {
        type: 'mysql',
        port: 3306,
        password: CONFIG_DATABASE_PASSWORD,
        username: CONFIG_DATABASE_USER,
        entities: [resolve(__dirname, `../src/model/${Databases.pbxConfig}/entities/**`)],
        temporary: true
      }
    }
  }
}

const initDbConnection = (database: Databases, options?: { [key: string]: any }) => {
  const defaultOptions = getConnectionOptions(database)
  const connectionOptions = { name: database, ...defaultOptions, ...options }

  if (defaultOptions.temporary) {
    return new Connection(connectionOptions).connect()
  }

  return createConnection(connectionOptions)
}

export { initDbConnection, Databases }

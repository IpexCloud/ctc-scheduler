import { createConnection, ConnectionOptions } from 'typeorm'
import { resolve } from 'path'

import { CONFIG_DATABASE_USER, CONFIG_DATABASE_PASSWORD } from '.'

enum Databases {
  pbxConfig = 'pbxConfig'
}

const getSettings = (name: Databases): ConnectionOptions => {
  switch (name) {
    case Databases.pbxConfig: {
      return {
        type: 'mysql',
        port: 3306,
        password: CONFIG_DATABASE_PASSWORD,
        username: CONFIG_DATABASE_USER,
        entities: [resolve(__dirname, `../src/model/${Databases.pbxConfig}/entities/**`)]
      }
    }
  }
}

const initDbConnection = (database: Databases, name?: string, options?: { [key: string]: any }) =>
  createConnection({
    name: database + (name || ''),
    ...getSettings(database),
    ...options
  })

export { initDbConnection, Databases }

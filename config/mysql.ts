import { resolve } from 'path'
import { createConnections } from 'typeorm'

import { CONFIG_DATABASE_USER, CONFIG_DATABASE_PASSWORD } from '.'

export enum Connections {
  config = 'config'
}

function getSettings(name: Connections): object {
  switch (name) {
    case Connections.config: {
      return {
        entities: [resolve(__dirname, '../src/model/typeorm/entities/config/**')],
        password: CONFIG_DATABASE_PASSWORD,
        username: CONFIG_DATABASE_USER
      }
    }
  }
}

export async function initDbConnection(name: Connections, options: object = {}): Promise<void> {
  await createConnections([
    {
      name,
      type: 'mysql',
      port: 3306,
      ...getSettings(name),
      ...options
    }
  ])
}

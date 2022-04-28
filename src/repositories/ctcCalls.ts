import { Connection } from 'typeorm'

import CtcCall from 'model/pbxConfig/entities/CtcCall.entity'

export async function findOne(connection: Connection, id: number) {
  return connection.getRepository(CtcCall).findOne({ relations: ['ctc'], where: { id } })
}

export async function remove(connection: Connection, id: number) {
  return connection.getRepository(CtcCall).delete({ id })
}

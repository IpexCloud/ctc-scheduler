import { Connection } from 'typeorm'
import CtcCall from '../model/typeorm/entities/config/CtcCallEntity'

export async function findOne(connection: Connection, id: number) {
  return connection.getRepository(CtcCall).findOne({ relations: ['ctc'], where: { id } })
}

export async function remove(connection: Connection, id: number) {
  return connection.getRepository(CtcCall).delete({ id })
}

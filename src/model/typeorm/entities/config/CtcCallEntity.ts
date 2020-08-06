import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity({ name: 'ctc_calls' }) // same as table name
export default class Order {
  @PrimaryColumn()
  id: number

  @Column('varchar', { length: 32 })
  number: string

  @Column({ type: 'timestamp', precision: 3 })
  timestamp: string
}

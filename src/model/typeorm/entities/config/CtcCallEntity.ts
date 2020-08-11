import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm'

import Ctc from './CtcEntity'

@Entity({ name: 'ctc_calls' })
export default class CtcCallEntity {
  @PrimaryColumn()
  id: number

  @Column('varchar', { length: 32 })
  number: string

  @Column({ type: 'timestamp', precision: 3 })
  timestamp: string

  @ManyToOne(
    () => Ctc,
    ctc => ctc.calls
  )
  @JoinColumn({ name: 'ctc_id' })
  ctc: Ctc
}

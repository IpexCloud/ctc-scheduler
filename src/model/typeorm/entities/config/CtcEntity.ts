import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm'

import CtcCall from './CtcCallEntity'

@Entity({ name: 'ctc' })
export default class CtcEntity {
  @PrimaryColumn()
  id: number

  @Column({ type: 'varchar', name: 'callerid', length: 45 })
  callerId: string

  @Column({ type: 'int', name: 'in_route_exten_id' })
  inRouteExtenId: number

  @Column({ type: 'int', name: 'out_route_tbl_id' })
  outRoutingId: number

  @OneToMany(
    () => CtcCall,
    call => call.ctc
  )
  calls?: CtcCall[]
}

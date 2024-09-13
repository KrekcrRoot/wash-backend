import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../user/dto/user.entity";
import { MachineEntity } from "../../machine/dto/machine.entity";

@Entity('Washes')
export class WashEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  time_begin: Date

  @Column({nullable: true, default: null})
  time_end?: Date

  @ManyToOne(() => MachineEntity, machine => machine.uuid)
  machine: MachineEntity;

  @ManyToOne(() => UserEntity, user => user.uuid)
  user: UserEntity;

  @ManyToOne(() => UserEntity, user => user.uuid, { nullable: true })
  queued?: UserEntity;

  @Column({ default: false })
  hard_end: boolean;

}
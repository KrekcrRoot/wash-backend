import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../user/dto/user.entity";
import { MachineEntity } from "../machine/dto/machine.entity";

@Entity('Reports')
export class ReportEntity
{
  @PrimaryGeneratedColumn(`uuid`)
  uuid: string;

  @ManyToOne(() => UserEntity, user => user.uuid)
  user: UserEntity;

  @Column()
  body: string;

  @ManyToOne(() => MachineEntity, machine => machine.uuid)
  machine: MachineEntity;

  @CreateDateColumn()
  created_at: Date;
}
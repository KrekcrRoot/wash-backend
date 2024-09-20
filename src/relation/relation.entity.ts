import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../user/dto/user.entity";
import { MachineEntity } from "../machine/dto/machine.entity";
import { RelationTypeEnum } from "./relation.type.enum";


@Entity('Relations')
export class RelationEntity
{
  @PrimaryGeneratedColumn(`uuid`)
  uuid: string;

  @ManyToOne(() => UserEntity, user => user.uuid)
  user: UserEntity;

  @ManyToOne(() => MachineEntity, machine => machine.uuid)
  machine: MachineEntity;

  @Column({
    type: 'enum',
    enum: RelationTypeEnum,
    default: RelationTypeEnum.Default,
  })
  type: RelationTypeEnum;

}
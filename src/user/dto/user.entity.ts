import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserTypeEnum } from "./user.type.enum";
import { RoomEntity } from "../../room/dto/room.entity";
import { MachineEntity } from "../../machine/dto/machine.entity";

@Entity('Users')
export class UserEntity {

  @PrimaryGeneratedColumn()
  uuid: string;

  @Column({ nullable: true })
  telegram_id: string;

  @Column()
  telegram_tag: string;

  @Column({ default: 0 })
  count: number;

  @Column({ default: 0 })
  time: number; // in minutes

  @ManyToOne(() => MachineEntity, machine => machine.uuid)
  link_machine: MachineEntity;

  @Column({ default: UserTypeEnum.Default })
  type: UserTypeEnum;

  @ManyToOne(() => RoomEntity, room => room.uuid)
  room: RoomEntity;

  @Column({ default: 100 })
  trust_factor: number;

  @Column({ default: false })
  kicked: boolean;
}
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoomEntity } from "../../room/dto/room.entity";
import { MachineEntity } from "../../machine/dto/machine.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity('Users')
export class UserEntity {

  @ApiProperty({
    example: 'b75fe173-1e59-49ef-9527-ca2fd02bd75c',
    description: 'uuid of user'
  })
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

  @ManyToOne(() => RoomEntity, room => room.uuid)
  room: RoomEntity;

  @Column({ default: 100 })
  trust_factor: number;
}
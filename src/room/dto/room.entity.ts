import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Rooms')
export class RoomEntity
{
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ unique: true })
  path: string;

  @Column({ default: 5 })
  available_users: number;
}
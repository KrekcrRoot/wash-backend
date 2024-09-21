import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../user/dto/user.entity";
import { WashEntity } from "../wash/dto/wash.entity";

@Entity('Orders')
export class OrderEntity
{

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => UserEntity, user => user.uuid)
  user: UserEntity;

  @ManyToOne(() => WashEntity, wash => wash.id)
  wash: WashEntity;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

}
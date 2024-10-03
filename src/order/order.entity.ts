import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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

  @OneToOne(() => OrderEntity, order => order.uuid, {nullable: true})
  queue: OrderEntity;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({ default: true })
  relevance: boolean;

}
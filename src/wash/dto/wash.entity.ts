import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../user/dto/user.entity";
import { MachineEntity } from "../../machine/dto/machine.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity('Washes')
export class WashEntity {

  @ApiProperty({
    example: 42,
    description: 'ID wash',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: new Date(),
    description: 'Time washing begin',
  })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  time_begin: Date

  @ApiProperty({
    example: new Date(),
    description: 'Time washing end',
  })
  @Column({nullable: true, default: null})
  time_end?: Date

  @ApiProperty({
    example: MachineEntity,
    description: 'Machine entity'
  })
  @ManyToOne(() => MachineEntity, machine => machine.uuid)
  machine: MachineEntity;

  @ApiProperty({
    example: UserEntity,
    description: 'User entity',
  })
  @ManyToOne(() => UserEntity, user => user.uuid)
  user: UserEntity;

  @ApiProperty({
    example: false,
    description: 'Is washing end hardly'
  })
  @Column({ default: false })
  hard_end: boolean;

}
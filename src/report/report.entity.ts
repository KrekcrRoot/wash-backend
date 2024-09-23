import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../user/dto/user.entity";
import { MachineEntity } from "../machine/dto/machine.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity('Reports')
export class ReportEntity
{
  @ApiProperty({
    example: '066d3d6c-5b89-4967-83b2-130b2821989f',
    description: 'UUID of report',
  })
  @PrimaryGeneratedColumn(`uuid`)
  uuid: string;

  @ApiProperty({
    example: UserEntity,
    description: 'User reported'
  })
  @ManyToOne(() => UserEntity, user => user.uuid)
  user: UserEntity;

  @ApiProperty({
    example: 'Lorem Ipsum se dolor',
    description: 'User body report'
  })
  @Column()
  body: string;

  @ApiProperty({
    example: MachineEntity,
    description: 'Machine linked to report',
  })
  @ManyToOne(() => MachineEntity, machine => machine.uuid)
  machine: MachineEntity;

  @ApiProperty({
    example: new Date(),
    description: 'Time report created',
  })
  @CreateDateColumn()
  created_at: Date;
}
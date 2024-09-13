import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Machines')
export class MachineEntity {

  @PrimaryGeneratedColumn(`uuid`)
  uuid: string;

  @Column({ unique: true })
  title: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  broken: boolean;

}
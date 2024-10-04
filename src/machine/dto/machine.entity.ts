import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ReportEntity } from "../../report/report.entity";

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

  @OneToOne(
    () => ReportEntity,
    report => report.uuid,
    {nullable: true}
  )
  @JoinColumn()
  broken_report: ReportEntity;

}
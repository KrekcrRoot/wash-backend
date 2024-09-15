import { DataSource } from "typeorm";
import { ReportEntity } from "./report.entity";

export const reportProviders = [
  {
    provide: 'REPORT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ReportEntity),
    inject: ['DATA_SOURCE'],
  }
]
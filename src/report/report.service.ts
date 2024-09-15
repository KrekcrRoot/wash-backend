import { Inject, Injectable } from "@nestjs/common";
import { StoreReportDto } from "./dto/store.report.dto";
import { UserEntity } from "../user/dto/user.entity";
import { Repository } from "typeorm";
import { ReportEntity } from "./report.entity";

@Injectable()
export class ReportService {

  constructor(
    @Inject('REPORT_REPOSITORY') private report_repository: Repository<ReportEntity>
  ) {
  }

  async make(storeReportDto: StoreReportDto, user: UserEntity)
  {
    const report = this.report_repository.create({
      ...storeReportDto
    })

    return this.report_repository.save(report);
  }

}

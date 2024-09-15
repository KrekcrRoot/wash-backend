import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { reportProviders } from "./report.providers";
import { DatabaseModule } from "../database/database.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [ReportController],
  providers: [ReportService, ...reportProviders],
})
export class ReportModule {}

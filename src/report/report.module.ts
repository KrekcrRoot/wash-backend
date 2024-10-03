import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { reportProviders } from "./report.providers";
import { DatabaseModule } from "../database/database.module";
import { UserModule } from "../user/user.module";
import { machineProviders } from "../machine/machine.providers";
import { RelationModule } from "../relation/relation.module";

@Module({
  imports: [DatabaseModule, UserModule, RelationModule],
  controllers: [ReportController],
  providers: [ReportService, ...reportProviders, ...machineProviders],
  exports: [ReportService],
})
export class ReportModule {}

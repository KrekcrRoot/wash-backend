import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { reportProviders } from "./report.providers";
import { DatabaseModule } from "../database/database.module";
import { UserModule } from "../user/user.module";
import { machineProviders } from "../machine/machine.providers";
import { RelationModule } from "../relation/relation.module";
import { WashService } from "../wash/wash.service";
import { washProviders } from "../wash/wash.providers";
import { orderProviders } from "../order/order.providers";
import { ConnectionModule } from "../connection/connection.module";

@Module({
  imports: [DatabaseModule, UserModule, RelationModule, ConnectionModule],
  controllers: [ReportController],
  providers: [ReportService, ...reportProviders, ...machineProviders, WashService, ...washProviders, ...orderProviders],
  exports: [ReportService],
})
export class ReportModule {}

import { Module } from '@nestjs/common';
import { WashService } from './wash.service';
import { WashController } from './wash.controller';
import { washProviders } from "./wash.providers";
import { DatabaseModule } from "../database/database.module";
import { MachineModule } from "../machine/machine.module";
import { UserModule } from "../user/user.module";
import { ReportModule } from "../report/report.module";
import { RelationModule } from "../relation/relation.module";
import { orderProviders } from "../order/order.providers";
import { ConnectionModule } from "../connection/connection.module";

@Module({
  imports: [
    DatabaseModule,
    MachineModule,
    UserModule,
    ReportModule,
    RelationModule,
    ConnectionModule
  ],
  providers: [WashService, ...washProviders, ...orderProviders],
  controllers: [WashController],
  exports: [...washProviders, WashService],

})
export class WashModule {}

import { Module } from '@nestjs/common';
import { WashService } from './wash.service';
import { WashController } from './wash.controller';
import { washProviders } from "./wash.providers";
import { DatabaseModule } from "../database/database.module";
import { MachineModule } from "../machine/machine.module";
import { UserModule } from "../user/user.module";
import { ReportModule } from "../report/report.module";

@Module({
  imports: [
    DatabaseModule,
    MachineModule,
    UserModule,
    ReportModule
  ],
  providers: [WashService, ...washProviders],
  controllers: [WashController],
  exports: [...washProviders],

})
export class WashModule {}

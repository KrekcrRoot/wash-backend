import { Module } from '@nestjs/common';
import { MachineController } from './machine.controller';
import { MachineService } from './machine.service';
import { DatabaseModule } from "../database/database.module";
import { machineProviders } from "./machine.providers";
import { UserModule } from "../user/user.module";
import { userProviders } from "../user/user.provider";
import { RelationModule } from "../relation/relation.module";
import { relationProviders } from "../relation/relation.providers";
import { WashService } from "../wash/wash.service";
import { washProviders } from "../wash/wash.providers";

@Module({
  imports: [DatabaseModule, UserModule, RelationModule],
  controllers: [MachineController],
  providers: [MachineService, ...machineProviders, ...userProviders, ...relationProviders, WashService, ...washProviders],
  exports: [...machineProviders],
})
export class MachineModule {}

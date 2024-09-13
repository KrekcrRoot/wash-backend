import { Module } from '@nestjs/common';
import { MachineController } from './machine.controller';
import { MachineService } from './machine.service';
import { DatabaseModule } from "../database/database.module";
import { machineProviders } from "./machine.providers";
import { UserModule } from "../user/user.module";
import { userProviders } from "../user/user.provider";

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [MachineController],
  providers: [MachineService, ...machineProviders, ...userProviders],
  exports: [...machineProviders],
})
export class MachineModule {}

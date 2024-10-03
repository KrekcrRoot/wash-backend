import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { orderProviders } from "./order.providers";
import { DatabaseModule } from "../database/database.module";
import { WashService } from "../wash/wash.service";
import { washProviders } from "../wash/wash.providers";
import { machineProviders } from "../machine/machine.providers";
import { userProviders } from "../user/user.provider";
import { UserModule } from "../user/user.module";
import { ConnectionModule } from "../connection/connection.module";
import { RelationModule } from "../relation/relation.module";
import { relationProviders } from "../relation/relation.providers";

@Module({
  imports: [DatabaseModule, UserModule, ConnectionModule, RelationModule],
  controllers: [OrderController],
  providers: [...relationProviders, OrderService, ...orderProviders, WashService, ...washProviders, ...machineProviders, ...userProviders],
  exports: [...orderProviders],
})
export class OrderModule {}

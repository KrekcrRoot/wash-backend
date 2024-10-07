import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { HttpModule } from "@nestjs/axios";
import { washProviders } from "../wash/wash.providers";
import { orderProviders } from "../order/order.providers";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
  }), DatabaseModule],
  providers: [ConnectionService, ...washProviders, ...orderProviders],
  exports: [ConnectionService],
})
export class ConnectionModule {}

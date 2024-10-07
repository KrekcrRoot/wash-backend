import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './room/room.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { WashModule } from './wash/wash.module';
import { MachineModule } from './machine/machine.module';
import { ReportModule } from './report/report.module';
import { RelationModule } from './relation/relation.module';
import { AdminModule } from './admin/admin.module';
import { OrderModule } from './order/order.module';
import { ConnectionModule } from './connection/connection.module';
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({isGlobal: true}),
    RoomModule,
    DatabaseModule,
    UserModule,
    WashModule,
    MachineModule,
    ReportModule,
    RelationModule,
    AdminModule,
    OrderModule,
    ConnectionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

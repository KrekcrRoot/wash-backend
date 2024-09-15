import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './room/room.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { WashModule } from './wash/wash.module';
import { MachineModule } from './machine/machine.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [RoomModule, DatabaseModule, UserModule, WashModule, MachineModule, ReportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

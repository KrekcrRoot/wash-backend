import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { roomProviders } from "./room.providers";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [RoomController],
  providers: [RoomService, ...roomProviders],
  exports: [...roomProviders],
})
export class RoomModule {}

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from "../database/database.module";
import { userProviders } from "./user.provider";
import { RoomModule } from "../room/room.module";

@Module({
  imports: [DatabaseModule, RoomModule],
  providers: [UserService, ...userProviders],
  controllers: [UserController],
  exports: [UserService, ...userProviders],
})
export class UserModule {}



import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from "../database/database.module";
import { userProviders } from "./user.provider";
import { RoomModule } from "../room/room.module";
import { RelationModule } from "../relation/relation.module";
import { relationProviders } from "../relation/relation.providers";

@Module({
  imports: [DatabaseModule, RoomModule, RelationModule],
  providers: [UserService, ...userProviders, ...relationProviders],
  controllers: [UserController],
  exports: [UserService, ...userProviders],
})
export class UserModule {}



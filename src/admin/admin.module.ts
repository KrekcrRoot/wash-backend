import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RelationModule } from "../relation/relation.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [RelationModule, UserModule],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule {}

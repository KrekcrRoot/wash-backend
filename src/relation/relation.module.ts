import { Module } from '@nestjs/common';
import { RelationService } from './relation.service';
import { relationProviders } from "./relation.providers";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  providers: [RelationService, ...relationProviders],
  exports: [RelationService, ...relationProviders]
})
export class RelationModule {}

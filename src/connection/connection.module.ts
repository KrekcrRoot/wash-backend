import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  providers: [ConnectionService]
})
export class ConnectionModule {}

import { Controller, Get } from "@nestjs/common";
import { RoomService } from "./room.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Rooms controller')
@Controller('room')
export class RoomController {

  constructor(private readonly roomService: RoomService) {}

  @Get('/all')
  getAll() {
    return this.roomService.findAll();
  }

}


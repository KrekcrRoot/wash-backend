import { Controller, Get } from "@nestjs/common";
import { RoomService } from "./room.service";

@Controller('Rooms controller')
export class RoomController {

  constructor(private readonly roomService: RoomService) {}

  @Get('/all')
  getAll() {
    return this.roomService.findAll();
  }

}


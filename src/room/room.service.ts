import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { RoomEntity } from "./dto/room.entity";

@Injectable()
export class RoomService {

  constructor(
    @Inject('ROOM_REPOSITORY')
    private roomRepository: Repository<RoomEntity>,
  ) {}

  async findAll() {
    return this.roomRepository.find();
  }

}

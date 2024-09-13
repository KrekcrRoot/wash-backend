import { RoomEntity } from "../../room/dto/room.entity";

export class CreateUserDto {
  telegram_id: string;
  telegram_tag: string;
  room: RoomEntity;
}
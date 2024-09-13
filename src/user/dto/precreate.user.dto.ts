import { RoomEntity } from "../../room/dto/room.entity";

export class PrecreateUserDto
{
  telegram_id: string;
  telegram_tag: string;
  room: string;
}
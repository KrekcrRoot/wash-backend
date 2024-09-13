import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ILike, Repository } from "typeorm";
import { UserEntity } from "./dto/user.entity";
import { UserTelegramIdDto } from "./dto/user.telegram.id.dto";
import { PrecreateUserDto } from "./dto/precreate.user.dto";
import { RoomEntity } from "../room/dto/room.entity";

@Injectable()
export class UserService {

  constructor(
    @Inject('USER_REPOSITORY') private users_repository: Repository<UserEntity>,
    @Inject('ROOM_REPOSITORY') private room_repository: Repository<RoomEntity>
  ) {}

  async getAll()
  {
    return this.users_repository.find();
  }

  async findByTelegramId(telegramDto: UserTelegramIdDto)
  {
    return this.users_repository.findOne({
      where: {
        telegram_id: telegramDto.telegramId,
      },
    });
  }

  async create(dto: PrecreateUserDto)
  {
    const user_exists = await this.users_repository.findOne({
      where: {
        telegram_id: dto.telegram_id,
        telegram_tag: dto.telegram_tag,
      },
      relations: {
        room: true,
      },
    });

    if(user_exists)
      return user_exists;

    const room = await this.room_repository.findOne({
      where: {
        path: ILike(`%${dto.room}%`),
      },
    });

    if(!room)
      throw new BadRequestException('There are no room with this number');

    const user = this.users_repository.create({
      ...dto,
      room
    });

    room.available_users--;
    await this.room_repository.save(room);

    return await this.users_repository.save(user);
  }

}

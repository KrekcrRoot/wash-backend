import { BadRequestException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ILike, Repository } from "typeorm";
import { UserEntity } from "./dto/user.entity";
import { UserTelegramIdDto } from "./dto/user.telegram.id.dto";
import { PrecreateUserDto } from "./dto/precreate.user.dto";
import { RoomEntity } from "../room/dto/room.entity";
import { AuthUserDto } from "./dto/auth.user.dto";
import { UserRegisterDto } from "./dto/user.register.dto";
import { KickUserDto } from "./dto/kick.user.dto";

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
      relations: {
        link_machine: true,
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

  async auth(userAuthDto: AuthUserDto)
  {
    const user = await this.users_repository.findOne({
      where: {
        telegram_tag: userAuthDto.telegram_tag,
      },
    });

    if(!user)
      throw new BadRequestException('There are no user with this tag');

    user.telegram_id = userAuthDto.telegram_id;
    await this.users_repository.save(user);

    return HttpStatus.OK;
  }

  async register(userRegisterDto: UserRegisterDto)
  {
    const room = await this.room_repository.findOne({
      where: {
        path: ILike(`%${userRegisterDto.room}%`),
      },
    });

    if(!room)
      throw new BadRequestException('There are no room with this path');

    const user = this.users_repository.create({
      telegram_tag: userRegisterDto.telegram_tag,
      room: room,
    });

    return this.users_repository.save(user);
  }

  async kick(kickUserDto: KickUserDto)
  {
    const user = await this.users_repository.findOne({
      where: {
        telegram_tag: kickUserDto.telegram_tag,
      },
    });

    if(!user)
      throw new BadRequestException('There are no user with this tag');

    user.kicked = true;
    return this.users_repository.save(user);
  }

}

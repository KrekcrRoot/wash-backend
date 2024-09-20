import { BadRequestException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ILike, Repository } from "typeorm";
import { UserEntity } from "./dto/user.entity";
import { UserTelegramIdDto } from "./dto/user.telegram.id.dto";
import { PrecreateUserDto } from "./dto/precreate.user.dto";
import { RoomEntity } from "../room/dto/room.entity";
import { AuthUserDto } from "./dto/auth.user.dto";
import { UserRegisterDto } from "./dto/user.register.dto";
import { MachineEntity } from "../machine/dto/machine.entity";
import { RelationService } from "../relation/relation.service";

@Injectable()
export class UserService {

  constructor(
    @Inject('USER_REPOSITORY') private users_repository: Repository<UserEntity>,
    @Inject('ROOM_REPOSITORY') private room_repository: Repository<RoomEntity>,
    private relationService: RelationService,
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

  async findByTelegramTag(telegram_tag: string)
  {
    return this.users_repository.findOne({
      where: {
        telegram_tag: telegram_tag,
      },
      relations: {
        link_machine: true,
      },
    });
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

  async register(userRegisterDto: UserRegisterDto, machine: MachineEntity)
  {

    const exists = await this.users_repository.findOne({
      where: {
        telegram_tag: userRegisterDto.telegram_tag,
      },
    });

    if(exists)
      throw new BadRequestException('User already exists');

    const room = await this.room_repository.findOne({
      where: {
        path: ILike(`%${userRegisterDto.room}%`),
      },
    });

    if(!room)
      throw new BadRequestException('There are no room with this path');

    const pre_user = this.users_repository.create({
      telegram_tag: userRegisterDto.telegram_tag,
      room: room,
    });

    const user = await this.users_repository.save(pre_user);

    return this.relationService.createRelation(user, machine);
  }

}

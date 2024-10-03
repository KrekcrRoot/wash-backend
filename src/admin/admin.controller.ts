import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get, Inject, Patch,
  Post,
  Put,
  Req,
  UseGuards
} from "@nestjs/common";
import { AuthGuard } from "../user/auth.guard";
import { getUser, TokenRequest } from "../user/dto/user.validate";
import { TelegramTagUserDto } from "../user/dto/telegram.tag.user.dto";
import { UserService } from "../user/user.service";
import { RelationService } from "../relation/relation.service";
import { ApiTags } from "@nestjs/swagger";
import { UserRegisterDto } from "../user/dto/user.register.dto";
import { TransferRightsDto } from "./dto/transferRights.dto";
import { Repository } from "typeorm";
import { RelationEntity } from "../relation/relation.entity";

@ApiTags('Admin controller')
@Controller('admin')
export class AdminController {

  constructor(
    private readonly userService: UserService,
    private readonly relationService: RelationService,
    @Inject('RELATION_REPOSITORY') private readonly relationRepository: Repository<RelationEntity>,
  ) {}

  @UseGuards(AuthGuard)
  @Post('/join')
  async join(@Req() tokenRequest: TokenRequest, @Body() joinUserDto: UserRegisterDto)
  {
    const user = await getUser(tokenRequest, this.userService);
    const relation = await this.relationService.findAdmin(user);

    if(!relation)
      throw new ForbiddenException();

    const join_user = await this.userService.findByTelegramTag(joinUserDto.telegram_tag);

    if(!join_user)
    {
      const newUser = await this.userService.register({
        telegram_tag: joinUserDto.telegram_tag,
        room: joinUserDto.room,
      }, relation.machine);

      return this.relationService.createRelation(newUser.user, relation.machine);
    }

    if(join_user.telegram_id == user.telegram_id)
      throw new BadRequestException('You can\' join yourself');

    return this.relationService.createRelation(join_user, relation.machine)
  }

  @UseGuards(AuthGuard)
  @Post('/kick')
  async kick(@Req() tokenRequest: TokenRequest, @Body() kickUserDto: TelegramTagUserDto)
  {
    const user = await getUser(tokenRequest, this.userService);
    const relation = await this.relationService.findAdmin(user);

    if(!relation)
      throw new ForbiddenException();

    const kicked_user = await this.userService.findByTelegramTag(kickUserDto.telegram_tag);

    if(!kicked_user)
      throw new BadRequestException('There are no user with this tag');

    if(kicked_user.telegram_id == user.telegram_id)
      throw new BadRequestException('You can\'t kick yourself');

    return this.relationService.removeRelation(kicked_user, relation.machine);
  }


  @UseGuards(AuthGuard)
  @Get('/check')
  async check(@Req() tokenRequest: TokenRequest)
  {
    const user = await getUser(tokenRequest, this.userService);
    const relation = await this.relationService.findAdminOfMachine(user.link_machine);

    return {
      isAdmin: relation.user.uuid == user.uuid,
    }
  }

  @UseGuards(AuthGuard)
  @Post('/transfer-rights')
  async transferRights(@Req() tokenRequest: TokenRequest, @Body() transferRightsDto: TransferRightsDto)
  {
    const user = await getUser(tokenRequest, this.userService);
    const relation = await this.relationService.findAdminOfMachine(user.link_machine);

    if(relation.user.uuid != user.uuid)
      throw new ForbiddenException('You are not admin of this machine');

    const admin = await this.userService.findByTelegramTag(transferRightsDto.telegram_tag);

    if(!admin)
      throw new BadRequestException('There are no user with this tag');

    relation.user = admin;

    return this.relationRepository.save(relation);
  }

}

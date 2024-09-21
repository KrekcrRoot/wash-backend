import { BadRequestException, Body, Controller, ForbiddenException, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../user/auth.guard";
import { getUser, TokenRequest } from "../user/dto/user.validate";
import { TelegramTagUserDto } from "../user/dto/telegram.tag.user.dto";
import { UserService } from "../user/user.service";
import { RelationService } from "../relation/relation.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Admin controller')
@Controller('admin')
export class AdminController {

  constructor(
    private readonly userService: UserService,
    private readonly relationService: RelationService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('/join')
  async join(@Req() tokenRequest: TokenRequest, @Body() joinUserDto: TelegramTagUserDto)
  {
    const user = await getUser(tokenRequest, this.userService);
    const relation = await this.relationService.findAdmin(user);

    if(!relation)
      throw new ForbiddenException();

    const join_user = await this.userService.findByTelegramTag(joinUserDto.telegram_tag);

    if(!join_user)
      throw new BadRequestException('There are no user with this tag');

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
  @Post('/check')
  async check(@Req() tokenRequest: TokenRequest)
  {
    const user = await getUser(tokenRequest, this.userService);
    const relation = await this.relationService.findAdminOfMachine(user.link_machine);

    return {
      isAdmin: relation.user == user,
    }

  }

}

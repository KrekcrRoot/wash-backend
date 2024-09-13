import { BadRequestException, Body, Controller, Get, Post } from "@nestjs/common";
import { WashService } from "./wash.service";
import { UserTelegramIdDto } from "../user/dto/user.telegram.id.dto";
import { UserService } from "../user/user.service";

@Controller('wash')
export class WashController {

  constructor(
    private readonly washService: WashService,
    private readonly userService: UserService,
  ) {}

  @Get('/all')
  getAll()
  {
    return this.washService.getAll();
  }

  @Get('/status')
  getStatus()
  {
    return this.washService.getStatus();
  }

  @Post('/occupy')
  async occupy(@Body() telegramDto: UserTelegramIdDto)
  {
    const user = await this.userService.findByTelegramId(telegramDto);
    if(!user)
      throw new BadRequestException('Telegram ID wasn\'t found');

    return this.washService.occupy(user);
  }

  @Post('/end')
  async end(@Body() telegramDto: UserTelegramIdDto)
  {
    const user = await this.userService.findByTelegramId(telegramDto);
    if(!user)
      throw new BadRequestException('Telegram ID wasn\'t found');

    return this.washService.end(user);
  }

  @Post('/broke')
  broke()
  {
    return this.washService.broke();
  }

  @Post('/fix')
  fix()
  {
    return this.washService.fix()
  }

}

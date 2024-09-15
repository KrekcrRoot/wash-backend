import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { WashService } from "./wash.service";
import { UserService } from "../user/user.service";
import { AuthGuard } from "../user/auth.guard";
import { getUser, TokenRequest } from "../user/dto/user.validate";

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

  @UseGuards(AuthGuard)
  @Post('/occupy')
  async occupy(@Req() tokenRequest: TokenRequest)
  {
    const user = await getUser(tokenRequest, this.userService);
    return this.washService.occupy(user);
  }

  @UseGuards(AuthGuard)
  @Post('/end')
  async end(@Req() tokenRequest: TokenRequest)
  {
    const user = await getUser(tokenRequest, this.userService);
    return this.washService.end(user);
  }

  @UseGuards(AuthGuard)
  @Post('/broke')
  broke()
  {
    return this.washService.broke();
  }

  @UseGuards(AuthGuard)
  @Post('/fix')
  async fix(@Req() tokenRequest: TokenRequest)
  {
    const user = await getUser(tokenRequest, this.userService);

    return this.washService.fix()
  }

}

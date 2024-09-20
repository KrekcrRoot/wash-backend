import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { WashService } from "./wash.service";
import { UserService } from "../user/user.service";
import { AuthGuard } from "../user/auth.guard";
import { getUser, TokenRequest } from "../user/dto/user.validate";
import { ReportService } from "../report/report.service";
import { ReportEnum } from "../report/report.enum";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Wash controller')
@Controller('wash')
export class WashController {

  constructor(
    private readonly washService: WashService,
    private readonly userService: UserService,
    private readonly reportService: ReportService,
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
  async broke(@Req() tokenRequest: TokenRequest)
  {
    const user = await getUser(tokenRequest, this.userService);
    await this.reportService.make({
      type: ReportEnum.Broke,
      body: "Machine was broke",
    }, user);
    return this.washService.broke();
  }

  @UseGuards(AuthGuard)
  @Post('/fix')
  async fix(@Req() tokenRequest: TokenRequest)
  {
    const user = await getUser(tokenRequest, this.userService);
    await this.reportService.make({
      type: ReportEnum.Fix,
      body: "Machine fixed",
    }, user);

    return this.washService.fix()
  }

}

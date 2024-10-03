import { BadRequestException, Controller, ForbiddenException, Get, Post, Req, UseGuards } from "@nestjs/common";
import { WashService } from "./wash.service";
import { UserService } from "../user/user.service";
import { AuthGuard } from "../user/auth.guard";
import { getUser, TokenRequest } from "../user/dto/user.validate";
import { ReportService } from "../report/report.service";
import { ReportEnum } from "../report/report.enum";
import { ApiTags } from "@nestjs/swagger";
import { RelationService } from "../relation/relation.service";

@ApiTags('Wash controller')
@Controller('wash')
export class WashController {

  constructor(
    private readonly washService: WashService,
    private readonly userService: UserService,
    private readonly reportService: ReportService,
    private readonly relationService: RelationService,
  ) {}

  @Get('/all')
  getAll()
  {
    return this.washService.getAll();
  }

  @UseGuards(AuthGuard)
  @Get('/status')
  async getStatus(@Req() tokenRequest: TokenRequest)
  {
    const user = await getUser(tokenRequest, this.userService);
    return this.washService.getStatus(user.link_machine);
  }

  @UseGuards(AuthGuard)
  @Post('/occupy')
  async occupy(@Req() tokenRequest: TokenRequest)
  {
    const user = await getUser(tokenRequest, this.userService);

    if(!user.link_machine)
      throw new ForbiddenException('You aren\'t linked to machine');

    return this.washService.occupy(user);
  }

  @UseGuards(AuthGuard)
  @Post('/occupy-order')
  async occupyOrder(@Req() tokenRequest: TokenRequest)
  {
    const user = await getUser(tokenRequest, this.userService);
    return this.washService.occupyOrder(user);
  }

  @UseGuards(AuthGuard)
  @Post('/end')
  async end(@Req() tokenRequest: TokenRequest)
  {
    const user = await getUser(tokenRequest, this.userService);

    if(!user.link_machine)
      throw new BadRequestException('You aren\'t linked to machine');

    return this.washService.end(user);
  }

  // @UseGuards(AuthGuard)
  // @Post('/broke')
  // async broke(@Req() tokenRequest: TokenRequest)
  // {
  //   const user = await getUser(tokenRequest, this.userService);
  //
  //   if(!user.link_machine)
  //     throw new ForbiddenException('You are not linked to machine');
  //
  //   await this.reportService.make({
  //     type: ReportEnum.Break,
  //     body: "Machine was broke",
  //   }, user);
  //
  //   return this.washService.broke(user.link_machine);
  // }
  //
  // @UseGuards(AuthGuard)
  // @Post('/fix')
  // async fix(@Req() tokenRequest: TokenRequest)
  // {
  //   const user = await getUser(tokenRequest, this.userService);
  //
  //   if(!user.link_machine)
  //     throw new BadRequestException('You are not linked to machine');
  //
  //   const relation = await this.relationService.findAdminOfMachine(user.link_machine);
  //   if(relation.user.uuid != user.uuid)
  //     throw new BadRequestException('You are not admin of this machine')
  //
  //   await this.reportService.make({
  //     type: ReportEnum.Fix,
  //     body: "Machine fixed",
  //   }, user);
  //
  //   return this.washService.fix(user.link_machine)
  // }

}

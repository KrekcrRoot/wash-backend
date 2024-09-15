import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../user/auth.guard";
import { getUser, TokenRequest } from "../user/dto/user.validate";
import { UserService } from "../user/user.service";
import { ReportService } from "./report.service";
import { StoreReportDto } from "./dto/store.report.dto";

@Controller('report')
export class ReportController {

  constructor(
    private readonly userService: UserService,
    private readonly reportService: ReportService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('/store')
  async makeReport(@Req() tokenRequest: TokenRequest, @Body() report: StoreReportDto)
  {
    const user = await getUser(tokenRequest, this.userService);
    return this.reportService.make(report, user);
  }

}

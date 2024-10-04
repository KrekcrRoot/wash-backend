import { Body, Controller, ForbiddenException, forwardRef, Inject, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../user/auth.guard";
import { getUser, TokenRequest } from "../user/dto/user.validate";
import { UserService } from "../user/user.service";
import { ReportService } from "./report.service";
import { StoreReportDto } from "./dto/store.report.dto";
import { ReportEnum } from "./report.enum";
import { ApiTags } from "@nestjs/swagger";
import { Repository } from "typeorm";
import { MachineEntity } from "../machine/dto/machine.entity";
import { RelationService } from "../relation/relation.service";
import { WashService } from "../wash/wash.service";

@ApiTags('Report controller')
@Controller('report')
export class ReportController {

  constructor(
    private readonly userService: UserService,
    private readonly reportService: ReportService,
    @Inject('MACHINE_REPOSITORY') private readonly machineRepository: Repository<MachineEntity>,
    private readonly relationService: RelationService,
    @Inject(forwardRef(() => WashService)) private washService: WashService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('/lost')
  async makeReport(@Req() tokenRequest: TokenRequest, @Body() report: StoreReportDto)
  {
    report.type = ReportEnum.Lost;
    const user = await getUser(tokenRequest, this.userService);
    return this.reportService.make(report, user);
  }

  @UseGuards(AuthGuard)
  @Post('/break')
  async breakMachine(@Req() tokenRequest: TokenRequest, @Body() report: StoreReportDto)
  {
    report.type = ReportEnum.Break;
    const user = await getUser(tokenRequest, this.userService);

    const machine = await this.machineRepository.findOne({
      where: {
        uuid: user.link_machine.uuid,
      },
    });

    await this.washService.hardEnd(machine);
    machine.broken = true;
    machine.isActive = false;

    const response = await this.reportService.make(report, user);
    machine.broken_report = response;

    await this.machineRepository.save(machine);
    return response;
  }

  @UseGuards(AuthGuard)
  @Post('/fix')
  async fixMachine(@Req() tokenRequest: TokenRequest)
  {
    const user = await getUser(tokenRequest, this.userService);

    const machine = await this.machineRepository.findOne({
      where: {
        uuid: user.link_machine.uuid,
      },
    });

    const admin = (await this.relationService.findAdminOfMachine(user.link_machine)).user;

    if(admin.uuid != user.uuid)
      throw new ForbiddenException('You are not admin of this machine');

    machine.broken = false;
    machine.broken_report = null;

    return this.machineRepository.save(machine);
  }

}

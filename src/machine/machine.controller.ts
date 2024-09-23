import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  forwardRef,
  Get,
  HttpStatus,
  Inject,
  Param, Patch,
  Post,
  Req,
  UseGuards
} from "@nestjs/common";
import { MachineService } from "./machine.service";
import { AuthGuard } from "../user/auth.guard";
import { UserService } from "../user/user.service";
import { getUser, TokenRequest } from "../user/dto/user.validate";
import { MachineSearchDto } from "./dto/machine.search.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserEntity } from "../user/dto/user.entity";
import { RelationService } from "../relation/relation.service";
import { WashService } from "../wash/wash.service";
import { WashStatusEnum } from "../wash/wash.status.enum";
import { RenameMachineDto } from "./dto/rename.machine.dto";

// @ts-ignore
@ApiTags('Machine controller')
@Controller('machine')
export class MachineController {

  constructor(
    private machineService: MachineService,
    private userService: UserService,
    private relationService: RelationService,
    @Inject(forwardRef(() => WashService)) private washService: WashService,
  ) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: UserEntity,
    isArray: false,
    description: 'linking machine',
  })
  @ApiOperation({ summary: 'linking machine' })
  @UseGuards(AuthGuard)
  @Post('/link')
  async linkMachine(@Req() request: TokenRequest, @Body() data: MachineSearchDto)
  {
    const user = await getUser(request, this.userService);
    const machine = await this.machineService.getByUuid(data.uuid);

    if(user.link_machine)
    {
      const status = await this.washService.getStatus(user.link_machine);
      if(
        (status.status == WashStatusEnum.Busy || status.status == WashStatusEnum.Waiting)
        && status.telegramTag == user.telegram_tag
      )
        throw new ForbiddenException('You can\'t relink to another machine while washing');
    }


    if(!machine)
      throw new BadRequestException('There are no machine with this title');

    return this.machineService.linkMachine(machine, user);
  }

  @UseGuards(AuthGuard)
  @Post('/unlink')
  async unlinkMachine(@Req() request: TokenRequest)
  {
    const user = await getUser(request, this.userService);

    if(!user.link_machine)
      throw new BadRequestException('You already not linked to any machines');

    const status = await this.washService.getStatus(user.link_machine);
    if(
      (status.status == WashStatusEnum.Busy || status.status == WashStatusEnum.Waiting)
      && status.telegramTag == user.telegram_tag
    )
      throw new ForbiddenException('You can\'t unlink from machine while washing');

    return this.machineService.unlinkMachine(user);
  }

  @Get('/all')
  async getAll()
  {
    return this.machineService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('/my')
  async getMyMachine(@Req() request: TokenRequest)
  {
    const user = await getUser(request, this.userService);
    const relations = await this.relationService.findAll(user);
    return relations.map(relation => relation.machine);
  }

  @Get('/:title/admin')
  async getAdmin(@Param() params: {title: string})
  {
    const machine = await this.machineService.findMachine(params.title);

    if(!machine)
      throw new BadRequestException('There are no machine with this title');

    return this.machineService.getAdmin(machine);
  }

  @Patch('/rename')
  async renameMachine(@Req() tokenRequest: TokenRequest, @Body() renameMachineDto: RenameMachineDto)
  {
    const user = await getUser(tokenRequest, this.userService);
    const relation = await this.relationService.findAdminOfMachine(user.link_machine);

    if(relation.user.uuid != user.uuid)
      throw new ForbiddenException('You aren\'t admin');

    return this.machineService.rename(renameMachineDto);
  }

}

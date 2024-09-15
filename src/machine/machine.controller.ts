import { BadRequestException, Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { MachineService } from "./machine.service";
import { AuthGuard } from "../user/auth.guard";
import { UserService } from "../user/user.service";
import { getUser, TokenRequest } from "../user/dto/user.validate";
import { MachineSearchDto } from "./dto/machine.search.dto";

@Controller('machine')
export class MachineController {

  constructor(
    private machineService: MachineService,
    private userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('/link')
  async linkMachine(@Req() request: TokenRequest, @Body() data: MachineSearchDto)
  {
    const user = await getUser(request, this.userService);
    const machine = await this.machineService.findMachine(data.title);

    if(!machine)
      throw new BadRequestException('There are no machine with this title');

    return this.machineService.linkMachine(machine, user);
  }

  @UseGuards(AuthGuard)
  @Post('/unlink')
  async unlinkMachine(@Req() request: TokenRequest)
  {
    const user = await getUser(request, this.userService);
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
    return user.link_machine;
  }

  @Get('/:title/admin')
  async getAdmin(@Param() params: {title: string})
  {
    const machine = await this.machineService.findMachine(params.title);

    if(!machine)
      throw new BadRequestException('There are no machine with this title');

    return this.machineService.getAdmin(machine);
  }

}

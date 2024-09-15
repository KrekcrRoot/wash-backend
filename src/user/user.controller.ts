import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { PrecreateUserDto } from "./dto/precreate.user.dto";
import { AuthUserDto } from "./dto/auth.user.dto";

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get('/all')
  async getAll() {
    return this.userService.getAll();
  }

  @Post('/create')
  async create(@Body() precreateUserDto: PrecreateUserDto)
  {
    return this.userService.create(precreateUserDto);
  }

  @Post('/auth')
  async auth(@Body() authUserDto: AuthUserDto)
  {
    return this.userService.auth(authUserDto);
  }

}

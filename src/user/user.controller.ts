import { BadRequestException, Body, Controller, ForbiddenException, Get, Post, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { PrecreateUserDto } from "./dto/precreate.user.dto";
import { AuthUserDto } from "./dto/auth.user.dto";
import { AuthGuard } from "./auth.guard";
import { getUser, TokenRequest } from "./dto/user.validate";
import { UserTypeEnum } from "./dto/user.type.enum";
import { UserRegisterDto } from "./dto/user.register.dto";
import { KickUserDto } from "./dto/kick.user.dto";

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

  @UseGuards(AuthGuard)
  @Post('/reg')
  async registration(@Req() tokenRequest: TokenRequest, @Body() registerUser: UserRegisterDto)
  {
    const user = await getUser(tokenRequest, this.userService);

    if(user.type != UserTypeEnum.Admin)
      throw new BadRequestException('User is not admin');

    return this.userService.register(registerUser);
  }

  @Post('/auth')
  async auth(@Body() authUserDto: AuthUserDto)
  {
    return this.userService.auth(authUserDto);
  }

  @UseGuards(AuthGuard)
  @Post('/kick')
  async kick(@Req() tokenRequest: TokenRequest, @Body() kickUserDto: KickUserDto)
  {
    const user = await getUser(tokenRequest, this.userService);
    if(user.type != UserTypeEnum.Admin)
      throw new ForbiddenException();

    return this.userService.kick(kickUserDto);
  }

}

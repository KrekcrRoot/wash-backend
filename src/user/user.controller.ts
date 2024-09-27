import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get, HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards
} from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthUserDto } from "./dto/auth.user.dto";
import { AuthGuard } from "./auth.guard";
import { getUser, TokenRequest } from "./dto/user.validate";
import { UserRegisterDto } from "./dto/user.register.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserEntity } from "./dto/user.entity";
import { RelationService } from "../relation/relation.service";

@ApiTags('User controller')
@Controller('user')
export class UserController {

  constructor(
    private readonly userService: UserService,
    private readonly relationService: RelationService,
  ) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: UserEntity,
    isArray: true,
    description: 'Response all users',
  })
  @ApiOperation({ summary: 'Find all users' })
  @Get('/all')
  async getAll() {
    return this.userService.getAll();
  }

  // @UseGuards(AuthGuard)
  // @Post('/reg')
  // async registration(@Req() tokenRequest: TokenRequest, @Body() registerUser: UserRegisterDto)
  // {
  //   const user = await getUser(tokenRequest, this.userService);
  //   const relation = await this.relationService.findAdmin(user);
  //
  //   if(!relation)
  //     throw new ForbiddenException();
  //
  //   return this.userService.register(registerUser, relation.machine);
  // }

  @HttpCode(HttpStatus.OK)
  @Post('/auth')
  async auth(@Body() authUserDto: AuthUserDto)
  {
    return this.userService.auth(authUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('/my')
  async getMy(@Req() tokenRequest: TokenRequest)
  {
    return await getUser(tokenRequest, this.userService);
  }

}

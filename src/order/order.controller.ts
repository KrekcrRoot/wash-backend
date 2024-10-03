import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../user/auth.guard";
import { OrderService } from "./order.service";
import { UserService } from "../user/user.service";
import { getUser, TokenRequest } from "../user/dto/user.validate";

@ApiTags('Order controller')
@Controller('order')
export class OrderController {

  constructor(
    private orderService: OrderService,
    private userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('/apply')
  async applyWash(@Req() tokenRequest: TokenRequest)
  {
    const user = await getUser(tokenRequest, this.userService);
    return this.orderService.apply(user);
  }

  @UseGuards(AuthGuard)
  @Post('/cancel')
  async cancelWash(@Req() tokenRequest: TokenRequest)
  {
    const user = await getUser(tokenRequest, this.userService);
    return this.orderService.cancel(user);
  }

  @UseGuards(AuthGuard)
  @Get('/get-last')
  async getOrder(@Req() tokenRequest: TokenRequest)
  {
    const user = await getUser(tokenRequest, this.userService);
    return this.orderService.getLastOrder(user.link_machine);
  }

  @Get('/history')
  async getOrderHistory(@Req() tokenRequest: TokenRequest)
  {
    const user = await getUser(tokenRequest, this.userService);
    return this.orderService.getHistory(user.link_machine);
  }

}

import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { OrderEntity } from "./order.enitity";
import { WashEntity } from "../wash/dto/wash.entity";
import { UserEntity } from "../user/dto/user.entity";

@Injectable()
export class OrderService {

  constructor(
    @Inject('ORDER_REPOSITORY') private orderRepository: Repository<OrderEntity>
  ) {}

  async link(user: UserEntity, wash: WashEntity)
  {
    const exists = await this.orderRepository.findOne({
      where: {
        wash: {
          id: wash.id,
        },
      },
    });

    if(exists)
      throw new ForbiddenException('You can\'t order machine');


  }

}

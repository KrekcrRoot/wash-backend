import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { OrderEntity } from "./order.entity";
import { WashEntity } from "../wash/dto/wash.entity";
import { UserEntity } from "../user/dto/user.entity";
import { WashService } from "../wash/wash.service";
import { MachineEntity } from "../machine/dto/machine.entity";

@Injectable()
export class OrderService {

  constructor(
    @Inject('ORDER_REPOSITORY') private orderRepository: Repository<OrderEntity>,
    @Inject(forwardRef(() => WashService)) private washService: WashService,
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

  async apply(user: UserEntity)
  {
    await this.cancel(user);
    return await this.washService.occupy(user);
  }

  async cancel(user: UserEntity)
  {
    const order = await this.orderRepository.findOne({
      where: {
        wash: {
          machine: {
            uuid: user.link_machine.uuid,
          },
        },
        relevance: true,
      },
      relations: {
        wash: true,
      },
    });

    if(!order)
      throw new BadRequestException('You don\'t have any orders');

    order.relevance = false;
    await this.orderRepository.save(order);
  }

  async getLastOrder(machine: MachineEntity)
  {
    return this.orderRepository.findOne({
      where: {
        wash: {
          machine: {
            uuid: machine.uuid,
          },
        },
        relevance: true,
      },
      relations: {
        user: true,
        wash: true,
      },
    });
  }

}

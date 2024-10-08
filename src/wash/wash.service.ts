import { BadRequestException, ForbiddenException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { WashEntity } from "./dto/wash.entity";
import { MachineEntity } from "../machine/dto/machine.entity";
import { WashStatusDto } from "./dto/wash.status.dto";
import { UserEntity } from "../user/dto/user.entity";
import { WashTotalDto } from "./dto/wash.total.dto";
import { WashStatusEnum } from "./wash.status.enum";
import { OrderEntity } from "../order/order.entity";
import { ConnectionService } from "../connection/connection.service";
import { RelationService } from "../relation/relation.service";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class WashService {

  constructor(
    @Inject('WASH_REPOSITORY') private washRepository: Repository<WashEntity>,
    @Inject('MACHINE_REPOSITORY') private machineRepository: Repository<MachineEntity>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<UserEntity>,
    @Inject('ORDER_REPOSITORY') private orderRepository: Repository<OrderEntity>,
    private readonly connectionService: ConnectionService,
    private readonly relationService: RelationService,
  ) {}

  async getAll()
  {
    return this.washRepository.find({
      where: {},
      order: {
        id: 'desc',
      },
    });
  }

  async getLatest()
  {
    return await this.washRepository.findOne({
      where: {},
      order: {
        id: 'DESC',
      },
      relations: {
        user: true,
      },
    });
  }

  async getLatestOfMachine(machine: MachineEntity)
  {
    return this.washRepository.findOne({
      where: {
        machine: {
          uuid: machine.uuid,
        },
      },
      relations: {
        user: true,
        machine: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async getStatus(machineDto: MachineEntity)
  {
    const machine = await this.machineRepository.findOne({
      where: {
        uuid: machineDto.uuid
      },
      relations: {
        broken_report: true,
      },
    });

    if(machine.broken)
    {
      return {
        status: WashStatusEnum.Broken,
        reportBody: machine.broken_report.body,
      } as WashStatusDto;
    }


    const status: WashStatusDto = {
      status: WashStatusEnum.Free,
    };

    const wash = await this.getLatestOfMachine(machine);

    if(!wash)
      return status;

    const order = await this.orderRepository.findOne({
      where: {
        wash: {
          id: wash.id,
        },
        relevance: true,
      },
      relations: {
        user: true,
        wash: true,
      },
    });

    if(!machine.isActive && !order)
      return status;

    if(!machine.isActive && order)
    {
      const relevance = await this.checkOrderRelevance(order);

      if(!relevance)
        return status;

      status.status = WashStatusEnum.Waiting;
      status.telegramTag = order.user.telegram_tag;
      status.timeBegin = wash.time_end;

      return status;
    }

    if(machine.isActive)
    {
      const relevance = await this.checkWashRelevance(wash);

      if(order && !relevance)
      {
        const orderRelevance = await this.checkOrderRelevance(order);

        if(orderRelevance)
        {
          status.status = WashStatusEnum.Waiting;
          status.telegramTag = order.user.telegram_tag;
          status.timeBegin = new Date();
        }

        return status;
      }

      if(relevance && order)
      {
        status.status = WashStatusEnum.Ordered;
        status.telegramTag = wash.user.telegram_tag;
        status.timeBegin = wash.time_begin;
        return status;
      }

      if(relevance)
      {
        status.status = WashStatusEnum.Busy;
        status.telegramTag = wash.user.telegram_tag;
        status.timeBegin = wash.time_begin;
      }

      return status;
    }

  }

  async checkWashRelevance(wash: WashEntity)
  {
    if(!wash.time_end)
    {
      const now = new Date();
      const time = now.getTime() - wash.time_begin.getTime();

      if(time / (1000 * 60 * 60) >= 3)
      {
        wash.time_end = now;
        wash.hard_end = true;
        wash.machine.isActive = false;
        wash.user.trust_factor--;
        wash.user.time += 3 * 60;

        await this.userRepository.save(wash.user);
        await this.machineRepository.save(wash.machine);
        await this.washRepository.save(wash);

        return false;
      }

      return true;
    }

    return false;

  }

  async checkOrderRelevance(orderDto: OrderEntity)
  {
    const order = await this.orderRepository.findOne({
      where: {
        uuid: orderDto.uuid,
      },
      relations: {
        user: true,
        wash: true,
      },
    });

    if(!order.relevance)
      return false;

    if(!order.wash.time_end)
      return true;

    const now = new Date();
    const time = now.getTime() - order.wash.time_end.getTime();

    if(time / (1000 * 60) >= 20)
    {
      order.relevance = false;
      order.user.trust_factor--;
      await this.userRepository.save(order.user);
      await this.orderRepository.save(order);

      return false;
    }

    return true;
  }

  async occupy(user: UserEntity)
  {
    const status = await this.getStatus(user.link_machine);

    if(status.status == WashStatusEnum.Busy || status.status == WashStatusEnum.Waiting && user.telegram_tag != status.telegramTag)
    {
      throw new BadRequestException('already occupy');
    }

    const machine = user.link_machine;
    machine.isActive = true;
    await this.machineRepository.save(machine);

    user.count += 1;
    await this.userRepository.save(user);

    const washDto: WashEntity = this.washRepository.create({ machine, user });
    const wash = await this.washRepository.save(washDto);

    this.connectionService.notificationWash(wash).then();
    this.connectionService.timeoutWash({ wash, user }).then();

    if(status.status == WashStatusEnum.Waiting)
    {
      const order = await this.orderRepository.findOne({
        where: {
          relevance: true,
          user: {
            uuid: user.uuid,
          },
          wash: {
            machine: {
              uuid: machine.uuid,
            },
          },
        },
        relations: {
          user: true,
          wash: true,
        },
      });

      if(!order)
        return wash;

      order.relevance = false;

      await this.orderRepository.save(order);
    }

    return wash;

  }

  async occupyOrder(user: UserEntity)
  {
    const machine = user.link_machine;
    const status = await this.getStatus(machine);

    if(status.status == WashStatusEnum.Free)
    {
      throw new ForbiddenException('You can\'t occupy order');
    }

    const wash = await this.getLatestOfMachine(machine);

    const exists = await this.orderRepository.findOne({
      where: {
        wash: {
          id: wash.id,
        },
        relevance: true,
      },
    });

    if(exists)
      throw new ForbiddenException('You can\'t occupy order');

    const order = this.orderRepository.create({
      user: user,
      wash: wash,
    });

    return await this.orderRepository.save(order);
  }

  async hardEnd(machine: MachineEntity)
  {
    const wash = await this.getLatestOfMachine(machine);

    if(!wash)
      throw new BadRequestException('There are no washing right now');

    wash.hard_end = true;
    wash.time_end = new Date();
    wash.user.time += Math.round((wash.time_end.getTime() - wash.time_begin.getTime()) / (1000 * 60));

    await this.washRepository.save(wash);
    await this.userRepository.save(wash.user);

    return HttpStatus.OK;

  }

  async end(user: UserEntity)
  {
    const status = await this.getStatus(user.link_machine);

    if(status.status == WashStatusEnum.Free)
      throw new BadRequestException('already ended');

    if((await this.relationService.findAdminOfMachine(user.link_machine)).user.uuid == user.uuid)
    {
      const machine = user.link_machine;
      machine.isActive = false;
      await this.machineRepository.save(machine);

      const wash: WashEntity = await this.washRepository.findOne({
        where: {
          machine: {
            uuid: machine.uuid,
          },
          time_end: null,
        },
        order: {
          id: 'desc',
        },
        relations: {
          user: true,
        },
      })

      wash.time_end = new Date();
      await this.washRepository.save(wash);
      wash.user.time += Math.round((wash.time_end.getTime() - wash.time_begin.getTime()) / (1000 * 60));

      await this.userRepository.save(wash.user);

      this.connectionService.orderFree(wash).then();

      return {
        elapsedTime: (wash.time_end.getTime() - wash.time_begin.getTime()) / (1000 * 60)
      } as WashTotalDto;
    }

    const wash: WashEntity = await this.washRepository.findOne({
      where: {
        user: {
          uuid: user.uuid,
        },
        time_end: null,
      },
      order: {
        id: 'desc',
      },
    });

    if(!wash)
      throw new BadRequestException('You don\'t have any washes');

    const machine = user.link_machine;
    machine.isActive = false;
    await this.machineRepository.save(machine);

    wash.time_end = new Date();
    await this.washRepository.save(wash);
    user.time += Math.round((wash.time_end.getTime() - wash.time_begin.getTime()) / (1000 * 60));
    user.trust_factor += 1;
    await this.userRepository.save(user);

    this.connectionService.orderFree(wash).then();

    return {
      elapsedTime: (wash.time_end.getTime() - wash.time_begin.getTime()) / (1000 * 60)
    } as WashTotalDto;
  }

  async broke(machine: MachineEntity)
  {
    machine.broken = true;
    return this.machineRepository.save(machine);
  }

  async fix(machine: MachineEntity)
  {
    machine.broken = false;
    return this.machineRepository.save(machine);
  }

}

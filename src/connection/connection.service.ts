import { Inject, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { TimeoutWashDto } from "./dto/timeout.wash.dto";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import { WashEntity } from "../wash/dto/wash.entity";
import { OrderEntity } from "../order/order.entity";
import { ReportEntity } from "../report/report.entity";
import { MachineEntity } from "../machine/dto/machine.entity";
import { UserEntity } from "../user/dto/user.entity";

const delay = (t) => new Promise(resolve => setTimeout(resolve, t));

@Injectable()
export class ConnectionService {

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject('WASH_REPOSITORY') private readonly washRepository: Repository<WashEntity>,
    @Inject('ORDER_REPOSITORY') private readonly orderRepository: Repository<OrderEntity>,
  ) {
    this.host =
      this.configService.get<string>('AIOGRAM_HOST') + ':' +
      this.configService.get<string>('AIOGRAM_PORT');
  }

  private readonly host: string;

  async machineBreak(report: ReportEntity, machine: MachineEntity, user: UserEntity)
  {
    return this.httpService.post(`${this.host}/machine/break`, {
      machine_uuid: machine.uuid,
      body: report.body,
      user_uuid: user.uuid,
    });
  }

  async timeoutWash(timeoutWashDto: TimeoutWashDto)
  {
    await delay(1000 * 60 * 60 * 3);

    const wash = await this.washRepository.findOne({
      where: {
        id: timeoutWashDto.wash.id,
      },
    });

    if(!wash.time_end)
      this.httpService.post(`${this.host}/timeout`,
    {
            user_id: timeoutWashDto.user.telegram_id,
            user_tag: timeoutWashDto.user.telegram_tag,
            wash_id: timeoutWashDto.wash.id,
          },
      );
  }

  async orderFree(wash: WashEntity)
  {
    const order = await this.orderRepository.findOne({
      where: {
        relevance: true,
        wash: {
          id: wash.id,
        },
      },
      relations: {
        wash: true,
        user: true,
      },
    });

    if(order)
      this.httpService.post(`${this.host}/order-free`, {
        wash_id: wash.id,
        user_id: order.user.telegram_id,
        user_tag: order.user.telegram_tag,
      });
  }

  async notificationWash(washDto: WashEntity)
  {
    await delay(1000 * 60 * 90);

    const wash = await this.washRepository.findOne({
      where: {
        id: washDto.id,
      },
    });

    if(!wash.time_end)
      this.httpService.post(`${this.host}/notification-wash`,
        {
          user_id: wash.user.telegram_id,
          user_tag: wash.user.telegram_tag,
          wash_id: wash.id,
        },
      );

  }

}

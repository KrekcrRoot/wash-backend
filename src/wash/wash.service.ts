import { BadRequestException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { WashEntity } from "./dto/wash.entity";
import { MachineEntity } from "../machine/dto/machine.entity";
import { WashStatusDto } from "./dto/wash.status.dto";
import { UserEntity } from "../user/dto/user.entity";
import { WashTotalDto } from "./dto/wash.total.dto";

@Injectable()
export class WashService {

  constructor(
    @Inject('WASH_REPOSITORY') private washRepository: Repository<WashEntity>,
    @Inject('MACHINE_REPOSITORY') private machineRepository: Repository<MachineEntity>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<UserEntity>,
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

  async getStatus()
  {
    const machine = (await this.machineRepository.find())[0];

    let status: WashStatusDto = {
      isActive: machine.isActive,
    };

    if(!status.isActive)
      return status;

    const wash = await this.getLatest();
    const now = new Date();
    const time = now.getTime() - wash.time_begin.getTime();

    if(time / (1000 * 60 * 60) >= 3)
    {
      wash.hard_end = true;
      wash.time_end = now;
      await this.washRepository.save(wash);
      machine.isActive = false;
      await this.machineRepository.save(machine);
      status.isActive = false;
      wash.user.time += 3 * 60;
      wash.user.trust_factor -= 5;
      await this.userRepository.save(wash.user);
      return status;
    }

    status.telegramTag = wash.user.telegram_tag;
    status.timeBegin = wash.time_begin

    return status;
  }

  async occupy(user: UserEntity)
  {
    const status = await this.getStatus();

    if(status.isActive)
    {
      throw new BadRequestException('already occupy');
    }

    const machine = (await this.machineRepository.find())[0];
    machine.isActive = true;
    await this.machineRepository.save(machine);

    user.count += 1;
    await this.userRepository.save(user);

    const wash: WashEntity = this.washRepository.create({ machine, user });
    return this.washRepository.save(wash);

  }

  async end(user: UserEntity)
  {
    const status = await this.getStatus();

    if(!status.isActive)
      throw new BadRequestException('already ended');

    const wash: WashEntity = await this.washRepository.findOne({
      where: {
        user: {
          uuid: user.uuid,
        },
      },
      order: {
        id: 'desc',
      },
    });

    if(wash.time_end !== null)
    {
      throw new BadRequestException('You don\'t have any washes');
    }

    const machine = (await this.machineRepository.find())[0];
    machine.isActive = false;
    await this.machineRepository.save(machine);

    wash.time_end = new Date();
    await this.washRepository.save(wash);
    user.time += Math.round((wash.time_end.getTime() - wash.time_begin.getTime()) / (1000 * 60));
    user.trust_factor += 1;
    await this.userRepository.save(user);

    return {
      elapsedTime: (wash.time_end.getTime() - wash.time_begin.getTime()) / (1000 * 60)
    } as WashTotalDto;
  }

  async broke()
  {
    const machine = (await this.machineRepository.find())[0];
    machine.broken = true;
    return this.machineRepository.save(machine);
  }

  async fix()
  {
    const machine = (await this.machineRepository.find())[0];
    machine.broken = false;
    return this.machineRepository.save(machine);
  }

}

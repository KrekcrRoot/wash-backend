import { Inject, Injectable } from "@nestjs/common";
import { ILike, Repository } from "typeorm";
import { MachineEntity } from "./dto/machine.entity";
import { UserEntity } from "../user/dto/user.entity";

@Injectable()
export class MachineService {

  constructor(
    @Inject('MACHINE_REPOSITORY') private machineRepository: Repository<MachineEntity>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<UserEntity>,
  ) {}

  async findAll()
  {
    return this.machineRepository.find();
  }

  async findMachine(title: string)
  {
    return this.machineRepository.findOne({
      where: {
        title: ILike(`%${title}%`),
      },
    });
  }

  async linkMachine(machine: MachineEntity, user: UserEntity)
  {
    user.link_machine = machine;
    return await this.userRepository.save(user);
  }

  async unlinkMachine(user: UserEntity)
  {
    user.link_machine = null;
    return await this.userRepository.save(user);
  }

}

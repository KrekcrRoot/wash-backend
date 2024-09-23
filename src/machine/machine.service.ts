import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ILike, Repository } from "typeorm";
import { MachineEntity } from "./dto/machine.entity";
import { UserEntity } from "../user/dto/user.entity";
import { RelationEntity } from "../relation/relation.entity";
import { RelationTypeEnum } from "../relation/relation.type.enum";
import { RenameMachineDto } from "./dto/rename.machine.dto";

@Injectable()
export class MachineService {

  constructor(
    @Inject('MACHINE_REPOSITORY') private machineRepository: Repository<MachineEntity>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<UserEntity>,
    @Inject('RELATION_REPOSITORY') private relationRepository: Repository<RelationEntity>
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

  async getByUuid(uuid: string)
  {
    return this.machineRepository.findOne({
      where: {
        uuid: uuid,
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

  async getAdmin(machine: MachineEntity)
  {

    const relation = await this.relationRepository.findOne({
      where: {
        machine: {
          uuid: machine.uuid,
        },
        type: RelationTypeEnum.Admin,
      },
      relations: {
        user: true,
        machine: true,
      },
    })

    if(!relation)
      throw new BadRequestException('There are no admin linked to this machine');

    return relation.user;
  }

  async rename(renameMachineDto: RenameMachineDto)
  {
    const machine = await this.machineRepository.findOne({
      where: {
        uuid: renameMachineDto.uuid,
      },
    });

    machine.title = renameMachineDto.title;
    return this.machineRepository.save(machine);
  }

}

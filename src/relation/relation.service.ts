import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { RelationEntity } from "./relation.entity";
import { UserEntity } from "../user/dto/user.entity";
import { MachineEntity } from "../machine/dto/machine.entity";
import { RelationTypeEnum } from "./relation.type.enum";

@Injectable()
export class RelationService {

  constructor(
    @Inject('RELATION_REPOSITORY') private relationRepository: Repository<RelationEntity>
  ) {}

  findAdmin(user: UserEntity)
  {
    return this.relationRepository.findOne({
      where: {
        user: {
          uuid: user.uuid,
        },
        type: RelationTypeEnum.Admin,
      },
      relations: {
        user: true,
        machine: true,
      },
    });
  }

  find(user: UserEntity, machine: MachineEntity)
  {

  }

  findAll(user: UserEntity)
  {
    return this.relationRepository.find({
      where: {
        user: {
          uuid: user.uuid,
        },
      },
      relations: {
        machine: true,
      },
    })
  }

  async createRelation(user: UserEntity, machine: MachineEntity)
  {
    const relation = this.relationRepository.create({ user, machine })
    return this.relationRepository.save(relation);
  }

  async removeRelation(user: UserEntity, machine: MachineEntity)
  {
    const relation = await this.relationRepository.findOne({
      where: {
        user: {
          uuid: user.uuid,
        },
        machine: {
          uuid: machine.uuid,
        },
      },
    });

    return this.relationRepository.remove(relation);
  }

}


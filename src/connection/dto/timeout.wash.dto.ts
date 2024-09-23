import { UserEntity } from "../../user/dto/user.entity";
import { WashEntity } from "../../wash/dto/wash.entity";

export class TimeoutWashDto
{
  wash: WashEntity
  user: UserEntity;
}
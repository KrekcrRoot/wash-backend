import { DataSource } from "typeorm";
import { UserEntity } from "./dto/user.entity";

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserEntity),
    inject: ['DATA_SOURCE'],
  }
]
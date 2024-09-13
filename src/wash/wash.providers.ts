import { DataSource } from "typeorm";
import { WashEntity } from "./dto/wash.entity";

export const washProviders = [
  {
    provide: 'WASH_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(WashEntity),
    inject: ['DATA_SOURCE']
  }
]
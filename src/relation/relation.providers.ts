import { DataSource } from "typeorm";
import { RelationEntity } from "./relation.entity";

export const relationProviders = [
  {
    provide: 'RELATION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(RelationEntity),
    inject: ['DATA_SOURCE'],
  },
]
import { DataSource } from "typeorm";
import { MachineEntity } from "./dto/machine.entity";


export const machineProviders = [
  {
    provide: 'MACHINE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(MachineEntity),
    inject: ['DATA_SOURCE'],
  },
]
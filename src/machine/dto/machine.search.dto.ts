import { IsNotEmpty, IsString, IsUUID } from "class-validator";


export class MachineSearchDto
{
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  uuid: string;
}
import { IsNotEmpty, IsString } from "class-validator";


export class MachineSearchDto
{
  @IsNotEmpty()
  @IsString()
  title: string;
}
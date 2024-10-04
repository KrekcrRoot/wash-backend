import { IsNotEmpty, IsString } from "class-validator";

export class TitleMachineDto
{
  @IsNotEmpty()
  @IsString()
  title: string;
}
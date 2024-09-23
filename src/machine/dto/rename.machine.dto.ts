import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class RenameMachineDto
{
  @IsUUID()
  uuid: string;

  @IsNotEmpty()
  @IsString()
  title: string;
}
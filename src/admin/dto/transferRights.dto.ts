import { IsNotEmpty, IsString } from "class-validator";

export class TransferRightsDto
{
  @IsString()
  @IsNotEmpty()
  telegram_tag: string;
}
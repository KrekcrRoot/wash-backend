import { IsNotEmpty, IsString } from "class-validator";

export class KickUserDto
{
  @IsString()
  @IsNotEmpty()
  telegram_tag: string;
}
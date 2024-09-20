import { IsNotEmpty, IsString } from "class-validator";

export class TelegramTagUserDto
{
  @IsString()
  @IsNotEmpty()
  telegram_tag: string;
}
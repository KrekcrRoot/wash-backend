import { IsNotEmpty, IsString } from "class-validator";

export class UserRegisterDto
{
  @IsString()
  @IsNotEmpty()
  telegram_tag: string;

  @IsString()
  @IsNotEmpty()
  room: string;
}
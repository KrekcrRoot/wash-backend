import { IsNotEmpty, IsString } from "class-validator";

export class AuthUserDto
{
  @IsString()
  @IsNotEmpty()
  telegram_tag: string;

  @IsString()
  @IsNotEmpty()
  telegram_id: string;
}
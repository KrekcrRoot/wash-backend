import { IsNotEmpty } from "class-validator";

export class UserTelegramIdDto {
  @IsNotEmpty()
  telegramId: string;
}
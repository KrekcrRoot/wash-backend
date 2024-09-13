import { BadRequestException } from "@nestjs/common";
import { UserService } from "../user.service";

export class TokenRequest {
  headers: {
    authorization: string;
  };
}

export async function getUser(request: TokenRequest, userService: UserService)
{
  const user = await userService.findByTelegramId({
    telegramId: request.headers.authorization,
  });

  if(!user)
    throw new BadRequestException('There are no user');

  return user;
}
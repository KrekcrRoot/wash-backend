import { IsNotEmpty, IsString } from "class-validator";

export class StoreReportDto
{
  @IsString()
  @IsNotEmpty()
  body: string;
}
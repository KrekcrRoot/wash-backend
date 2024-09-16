import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ReportEnum } from "../report.enum";

export class StoreReportDto
{
  @IsString()
  @IsNotEmpty()
  body: string;

  @IsOptional()
  @IsEnum(ReportEnum)
  type: ReportEnum;
}
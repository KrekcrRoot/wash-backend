import { WashStatusEnum } from "../wash.status.enum";


export class WashStatusDto {

  status: WashStatusEnum;
  telegramTag?: string;
  timeBegin?: Date;

}
import { Controller } from '@nestjs/common';
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Order controller')
@Controller('order')
export class OrderController {}

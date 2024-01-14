import { Controller, Post, Body } from '@nestjs/common';
import { ConfirmationCodesService } from './confirmation-codes.service';
import { ApiTags } from '@nestjs/swagger';
import { RequestCodeDto } from '@/confirmation-codes/dto/request-code.dto';

@ApiTags('ConfirmationCode')
@Controller('confirmation-codes')
export class ConfirmationCodesController {
  constructor(
    private readonly confirmationCodesService: ConfirmationCodesService,
  ) {}

  @Post('/')
  async requestCode(@Body() requestCodeDto: RequestCodeDto) {
    return this.confirmationCodesService.requestCode(requestCodeDto);
  }
}

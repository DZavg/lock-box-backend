import { HttpException, HttpStatus } from '@nestjs/common';
import { errorMessage } from '@/utils/errorMessage';

export class UnauthorizedException extends HttpException {
  constructor() {
    super({ error: errorMessage.Unauthorized }, HttpStatus.UNAUTHORIZED);
  }
}

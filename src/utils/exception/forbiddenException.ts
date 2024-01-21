import { HttpException, HttpStatus } from '@nestjs/common';
import { errorMessage } from '@/utils/errorMessage';

export class ForbiddenException extends HttpException {
  constructor() {
    super({ error: errorMessage.Forbidden }, HttpStatus.FORBIDDEN);
  }
}

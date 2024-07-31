import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(errors: any) {
    super({ errors }, HttpStatus.BAD_REQUEST);
  }
}

import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';

export default new ValidationPipe({
  transform: true,
  whitelist: true,
  exceptionFactory: (errorsList) => {
    const errors = {};
    errorsList.forEach(function (error) {
      errors[error.property] = Object.values(error.constraints);
    });
    return new BadRequestException({
      errors,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  },
});

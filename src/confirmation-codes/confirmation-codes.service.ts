import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateConfirmationCodeDto } from './dto/create-confirmation-code.dto';
import generateFixedLengthNumber from '@/utils/generateFixedLengthNumber';
import { successMessage } from '@/utils/successMessage';
import { MailerService } from '@/mailer/mailer.service';
import { REQUEST_CODE_LENGTH } from '@/confirmation-codes/confirmation-codes.constants';
import { UsersService } from '@/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfirmationCode } from '@/confirmation-codes/entities/confirmation-code.entity';
import { RequestCodeDto } from '@/confirmation-codes/dto/request-code.dto';
import { errorMessage } from '@/utils/errorMessage';
import { ConfigService } from '@nestjs/config';
import { VerifyCodeDto } from '@/confirmation-codes/dto/verify-code.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class ConfirmationCodesService {
  constructor(
    @InjectRepository(ConfirmationCode)
    private confirmationCodeRepository: Repository<ConfirmationCode>,
    private mailerService: MailerService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async saveCode(createConfirmationCodeDto: CreateConfirmationCodeDto) {
    const code = this.confirmationCodeRepository.create(
      createConfirmationCodeDto,
    );
    return this.confirmationCodeRepository.save(code);
  }

  async requestCode(requestCodeDto: RequestCodeDto) {
    const code = String(generateFixedLengthNumber(REQUEST_CODE_LENGTH));
    const user = await this.usersService.findOneByEmail(requestCodeDto.email);

    if (user) {
      const expiredCode = new Date(
        new Date().getTime() +
          this.configService.get('CONFIRMATION_CODES_EXPIRATION') * 1000,
      );

      await this.saveCode({ code, expiredAt: expiredCode, user });
      await this.mailerService.sendMail({
        to: requestCodeDto.email,
        subject: 'Код подтверждения на сайте example.ru',
        text: String(code),
      });
    }
    return { message: successMessage.confirmationCode };
  }

  async verifyCode(verifyCodeDto: VerifyCodeDto): Promise<boolean> {
    const user = await this.usersService.findOneByEmail(verifyCodeDto.email);
    const code = instanceToPlain(user.confirmationCode);

    if (!user || code.code !== verifyCodeDto.code) {
      throw new HttpException(
        { error: errorMessage.IncorrectCode },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (code.expiredAt.getTime() < new Date().getTime()) {
      throw new HttpException(
        { error: errorMessage.ExpiredCode },
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }
}

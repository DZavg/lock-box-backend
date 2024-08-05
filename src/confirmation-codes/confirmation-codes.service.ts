import { Injectable } from '@nestjs/common';
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
import { TIMEOUT_REQUEST_CODE } from '@/utils/constants';
import { BadRequestException } from '@/utils/exception/badRequestException';

@Injectable()
export class ConfirmationCodesService {
  constructor(
    @InjectRepository(ConfirmationCode)
    private confirmationCodeRepository: Repository<ConfirmationCode>,
    private mailerService: MailerService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async saveOrUpdateCode(createConfirmationCodeDto: CreateConfirmationCodeDto) {
    return await this.confirmationCodeRepository.upsert(
      { ...createConfirmationCodeDto, updatedAt: new Date() },
      { conflictPaths: ['email'] },
    );
  }

  async revokeCode(verifyCodeDto: VerifyCodeDto) {
    return await this.confirmationCodeRepository.delete(verifyCodeDto);
  }

  async findOneByEmailAndCode(verifyCodeDto: VerifyCodeDto) {
    return await this.confirmationCodeRepository.findOne({
      where: {
        code: verifyCodeDto.code,
        email: verifyCodeDto.email.toLowerCase(),
      },
    });
  }

  async findOneByEmail(email: string) {
    return await this.confirmationCodeRepository.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });
  }

  async requestCode(requestCodeDto: RequestCodeDto) {
    const code = String(generateFixedLengthNumber(REQUEST_CODE_LENGTH));
    const user = await this.usersService.findOneByEmail(requestCodeDto.email);
    if (user) {
      const expiredDate = new Date(
        new Date().getTime() +
          this.configService.get('CONFIRMATION_CODES_EXPIRATION') * 1000,
      );

      const pastCode = await this.findOneByEmail(user.email);
      const checkTimeout =
        pastCode &&
        pastCode.updatedAt.getTime() + TIMEOUT_REQUEST_CODE * 1000 >
          new Date().getTime();

      if (checkTimeout) {
        throw new BadRequestException({ code: [errorMessage.Timeout] });
      }

      await this.saveOrUpdateCode({
        code,
        expiredAt: expiredDate,
        email: user.email.toLowerCase(),
      });

      await this.mailerService.sendMail({
        to: requestCodeDto.email.toLowerCase(),
        subject: 'Код подтверждения на сайте dzavg.ru',
        text: String(code),
      });
    }
    return { message: successMessage.confirmationCode };
  }

  async verifyCode(verifyCodeDto: VerifyCodeDto): Promise<boolean> {
    const code = await this.findOneByEmailAndCode(verifyCodeDto);

    if (!code) {
      throw new BadRequestException({ code: [errorMessage.IncorrectCode] });
    }
    if (code?.expiredAt?.getTime() < new Date().getTime()) {
      throw new BadRequestException({ code: [errorMessage.ExpiredCode] });
    }

    await this.revokeCode(verifyCodeDto);

    return true;
  }
}

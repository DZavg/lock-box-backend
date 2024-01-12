import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { errorMessage } from '@/utils/errorMessage';

@Injectable()
export class MailerService {
  private nodemailerTransport: Mail;

  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      service: configService.get('MAILER_SERVICE'),
      auth: {
        user: configService.get('MAILER_USER'),
        pass: configService.get('MAILER_PASSWORD'),
      },
    });
  }

  async sendMail(options: Mail.Options) {
    const mailer = await this.nodemailerTransport.sendMail({
      from: this.configService.get('MAILER_USER'),
      ...options,
    });
    if (!mailer.messageId) {
      throw new HttpException(
        { error: errorMessage.MailerError },
        HttpStatus.BAD_REQUEST,
      );
    }
    return mailer;
  }
}

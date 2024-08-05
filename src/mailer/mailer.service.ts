import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { errorMessage } from '@/utils/errorMessage';

@Injectable()
export class MailerService {
  private nodemailerTransport: Mail;

  constructor(private readonly configService: ConfigService) {
    const smtpConfig = {
      host: configService.get('MAILER_HOST'),
      port: configService.get('MAILER_PORT'),
      secure: true,
      auth: {
        user: configService.get('MAILER_USER'),
        pass: configService.get('MAILER_PASSWORD'),
      },
    };
    this.nodemailerTransport = createTransport(smtpConfig);
  }

  async sendMail(options: Mail.Options) {
    try {
      return await this.nodemailerTransport.sendMail({
        from: this.configService.get('MAILER_USER'),
        ...options,
      });
    } catch (e) {
      console.log(e);
      throw new HttpException(
        { error: errorMessage.MailerError },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

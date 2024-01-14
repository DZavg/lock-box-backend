import { Module } from '@nestjs/common';
import { ConfirmationCodesService } from './confirmation-codes.service';
import { ConfirmationCodesController } from './confirmation-codes.controller';
import { MailerModule } from '@/mailer/mailer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfirmationCode } from '@/confirmation-codes/entities/confirmation-code.entity';
import { UsersModule } from '@/users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConfirmationCode]),
    MailerModule,
    UsersModule,
    ConfigModule,
  ],
  controllers: [ConfirmationCodesController],
  providers: [ConfirmationCodesService],
})
export class ConfirmationCodesModule {}

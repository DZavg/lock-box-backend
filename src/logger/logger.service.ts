import { Injectable } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MyLogger } from '@/logger/entities/logger.entity';

@Injectable()
export class LoggerService {
  constructor(
    @InjectRepository(MyLogger)
    private loggerRepository: Repository<MyLogger>,
  ) {}
  async create(log: CreateLogDto) {
    const newLog = this.loggerRepository.create(log);
    return await this.loggerRepository.save(newLog);
  }
}

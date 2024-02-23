import { Injectable } from '@nestjs/common';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';

@Injectable()
export class AccessesService {
  create(createAccessDto: CreateAccessDto) {
    return 'This action adds a new access';
  }

  findAll() {
    return `This action returns all accesses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} access`;
  }

  update(id: number, updateAccessDto: UpdateAccessDto) {
    return `This action updates a #${id} access`;
  }

  remove(id: number) {
    return `This action removes a #${id} access`;
  }
}

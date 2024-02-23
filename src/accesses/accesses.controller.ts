import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccessesService } from './accesses.service';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Accesses')
@Controller('accesses')
export class AccessesController {
  constructor(private readonly accessesService: AccessesService) {}

  @Post()
  create(@Body() createAccessDto: CreateAccessDto) {
    return this.accessesService.create(createAccessDto);
  }

  @Get()
  findAll() {
    return this.accessesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accessesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccessDto: UpdateAccessDto) {
    return this.accessesService.update(+id, updateAccessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accessesService.remove(+id);
  }
}

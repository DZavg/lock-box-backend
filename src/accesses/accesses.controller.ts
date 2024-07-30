import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessesService } from './accesses.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/auth/auth.guard';
import { AccessDto } from '@/accesses/dto/access.dto';
import { UpdateAccessDto } from '@/accesses/dto/update-access.dto';
import { AccessType } from '@/accesses/entities/access-type.entity';

@ApiTags('Accesses')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('accesses')
export class AccessesController {
  constructor(private readonly accessesService: AccessesService) {}

  @Get('/types')
  findAllTypes(): Promise<AccessType[]> {
    return this.accessesService.findAllTypes();
  }

  @Get(':id')
  findOneById(@Req() req, @Param('id') id: string): Promise<AccessDto> {
    return this.accessesService.findOneById(+id, req.user);
  }

  @Get(':id/password')
  findPasswordById(@Req() req, @Param('id') id: string) {
    return this.accessesService.findPasswordById(+id, req.user);
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateAccessDto: UpdateAccessDto,
  ) {
    return this.accessesService.update(+id, updateAccessDto, req.user);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.accessesService.remove(+id, req.user);
  }
}

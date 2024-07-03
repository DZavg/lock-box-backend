import { AccessDto } from '@/accesses/dto/access.dto';
import { ProjectDto } from '@/projects/dto/project.dto';

export class ProjectPageDto {
  accesses: AccessDto[];
  project: ProjectDto;
}

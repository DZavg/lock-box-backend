import { ProjectDto } from '@/projects/dto/project.dto';

export class ProjectsPageDto {
  projects: ProjectDto[];
  total_count: number;
}

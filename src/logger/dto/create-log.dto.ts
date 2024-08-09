export class CreateLogDto {
  method: string;
  url: string;
  status_code: number;
  user_agent: string;
  ip: string;
}

export default CreateLogDto;

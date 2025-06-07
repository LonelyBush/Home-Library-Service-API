import { IsUUID } from 'class-validator';

export class idParam {
  @IsUUID()
  id: string;
}

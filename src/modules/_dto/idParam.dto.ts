import { IsUUID } from 'class-validator';

export class idParam {
  @IsUUID()
  id: string;
}

export class favsParams {
  @IsUUID()
  id: string;
  @IsUUID()
  userId: string;
}

import { IsNotEmpty } from 'class-validator';

export class CreateArtistDto {
  @IsNotEmpty({ message: 'name is required field !' })
  name: string;
  grammy: boolean;
}

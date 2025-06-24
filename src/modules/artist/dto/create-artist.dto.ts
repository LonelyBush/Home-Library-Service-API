import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateArtistDto {
  @IsNotEmpty({ message: 'name is required field !' })
  name: string;
  @IsBoolean()
  grammy: boolean;
}

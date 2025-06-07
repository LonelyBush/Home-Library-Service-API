import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistDto } from './create-artist.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {
  @IsNotEmpty({ message: 'name is required field !' })
  name: string;
  grammy: boolean;
}

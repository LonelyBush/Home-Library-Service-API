import { PartialType } from '@nestjs/mapped-types';
import { CreateTrackDto } from './create-track.dto';
import { IsNotEmpty, IsNumber, IsUUID, ValidateIf } from 'class-validator';

export class UpdateTrackDto extends PartialType(CreateTrackDto) {
  @IsNotEmpty({ message: 'name is required field !' })
  name: string;
  @IsNotEmpty({ message: 'duration is required field !' })
  @IsNumber()
  duration: number;
  @IsUUID()
  artistId: string | null; // refers to Artist
  @ValidateIf((o) => typeof o.albumId === 'string')
  @IsUUID()
  albumId: string | null; // refers to Album
}

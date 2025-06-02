import { PartialType } from '@nestjs/mapped-types';
import { CreateTrackDto } from './create-track.dto';

export class UpdateTrackDto extends PartialType(CreateTrackDto) {
  name: string;
  duration: number;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
}

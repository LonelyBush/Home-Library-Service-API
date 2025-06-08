import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty({ message: 'name is required field !' })
  name: string;
  @IsNotEmpty({ message: 'duration is required field !' })
  @IsNumber()
  duration: number;
  @IsUUID()
  artistId: string | null; // refers to Artist
  @IsUUID()
  albumId: string | null; // refers to Album
}

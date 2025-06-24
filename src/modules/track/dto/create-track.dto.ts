import { IsNotEmpty, IsNumber, IsUUID, ValidateIf } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty({ message: 'name is required field !' })
  name: string;
  @IsNotEmpty({ message: 'duration is required field !' })
  @IsNumber()
  duration: number;
  @ValidateIf((o) => typeof o.artistId === 'string')
  @IsUUID()
  artistId: string | null; // refers to Artist
  @ValidateIf((o) => typeof o.albumId === 'string')
  @IsUUID()
  albumId: string | null; // refers to Album
}

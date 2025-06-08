import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty({ message: 'name is required field !' })
  name: string;
  @IsNotEmpty({ message: 'year is required field !' })
  @IsNumber()
  year: number;
  @IsUUID()
  artistId: string | null; // refers to Artist
}
